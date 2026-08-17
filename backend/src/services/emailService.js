const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

function buildLayout(bodyHtml) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #fce7f3; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #e8a0bf, #d48cb0); padding: 30px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 22px; }
  .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
  .body { padding: 30px; }
  .body h2 { color: #1e293b; font-size: 18px; margin: 0 0 15px; }
  .body p { color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
  .btn { display: inline-block; padding: 14px 32px; background: #e8a0bf; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; }
  .footer { padding: 20px 30px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>${bodyProps.headerTitle || 'Ambar Castro Alejos'}</h1>
      ${bodyProps.headerSub ? `<p>${bodyProps.headerSub}</p>` : ''}
    </div>
    <div class="body">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>© 2026 Ambar Castro Alejos · Econova Hub</p>
      <p>¿Tienes dudas? Responde a este correo</p>
    </div>
  </div>
</body>
</html>`;
}

let bodyProps = {};

async function sendOrderReceivedEmail({ email, name, productName }) {
  bodyProps = { headerTitle: `Gracias por tu compra, ${name}!`, headerSub: `Has adquirido: ${productName}` };
  const html = buildLayout(`
    <h2>Hemos recibido tu pedido</h2>
    <p>Gracias por comprar <strong>${productName}</strong>. Hemos recibido tu solicitud de compra y en breve te confirmaremos el pago.</p>
    <p>Una vez que confirmemos el pago, te enviaremos un correo con el link de descarga de tu archivo digital.</p>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin-top:20px">Si tienes alguna duda, responde a este correo.</p>
  `);

  const text = `Gracias por tu compra, ${name}!\n\nHas adquirido: ${productName}\n\nHemos recibido tu pedido. Una vez que confirmemos el pago, te enviaremos el link de descarga.\n\nAmbar Castro Alejos · Econova Hub`;

  return enviarEmail({ email, name, subject: `Recibimos tu compra de ${productName}`, text, html });
}

async function sendDownloadReadyEmail({ email, name, productName, downloadLink }) {
  bodyProps = { headerTitle: `Tu descarga esta lista, ${name}!`, headerSub: productName };
  const html = buildLayout(`
    <h2>Pago confirmado</h2>
    <p>El pago de <strong>${productName}</strong> ha sido confirmado exitosamente.</p>
    <p>Haz clic en el siguiente boton para descargar tu archivo digital:</p>
    <p style="text-align:center"><a href="${downloadLink}" class="btn">Descargar mi archivo</a></p>
    <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:20px">Este link expira en 72 horas · Maximo 5 descargas</p>
    <hr style="border:none;border-top:1px solid #f1f5f9;margin:25px 0">
    <p style="font-size:13px;margin-bottom:0"><strong>Tambien puedes acceder desde:</strong></p>
    <p style="font-size:13px;margin-top:5px"><a href="${downloadLink}" style="color:#e8a0bf">${downloadLink}</a></p>
  `);

  const text = `Tu descarga esta lista, ${name}!\n\nPago confirmado para: ${productName}\n\nDescarga tu archivo aqui:\n${downloadLink}\n\nEl link expira en 72 horas. Maximo 5 descargas.\n\nAmbar Castro Alejos · Econova Hub`;

  return enviarEmail({ email, name, subject: `Descarga lista - ${productName}`, text, html });
}

async function enviarEmail({ email, name, subject, text, html }) {
  const mailOptions = {
    from: `"Ambar Castro" <${process.env.SMTP_FROM || 'noreply@econovahub.com'}>`,
    to: email,
    subject,
    text,
    html,
  };

  const t = getTransporter();

  if (!t) {
    console.log('\n========================================');
    console.log('📧 EMAIL ENVIADO (simulado):');
    console.log(`   Para: ${email}`);
    console.log(`   Asunto: ${subject}`);
    console.log(`   Link: ${text.match(/https?:\/\/[^\s]+/)?.[0] || '(sin link)'}`);
    console.log('========================================\n');
    return { simulated: true };
  }

  try {
    const info = await t.sendMail(mailOptions);
    console.log(`📧 Email enviado a ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email:', error.message);
    return { error: error.message };
  }
}

async function sendVerificationEmail({ email, name, code }) {
  bodyProps = { headerTitle: `Verifica tu correo, ${name}!`, headerSub: 'Código de verificación' };
  const html = buildLayout(`
    <h2>Tu código de verificación</h2>
    <p>Gracias por registrarte. Usa el siguiente código para verificar tu correo electrónico:</p>
    <p style="text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:#e8a0bf;background:#fce7f3;padding:16px;border-radius:12px;margin:20px 0">${code}</p>
    <p>Este código expira en 10 minutos.</p>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin-top:20px">Si no solicitaste este código, ignora este correo.</p>
  `);

  const text = `Tu código de verificación es: ${code}\n\nEste código expira en 10 minutos.\n\nSi no solicitaste este código, ignora este correo.\n\nAmbar Castro Alejos · Econova Hub`;

  return enviarEmail({ email, name, subject: 'Código de verificación - Econova Hub', text, html });
}

module.exports = { sendOrderReceivedEmail, sendDownloadReadyEmail, sendVerificationEmail };