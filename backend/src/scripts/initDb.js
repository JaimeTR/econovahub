require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initDb() {
  console.log('Initializing Econova Hub database...\n');

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS creators (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        photo_url TEXT,
        bio TEXT,
        profession VARCHAR(255),
        experience TEXT,
        social_links JSONB DEFAULT '{}',
        role VARCHAR(50) DEFAULT 'creator',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table "creators" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        tagline VARCHAR(255),
        badge VARCHAR(100),
        features JSONB DEFAULT '[]',
        image_url TEXT,
        file_url TEXT,
        payment_url TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table "products" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table "customers" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID REFERENCES products(id),
        customer_id UUID REFERENCES customers(id),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        culqi_reference VARCHAR(255),
        buyer_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table "orders" created');

    await db.query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        max_downloads INT DEFAULT 3,
        download_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table "downloads" created');

    const existingAdmin = await db.query(
      "SELECT id FROM creators WHERE email = $1",
      [process.env.ADMIN_EMAIL || 'admin@econovahub.com']
    );

    if (existingAdmin.rows.length === 0) {
      const password = process.env.ADMIN_PASSWORD;
      if (!password) {
        console.error('Falta ADMIN_PASSWORD en .env para crear el admin inicial');
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);

      await db.query(
        `INSERT INTO creators (name, email, password_hash, profession, role, bio, social_links)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          'Creadora Econova',
          process.env.ADMIN_EMAIL || 'admin@econovahub.com',
          passwordHash,
          'Economista',
          'admin',
          'Especialista en herramientas financieras y organización de negocios.',
          JSON.stringify({
            linkedin: 'https://linkedin.com/',
            instagram: 'https://instagram.com/',
            twitter: 'https://twitter.com/',
          }),
        ]
      );
      console.log('✓ Admin user created');
      console.log('  ⚠ Change the default password in production!');
    } else {
      console.log('✓ Admin user already exists');
    }

    console.log('\nDatabase initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
