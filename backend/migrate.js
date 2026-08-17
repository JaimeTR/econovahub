require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  try {
    await pool.query(`ALTER TABLE creators ADD COLUMN IF NOT EXISTS landing_config JSONB DEFAULT '{}'`);
    console.log('✅ landing_config column added');
  } catch (e) {
    console.log('Error:', e.message);
  }
  pool.end();
}

migrate();
