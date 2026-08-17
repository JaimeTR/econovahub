'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function MisCompras() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const buscarCompras = async () => {
    if (!email.includes('@')) {
      setError('Ingresa un correo valido');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const res = await fetch(`${API_URL}/orders/customer/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Sin resultados');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-rose-light py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/ambar" className="inline-flex items-center gap-1 text-xs text-text-gray hover:text-rose-elegant mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la tienda
        </Link>

        <div className="bg-white rounded-3xl border border-rose-soft/50 p-6 shadow-md">
          <h1 className="text-xl font-bold text-text-dark mb-2">Mis compras</h1>
          <p className="text-sm text-text-gray mb-6">Ingresa tu correo para ver tus productos adquiridos</p>

          <div className="flex gap-2">
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="tu@correo.com"
              onKeyDown={(e) => e.key === 'Enter' && buscarCompras()}
              className="flex-1 px-4 py-3 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30 focus:border-rose-elegant text-text-dark"
            />
            <button
              onClick={buscarCompras}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

          {searched && (
            <div className="mt-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-rose-elegant/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-text-gray">No encontramos compras con este correo</p>
                  <p className="text-xs text-text-gray mt-1">Verifica que sea el mismo que usaste al pagar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-text-gray">{orders.length} compra(s) encontrada(s)</p>
                  {orders.map((order: any) => (
                    <div key={order.id} className="p-4 rounded-xl border border-rose-soft/50 bg-rose-soft/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-text-dark text-sm">{order.product_name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.status === 'completed' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-xs text-text-gray mb-1">Monto: S/ {order.amount}</p>
                      <p className="text-xs text-text-gray mb-3">Fecha: {new Date(order.created_at).toLocaleDateString('es-PE')}</p>

                      {order.status === 'completed' && order.download_token && (
                        <a
                          href={`/descargar/${order.download_token}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-elegant text-white text-xs font-medium hover:bg-rose-elegant/90 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Descargar
                        </a>
                      )}

                      {order.culqi_reference && order.status === 'completed' && (
                        <p className="text-[10px] text-text-gray mt-2">Pago Culqi: {order.culqi_reference}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
