'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (token && user) {
      const role = JSON.parse(user).role;
      router.push(role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(email, password);
      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_user', JSON.stringify(result.creator));

      if (result.creator.role === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-text-dark text-lg">Super Admin</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-dark">Panel de Super Administrador</h1>
          <p className="text-text-gray mt-2">Acceso exclusivo para administración del sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sky-200/50 p-8 shadow-md">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-text-dark mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-sky-200/50 bg-white text-text-dark placeholder:text-text-gray/60 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              placeholder="superadmin@econovahub.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-dark mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-sky-200/50 bg-white text-text-dark placeholder:text-text-gray/60 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="block text-sm text-text-gray hover:text-sky-600 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
