const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.creator = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.creator.role !== 'admin' && req.creator.role !== 'super_admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }
  next();
};

const superAdminOnly = (req, res, next) => {
  if (req.creator.role !== 'super_admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo super admin' });
  }
  next();
};

const requireProductOwner = async (req, res, next) => {
  try {
    const ProductModel = require('../models/Product');
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (product.creator_id !== req.creator.id) {
      return res.status(403).json({ error: 'Acceso denegado. No eres el propietario de este producto' });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar la propiedad del producto' });
  }
};

const requireOrderOwner = async (req, res, next) => {
  try {
    const OrderModel = require('../models/Order');
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    if (order.creator_id !== req.creator.id) {
      return res.status(403).json({ error: 'Acceso denegado. No eres el propietario de esta orden' });
    }
    req.order = order;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar la propiedad de la orden' });
  }
};

const requireOrderOwnerOrSuperAdmin = async (req, res, next) => {
  try {
    const OrderModel = require('../models/Order');
    const orderId = req.params.id || req.params.orderId;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    if (order.creator_id !== req.creator.id && req.creator.role !== 'super_admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    req.order = order;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar la propiedad de la orden' });
  }
};

module.exports = { authMiddleware, adminOnly, superAdminOnly, requireProductOwner, requireOrderOwner, requireOrderOwnerOrSuperAdmin };
