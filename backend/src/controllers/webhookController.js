const OrderModel = require('../models/Order');
const DownloadModel = require('../models/Download');
const CustomerModel = require('../models/Customer');
const ProductModel = require('../models/Product');
const { sendDownloadReadyEmail } = require('../services/emailService');
const crypto = require('crypto');
const https = require('https');
const { URLSearchParams } = require('url');

function verifyCulqiSignature(req) {
  const key = process.env.CULQI_API_KEY || process.env.CULQI_SECRET_KEY;
  if (!key) {
    console.warn('Culqi webhook: CULQI_API_KEY no configurado, rechazando webhook');
    return false;
  }

  const signature = req.headers['culqi-signature'];
  if (!signature || !req.rawBody) {
    return false;
  }

  const rawBody = req.rawBody;
  const parts = String(signature).split(',');

  for (const part of parts) {
    const [version, value] = part.trim().split('=');
    if (version === 'v2' && value) {
      const expected = crypto.createHmac('sha256', key).update(rawBody).digest('hex');
      const a = Buffer.from(expected);
      const b = Buffer.from(String(value).trim());
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    }
  }

  return false;
}

function verifyPayPalIpn(body) {
  return new Promise((resolve, reject) => {
    const isSandbox = process.env.PAYPAL_MODE === 'sandbox' || process.env.PAYPAL_SANDBOX === 'true';
    const host = isSandbox ? 'ipnpb.sandbox.paypal.com' : 'ipnpb.paypal.com';
    const params = new URLSearchParams({ cmd: '_notify-validate', ...body }).toString();

    const req = https.request(
      {
        host,
        path: '/cgi-bin/webscr',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(params),
        },
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(data.trim() === 'VERIFIED'));
      }
    );

    req.setTimeout(10000, () => req.destroy(new Error('IPN verification timeout')));
    req.on('error', reject);
    req.write(params);
    req.end();
  });
}

async function completarPago({ productId, customerEmail, customerName, amount, reference }) {
  const product = await ProductModel.findById(productId);
  if (!product) {
    console.log(`Producto no encontrado: ${productId}`);
    return null;
  }

  const customer = await CustomerModel.findOrCreate({
    name: customerName || 'Cliente',
    email: customerEmail,
  });

  const orders = await OrderModel.findByCustomerEmail(customerEmail);
  const existingCompleted = orders.find(
    o => o.product_id === productId && o.status === 'completed'
  );

  if (existingCompleted) {
    console.log(`Orden ya completada para ${customerEmail} - ${productId}`);
    const dl = await DownloadModel.findByOrder(existingCompleted.id);
    if (dl) return { order: existingCompleted, download: dl, wasExisting: true };
  }

  // Buscar orden pendiente para actualizar
  const pendingOrder = orders.find(
    o => o.product_id === productId && o.status === 'pending'
  );

  let order;
  if (pendingOrder) {
    order = await OrderModel.updateStatus(pendingOrder.id, 'completed', reference);
    console.log(`Orden pendiente ${pendingOrder.id} actualizada a completada`);
  } else {
    order = await OrderModel.create({
      productId,
      customerId: customer.id,
      amount: parseFloat(amount),
      status: 'completed',
      culqiReference: reference,
      buyerEmail: customerEmail,
    });
    console.log(`Nueva orden completada creada para ${customerEmail}`);
  }

  const download = await DownloadModel.create({
    orderId: order.id,
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    maxDownloads: 5,
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const downloadLink = `${frontendUrl}/descargar/${download.token}`;

  await sendDownloadReadyEmail({
    email: customerEmail,
    name: customerName || 'Cliente',
    productName: product.name,
    downloadLink,
  });

  console.log(`✅ Pago completado: ${customerEmail} - ${product.name}`);
  console.log(`   Link descarga: ${downloadLink}`);

  return { order, download };
}

const WebhookController = {
  // Webhook Culqi
  async culqiWebhook(req, res) {
    try {
      if (!verifyCulqiSignature(req)) {
        console.warn('Culqi webhook rechazado: firma inválida o no configurada');
        return res.status(401).json({ error: 'Firma inválida' });
      }

      const event = req.body;
      console.log('Webhook Culqi recibido:', JSON.stringify(event).slice(0, 300));

      if (event.action !== 'creation' || event.result !== 'succeeded') {
        return res.status(200).json({ received: true });
      }

      const data = event.data || {};

      const productId = data.metadata?.product_id;
      const customerEmail = data.metadata?.customer_email || data.payer?.email;
      const customerName = data.metadata?.customer_name || data.payer?.name || 'Cliente';
      const amount = data.amount ? (data.amount / 100) : 0;
      const reference = data.id || data.reference_code;

      if (!customerEmail) {
        console.log('Culqi webhook: email no disponible');
        return res.status(200).json({ received: true });
      }

      if (!productId) {
        // Buscar orden pendiente por email para completar
        const pending = (await OrderModel.findByCustomerEmail(customerEmail))
          .find(o => o.status === 'pending');
        if (pending) {
          console.log(`Culqi webhook: completando orden pendiente ${pending.id} para ${customerEmail}`);
          await completarPago({
            productId: pending.product_id,
            customerEmail,
            customerName,
            amount: pending.amount,
            reference,
          });
        } else {
          console.log(`Culqi webhook: producto_id no proporcionado y sin orden pendiente para ${customerEmail}`);
        }
        return res.status(200).json({ received: true });
      }

      await completarPago({ productId, customerEmail, customerName, amount, reference });
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error webhook Culqi:', error.message);
      res.status(200).json({ received: true });
    }
  },

  // Webhook PayPal IPN
  async paypalIpn(req, res) {
    try {
      console.log('IPN PayPal recibido:', JSON.stringify(req.body).slice(0, 400));

      const body = req.body;

      const verified = await verifyPayPalIpn(body);
      if (!verified) {
        console.warn('IPN PayPal rechazado: no verificado por PayPal');
        return res.status(400).send('INVALID');
      }

      if (body.payment_status !== 'Completed') {
        return res.status(200).send('OK');
      }

      const customerEmail = body.payer_email;
      const customerName = body.first_name + ' ' + (body.last_name || '');
      const amount = body.mc_gross || body.payment_gross || 0;

      if (!customerEmail) {
        return res.status(200).send('OK');
      }

      // Buscar orden pendiente por email
      const pending = (await OrderModel.findByCustomerEmail(customerEmail))
        .find(o => o.status === 'pending');

      if (pending) {
        await completarPago({
          productId: pending.product_id,
          customerEmail,
          customerName,
          amount: pending.amount,
          reference: body.txn_id || body.ipn_track_id,
        });
      } else {
        console.log(`IPN PayPal: no hay orden pendiente para ${customerEmail}`);
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error IPN PayPal:', error.message);
      res.status(200).send('OK');
    }
  },

  // Verificar pedido manual (después de cerrar popup)
  async verificarPedido(req, res) {
    try {
      const { email, productId } = req.body;

      const orders = await OrderModel.findByCustomerEmail(email);
      const completed = orders.find(o =>
        o.product_id === productId && o.status === 'completed'
      );

      if (completed) {
        const download = await DownloadModel.findByOrder(completed.id);
        return res.json({
          completed: true,
          download_token: download?.token || null,
        });
      }

      res.json({ completed: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = WebhookController;
