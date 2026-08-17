'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import GoogleSignIn from '@/components/ui/GoogleSignIn';

export default function AdminLogin() {
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

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    setError('');
    setLoading(true);
    try {
      const result = await api.googleLogin(credential);
      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_user', JSON.stringify(result.creator));
      router.push(result.creator.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-rose-light px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-rose-elegant flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-text-dark text-lg">Econova Hub</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-dark">Panel de Administración</h1>
          <p className="text-text-gray mt-2">Ingresa tus credenciales para acceder</p>
        </div>

        <div className="bg-white rounded-2xl border border-rose-soft/50 p-8 shadow-md">
          <div className="mb-4">
            <GoogleSignIn onSuccess={handleGoogleSuccess} mode="login" />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-rose-soft/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-text-gray">o continúa con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
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
                className="w-full px-4 py-3 rounded-xl border border-rose-soft/50 bg-white text-text-dark placeholder:text-text-gray/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30 focus:border-rose-elegant"
                placeholder="admin@econovahub.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-dark mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-rose-soft/50 bg-white text-text-dark placeholder:text-text-gray/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30 focus:border-rose-elegant"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="block text-sm text-text-gray hover:text-rose-elegant transition-colors">
            ← Volver al inicio
          </Link>
          <Link href="/admin/register" className="block text-sm text-rose-elegant font-medium hover:underline">
            Crear una cuenta nueva
          </Link>
        </div>
      </div>
    </div>
  );
}
