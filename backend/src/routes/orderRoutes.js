const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authMiddleware, superAdminOnly, requireOrderOwner, requireOrderOwnerOrSuperAdmin } = require('../middleware/auth');

router.get('/', authMiddleware, OrderController.getMyOrders);
router.get('/all', authMiddleware, superAdminOnly, OrderController.getAllOrders);
router.get('/customers', authMiddleware, superAdminOnly, OrderController.getCustomers);
router.get('/customer/:email', authMiddleware, OrderController.getOrdersByEmail);
router.post('/paypal', OrderController.createPayPalOrder);
router.get('/:id', authMiddleware, requireOrderOwnerOrSuperAdmin, OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.put('/:id/status', authMiddleware, requireOrderOwnerOrSuperAdmin, OrderController.updateOrderStatus);
router.post('/:id/confirmar', authMiddleware, requireOrderOwner, OrderController.confirmPayment);

module.exports = router;
