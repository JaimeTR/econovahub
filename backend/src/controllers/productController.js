const ProductModel = require('../models/Product');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

function parseFileMeta(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function sanitizeExistingFiles(files) {
  if (!Array.isArray(files)) return [];
  return files.filter((f) => {
    const url = f && f.url;
    if (typeof url !== 'string' || !url.startsWith('/uploads/')) return false;
    if (url.split(/[\\/]/).includes('..')) return false;
    const resolved = path.resolve(UPLOADS_DIR, url.replace(/^\/+/, ''));
    return resolved === UPLOADS_DIR || resolved.startsWith(UPLOADS_DIR + path.sep);
  });
}

function processUploadedFiles(reqFiles, category) {
  const files = [];
  if (!reqFiles) return files;
  for (const f of reqFiles) {
    files.push({
      name: f.originalname,
      type: path.extname(f.originalname).match(/\.(xlsx?|csv)/i) ? 'excel' : path.extname(f.originalname).match(/\.(pdf)/i) ? 'manual' : path.extname(f.originalname).match(/\.(zip|rar|7z)/i) ? 'zip' : 'other',
      url: `/uploads/${f.filename}`,
      size: f.size,
      category: category || 'main',
    });
  }
  return files;
}

const ProductController = {
  async getAllProducts(req, res) {
    try {
      const products = await ProductModel.findAll();
      res.json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  async getMyProducts(req, res) {
    try {
      const products = await ProductModel.findByCreator(req.creator.id);
      res.json(products);
    } catch (error) {
      console.error('Error getting my products:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  },

  async createProduct(req, res) {
    try {
      const { name, description, price, tagline, badge, features, payment_url, paypal_url, sortOrder, existingFiles, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
      }

      const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;

      let files = existingFiles ? sanitizeExistingFiles(parseFileMeta(existingFiles)) : [];
      files = files.map((f) => ({ ...f, category: f.category || 'main' }));
      files = [...files, ...processUploadedFiles(req.files?.files_principal, 'main')];
      files = [...files, ...processUploadedFiles(req.files?.files_manual, 'guide')];

      const fileUrl = files.length > 0 ? files[0].url : null;

      const product = await ProductModel.create({
        creatorId: req.creator.id,
        name,
        description,
        price: parseFloat(price),
        tagline,
        badge,
        features: Array.isArray(features) ? features : JSON.parse(features || '[]'),
        imageUrl,
        fileUrl,
        files,
        paymentUrl: payment_url,
        paypalUrl: paypal_url,
        category,
        sortOrder: parseInt(sortOrder) || 0,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  },

  async updateProduct(req, res) {
    try {
      const { name, description, price, tagline, badge, features, payment_url, paypal_url, isActive, sortOrder, existingFiles, removeFiles, category } = req.body;

      const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : undefined;

      let files = existingFiles ? sanitizeExistingFiles(parseFileMeta(existingFiles)) : undefined;
      if (files && removeFiles) {
        const toRemove = parseFileMeta(removeFiles);
        for (const rem of toRemove) {
          const filePath = path.join(__dirname, '../../uploads', path.basename(rem));
          try { fs.unlinkSync(filePath); } catch {}
        }
        files = files.filter((f) => !toRemove.some((r) => r === f.url));
      }

      if (files) files = files.map((f) => ({ ...f, category: f.category || 'main' }));
      const newPrincipal = processUploadedFiles(req.files?.files_principal, 'main');
      const newGuide = processUploadedFiles(req.files?.files_manual, 'guide');
      if (newPrincipal.length > 0 || newGuide.length > 0) {
        if (!files) files = [];
        files = [...files, ...newPrincipal, ...newGuide];
      }

      const parsedFeatures = features ? (Array.isArray(features) ? features : JSON.parse(features)) : undefined;

      const product = await ProductModel.update(req.params.id, {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        tagline,
        badge,
        features: parsedFeatures,
        imageUrl,
        fileUrl: undefined,
        files,
        paymentUrl: payment_url,
        paypalUrl: paypal_url,
        category,
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : undefined,
        sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
      });

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  },

  async deleteProduct(req, res) {
    try {
      // Delete associated files
      const product = await ProductModel.findById(req.params.id);
      if (product?.files) {
        for (const f of product.files) {
          const filePath = path.join(__dirname, '../../uploads', path.basename(f.url));
          try { fs.unlinkSync(filePath); } catch {}
        }
      }
      if (product?.image_url) {
        const imgPath = path.join(__dirname, '../../uploads', path.basename(product.image_url));
        try { fs.unlinkSync(imgPath); } catch {}
      }

      await ProductModel.delete(req.params.id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  },
};

module.exports = ProductController;