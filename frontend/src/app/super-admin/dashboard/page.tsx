'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (!token || !user) { router.push('/super-admin/login'); return; }
    if (JSON.parse(user).role !== 'super_admin') { router.push('/admin/dashboard'); return; }

    fetch(`${API_URL}/orders/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setOrders(d || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  const totalVentas = orders.filter(o => o.status === 'completed').length;
  const totalIngresos = orders.filter(o => o.status === 'completed').reduce((s, o) => s + parseFloat(o.amount || 0), 0);
  const totalClientes = [...new Set(orders.filter(o => o.status === 'completed').map(o => o.buyer_email || o.customer_email))].length;
  const totalCreadores = new Set(orders.map(o => o.creator_name)).size;
  const pendientes = orders.filter(o => o.status !== 'completed').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Panel Super Admin</h1>
          <p className="text-sm text-text-gray">Gestión general del sistema Econova Hub</p>
        </div>
        <Link href="/super-admin/ordenes"
          className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-all">
          {pendientes > 0 ? `${pendientes} orden(es) pendiente(s)` : 'Ver ordenes'}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Ventas totales</p>
          <p className="text-2xl font-bold text-text-dark">{totalVentas}</p>
        </div>
        <div className="bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Ingresos totales</p>
          <p className="text-2xl font-bold text-sky-600">S/ {totalIngresos.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Clientes</p>
          <p className="text-2xl font-bold text-text-dark">{totalClientes}</p>
        </div>
        <div className="bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm">
          <p className="text-text-gray text-xs mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-amber-500">{pendientes}</p>
        </div>
      </div>

      {/* Acceso rapido */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Link href="/super-admin/creadores" className="block bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-dark text-sm">Creadores</p>
              <p className="text-[11px] text-text-gray">Gestionar creadores del sistema</p>
            </div>
          </div>
        </Link>

        <Link href="/super-admin/clientes" className="block bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-dark text-sm">Clientes</p>
              <p className="text-[11px] text-text-gray">Ver todos los clientes y compras</p>
            </div>
          </div>
        </Link>

        <Link href="/super-admin/ordenes" className="block bg-white rounded-2xl border border-sky-200/50 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-dark text-sm">Ordenes</p>
              <p className="text-[11px] text-text-gray">Todas las ordenes del sistema</p>
            </div>
          </div>
        </Link>

        <Link href="/" className="block bg-gradient-to-r from-sky-500/5 to-sky-200/30 rounded-2xl border border-sky-200/50 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-dark text-sm">Ir al inicio</p>
              <p className="text-[11px] text-text-gray">Ver la plataforma pública</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Ordenes recientes */}
      <div className="bg-white rounded-2xl border border-sky-200/50 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-sky-200/30 flex items-center justify-between">
          <h2 className="font-bold text-text-dark text-sm">Ordenes recientes</h2>
          <Link href="/super-admin/ordenes" className="text-xs text-sky-600 hover:underline">Ver todas</Link>
        </div>
        <div className="divide-y divide-sky-100/50">
          {orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-text-gray text-sm">No hay ordenes aun</p>
          ) : (
            orders.slice(0, 5).map((o: any) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-dark">{o.product_name || 'Producto'}</p>
                  <p className="text-[11px] text-text-gray">{o.buyer_email || o.customer_email} · S/ {o.amount} · {o.creator_name || '—'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {o.status === 'completed' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
