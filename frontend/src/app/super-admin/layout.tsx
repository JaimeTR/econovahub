'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/super-admin/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { href: '/super-admin/ordenes', label: 'Ordenes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { href: '/super-admin/creadores', label: 'Creadores', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/super-admin/clientes', label: 'Clientes', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === '/super-admin/login') { setAuthed(true); return; }
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (!token || !user) { router.push('/super-admin/login'); return; }
    const role = JSON.parse(user).role;
    if (role !== 'super_admin') { router.push('/admin/dashboard'); return; }
    setAuthed(true);
  }, [pathname, router]);

  if (!authed) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (pathname === '/super-admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-56 bg-white border-r border-sky-200/50 flex-col flex-shrink-0">
          <div className="h-14 flex items-center gap-2 px-5 border-b border-sky-200/30">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-text-dark text-sm">Super Admin</span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${pathname === n.href ? 'bg-sky-100 text-sky-700 font-semibold' : 'text-text-gray hover:bg-sky-50 hover:text-text-dark'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={n.icon} />
                </svg>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-sky-200/30">
            <Link href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-gray hover:bg-sky-50 hover:text-text-dark transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ir al inicio
            </Link>
            <button onClick={() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); router.push('/super-admin/login'); }}
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-sky-200/50 flex items-center justify-around px-2 py-1 safe-area-bottom">
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] transition-all min-w-0 ${pathname === n.href ? 'text-sky-700 font-semibold' : 'text-text-gray'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={n.icon} />
            </svg>
            {n.label}
          </Link>
        ))}
        <Link href="/"
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] text-text-gray transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Inicio
        </Link>
      </nav>
    </div>
  );
}
