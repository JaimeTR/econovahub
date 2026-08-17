'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#planes', label: 'Planes' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-soft/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-elegant flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-text-dark text-lg">Econova Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-gray hover:text-rose-elegant transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/admin/login"
              className="text-text-gray hover:text-rose-elegant transition-colors text-sm"
            >
              Admin
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-gray hover:text-text-dark"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-rose-soft/30">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-gray hover:text-rose-elegant transition-colors text-sm font-medium py-1"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="text-text-gray hover:text-rose-elegant transition-colors text-sm pt-1 border-t border-rose-soft/30"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
