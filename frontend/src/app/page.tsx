'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed'); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function Blob({ className, color, style }: { className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-30 ${color || 'bg-rose-elegant/20'} ${className || ''}`} style={style} />
  );
}

export default function HomePage() {
  const [year, setYear] = useState('2026');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const benefitsRef = useReveal(0.1);
  const creatorsRef = useReveal(0.1);
  const creatorsStepsRef = useReveal(0.1);
  const clientsRef = useReveal(0.1);
  const clientsStepsRef = useReveal(0.1);

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    setIsLoggedIn(!!token);
    if (token && user) {
      setIsSuperAdmin(JSON.parse(user).role === 'super_admin');
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'CREADORES', href: '#para-creadores' },
    { label: 'CLIENTES', href: '#para-clientes' },
  ];

  return (
    <div className="relative">
      {/* Full page gradient background */}
      <div className="fixed inset-0 animate-gradient-shift bg-gradient-to-br from-rose-soft/40 via-white via-30% to-blue-100/40 -z-10" />

      {/* NAVBAR */}
      <nav className={`fixed z-40 transition-all duration-300 ${scrolled ? 'top-3 left-4 right-4 max-w-5xl mx-auto' : 'top-3 left-4 right-4 max-w-7xl mx-auto'}`}>
        <div className={`transition-all duration-300 flex items-center justify-between ${scrolled ? 'bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg shadow-rose-elegant/5 px-4 sm:px-6 h-14' : 'bg-blue-50/60 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg shadow-rose-elegant/5 px-4 sm:px-6 lg:px-8 h-16'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 bg-clip-text text-transparent" style={{ fontFamily: "'ONE DAY', sans-serif" }}>
              EconovaHUB
            </span>
            <span className="hidden sm:inline text-xs text-text-gray/60 font-medium tracking-wide border-l border-rose-soft/30 pl-3 ml-1" style={{ fontFamily: "'ONE DAY', sans-serif" }}>
              By Ambar Castro
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className="px-4 py-2 rounded-xl text-sm text-text-dark hover:bg-white/40 transition-all uppercase tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                {link.label}
              </a>
            ))}
            {isLoggedIn ? (
              <Link href={isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard'}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-elegant/20 uppercase tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link href="/admin/login"
                  className="px-4 py-2 rounded-xl text-sm text-text-dark font-medium hover:bg-white/40 transition-all">
                  iniciar sesión
                </Link>
                <Link href="/admin/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-rose-elegant/20">
                  crear cuenta
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 text-text-dark">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 mx-4 bg-white/50 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-xl overflow-hidden">
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm text-text-dark hover:bg-white/40 transition-all uppercase tracking-wider"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                  {link.label}
                </a>
              ))}
              {isLoggedIn ? (
                <Link href={isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard'} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white shadow-lg shadow-rose-elegant/20 uppercase tracking-wider"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                  DASHBOARD
                </Link>
              ) : (
                <>
                  <Link href="/admin/login" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm text-text-dark font-medium hover:bg-white/40 transition-all">
                    iniciar sesión
                  </Link>
                  <Link href="/admin/register" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white shadow-lg shadow-rose-elegant/20">
                    crear cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-rose-soft/20" />
        <Blob className="top-20 left-10 w-[400px] h-[400px] bg-blue-400/15 animate-float-slow" />
        <Blob className="bottom-20 right-10 w-[350px] h-[350px] bg-rose-elegant/10 animate-float-slow" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid lg:grid-cols-[60fr_40fr] gap-12 items-center">

            {/* LEFT: Text content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-soft/80 backdrop-blur-md border border-rose-soft text-sm font-semibold text-rose-elegant mb-8 shadow-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-elegant animate-pulse" />
                PLATAFORMA PARA CREADORES DIGITALES
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] mb-8" style={{ fontFamily: "'ONE DAY', sans-serif" }}>
                <span className="text-text-dark">La forma mas facil de </span>
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent">vender y compartir</span>
                <span className="text-text-dark"> tus recursos digitales</span>
              </h1>
              <p className="text-lg text-text-gray max-w-xl mb-10 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                Crea una landing page personalizada, sube tus plantillas, guias o herramientas digitales,
                y compartelas con tu comunidad. Sin conocimientos tecnicos, en minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/admin/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white font-semibold text-base hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-rose-elegant/20 active:scale-[0.98] animate-btn-pulse animate-btn-gradient"
                  style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  soy creador
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <a href="#para-clientes"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 text-text-dark font-semibold text-base hover:bg-white/80 transition-all shadow-sm"
                  style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  soy cliente
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </div>

            {/* RIGHT: SVG + Floating glassmorphism 3D elements */}
            <div className="relative hidden lg:flex items-center justify-center" style={{ perspective: '1000px' }}>
              {/* Main SVG image */}
              <div className="relative w-full max-w-lg animate-float-slow" style={{ animationDuration: '5s' }}>
                <img src="/undraw_mobile-app_qxev.svg" alt="Plataforma para creadores" className="w-full h-auto" fetchPriority="high" />
              </div>

              {/* Floating glassmorphism 3D tags */}
              <div className="absolute top-5 -right-4 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-500/5 animate-float"
                style={{ transform: 'rotateY(-5deg) rotateX(3deg)', animationDelay: '1s', animationDuration: '4s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-semibold text-text-dark" style={{ fontFamily: 'var(--font-poppins)' }}>Sin comisiones</span>
                </div>
              </div>

              <div className="absolute bottom-10 -left-6 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-500/5 animate-float"
                style={{ transform: 'rotateY(5deg) rotateX(-2deg)', animationDelay: '2s', animationDuration: '5s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-xs font-semibold text-text-dark" style={{ fontFamily: 'var(--font-poppins)' }}>Landing en minutos</span>
                </div>
              </div>

              <div className="absolute top-[38%] left-1/2 -translate-x-1/2 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-500/5 animate-float"
                style={{ transform: 'rotateY(-8deg) rotateX(4deg)', animationDelay: '3s', animationDuration: '4.5s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span className="text-xs font-semibold text-text-dark" style={{ fontFamily: 'var(--font-poppins)' }}>Pago directo</span>
                </div>
              </div>

              <div className="absolute bottom-1/3 -right-4 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-500/5 animate-float"
                style={{ transform: 'rotateY(-3deg) rotateX(2deg)', animationDelay: '4s', animationDuration: '5.5s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-semibold text-text-dark" style={{ fontFamily: 'var(--font-poppins)' }}>Plataforma gratis</span>
                </div>
              </div>

              <div className="absolute top-1/4 -left-8 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-500/5 animate-float"
                style={{ transform: 'rotateY(4deg) rotateX(-3deg)', animationDelay: '0.5s', animationDuration: '3.8s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-elegant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span className="text-xs font-semibold text-text-dark" style={{ fontFamily: 'var(--font-poppins)' }}>Comparte</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-[10px] text-text-gray/40 uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Despliega</span>
          <svg className="w-4 h-4 text-text-gray/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* BENEFICIOS GENERALES */}
      <section ref={benefitsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 via-rose-soft/30 to-blue-50/60" />
        <Blob className="top-0 right-0 w-[500px] h-[500px] bg-rose-elegant/5 animate-float-slow" />
        <Blob className="bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-rose-elegant uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Todo en un solo lugar</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-text-dark" style={{ fontFamily: "'ONE DAY', sans-serif" }}>¿Por que Econova Hub?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#iconGrad)" />
                    <path d="M2 17l10 5 10-5" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12l10 5 10-5" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" fill="url(#iconGrad)" />
                  </svg>
                ),
                title: 'CREA EN MINUTOS',
                desc: 'Regístrate y tu landing page está lista. Sin programar, sin complicaciones.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                    <circle cx="12" cy="12" r="10" stroke="url(#iconGrad)" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" fill="url(#iconGrad)" />
                    <path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: 'LANDING PERSONALIZADA',
                desc: 'Elige colores, textos y productos. Tu página, tu estilo.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'TU ENLACE UNICO',
                desc: 'Comparte un solo link con toda tu comunidad. Ej: econovahub.com/tu-nombre',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                    <rect x="1" y="4" width="22" height="16" rx="2" stroke="url(#iconGrad)" strokeWidth="2" />
                    <line x1="1" y1="10" x2="23" y2="10" stroke="url(#iconGrad)" strokeWidth="2" />
                    <circle cx="6" cy="16" r="1" fill="url(#iconGrad)" />
                    <circle cx="10" cy="16" r="1" fill="url(#iconGrad)" />
                  </svg>
                ),
                title: 'PAGOS INTEGRADOS',
                desc: 'Culqi para Perú, PayPal para el mundo. Tú eliges cómo cobrar.',
              },
            ].map((item, i) => (
              <div key={item.title}
                className="text-center p-7 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/30 shadow-xl shadow-rose-elegant/10 hover:shadow-2xl hover:shadow-rose-elegant/20 hover:-translate-y-2 transition-all duration-300 group"
                style={{ transform: 'perspective(800px) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-elegant/15 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:animate-icon-float">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-text-dark mb-1.5 tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h3>
                <p className="text-xs text-text-gray/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SVG gradient definitions */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      {/* SECCION PARA CREADORES */}
      <section id="para-creadores" ref={creatorsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-rose-light/30" />
        <Blob className="top-20 left-10 w-[500px] h-[500px] bg-rose-elegant/8 animate-float-slow" />
        <Blob className="bottom-20 right-10 w-[400px] h-[400px] bg-cyan-400/8 animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-sm font-semibold text-rose-elegant uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Para creadores</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-text-dark mb-6" style={{ fontFamily: "'ONE DAY', sans-serif" }}>
                Tu propia tienda digital para compartir con tu comunidad
              </h2>
              <p className="text-text-gray/80 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                Si creas contenido, plantillas, guias o herramientas digitales, Econova Hub te permite
                tener tu propia pagina web para vender o compartir tus recursos con tu comunidad.
              </p>

              {/* SVG gradient definitions */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <linearGradient id="creatorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="14,2 14,8 20,8" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="16" y1="13" x2="8" y2="13" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="16" y1="17" x2="8" y2="17" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'LANDING PAGE AUTOMATICA',
                    desc: 'Al registrarte obtienes una landing page personalizada con tu marca. Elige colores, textos, qué productos mostrar y en qué orden.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="22.08" x2="12" y2="12" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'SUBE TUS PRODUCTOS',
                    desc: 'Agrega archivos Excel, PDF, ZIP, guías, manuales. Todo lo que quieras vender o regalar a tu comunidad.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'COMPARTE TU ENLACE',
                    desc: 'Un solo link para compartir en Instagram, TikTok, YouTube o WhatsApp. Ej: econovahub.com/tu-marca',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <line x1="12" y1="1" x2="12" y2="23" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'COBRA COMO QUIERAS',
                    desc: 'Configura Culqi para pagos en soles (Perú) y PayPal para dólares (internacional). Sin comisiones ocultas.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <line x1="18" y1="20" x2="18" y2="10" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="20" x2="12" y2="4" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="6" y1="20" x2="6" y2="14" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'CONTROLA TUS VENTAS',
                    desc: 'Dashboard completo con historial de órdenes, ingresos y clientes. Sabrás exactamente cuánto vendes.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="22,6 12,13 2,6" stroke="url(#creatorGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'DESCARGAS AUTOMATIZADAS',
                    desc: 'Cuando confirmes un pago, el cliente recibe automáticamente un correo con su link de descarga.',
                  },
                ].map((item) => (
                  <div key={item.title}
                    className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-xl border border-white/30 shadow-xl shadow-rose-elegant/10 hover:shadow-2xl hover:shadow-rose-elegant/20 hover:-translate-y-1.5 transition-all duration-300 group"
                    style={{ transform: 'perspective(800px) rotateX(1deg)', transformStyle: 'preserve-3d' }}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-elegant/15 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {item.icon}
                    </div>
                    <h4 className="text-xs font-semibold text-text-dark tracking-wider mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h4>
                    <p className="text-[11px] text-text-gray/70 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:flex flex-col items-center gap-5">
              <img src="/undraw-website-visitors.svg" alt="Vista previa de landing" loading="lazy"
                className="w-full max-w-md h-auto drop-shadow-2xl animate-tilt-float" />

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/register"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white font-semibold text-base hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-rose-elegant/20 active:scale-[0.98] animate-btn-pulse animate-btn-gradient"
                  style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  crear mi cuenta
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <a href="#como-funciona-creador"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 text-text-dark font-semibold text-base hover:bg-white/80 transition-all shadow-sm"
                  style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  ver como funciona
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA PARA CREADORES */}
      <section id="como-funciona-creador" ref={creatorsStepsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 via-rose-soft/30 to-blue-50/60" />
        <Blob className="top-0 left-1/3 w-[600px] h-[600px] bg-rose-elegant/5 animate-float-slow" />
        <Blob className="bottom-0 right-1/4 w-80 h-80 bg-cyan-400/10 animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-rose-elegant uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Para creadores</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-text-dark" style={{ fontFamily: "'ONE DAY', sans-serif" }}>Como funciona</h2>
            <p className="text-text-gray/70 mt-3 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>En solo 4 pasos tendras tu pagina web lista para compartir</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'REGISTRATE', desc: 'Crea tu cuenta de creador con email o Google. Solo necesitas nombre, correo y contraseña.',
                icon: <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="url(#iconGrad)" strokeWidth="2" /></svg> },
              { step: '2', title: 'CONFIGURA TU LANDING', desc: 'Elige colores, sube tu foto, escribe tu bio y selecciona los productos que quieres mostrar.',
                icon: <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M12 20h9" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
              { step: '3', title: 'SUBE TUS PRODUCTOS', desc: 'Agrega archivos digitales (Excel, PDF, ZIP) con sus precios y links de pago Culqi o PayPal.',
                icon: <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><polyline points="17 8 12 3 7 8" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="3" x2="12" y2="15" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" /></svg> },
              { step: '4', title: 'COMPARTE TU ENLACE', desc: 'Publica tu landing y comparte el link en redes sociales, WhatsApp o email.',
                icon: <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
            ].map((item) => (
              <div key={item.step}
                className="relative text-center p-7 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/30 shadow-xl shadow-rose-elegant/10 hover:shadow-2xl hover:shadow-rose-elegant/20 hover:-translate-y-2 transition-all duration-300 group"
                style={{ transform: 'perspective(800px) rotateX(1deg)', transformStyle: 'preserve-3d' }}>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-br from-rose-elegant via-blue-500 to-cyan-500 text-white text-xs font-bold shadow-sm">{item.step}</span>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-rose-elegant/20 via-blue-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-text-dark mb-2 tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h3>
                <p className="text-xs text-text-gray/80 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCION PARA CLIENTES */}
      <section id="para-clientes" ref={clientsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-rose-light/30" />
        <Blob className="top-20 right-20 w-[450px] h-[450px] bg-blue-400/8 animate-float-slow" />
        <Blob className="bottom-20 left-20 w-[350px] h-[350px] bg-rose-elegant/8 animate-float-slow" style={{ animationDelay: '2.5s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div className="relative hidden lg:flex flex-col items-center gap-6 order-last">
              <img src="/undraw-cloud-files.svg" alt="Descarga de archivos" loading="lazy"
                className="w-full max-w-md h-auto drop-shadow-2xl animate-tilt-float" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/mis-compras"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white font-semibold text-base hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-rose-elegant/20 active:scale-[0.98] animate-btn-pulse animate-btn-gradient"
                  style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  mis compras
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </Link>
                <a href="#faq"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 text-text-dark font-semibold text-base hover:bg-white/80 transition-all shadow-sm"
                  style={{ fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                  ayuda
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-rose-elegant uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Para clientes</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-text-dark mb-6" style={{ fontFamily: "'ONE DAY', sans-serif" }}>
                Compra y descarga de forma segura en Econova Hub
              </h2>
              <p className="text-text-gray/80 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                Encontraste un recurso que te gusta? Comprarlo es facil, rapido y seguro.
                Recibiras tus archivos al instante cuando el creador confirme tu pago.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <circle cx="9" cy="21" r="1" fill="url(#clientGrad)" />
                        <circle cx="20" cy="21" r="1" fill="url(#clientGrad)" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="url(#clientGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'ELIGE TU PLAN',
                    desc: 'Cada creador muestra sus productos con precios en soles (PEN) o dólares (USD). Selecciona el que más te guste.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <rect x="1" y="4" width="22" height="16" rx="2" stroke="url(#clientGrad)" strokeWidth="1.5" />
                        <line x1="1" y1="10" x2="23" y2="10" stroke="url(#clientGrad)" strokeWidth="1.5" />
                        <circle cx="6" cy="16" r="1" fill="url(#clientGrad)" />
                        <circle cx="10" cy="16" r="1" fill="url(#clientGrad)" />
                      </svg>
                    ),
                    title: 'PAGA CON TU METODO',
                    desc: 'Si estás en Perú, pagas con Culqi (Yape, Visa, Mastercard). Si estás fuera, con PayPal en dólares.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#clientGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="22,6 12,13 2,6" stroke="url(#clientGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    title: 'RECIBE TU COMPRA',
                    desc: 'El creador confirma tu pago y automáticamente recibes un correo con tu link de descarga personalizado.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="url(#clientGrad)" strokeWidth="1.5" />
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="url(#clientGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="16" r="1" fill="url(#clientGrad)" />
                      </svg>
                    ),
                    title: 'DESCARGA SEGURA',
                    desc: 'Cada link de descarga tiene vigencia de 72 horas y un maximo de 5 descargas. Tiempo suficiente para guardar tus archivos.',
                  },
                ].map((item) => (
                  <div key={item.title}
                    className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-xl border border-white/30 shadow-xl shadow-rose-elegant/10 hover:shadow-2xl hover:shadow-rose-elegant/20 hover:-translate-y-1.5 transition-all duration-300 group"
                    style={{ transform: 'perspective(800px) rotateX(1deg)', transformStyle: 'preserve-3d' }}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-elegant/15 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {item.icon}
                    </div>
                    <h4 className="text-xs font-semibold text-text-dark tracking-wider mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h4>
                    <p className="text-[11px] text-text-gray/70 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SVG gradient definitions */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      {/* COMO FUNCIONA PARA CLIENTES */}
      <section ref={clientsStepsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 via-rose-soft/30 to-blue-50/60" />
        <Blob className="top-10 right-1/4 w-[500px] h-[500px] bg-cyan-400/8 animate-float-slow" />
        <Blob className="bottom-10 left-1/4 w-72 h-72 bg-rose-elegant/8 animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-rose-elegant uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Para clientes</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-text-dark" style={{ fontFamily: "'ONE DAY', sans-serif" }}>Proceso de compra y descarga</h2>
            <p className="text-text-gray/70 mt-3 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>Asi de facil es comprar y recibir tus recursos digitales</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                    <circle cx="12" cy="12" r="10" stroke="url(#stepsGrad)" strokeWidth="1.5" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="url(#stepsGrad)" strokeWidth="1.5" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="url(#stepsGrad)" strokeWidth="1.5" />
                  </svg>
                ),
                step: '1',
                title: 'VISITA LA LANDING',
                desc: 'Ingresa al link del creador y explora sus productos disponibles.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="url(#stepsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="8" y="2" width="8" height="4" rx="1" stroke="url(#stepsGrad)" strokeWidth="1.5" />
                    <line x1="9" y1="12" x2="15" y2="12" stroke="url(#stepsGrad)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="9" y1="16" x2="13" y2="16" stroke="url(#stepsGrad)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                step: '2',
                title: 'ELIGE Y COMPRA',
                desc: 'Selecciona el plan que necesitas. El precio se muestra en PEN o USD según tu país.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                    <rect x="1" y="4" width="22" height="16" rx="2" stroke="url(#stepsGrad)" strokeWidth="1.5" />
                    <line x1="1" y1="10" x2="23" y2="10" stroke="url(#stepsGrad)" strokeWidth="1.5" />
                    <circle cx="6" cy="16" r="1" fill="url(#stepsGrad)" />
                    <circle cx="10" cy="16" r="1" fill="url(#stepsGrad)" />
                  </svg>
                ),
                step: '3',
                title: 'PAGA',
                desc: 'Paga con Culqi (Perú) o PayPal (internacional). Se abre una ventana segura.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="url(#stepsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="7,10 12,15 17,10" stroke="url(#stepsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="15" x2="12" y2="3" stroke="url(#stepsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                step: '4',
                title: 'DESCARGA',
                desc: 'Recibirás un correo con tu link. Descarga tus archivos agrupados por categoría.',
              },
            ].map((item) => (
              <div key={item.step}
                className="relative text-center p-7 pt-10 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/30 shadow-xl shadow-rose-elegant/10 hover:shadow-2xl hover:shadow-rose-elegant/20 hover:-translate-y-2 transition-all duration-300 group"
                style={{ transform: 'perspective(800px) rotateX(1deg)', transformStyle: 'preserve-3d' }}>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-br from-rose-elegant via-blue-500 to-cyan-500 text-white text-xs font-bold shadow-sm">{item.step}</span>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-elegant/15 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-text-dark mb-1.5 tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h3>
                <p className="text-xs text-text-gray/80 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* SVG gradient definitions */}
          <svg className="absolute w-0 h-0">
            <defs>
              <linearGradient id="stepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

        </div>
      </section>

      {/* TESTIMONIOS / CONFIANZA */}
      {/* FAQ */}
      <section id="faq" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-rose-light/30" />
        <Blob className="top-0 left-1/4 w-80 h-80 bg-rose-elegant/8 animate-float-slow" />
        <Blob className="bottom-0 right-1/4 w-96 h-96 bg-cyan-400/8 animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark text-center mb-12" style={{ fontFamily: "'ONE DAY', sans-serif" }}>Preguntas frecuentes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-8 items-start">
            <div className="space-y-3">
            {[
              { q: '¿Cuánto cuesta usar Econova Hub?', a: 'La plataforma es gratuita para creadores. Solo pagas las comisiones de tu procesador de pago (Culqi o PayPal).' },
              { q: '¿Cómo recibo los pagos de mis clientes?', a: 'Configuras tus links de pago de Culqi (para Perú, en soles) y PayPal (para internacional, en dólares). Cuando un cliente paga, tú recibes el dinero directamente.' },
              { q: '¿Cómo descargo mis compras?', a: 'Cuando el creador confirme tu pago, recibirás un correo con un link de descarga. También puedes ingresar a "Mis compras" con tu email para ver todas tus órdenes.' },
              { q: '¿Por cuánto tiempo tengo acceso a la descarga?', a: 'El link de descarga está disponible por 72 horas y puedes descargar hasta 5 veces. Tiempo suficiente para guardar tus archivos.' },
              { q: '¿Puedo tener más de un creador en la plataforma?', a: 'Sí. Cada creador tiene su propia cuenta y su propia landing page. Puedes tener múltiples cuentas si necesitas separar tus marcas o proyectos.' },
              { q: '¿Qué métodos de pago están disponibles?', a: 'Para Perú puedes pagar con Culqi (tarjetas de débito, crédito y yape). Para el resto del mundo, PayPal acepta tarjetas internacionales y saldo PayPal. Ambos son procesadores seguros y no compartimos tus datos financieros.' },
            ].map((faq, idx) => (
              <details key={faq.q} open={idx === 0}
                className={`rounded-xl border overflow-hidden group shadow-sm hover:shadow-md transition-all ${idx === 0 ? 'bg-blue-50/60 border-blue-200' : 'bg-white/50 backdrop-blur-md border-white/30'}`}>
                <summary className={`px-6 py-4 text-sm font-medium cursor-pointer transition-colors list-none flex items-center justify-between ${idx === 0 ? 'text-rose-elegant' : 'text-text-dark hover:bg-white/30'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                  {faq.q}
                  <svg className="w-4 h-4 text-text-gray/50 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-4 text-xs text-text-gray/80 leading-relaxed border-t border-white/20 pt-3" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-6">
            <img src="/undraw_searching_no1g.svg" alt="Preguntas frecuentes" className="w-full max-w-xs h-auto opacity-85" loading="lazy" />
            <div className="w-full max-w-xs text-center">
              <h3 className="text-sm font-semibold text-text-dark mb-2" style={{ fontFamily: "'ONE DAY', sans-serif" }}>BUSCAR PERFIL DE CREADOR</h3>
              <p className="text-xs text-text-gray/60 mb-3" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>Ingresa el nombre del creador para visitar su página</p>
              <form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if (input && input.value.trim()) window.location.href = `/${input.value.trim()}`; }}
                className="flex gap-2">
                <input name="slug" placeholder="usuario del creador"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-rose-elegant placeholder:text-text-gray/40 transition-all" />
                <button type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-elegant via-blue-500 to-cyan-500 text-white text-sm hover:opacity-90 transition-all shadow-md"
                  style={{ fontFamily: 'var(--font-poppins)' }}>
                  Ir
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* CTA CREADORES */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-blue-950 via-text-dark to-text-dark">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <svg className="w-7 h-7 text-blue-300 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.38 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>Para creadores</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'ONE DAY', sans-serif" }}>Comienza hoy</h2>
          <p className="text-white/70 text-sm sm:text-base mb-5 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
            Crea tu landing page personalizada en minutos y empieza a compartir tus recursos con el mundo.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs mb-7" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 400 }}>
            <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            El primer mes incluye asesoría personalizada de uso y configuración
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/admin/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white text-rose-elegant text-sm font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl active:scale-[0.98] animate-btn-pulse"
              style={{ fontFamily: 'var(--font-poppins)' }}>
              crear mi cuenta
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link href="/admin/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm hover:bg-white/20 transition-all"
              style={{ fontFamily: 'var(--font-poppins)' }}>
              ya tengo cuenta
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-text-dark relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-base font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: "'ONE DAY', sans-serif" }}>EconovaHUB</span>
                <span className="text-[11px] text-white/30 font-medium border-l border-white/10 pl-3" style={{ fontFamily: 'var(--font-poppins)' }}>By Ambar Castro</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                Plataforma para creadores digitales: vende y comparte tus recursos con tu comunidad.
              </p>
            </div>

            {/* Links */}
            <div className="text-center md:text-left">
              <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>Enlaces</h4>
              <ul className="space-y-2 text-xs text-white/40" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                <li><a href="#para-creadores" className="hover:text-blue-400 transition-colors">Para creadores</a></li>
                <li><a href="#para-clientes" className="hover:text-blue-400 transition-colors">Para clientes</a></li>
                <li><a href="#faq" className="hover:text-blue-400 transition-colors">Preguntas frecuentes</a></li>
                <li><a href="/mis-compras" className="hover:text-blue-400 transition-colors">Mis compras</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="text-center md:text-left">
              <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>Contacto</h4>
              <ul className="space-y-2 text-xs text-white/40" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                <li>
                  <a href="tel:+51975646074" className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    975 646 074
                  </a>
                </li>
                <li>
                  <a href="mailto:contacto@devmarkpe.com" className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    contacto@devmarkpe.com
                  </a>
                </li>
                <li>
                  <a href="https://devmarkpe.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    Devmark Studio
                  </a>
                </li>
              </ul>
              <p className="text-[11px] text-white/30 mt-4" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                Desarrollado por <a href="https://devmarkpe.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Devmark Studio</a>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-5 border-t border-white/5 text-center">
            <p className="text-white/40 text-[11px]" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>© {year} Econova Hub — Plataforma para creadores digitales</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
