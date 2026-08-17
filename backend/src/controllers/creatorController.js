const CreatorModel = require('../models/Creator');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendVerificationEmail } = require('../services/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const REGISTRATION_ROLE = 'admin';

const CreatorController = {
  async getPublicProfile(req, res) {
    try {
      const profile = await CreatorModel.getPublicProfile();
      if (!profile) {
        return res.status(404).json({ error: 'Perfil no encontrado' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Error getting public profile:', error);
      res.status(500).json({ error: 'Error al obtener el perfil' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const creator = await CreatorModel.findByEmail(email);
      if (!creator) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, creator.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: creator.id, email: creator.email, role: creator.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          role: creator.role,
        },
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      const existing = await CreatorModel.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Ya existe una cuenta con ese email' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const creator = await CreatorModel.create({
        name,
        email,
        passwordHash,
        role: REGISTRATION_ROLE,
        slug: email.split('@')[0].replace(/[^a-z0-9-]/g, ''),
      });

      const token = jwt.sign(
        { id: creator.id, email: creator.email, role: creator.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          role: creator.role,
        },
      });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Error al registrar' });
    }
  },

  async googleLogin(req, res) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ error: 'Credencial de Google requerida' });
      }

      if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google login no configurado. Contacta al administrador.' });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ error: 'No se pudo verificar la identidad de Google' });
      }

      const { email, name, picture } = payload;
      let creator = await CreatorModel.findByEmail(email);

      if (!creator) {
        return res.status(400).json({ error: 'No existe una cuenta con este email. Regístrate primero.' });
      }

      const token = jwt.sign(
        { id: creator.id, email: creator.email, role: creator.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          role: creator.role,
        },
      });
    } catch (error) {
      console.error('Error in googleLogin:', error);
      res.status(500).json({ error: 'Error al iniciar sesión con Google' });
    }
  },

  async googleRegister(req, res) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ error: 'Credencial de Google requerida' });
      }

      if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google login no configurado. Contacta al administrador.' });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ error: 'No se pudo verificar la identidad de Google' });
      }

      const { email, name, picture } = payload;

      const existing = await CreatorModel.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Ya existe una cuenta con este email. Inicia sesión.' });
      }

      const creator = await CreatorModel.create({
        name: name || email.split('@')[0],
        email,
        passwordHash: await bcrypt.hash(Math.random().toString(36), 10),
        role: REGISTRATION_ROLE,
        slug: email.split('@')[0].replace(/[^a-z0-9-]/g, ''),
        photoUrl: picture || null,
      });

      const token = jwt.sign(
        { id: creator.id, email: creator.email, role: creator.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          role: creator.role,
        },
      });
    } catch (error) {
      console.error('Error in googleRegister:', error);
      res.status(500).json({ error: 'Error al registrarse con Google' });
    }
  },

  async sendVerificationCode(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      const existing = await CreatorModel.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Ya existe una cuenta con ese email' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await db.query(
        `INSERT INTO pending_registrations (email, name, password_hash, code, expires_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET name = $2, password_hash = $3, code = $4, expires_at = $5`,
        [email, name, passwordHash, code, expiresAt]
      );

      await sendVerificationEmail({ email, name, code });

      res.json({ message: 'Código de verificación enviado al correo' });
    } catch (error) {
      console.error('Error in sendVerificationCode:', error);
      res.status(500).json({ error: 'Error al enviar código de verificación' });
    }
  },

  async verifyCodeAndRegister(req, res) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ error: 'Email y código son requeridos' });
      }

      const result = await db.query(
        'SELECT * FROM pending_registrations WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'No hay registro pendiente para este email' });
      }

      const pending = result.rows[0];

      if (pending.code !== code) {
        return res.status(400).json({ error: 'Código incorrecto' });
      }

      if (new Date() > new Date(pending.expires_at)) {
        await db.query('DELETE FROM pending_registrations WHERE email = $1', [email]);
        return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo' });
      }

      const existing = await CreatorModel.findByEmail(email);
      if (existing) {
        await db.query('DELETE FROM pending_registrations WHERE email = $1', [email]);
        return res.status(400).json({ error: 'Ya existe una cuenta con ese email' });
      }

      const creator = await CreatorModel.create({
        name: pending.name,
        email: pending.email,
        passwordHash: pending.password_hash,
        role: REGISTRATION_ROLE,
        slug: email.split('@')[0].replace(/[^a-z0-9-]/g, ''),
      });

      await db.query('DELETE FROM pending_registrations WHERE email = $1', [email]);

      const token = jwt.sign(
        { id: creator.id, email: creator.email, role: creator.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          role: creator.role,
        },
      });
    } catch (error) {
      console.error('Error in verifyCodeAndRegister:', error);
      res.status(500).json({ error: 'Error al verificar el código' });
    }
  },

  async getProfile(req, res) {
    try {
      const creator = await CreatorModel.findById(req.creator.id);
      if (!creator) {
        return res.status(404).json({ error: 'Perfil no encontrado' });
      }
      res.json(creator);
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ error: 'Error al obtener el perfil' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, bio, profession, experience, socialLinks, slug } = req.body;
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Parse socialLinks if it came as JSON string from FormData
      let parsedSocial = socialLinks;
      if (typeof socialLinks === 'string') {
        try { parsedSocial = JSON.parse(socialLinks); } catch { parsedSocial = {}; }
      }

      // Validate slug uniqueness if changed
      if (slug) {
        const existingBySlug = await CreatorModel.findBySlug(slug);
        if (existingBySlug && existingBySlug.id !== req.creator.id) {
          return res.status(400).json({ error: 'Ese slug ya esta en uso por otro creador' });
        }
      }

      const updated = await CreatorModel.update(req.creator.id, {
        name,
        bio,
        profession,
        experience,
        socialLinks: parsedSocial,
        photoUrl,
        slug,
      });

      res.json(updated);
    } catch (error) {
      console.error('Error updating profile:', error.message, error.stack);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Ese slug ya esta en uso' });
      }
      res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
  },

  async getCreatorBySlug(req, res) {
    try {
      const { slug } = req.params;
      const creator = await CreatorModel.findBySlug(slug);
      if (!creator) {
        return res.status(404).json({ error: 'Creador no encontrado' });
      }

      // Get their landing page
      const landingResult = await db.query(
        'SELECT * FROM landing_pages WHERE creator_id = $1 AND published = true LIMIT 1',
        [creator.id]
      );

      // Get their products
      const ProductModel = require('../models/Product');
      const products = await ProductModel.findByCreator(creator.id);

      res.json({
        creator,
        landing: landingResult.rows[0] || null,
        products: products.filter(p => p.is_active),
      });
    } catch (error) {
      console.error('Error getting creator by slug:', error);
      res.status(500).json({ error: 'Error al obtener el creador' });
    }
  },

  async getDashboardStats(req, res) {
    try {
      const OrderModel = require('../models/Order');
      const ProductModel = require('../models/Product');

      const stats = await OrderModel.getStats(req.creator.id);
      const products = await ProductModel.findByCreator(req.creator.id);

      res.json({
        ...stats,
        total_productos: products.length,
        productos_activos: products.filter(p => p.is_active).length,
      });
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  },

  async getAllCreators(req, res) {
    try {
      const creators = await CreatorModel.findAll();
      res.json(creators);
    } catch (error) {
      console.error('Error getting all creators:', error);
      res.status(500).json({ error: 'Error al obtener creadores' });
    }
  },

  async updateCreator(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role, profession, bio, experience, slug } = req.body;

      if (email) {
        const existing = await CreatorModel.findByEmail(email);
        if (existing && existing.id !== id) {
          return res.status(400).json({ error: 'Ese email ya está en uso' });
        }
      }
      if (slug) {
        const existingBySlug = await CreatorModel.findBySlug(slug);
        if (existingBySlug && existingBySlug.id !== id) {
          return res.status(400).json({ error: 'Ese slug ya está en uso' });
        }
      }

      const updated = await CreatorModel.updateByAdmin(id, { name, email, role, profession, bio, experience, slug });
      if (!updated) return res.status(404).json({ error: 'Creador no encontrado' });
      res.json(updated);
    } catch (error) {
      console.error('Error updating creator:', error);
      res.status(500).json({ error: 'Error al actualizar el creador' });
    }
  },

  async deleteCreator(req, res) {
    try {
      const { id } = req.params;
      if (id === req.creator.id) {
        return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
      }
      const deleted = await CreatorModel.delete(id);
      if (!deleted) return res.status(404).json({ error: 'Creador no encontrado' });
      res.json({ message: 'Creador eliminado' });
    } catch (error) {
      console.error('Error deleting creator:', error);
      res.status(500).json({ error: 'Error al eliminar el creador' });
    }
  },
};

module.exports = CreatorController;
