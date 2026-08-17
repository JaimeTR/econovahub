'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/components/ui/NotificationProvider';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const TOKEN = () => (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);

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

export default function SuperAdminCreadores() {
  const { notify } = useNotification();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Creator | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newCreator, setNewCreator] = useState({ name: '', email: '', password: '' });
  const [creatingLoading, setCreatingLoading] = useState(false);

  const load = () => {
    fetch(`${API}/creators/all`, {
      headers: { Authorization: `Bearer ${TOKEN()}` },
    })
      .then(r => r.json())
      .then(d => { setCreators(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await fetch(`${API}/creators/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` },
      body: JSON.stringify({
        name: editing.name,
        email: editing.email,
        role: editing.role,
        profession: editing.profession,
        bio: editing.bio,
        slug: editing.slug,
      }),
    });
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`${API}/creators/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${TOKEN()}` },
    });
    const data = await res.json();
    if (data.error) { notify('error', data.error); return; }
    setDeleting(null);
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreator.name || !newCreator.email || !newCreator.password) {
      notify('error', 'Todos los campos son requeridos');
      return;
    }
    if (newCreator.password.length < 6) {
      notify('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setCreatingLoading(true);
    const res = await fetch(`${API}/creators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCreator),
    });
    const data = await res.json();
    if (data.error) { notify('error', data.error); setCreatingLoading(false); return; }
    notify('success', `Creador "${data.creator.name}" registrado`);
    setCreating(false);
    setNewCreator({ name: '', email: '', password: '' });
    setCreatingLoading(false);
    load();
  };

  if (loading) return <div className="p-6 flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-dark">Creadores</h1>
        <button onClick={() => setCreating(true)}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-all">
          + Nuevo creador
        </button>
      </div>

      {creators.length === 0 ? (
        <div className="text-center py-16 text-text-gray">No hay creadores registrados</div>
      ) : (
        <div className="space-y-3">
          {creators.filter(c => c.role !== 'super_admin').map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-sky-200/30 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-200 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {c.photo_url ? (
                  <img src={`${API.replace('/api', '')}${c.photo_url}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  c.name?.charAt(0)?.toUpperCase() || '?'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-dark">{c.name || 'Sin nombre'}</p>
                <p className="text-xs text-text-gray truncate">{c.email}</p>
                {c.profession && <p className="text-xs text-sky-600 mt-0.5">{c.profession}</p>}
              </div>
              <div className="flex items-center gap-2 text-xs flex-shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-600">Creador</span>
                {c.slug && (
                  <Link href={`/${c.slug}`} target="_blank" className="text-sky-600 hover:underline hidden sm:inline">Ver landing</Link>
                )}
                <button onClick={() => setEditing(c)}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all font-medium">Editar</button>
                <button onClick={() => setDeleting(c.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editar */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-dark">Editar Creador</h2>
              <button onClick={() => setEditing(null)} className="text-text-gray hover:text-text-dark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-dark mb-1">Nombre</label>
                  <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-dark mb-1">Email</label>
                  <input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-dark mb-1">Profesión</label>
                  <input value={editing.profession} onChange={e => setEditing({ ...editing, profession: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-dark mb-1">Slug (URL)</label>
                  <input value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-dark mb-1">Biografía</label>
                <textarea value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-sky-200/50 text-sm text-text-gray hover:bg-sky-50 transition-all">Cancelar</button>
                <button type="submit"
                  className="px-6 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-all">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleting && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDeleting(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-2">Eliminar creador</h3>
            <p className="text-sm text-text-gray mb-6">Se eliminarán todos sus productos, órdenes y datos asociados. Esta acción no se puede deshacer.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleting(null)}
                className="px-4 py-2 rounded-xl border border-sky-200/50 text-sm text-text-gray hover:bg-sky-50 transition-all">Cancelar</button>
              <button onClick={() => handleDelete(deleting)}
                className="px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear */}
      {creating && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setCreating(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-dark">Nuevo creador</h2>
              <button onClick={() => setCreating(false)} className="text-text-gray hover:text-text-dark">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-dark mb-1">Nombre</label>
                <input value={newCreator.name} onChange={e => setNewCreator({ ...newCreator, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-dark mb-1">Email</label>
                <input type="email" value={newCreator.email} onChange={e => setNewCreator({ ...newCreator, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-dark mb-1">Contraseña</label>
                <input type="password" value={newCreator.password} onChange={e => setNewCreator({ ...newCreator, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" required />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setCreating(false)}
                  className="px-4 py-2 rounded-xl border border-sky-200/50 text-sm text-text-gray hover:bg-sky-50 transition-all">Cancelar</button>
                <button type="submit" disabled={creatingLoading}
                  className="px-6 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-all disabled:opacity-50">
                  {creatingLoading ? 'Creando...' : 'Crear creador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
