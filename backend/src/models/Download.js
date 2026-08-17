const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const DownloadModel = {
  async findByToken(token) {
    const result = await db.query(
      `SELECT d.*, o.product_id, o.status as order_status, p.file_url, p.files, p.name as product_name
       FROM downloads d
       JOIN orders o ON d.order_id = o.id
       JOIN products p ON o.product_id = p.id
       WHERE d.token = $1`,
      [token]
    );
    return result.rows[0];
  },

  async create({ orderId, expiresAt, maxDownloads }) {
    const token = uuidv4();
    const result = await db.query(
      `INSERT INTO downloads (order_id, token, expires_at, max_downloads)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderId, token, expiresAt || new Date(Date.now() + 72 * 60 * 60 * 1000), maxDownloads || 3]
    );
    return result.rows[0];
  },

  async incrementDownload(id) {
    const result = await db.query(
      `UPDATE downloads
       SET download_count = download_count + 1
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async findByOrder(orderId) {
    const result = await db.query(
      'SELECT * FROM downloads WHERE order_id = $1',
      [orderId]
    );
    return result.rows[0];
  },
};

module.exports = DownloadModel;
