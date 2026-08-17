require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const creatorRoutes = require('./routes/creatorRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const landingRoutes = require('./routes/landingRoutes');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.18.8:3000',
      process.env.CORS_ORIGIN,
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de inicio de sesión' },
});

app.use('/api/webhooks', webhookRoutes);

app.use('/api/', generalLimiter);
app.use('/api/creators/login', authLimiter);

app.use('/api/creators', creatorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/landing', landingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);

  if (err.message === 'Tipo de archivo no permitido') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo supera el límite de 100MB' });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Campo de archivo inesperado' });
  }

  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Econova Hub API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
