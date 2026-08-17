const db = require('../config/db');

const CreatorModel = {
  async findById(id) {
    const result = await db.query(
      'SELECT id, name, email, photo_url, bio, profession, experience, social_links, role, slug, created_at FROM creators WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM creators WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findBySlug(slug) {
    const result = await db.query(
      'SELECT id, name, photo_url, bio, profession, experience, social_links, slug, created_at FROM creators WHERE slug = $1',
      [slug]
    );
    return result.rows[0];
  },

  async getPublicProfile() {
    const result = await db.query(
      'SELECT id, name, photo_url, bio, profession, experience, social_links, slug, created_at FROM creators WHERE role = $1 LIMIT 1',
      ['admin']
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query(
      'SELECT id, name, email, photo_url, bio, profession, experience, slug, role, created_at FROM creators ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async create({ name, email, passwordHash, slug, photoUrl, bio, profession, experience, socialLinks, role }) {
    const result = await db.query(
      `INSERT INTO creators (name, email, password_hash, slug, photo_url, bio, profession, experience, social_links, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, email, photo_url, bio, profession, experience, social_links, role, slug, created_at`,
      [name, email, passwordHash, slug, photoUrl, bio, profession, experience, JSON.stringify(socialLinks || {}), role || 'creator']
    );
    return result.rows[0];
  },

  async update(id, { name, bio, profession, experience, socialLinks, photoUrl, slug }) {
    const result = await db.query(
      `UPDATE creators
       SET name = COALESCE($2, name),
           bio = COALESCE($3, bio),
           profession = COALESCE($4, profession),
           experience = COALESCE($5, experience),
           social_links = COALESCE($6, social_links),
           photo_url = COALESCE($7, photo_url),
           slug = COALESCE($8, slug)
       WHERE id = $1
       RETURNING id, name, email, photo_url, bio, profession, experience, social_links, role, slug, created_at`,
      [id, name, bio, profession, experience, JSON.stringify(socialLinks), photoUrl, slug]
    );
    return result.rows[0];
  },

  async updateByAdmin(id, { name, email, role, profession, bio, experience, slug }) {
    const result = await db.query(
      `UPDATE creators
       SET name = COALESCE($2, name),
           email = COALESCE($3, email),
           role = COALESCE($4, role),
           profession = COALESCE($5, profession),
           bio = COALESCE($6, bio),
           experience = COALESCE($7, experience),
           slug = COALESCE($8, slug)
       WHERE id = $1
       RETURNING id, name, email, photo_url, bio, profession, experience, social_links, role, slug, created_at`,
      [id, name, email, role, profession, bio, experience, slug]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM creators WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },
};

module.exports = CreatorModel;