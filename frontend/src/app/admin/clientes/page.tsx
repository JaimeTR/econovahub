'use client';

import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface CustomerOrder {
  order_id: string;
  status: string;
  amount: number;
  product_name: string;
  creator_name: string;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  registered_at: string;
  total_orders: number;
  completed_orders: number;
  orders: CustomerOrder[];
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/orders/customers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    })
      .then(r => r.json())
      .then(d => { setCustomers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-text-dark mb-6">Clientes</h1>

      {customers.length === 0 ? (
        <div className="text-center py-16 text-text-gray">Aún no hay clientes registrados</div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-rose-soft/30 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-rose-soft/20 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-elegant to-rose-soft flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {c.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-text-dark truncate">{c.name || 'Sin nombre'}</p>
                    <p className="text-xs text-text-gray truncate">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-gray flex-shrink-0">
                  <span className="hidden sm:inline">{c.total_orders} órdenes</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.completed_orders > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.completed_orders} completadas
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${expanded === c.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === c.id && (
                <div className="border-t border-rose-soft/20">
                  {c.orders?.length === 0 ? (
                    <p className="p-4 text-sm text-text-gray text-center">Sin órdenes</p>
                  ) : (
                    <div className="divide-y divide-rose-soft/20">
                      {c.orders.map((o: CustomerOrder) => (
                        <div key={o.order_id} className="px-4 py-3 flex items-center justify-between text-sm">
                          <div className="min-w-0">
                            <p className="font-medium text-text-dark truncate">{o.product_name || 'Producto'}</p>
                            <p className="text-xs text-text-gray">Creador: {o.creator_name || '—'}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs flex-shrink-0">
                            <span className="text-text-gray">S/ {Number(o.amount).toFixed(2)}</span>
                            <span className={`px-2 py-0.5 rounded-full font-medium ${o.status === 'completed' ? 'bg-green-100 text-green-700' : o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                              {o.status === 'completed' ? 'Completada' : o.status === 'pending' ? 'Pendiente' : 'Anulada'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
