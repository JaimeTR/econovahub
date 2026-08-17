const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function seed() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'econovahub',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Faltan SUPER_ADMIN_EMAIL o SUPER_ADMIN_PASSWORD en .env');
      return;
    }

    const existing = await pool.query('SELECT * FROM creators WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE creators SET role = $1 WHERE email = $2',
        ['super_admin', email]
      );
      console.log('Super admin actualizado: role=super_admin');
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO creators (name, email, password_hash, role, slug)
         VALUES ($1, $2, $3, $4, $5)`,
        ['Super Admin', email, passwordHash, 'super_admin', 'super-admin']
      );
      console.log('Super admin creado exitosamente');
    }

    console.log('Super admin listo');
  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    await pool.end();
  }
}

seed();
