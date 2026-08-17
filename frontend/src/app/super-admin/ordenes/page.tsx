'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function SuperAdminOrdenes() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCreator, setFilterCreator] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch(`${API_URL}/orders/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setOrders(d || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const creators = [...new Set(orders.map(o => o.creator_name).filter(Boolean))] as string[];

  const filtered = filterCreator
    ? orders.filter(o => o.creator_name === filterCreator)
    : orders;

  if (loading) return <div className="p-6 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-dark">Órdenes</h1>
        {creators.length > 0 && (
          <select value={filterCreator} onChange={e => setFilterCreator(e.target.value)}
            className="px-4 py-2 rounded-xl border border-sky-200/50 text-sm bg-white text-text-dark focus:outline-none focus:ring-2 focus:ring-sky-500/30">
            <option value="">Todos los creadores</option>
            {creators.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-gray">No hay órdenes registradas</div>
      ) : (
        <div className="bg-white rounded-xl border border-sky-200/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 text-text-gray text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium">Producto</th>
                  <th className="text-left px-4 py-3 font-medium">Creador</th>
                  <th className="text-left px-4 py-3 font-medium">Monto</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/50">
                {filtered.map((o: any) => (
                  <tr key={o.id} className="hover:bg-sky-50/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-dark">{o.customer_name || '—'}</p>
                      <p className="text-[11px] text-text-gray">{o.buyer_email || o.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 text-text-dark">{o.product_name || '—'}</td>
                    <td className="px-4 py-3 text-text-dark">{o.creator_name || '—'}</td>
                    <td className="px-4 py-3 text-text-dark">S/ {Number(o.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {o.status === 'completed' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-gray whitespace-nowrap">{new Date(o.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
