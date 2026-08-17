const express = require('express');
const router = express.Router();
const DownloadController = require('../controllers/downloadController');
const { authMiddleware, requireOrderOwnerOrSuperAdmin } = require('../middleware/auth');

router.get('/file/:token', DownloadController.streamFileByToken);
router.get('/:token', DownloadController.getDownloadPage);
router.get('/:token/file/:fileIndex', DownloadController.processDownload);
router.get('/:token/file', DownloadController.processDownload);
router.post('/order/:orderId', authMiddleware, requireOrderOwnerOrSuperAdmin, DownloadController.generateDownloadToken);

module.exports = router;
