const db = require('../config/db');

const CustomerModel = {
  async findOrCreate({ name, email, phone }) {
    let result = await db.query('SELECT * FROM customers WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    result = await db.query(
      `INSERT INTO customers (name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, phone || null]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0];
  },
};

module.exports = CustomerModel;
