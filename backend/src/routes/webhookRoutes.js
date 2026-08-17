const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhookController');

router.post('/culqi', WebhookController.culqiWebhook);
router.post('/paypal-ipn', WebhookController.paypalIpn);
router.post('/verificar', WebhookController.verificarPedido);

module.exports = router;
