const DownloadModel = require('../models/Download');
const OrderModel = require('../models/Order');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

function resolveSafeUploadPath(fileUrl) {
  if (typeof fileUrl !== 'string' || !fileUrl.startsWith('/uploads/')) return null;
  if (fileUrl.split(/[\\/]/).includes('..')) return null;
  const relativePath = fileUrl.replace(/^\/+/, '');
  const filePath = path.resolve(UPLOADS_DIR, relativePath);
  if (filePath !== UPLOADS_DIR && !filePath.startsWith(UPLOADS_DIR + path.sep)) return null;
  return filePath;
}

async function validateDownloadToken(token) {
  const download = await DownloadModel.findByToken(token);
  if (!download) return { download: null, error: { status: 404, message: 'Token de descarga inválido' } };
  if (download.order_status !== 'completed') return { download: null, error: { status: 400, message: 'El pago no ha sido completado' } };
  if (new Date(download.expires_at) < new Date()) return { download: null, error: { status: 410, message: 'El link de descarga ha expirado' } };
  if (download.download_count >= download.max_downloads) return { download: null, error: { status: 429, message: 'Has alcanzado el límite de descargas' } };
  return { download, error: null };
}

const DownloadController = {
  async getDownloadPage(req, res) {
    try {
      const { token } = req.params;

      const { download, error } = await validateDownloadToken(token);

      if (error) {
        return res.status(error.status).json({ error: error.message });
      }

      const files = download.files || [];
      const parsedFiles = typeof files === 'string' ? JSON.parse(files) : files;

      res.json({
        productName: download.product_name,
        files: parsedFiles,
        downloadsRemaining: download.max_downloads - download.download_count,
        expiresAt: download.expires_at,
      });
    } catch (error) {
      console.error('Error getting download:', error);
      res.status(500).json({ error: 'Error al obtener la descarga' });
    }
  },

  async processDownload(req, res) {
    try {
      const { token } = req.params;
      const fileIndex = parseInt(req.params.fileIndex || '0', 10);

      const { download, error } = await validateDownloadToken(token);

      if (error) {
        return res.status(error.status).json({ error: error.message });
      }

      await DownloadModel.incrementDownload(download.id);

      const files = download.files || [];
      const parsedFiles = typeof files === 'string' ? JSON.parse(files) : files;

      let fileUrl, fileName;

      if (parsedFiles.length > 0 && parsedFiles[fileIndex]) {
        fileUrl = parsedFiles[fileIndex].url;
        fileName = parsedFiles[fileIndex].name;
      } else {
        fileUrl = download.file_url;
        fileName = `${download.product_name.replace(/\s+/g, '_')}.xlsx`;
      }

      const filePath = resolveSafeUploadPath(fileUrl);

      if (filePath && fs.existsSync(filePath)) {
        res.download(filePath, fileName);
      } else {
        res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
      }
    } catch (error) {
      console.error('Error processing download:', error);
      res.status(500).json({ error: 'Error al procesar la descarga' });
    }
  },

  async streamFileByToken(req, res) {
    try {
      const { token } = req.params;
      const fileUrl = req.query.path;

      const { download, error } = await validateDownloadToken(token);

      if (error) {
        return res.status(error.status).json({ error: error.message });
      }

      const filePath = resolveSafeUploadPath(fileUrl);
      if (!filePath) {
        return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
      }

      const files = download.files || [];
      const parsedFiles = typeof files === 'string' ? JSON.parse(files) : files;
      const match = parsedFiles.find(f => f && f.url === fileUrl);
      const fileName = (match && match.name) || path.basename(filePath);

      res.sendFile(filePath, {
        headers: {
          'Content-Disposition': `inline; filename="${String(fileName).replace(/"/g, '')}"`,
        },
      });
    } catch (error) {
      console.error('Error streaming file:', error);
      res.status(500).json({ error: 'Error al procesar la descarga' });
    }
  },

  async generateDownloadToken(req, res) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      if (order.status !== 'completed') {
        return res.status(400).json({ error: 'La orden no está completada' });
      }

      const existingDownload = await DownloadModel.findByOrder(orderId);
      if (existingDownload) {
        return res.json(existingDownload);
      }

      const download = await DownloadModel.create({
        orderId,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        maxDownloads: 5,
      });

      res.status(201).json(download);
    } catch (error) {
      console.error('Error generating download token:', error);
      res.status(500).json({ error: 'Error al generar token de descarga' });
    }
  },
};

module.exports = DownloadController;
