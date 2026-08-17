'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }

    Promise.all([
      fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/creators/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([ords, sts]) => {
        setOrders(ords || []);
        setStats(sts || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" /></div>;

  const totalVentas = orders.filter(o => o.status === 'completed').length;
  const totalIngresos = orders.filter(o => o.status === 'completed').reduce((s, o) => s + parseFloat(o.amount || 0), 0);
  const totalClientes = [...new Set(orders.filter(o => o.status === 'completed').map(o => o.buyer_email || o.customer_email))].length;
  const pendientes = orders.filter(o => o.status !== 'completed').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-sm text-text-gray">Bienvenida de vuelta, Ambar</p>
        </div>
        <Link href="/admin/ordenes"
          className="px-4 py-2 rounded-xl bg-rose-elegant text-white text-sm font-semibold hover:bg-rose-elegant/90 transition-all">
          {pendientes > 0 ? `${pendientes} orden(es) pendiente(s)` : 'Ver ordenes'}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Ventas</p>
          <p className="text-2xl font-bold text-text-dark">{totalVentas}</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Ingresos</p>
          <p className="text-2xl font-bold text-rose-elegant">S/ {totalIngresos.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Clientes</p>
          <p className="text-2xl font-bold text-text-dark">{totalClientes}</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-amber-500">{pendientes}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ordenes recientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-rose-soft/50 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-rose-soft/30 flex items-center justify-between">
            <h2 className="font-bold text-text-dark text-sm">Ordenes recientes</h2>
            <Link href="/admin/ordenes" className="text-xs text-rose-elegant hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-rose-soft/20">
            {orders.length === 0 ? (
              <p className="px-5 py-8 text-center text-text-gray text-sm">No hay ordenes aun</p>
            ) : (
              orders.slice(0, 5).map((o) => (
                <div key={o.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-dark">{o.product_name || 'Producto'}</p>
                    <p className="text-[11px] text-text-gray">{o.buyer_email || o.customer_email} · S/ {o.amount}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {o.status === 'completed' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Acciones rapidas */}
        <div className="space-y-4">
          <Link href="/admin/productos" className="block bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-elegant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-dark text-sm">Productos</p>
                <p className="text-[11px] text-text-gray">Editar planes y precios</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/landing" className="block bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-elegant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-dark text-sm">Landing</p>
                <p className="text-[11px] text-text-gray">Editar textos y colores</p>
              </div>
            </div>
          </Link>

          <Link href="/" className="block bg-gradient-to-r from-rose-elegant/5 to-rose-soft/30 rounded-2xl border border-rose-soft/50 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-elegant flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-dark text-sm">Ver landing page</p>
                <p className="text-[11px] text-text-gray">Como lo ven tus clientes</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/perfil" className="block bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-elegant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-dark text-sm">Mi Perfil</p>
                <p className="text-[11px] text-text-gray">Foto, biografia y redes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
