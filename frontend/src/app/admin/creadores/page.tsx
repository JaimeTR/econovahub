'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Creator {
  id: string;
  name: string;
  email: string;
  photo_url?: string;
  bio: string;
  profession: string;
  slug?: string;
  role: string;
  created_at: string;
}

export default function AdminCreadoresPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/creators/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    })
      .then(r => r.json())
      .then(d => { setCreators(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-dark">Creadores</h1>
        <Link href="/admin/register"
          className="px-4 py-2 rounded-xl bg-rose-elegant text-white text-sm font-semibold hover:bg-rose-elegant/90 transition-all">
          + Nuevo creador
        </Link>
      </div>

      {creators.length === 0 ? (
        <div className="text-center py-16 text-text-gray">No hay creadores registrados</div>
      ) : (
        <div className="space-y-3">
          {creators.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-rose-soft/30 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-elegant to-rose-soft flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {c.photo_url ? (
                  <img src={`${API.replace('/api', '')}${c.photo_url}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  c.name?.charAt(0)?.toUpperCase() || '?'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-dark">{c.name || 'Sin nombre'}</p>
                <p className="text-xs text-text-gray truncate">{c.email}</p>
                {c.profession && <p className="text-xs text-rose-elegant mt-0.5">{c.profession}</p>}
              </div>
              <div className="flex items-center gap-3 text-xs flex-shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-rose-soft/50 text-rose-elegant">{c.role}</span>
                {c.slug && (
                  <Link href={`/${c.slug}`} target="_blank"
                    className="text-rose-elegant hover:underline">
                    Ver landing
                  </Link>
                )}
                <span className="text-text-gray hidden sm:inline">{new Date(c.created_at).toLocaleDateString('es-PE')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
