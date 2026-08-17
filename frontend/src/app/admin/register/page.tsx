'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import GoogleSignIn from '@/components/ui/GoogleSignIn';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (token && user) {
      const role = JSON.parse(user).role;
      router.push(role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard');
    }
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Todos los campos son requeridos');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await api.sendVerificationCode(form.name, form.email, form.password);
      setStep('code');
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Ingresa el código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyCode(form.email, fullCode);
      localStorage.setItem('admin_token', res.token);
      localStorage.setItem('admin_user', JSON.stringify(res.creator));

      if (res.creator.role === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      await api.sendVerificationCode(form.name, form.email, form.password);
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || 'Error al reenviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (i: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[i] = value;
    setCode(newCode);
    if (value && i < 5) {
      const next = document.getElementById(`code-${i + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      const prev = document.getElementById(`code-${i - 1}`);
      prev?.focus();
    }
  };

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.googleRegister(credential);
      localStorage.setItem('admin_token', res.token);
      localStorage.setItem('admin_user', JSON.stringify(res.creator));
      router.push(res.creator.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-soft/40 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-elegant flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-2xl font-bold text-text-dark">
            {step === 'form' ? 'Crear cuenta' : 'Verifica tu correo'}
          </h1>
          <p className="text-sm text-text-gray mt-1">
            {step === 'form' ? 'Registra un nuevo administrador' : `Enviamos un código a ${form.email}`}
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSendCode} className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Nombre</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Contraseña</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Confirmar contraseña</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all disabled:opacity-50">
              {loading ? 'Enviando código...' : 'Enviar código de verificación'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rose-soft/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-text-gray">o regístrate con</span>
              </div>
            </div>

            <GoogleSignIn onSuccess={handleGoogleSuccess} mode="register" />

            <p className="text-center text-xs text-text-gray">
              ¿Ya tienes cuenta?{' '}
              <Link href="/admin/login" className="text-rose-elegant font-medium hover:underline">Inicia sesión</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-dark mb-3 text-center">Código de verificación</label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, i) => (
                  <input key={i} id={`code-${i}`} type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-rose-soft/50 text-text-dark focus:outline-none focus:ring-2 focus:ring-rose-elegant/30" />
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all disabled:opacity-50">
              {loading ? 'Verificando...' : 'Verificar y crear cuenta'}
            </button>

            <div className="text-center">
              <button type="button" onClick={handleResend} disabled={resendTimer > 0 || loading}
                className="text-xs text-rose-elegant font-medium hover:underline disabled:opacity-50 disabled:no-underline">
                {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : 'Reenviar código'}
              </button>
            </div>

            <button type="button" onClick={() => { setStep('form'); setCode(['', '', '', '', '', '']); setError(''); }}
              className="w-full text-xs text-text-gray hover:text-text-dark transition-colors">
              Volver atrás
            </button>
          </form>
        )}
      </div>
    </div>
  );
}