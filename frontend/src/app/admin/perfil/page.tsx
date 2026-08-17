'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Creator } from '@/lib/types';
import { useNotification } from '@/components/ui/NotificationProvider';

import { getBackendUrl } from '@/lib/urls';

const BACKEND_URL = getBackendUrl();

export default function AdminPerfil() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const { notify } = useNotification();
  const [profile, setProfile] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    bio: '',
    profession: '',
    experience: '',
    slug: '',
    social_linkedin: '',
    social_instagram: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { router.push('/admin/login'); return; }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getMyProfile(token!);
      setProfile(data);
      setForm({
        name: data.name || '',
        bio: data.bio || '',
        profession: data.profession || '',
        experience: data.experience || '',
        slug: data.slug || '',
        social_linkedin: data.social_links?.linkedin || '',
        social_instagram: data.social_links?.instagram || '',
      });
      if (data.photo_url) {
        setPhotoPreview(data.photo_url.startsWith('http') ? data.photo_url : `${BACKEND_URL}${data.photo_url}`);
      }
    } catch {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('bio', form.bio);
    fd.append('profession', form.profession);
    fd.append('experience', form.experience);
    fd.append('slug', form.slug);
    fd.append('socialLinks', JSON.stringify({
      linkedin: form.social_linkedin,
      instagram: form.social_instagram,
    }));
    if (photoFile) fd.append('photo', photoFile);
    try {
      await api.updateMyProfile(token, fd);
      loadProfile();
    } catch (e: any) {
      notify('error', e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-light flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-light">
      <header className="bg-white border-b border-rose-soft/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-elegant flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-text-dark">Econova Hub Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-sm text-text-gray hover:text-rose-elegant transition-colors">Dashboard</Link>
            <Link href="/admin/landing" className="text-sm text-text-gray hover:text-rose-elegant transition-colors">Landing</Link>
            <Link href="/" className="text-sm text-text-gray hover:text-rose-elegant transition-colors">Ver Landing</Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 transition-colors">Salir</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-text-dark mb-8">Mi Perfil</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-rose-soft/50 p-8 shadow-sm space-y-6">
          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Foto de perfil</label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-elegant to-rose-elegant/80 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
                {photoPreview ? (
                  <img src={photoPreview} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{form.name.charAt(0) || '?'}</span>
                )}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); }
                }} className="w-full text-sm text-text-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rose-soft file:text-rose-elegant file:font-medium file:text-sm hover:file:bg-rose-elegant/20" />
                <p className="text-[10px] text-text-gray mt-1">Recomendado: 400x400px, formato cuadrado</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">URL de tu landing</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-gray flex-shrink-0">/</span>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase() })}
                  placeholder="ambar-castro"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
              </div>
              <p className="text-[10px] text-text-gray mt-1">Tu pagina: econovahub.com/{form.slug || 'tu-url'}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Profesion</label>
              <input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })}
                placeholder="Ej: Economista"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Biografia</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Experiencia</label>
            <textarea value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={2}
              placeholder="Ej: 5 anos ayudando a emprendedoras a organizar sus finanzas"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">LinkedIn</label>
              <input value={form.social_linkedin} onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Instagram</label>
              <input value={form.social_instagram} onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </main>
    </div>
  );
}