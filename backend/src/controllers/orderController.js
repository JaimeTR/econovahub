const OrderModel = require('../models/Order');
const CustomerModel = require('../models/Customer');
const ProductModel = require('../models/Product');
const DownloadModel = require('../models/Download');
const { sendOrderReceivedEmail, sendDownloadReadyEmail } = require('../services/emailService');

const OrderController = {
  async getMyOrders(req, res) {
    try {
      const orders = await OrderModel.findByCreator(req.creator.id);
      res.json(orders);
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ error: 'Error al obtener órdenes' });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.findAll();
      res.json(orders);
    } catch (error) {
      console.error('Error getting all orders:', error);
      res.status(500).json({ error: 'Error al obtener órdenes' });
    }
  },

  async confirmPayment(req, res) {
    try {
      const orderId = req.params.id;

      const order = await OrderModel.findById(orderId);
      if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

      if (order.status === 'completed') {
        return res.json({ message: 'Pago ya confirmado', download_token: order.download_token });
      }

      await OrderModel.updateStatus(orderId, 'completed');

      let download = await DownloadModel.findByOrder(orderId);
      if (!download) {
        download = await DownloadModel.create({
          orderId,
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
          maxDownloads: 5,
        });
      }

      // Enviar email de descarga lista
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const downloadLink = `${frontendUrl}/descargar/${download.token}`;

      await sendDownloadReadyEmail({
        email: order.buyer_email || order.customer_email,
        name: order.customer_name || 'Cliente',
        productName: order.product_name,
        downloadLink,
      });

      res.json({ message: 'Pago confirmado exitosamente', download_token: download.token });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ error: 'Error al confirmar el pago' });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      res.json(order);
    } catch (error) {
      console.error('Error getting order:', error);
      res.status(500).json({ error: 'Error al obtener la orden' });
    }
  },

  async createOrder(req, res) {
    try {
      const { productId, name, email, phone, amount } = req.body;

      if (!productId || !email || !name || !amount) {
        return res.status(400).json({ error: 'Datos incompletos. Requiere productId, name, email y amount' });
      }

      const customer = await CustomerModel.findOrCreate({ name, email, phone });

      const order = await OrderModel.create({
        productId,
        customerId: customer.id,
        amount: parseFloat(amount),
        status: 'pending',
        buyerEmail: email,
      });

      // Enviar email de confirmacion de pedido recibido
      const product = await ProductModel.findById(productId);
      sendOrderReceivedEmail({
        email,
        name,
        productName: product?.name || 'Producto',
      }).catch(err => console.error('Error sending order received email:', err.message));

      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error al crear la orden' });
    }
  },

  async getOrdersByEmail(req, res) {
    try {
      const { email } = req.params;
      if (!email) return res.status(400).json({ error: 'Email requerido' });

      const orders = await OrderModel.findByCustomerEmail(email);

      if (req.creator.role !== 'super_admin') {
        const ownOrders = orders.filter(o => o.creator_id === req.creator.id);
        if (orders.length > 0 && ownOrders.length === 0) {
          return res.status(403).json({ error: 'Acceso denegado' });
        }
        return res.json(ownOrders);
      }

      res.json(orders);
    } catch (error) {
      console.error('Error getting orders by email:', error);
      res.status(500).json({ error: 'Error al buscar compras' });
    }
  },

  async createPayPalOrder(req, res) {
    try {
      const { paypalOrderId, productId, name, email, amount } = req.body;

      if (!paypalOrderId || !productId || !email || !name || !amount) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      // Verify with PayPal API
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

      const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` },
        body: 'grant_type=client_credentials',
      });

      if (!tokenRes.ok) {
        return res.status(400).json({ error: 'Error verificando pago con PayPal' });
      }

      const { access_token } = await tokenRes.json();

      const verifyRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!verifyRes.ok) {
        return res.status(400).json({ error: 'Orden de PayPal no encontrada' });
      }

      const paypalOrder = await verifyRes.json();

      if (paypalOrder.status !== 'COMPLETED') {
        return res.status(400).json({ error: 'El pago no ha sido completado' });
      }

      const customer = await CustomerModel.findOrCreate({ name, email });

      const order = await OrderModel.create({
        productId,
        customerId: customer.id,
        amount: parseFloat(amount),
        status: 'completed',
        culqiReference: paypalOrderId,
        buyerEmail: email,
      });

      const download = await DownloadModel.create({
        orderId: order.id,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        maxDownloads: 5,
      });

      res.status(201).json({
        success: true,
        order_id: order.id,
        download_token: download.token,
      });
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      res.status(500).json({ error: 'Error al procesar el pago' });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { status, culqiReference } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Estado es requerido' });
      }

      const order = await OrderModel.updateStatus(req.params.id, status, culqiReference);

      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Error al actualizar la orden' });
    }
  },

  async getCustomers(req, res) {
    try {
      const customers = await OrderModel.findAllCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error getting customers:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  },
};

module.exports = OrderController;
