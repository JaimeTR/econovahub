const db = require('../config/db');

const ProductModel = {
  async findAll() {
    const result = await db.query(
      `SELECT p.*, c.name as creator_name, c.photo_url as creator_photo
       FROM products p
       JOIN creators c ON p.creator_id = c.id
       WHERE p.is_active = true
       ORDER BY p.sort_order ASC`
    );
    return result.rows;
  },

  async findByCreator(creatorId) {
    const result = await db.query(
      'SELECT * FROM products WHERE creator_id = $1 ORDER BY sort_order ASC',
      [creatorId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT p.*, c.name as creator_name
       FROM products p
       JOIN creators c ON p.creator_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create({ creatorId, name, description, price, tagline, badge, features, imageUrl, fileUrl, files, paymentUrl, paypalUrl, category, sortOrder }) {
    const result = await db.query(
      `INSERT INTO products (creator_id, name, description, price, tagline, badge, features, image_url, file_url, files, payment_url, paypal_url, category, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [creatorId, name, description, price, tagline, badge, JSON.stringify(features || []), imageUrl, fileUrl, JSON.stringify(files || []), paymentUrl, paypalUrl, category || '', sortOrder || 0]
    );
    return result.rows[0];
  },

  async update(id, { name, description, price, tagline, badge, features, imageUrl, fileUrl, files, paymentUrl, paypalUrl, category, isActive, sortOrder }) {
    const result = await db.query(
      `UPDATE products
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           tagline = COALESCE($5, tagline),
           badge = COALESCE($6, badge),
           features = COALESCE($7, features),
           image_url = COALESCE($8, image_url),
           file_url = COALESCE($9, file_url),
           files = COALESCE($10, files),
           payment_url = COALESCE($11, payment_url),
           paypal_url = COALESCE($12, paypal_url),
           category = COALESCE($13, category),
           is_active = COALESCE($14, is_active),
           sort_order = COALESCE($15, sort_order),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, name, description, price, tagline, badge, features ? JSON.stringify(features) : null, imageUrl, fileUrl, files ? JSON.stringify(files) : null, paymentUrl, paypalUrl, category, isActive, sortOrder]
    );
    return result.rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    return { deleted: true };
  },
};

module.exports = ProductModel;
