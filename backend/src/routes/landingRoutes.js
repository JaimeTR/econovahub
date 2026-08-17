const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const db = require('../config/db');

const DEFAULT_CONFIG = {
  hero: { title: 'Organiza tus ventas por catálogo y conoce realmente cuánto ganas', subtitle: 'Plantillas de Excel profesionales para controlar clientes, productos, ventas y ganancias desde un solo lugar.', cta: 'Ver planes' },
  problems: { title: '¿Por qué usar un sistema de gestión de ventas?', problem: 'Sin un registro ordenado pierdes clientes, no sabes si un producto deja ganancia y confundes precios con comisiones.', solution: 'Ingresa tus datos y las hojas calculan automáticamente precios, ganancias, comisiones y totales mensuales.' },
  how: { subtitle: 'Obtén tu plantilla en 3 pasos' },
  cta: { title: 'Empieza a organizar tu negocio hoy', subtitle: 'Invierte en el control de tu negocio. Descarga tu plantilla al instante.', button: 'Ver planes disponibles' },
  theme: { id: 'rose', primary: '#e8a0bf', variant: 'rose' },
  sections: Object.fromEntries(['hero', 'problems', 'creator', 'plans', 'how', 'faq', 'cta'].map(s => [s, true])),
};

// Public: get active landing page by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query(
      'SELECT * FROM landing_pages WHERE slug = $1 AND published = true LIMIT 1',
      [slug]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Landing page no encontrada' });
    }
    const page = result.rows[0];
    const config = { ...DEFAULT_CONFIG, ...(typeof page.config === 'object' ? page.config : {}) };
    res.json({ ...page, config });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auth: list all landing pages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, slug, title, published, created_at, updated_at FROM landing_pages WHERE creator_id = $1 ORDER BY created_at DESC',
      [req.creator.id]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auth: get single landing page with full config
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM landing_pages WHERE id = $1 AND creator_id = $2',
      [req.params.id, req.creator.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Landing page no encontrada' });
    }
    const page = result.rows[0];
    const config = { ...DEFAULT_CONFIG, ...(typeof page.config === 'object' ? page.config : {}) };
    res.json({ ...page, config });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auth: create landing page
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { slug, title, config, product_ids } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ error: 'Slug y titulo son requeridos' });
    }
    const result = await db.query(
      `INSERT INTO landing_pages (creator_id, slug, title, config, product_ids, published)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id, slug, title, published, created_at`,
      [req.creator.id, slug, title, JSON.stringify(config || {}), product_ids || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ error: 'Ya existe una landing page con ese slug' });
    }
    res.status(500).json({ error: e.message });
  }
});

// Auth: update landing page
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, config, product_ids, published } = req.body;
    await db.query(
      `UPDATE landing_pages
       SET title = COALESCE($1, title),
           config = COALESCE($2, config),
           product_ids = COALESCE($3, product_ids),
           published = COALESCE($4, published),
           updated_at = NOW()
       WHERE id = $5 AND creator_id = $6`,
      [title, config ? JSON.stringify(config) : null, product_ids, published, req.params.id, req.creator.id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auth: delete landing page
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM landing_pages WHERE id = $1 AND creator_id = $2', [req.params.id, req.creator.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;