const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authMiddleware, requireProductOwner } = require('../middleware/auth');
const upload = require('../middleware/upload');

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'files_principal', maxCount: 10 },
  { name: 'files_manual', maxCount: 10 },
]);

router.get('/', ProductController.getAllProducts);
router.get('/mine', authMiddleware, ProductController.getMyProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authMiddleware, uploadFields, ProductController.createProduct);
router.put('/:id', authMiddleware, requireProductOwner, uploadFields, ProductController.updateProduct);
router.delete('/:id', authMiddleware, requireProductOwner, ProductController.deleteProduct);

module.exports = router;
