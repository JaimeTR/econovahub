'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useNotification } from '@/components/ui/NotificationProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminOrdenes() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);

    fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const confirmarPago = async (orderId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/confirmar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      notify('success', 'Pago confirmado', `Token: ${data.download_token?.slice(0, 8)}...`);

      const updated = await fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(await updated.json());
    } catch {
      notify('error', 'Error al confirmar pago');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-dark mb-6">Órdenes de compra</h1>

      <div className="bg-white rounded-xl border border-rose-soft/50 p-4 mb-6 shadow-sm">
        <p className="text-xs text-text-gray">
          Confirma manualmente los pagos cuando verifiques que el cliente pagó en PayPal o Culqi.
          Al confirmar, se envía automáticamente un correo con el link de descarga.
        </p>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-rose-soft/50 p-12 text-center shadow-sm">
            <p className="text-text-gray">No hay órdenes registradas</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-rose-soft/50 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.status === 'completed' ? 'Pagado' : 'Pendiente'}
                    </span>
                    <span className="font-semibold text-text-dark text-sm">{order.product_name || 'Producto'}</span>
                  </div>
                  <p className="text-xs text-text-gray">
                    <strong>{order.customer_name || order.buyer_email}</strong> · {order.buyer_email}
                  </p>
                  <p className="text-xs text-text-gray mt-1">
                    S/ {order.amount} · {new Date(order.created_at).toLocaleDateString('es-PE')} {new Date(order.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {order.culqi_reference && (
                    <p className="text-[10px] text-text-gray mt-1">Culqi Ref: {order.culqi_reference}</p>
                  )}
                  {order.download_token && (
                    <p className="text-[10px] text-green-600 mt-1">Token descarga: {order.download_token.slice(0, 12)}...</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {order.status !== 'completed' ? (
                    <button onClick={() => confirmarPago(order.id)}
                      className="px-5 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-all">
                      Confirmar pago
                    </button>
                  ) : (
                    <span className="px-3 py-2 text-xs text-green-600 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
