-- Actualizar productos con links de PayPal y Culqi
DELETE FROM products;

INSERT INTO products (creator_id, name, description, price, tagline, badge, features, payment_url, sort_order, is_active)
VALUES
(
  (SELECT id FROM creators WHERE email = 'admin@econovahub.com'),
  'Mi Catalogo al Dia',
  'Ordena tus ventas y clientes sin complicarte. 14 hojas listas para usar con inventario de hasta 50 productos, registro de ventas diarias, control de clientes y totales mensuales automaticos.',
  18.00,
  'Ordena tus ventas y clientes sin complicarte',
  NULL,
  '["14 hojas listas para usar","Inventario de hasta 50 productos","Registro de ventas diarias (ene-dic)","Control de clientes, productos y pedidos","Totales mensuales automaticos","Ideal para empezar a organizar tu negocio","Manual de uso incluido"]',
  'https://express.culqi.com/pago/C049DDA931',
  1,
  true
),
(
  (SELECT id FROM creators WHERE email = 'admin@econovahub.com'),
  'Gestion de Ventas por Catalogo',
  'Conoce tu ganancia real y controla comisiones. 16 hojas profesionales con inventario inteligente que calcula automaticamente precio, ganancia y comision.',
  35.00,
  'Conoce tu ganancia real y controla comisiones',
  'El mas vendido',
  '["16 hojas profesionales","Inventario inteligente con calculo automatico","Calculadora de campana","Control de comisiones para vendedoras","Resumen anual con dashboard y graficos","Ganancia real por producto","Compatible con todos los catalogos","Manual de uso incluido"]',
  'https://express.culqi.com/pago/9B49AFCF52',
  2,
  true
),
(
  (SELECT id FROM creators WHERE email = 'admin@econovahub.com'),
  'Gestion de Ventas Pro',
  'El sistema completo para escalar tu negocio. 19 hojas profesionales con calculadora de costo unitario, gestion de precios, calculo de sueldo y rentabilidad real.',
  55.00,
  'El sistema completo para escalar tu negocio',
  NULL,
  '["19 hojas profesionales","Calculadora de costo unitario (costos fijos + variables + empaque)","Gestion de precios e inventario","Calculo de inversion y margen de ganancia","Calculadora automatica de campanas","Modulo Cuanto me pago (sueldo real)","Monitoreo por catalogo","Control de facturas","Resumen anual con graficos y metricas","Manual de uso incluido"]',
  'https://express.culqi.com/pago/B11C573E1D',
  3,
  true
);
