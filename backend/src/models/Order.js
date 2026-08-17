const db = require('../config/db');

const OrderModel = {
  async findAll() {
    const result = await db.query(
      `SELECT o.*, p.name as product_name, p.creator_id,
              cr.name as creator_name,
              c.name as customer_name, c.email as customer_email
       FROM orders o
       LEFT JOIN products p ON o.product_id = p.id
       LEFT JOIN creators cr ON p.creator_id = cr.id
       LEFT JOIN customers c ON o.customer_id = c.id
       ORDER BY o.created_at DESC`
    );
    return result.rows;
  },

  async findByCreator(creatorId) {
    const result = await db.query(
      `SELECT o.*, p.name as product_name, p.creator_id,
              cust.name as customer_name, cust.email as customer_email
       FROM orders o
       JOIN products p ON o.product_id = p.id
       LEFT JOIN customers cust ON o.customer_id = cust.id
       WHERE p.creator_id = $1
       ORDER BY o.created_at DESC`,
      [creatorId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT o.*, p.name as product_name, p.creator_id,
              c.name as customer_name, c.email as customer_email,
              d.token as download_token, d.expires_at, d.download_count, d.max_downloads
       FROM orders o
       JOIN products p ON o.product_id = p.id
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN downloads d ON d.order_id = o.id
       WHERE o.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create({ productId, customerId, amount, status, culqiReference, buyerEmail }) {
    const result = await db.query(
      `INSERT INTO orders (product_id, customer_id, amount, status, culqi_reference, buyer_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [productId, customerId, amount, status || 'pending', culqiReference, buyerEmail]
    );
    return result.rows[0];
  },

  async updateStatus(id, status, culqiReference) {
    const result = await db.query(
      `UPDATE orders
       SET status = $2, culqi_reference = COALESCE($3, culqi_reference)
       WHERE id = $1
       RETURNING *`,
      [id, status, culqiReference]
    );
    return result.rows[0];
  },

  async findByCustomerEmail(email) {
    const result = await db.query(
      `SELECT o.*, p.name as product_name, p.creator_id,
              d.token as download_token, d.expires_at, d.download_count, d.max_downloads
       FROM orders o
       JOIN products p ON o.product_id = p.id
       LEFT JOIN downloads d ON d.order_id = o.id
       WHERE o.buyer_email = $1
       ORDER BY o.created_at DESC`,
      [email]
    );
    return result.rows;
  },

  async getStats(creatorId) {
    const result = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE o.status = 'completed') as total_ventas,
         COALESCE(SUM(o.amount) FILTER (WHERE o.status = 'completed'), 0) as total_ingresos,
         COUNT(DISTINCT o.customer_id) as total_clientes
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE p.creator_id = $1`,
      [creatorId]
    );
    return result.rows[0];
  },

  async findAllCustomers() {
    const result = await db.query(
      `SELECT c.id, c.name, c.email, c.created_at as registered_at,
              COUNT(o.id) as total_orders,
              COUNT(o.id) FILTER (WHERE o.status = 'completed') as completed_orders,
              COALESCE(json_agg(
                json_build_object(
                  'order_id', o.id,
                  'status', o.status,
                  'amount', o.amount,
                  'product_name', p.name,
                  'creator_name', cr.name,
                  'created_at', o.created_at
                ) ORDER BY o.created_at DESC
              ) FILTER (WHERE o.id IS NOT NULL), '[]') as orders
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id
       LEFT JOIN products p ON o.product_id = p.id
       LEFT JOIN creators cr ON p.creator_id = cr.id
       GROUP BY c.id, c.name, c.email, c.created_at
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  },
};

module.exports = OrderModel;
