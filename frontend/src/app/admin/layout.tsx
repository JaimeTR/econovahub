'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { href: '/admin/ordenes', label: 'Ordenes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { href: '/admin/productos', label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10' },
  { href: '/admin/landing', label: 'Landing', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/admin/perfil', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setAuthed(true); return; }
    if (pathname === '/admin/register') { setAuthed(true); return; }
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (!token || !user) { router.push('/admin/login'); return; }
    const role = JSON.parse(user).role;
    if (role === 'super_admin') { router.push('/super-admin/dashboard'); return; }
    setAuthed(true);
  }, [pathname, router]);

  if (!authed) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (pathname === '/admin/login') return <>{children}</>;
  if (pathname === '/admin/register') return <>{children}</>;

  return (
    <div className="min-h-screen bg-rose-light flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-56 bg-white border-r border-rose-soft/50 flex-col flex-shrink-0">
          <div className="h-14 flex items-center gap-2 px-5 border-b border-rose-soft/30">
            <div className="w-7 h-7 rounded-lg bg-rose-elegant flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="font-semibold text-text-dark text-sm">Econova Hub</span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${pathname === n.href ? 'bg-rose-soft text-rose-elegant font-semibold' : 'text-text-gray hover:bg-rose-soft/50 hover:text-text-dark'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={n.icon} />
                </svg>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-rose-soft/30">
            <Link href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-gray hover:bg-rose-soft/50 hover:text-text-dark transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver landing
            </Link>
            <button onClick={() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); router.push('/admin/login'); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all mt-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-rose-soft/30 safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-0.5">
          {NAV.map(n => {
            const isActive = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] transition-all min-w-0 ${isActive ? 'bg-rose-soft text-rose-elegant font-semibold' : 'text-text-gray hover:text-rose-elegant'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 1.5} d={n.icon} />
                </svg>
                {n.label}
              </Link>
            );
          })}
          <button onClick={() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); router.push('/admin/login'); }}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] text-text-gray hover:text-red-500 transition-all min-w-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </nav>
    </div>
  );
}
