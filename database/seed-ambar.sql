-- Actualizar el perfil de la creadora
UPDATE creators
SET name = 'Ambar Castro Alejos',
    bio = 'Economista especialista en herramientas financieras y organizacion de negocios. Ayudo a emprendedores a tomar el control de sus ventas por catalogo.',
    profession = 'Economista',
    experience = '3+ anos creando herramientas financieras para emprendedores y pequenos negocios.',
    social_links = '{"instagram": "https://instagram.com/", "linkedin": "https://linkedin.com/", "tiktok": "https://tiktok.com/"}'
WHERE email = 'admin@econovahub.com';

-- Borrar productos anteriores y crear los correctos
DELETE FROM products;

INSERT INTO products (creator_id, name, description, price, tagline, badge, features, payment_url, sort_order, is_active)
VALUES
(
  (SELECT id FROM creators WHERE email = 'admin@econovahub.com'),
  'Mi Catalogo al Dia',
  'Herramienta basica para empezar a registrar tus ventas, clientes y tener un resumen mensual claro. Incluye manual de uso.',
  18.00,
  'Anota tus ventas, controla tus clientes y sabe cuanto vendiste cada mes.',
  NULL,
  '["Registro de ventas","Control basico de clientes","Resumen mensual","Seguimiento de pedidos","Manual de uso incluido"]',
  'https://express.culqi.com/pago/C049DDA931',
  1,
  true
),
(
  (SELECT id FROM creators WHERE email = 'admin@econovahub.com'),
  'Gestion de Ventas por Catalogo',
  'Herramienta intermedia con control de productos, calculo de ganancias y reportes basicos. Incluye manual de uso.',
  35.00,
  'Sabe exactamente cuanto ganas por cada producto que vendes.',
  'El mas vendido',
  '["Control de productos","Registro de ventas","Control de clientes","Calculo de ganancias","Reportes basicos","Manual de uso incluido"]',
  'https://express.culqi.com/pago/9B49AFCF52',
  2,
  true
),
(
  (SELECT id FROM creators WHERE email = 'admin@econovahub.com'),
  'Gestion, Analisis - Negocio Escalable',
  'Sistema completo con costos reales, utilidad, sueldo y multiples catalogos. Reportes avanzados para escalar tu negocio. Incluye manual de uso.',
  55.00,
  'El sistema completo: costo real, ganancia, sueldo y todos tus catalogos en uno.',
  NULL,
  '["Gestion completa de productos","Costos reales","Calculo de utilidad","Control de sueldo","Multiples catalogos","Reportes avanzados","Manual de uso incluido"]',
  'https://express.culqi.com/pago/B11C573E1D',
  3,
  true
);
