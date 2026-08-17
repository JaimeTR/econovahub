const express = require('express');
const router = express.Router();
const CreatorController = require('../controllers/creatorController');
const { authMiddleware, superAdminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/public', CreatorController.getPublicProfile);
router.get('/slug/:slug', CreatorController.getCreatorBySlug);
router.post('/login', CreatorController.login);
router.post('/google-login', CreatorController.googleLogin);
router.post('/google-register', CreatorController.googleRegister);
router.post('/register', CreatorController.register);
router.post('/send-verification-code', CreatorController.sendVerificationCode);
router.post('/verify-code', CreatorController.verifyCodeAndRegister);
router.get('/me', authMiddleware, CreatorController.getProfile);
router.put('/me', authMiddleware, upload.single('photo'), CreatorController.updateProfile);
router.get('/dashboard', authMiddleware, CreatorController.getDashboardStats);
router.get('/all', authMiddleware, superAdminOnly, CreatorController.getAllCreators);
router.put('/:id', authMiddleware, superAdminOnly, CreatorController.updateCreator);
router.delete('/:id', authMiddleware, superAdminOnly, CreatorController.deleteCreator);

module.exports = router;
