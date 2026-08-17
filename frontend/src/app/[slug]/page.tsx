'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { Creator, Product } from '@/lib/types';
import CheckoutModal from '@/components/ui/CheckoutModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const planIcons = ['📋', '📊', '🚀'];
const usdPrices = [6, 11, 17];

export default function CreatorLandingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [landingConfig, setLandingConfig] = useState<any>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [year, setYear] = useState('2026');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    fetch(`${API_URL}/creators/slug/${slug}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(data => {
        setCreator(data.creator);
        setProducts(data.products || []);
        if (data.landing?.config) {
          setLandingConfig(data.landing.config);
        }
      })
      .catch(() => setNotFound(true));

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => setCountry(data.country_code))
      .catch(() => setCountry('PE'))
      .finally(() => setLoadingLocation(false));
  }, [slug]);

  const isPeru = country === 'PE';
  const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order);
  const currency = isPeru ? 'PEN' : 'USD';
  const cfg = landingConfig || {};
  const theme = cfg.theme || { id: 'rose', primary: '#e8a0bf' };
  const heroText = cfg.hero || {};

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-light">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-dark mb-4">404</h1>
          <p className="text-text-gray mb-6">Creador no encontrado</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm">Ir al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-soft/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-rose-elegant">Econova Hub</Link>
          <div className="flex items-center gap-4 text-sm">
            {!loadingLocation && (
              <span className="text-text-gray flex items-center gap-1">
                <span className="text-base">{isPeru ? '🇵🇪' : '🌎'}</span>
                {isPeru ? 'Soles (PEN)' : 'Dólares (USD)'}
              </span>
            )}
            <a href="#planes" className="px-4 py-2 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all">
              Comprar
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-rose-soft/30 to-white overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-soft/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-soft text-rose-elegant mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-elegant animate-pulse" />
                {creator?.profession || 'Herramientas digitales'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-text-dark mb-6">
                {heroText.title || `Hola, soy ${creator?.name || 'creador'}`}
              </h1>
              <p className="text-lg text-text-gray max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                {heroText.subtitle || (creator?.bio || 'Recursos digitales para tu negocio')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {(heroText.buttons || []).length > 0 ? heroText.buttons.map((btn: any, i: number) => (
                  <a key={i} href={btn.url || '#planes'}
                    className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-base transition-all active:scale-[0.98] ${i === 0 ? 'bg-rose-elegant text-white shadow-lg shadow-rose-elegant/20' : 'bg-white text-text-dark border border-rose-soft/50 hover:bg-rose-soft/20 shadow-sm'}`}>
                    {btn.text || (i === 0 ? 'Ver planes' : 'Más información')}
                  </a>
                )) : (
                  <a href="#planes" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-rose-elegant text-white font-semibold text-base hover:bg-rose-elegant/90 transition-all shadow-lg shadow-rose-elegant/20 active:scale-[0.98]">
                    Ver planes
                  </a>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {creator && (
                <div className="relative group animate-float-delayed sm:translate-x-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-soft/30 via-rose-elegant/10 to-rose-soft/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-md p-5 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-elegant to-rose-elegant/80 flex items-center justify-center shadow-lg shadow-rose-elegant/20 mb-3 overflow-hidden">
                      {creator.photo_url ? (
                        <img src={creator.photo_url.startsWith('http') ? creator.photo_url : `${API_URL.replace('/api', '')}${creator.photo_url}`} alt={creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-white">{creator.name.charAt(0)}</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-text-dark">{creator.name}</p>
                    <p className="text-xs text-rose-elegant font-medium">{creator.profession}</p>
                  </div>
                </div>
              )}
              {sorted.length > 0 && (
                <div className="relative group animate-float sm:-translate-x-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-elegant/20 via-rose-soft/40 to-rose-elegant/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-5 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center overflow-hidden">
                      {sorted[0].image_url ? (
                        <img src={`${API_URL.replace('/api', '')}${sorted[0].image_url}`} alt={sorted[0].name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <span className="text-4xl">📊</span>
                      )}
                    </div>
                    <p className="text-text-dark font-bold text-base">{sorted[0].name}</p>
                    <p className="text-text-gray text-xs">{sorted[0].tagline} {year}</p>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-rose-soft/60 text-[10px] font-medium text-rose-elegant">.xlsx</span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[10px] font-medium text-blue-600">PDF</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMAS */}
      {cfg.sections?.problems !== false && cfg.problems?.title && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {cfg.problems?.problem && (
                <div className="bg-white rounded-2xl border border-rose-soft/50 p-6 sm:p-8 shadow-sm">
                  <span className="text-xs font-bold text-rose-elegant uppercase tracking-wider">El problema</span>
                  <p className="mt-3 text-sm text-text-gray leading-relaxed">{cfg.problems.problem}</p>
                </div>
              )}
              {cfg.problems?.solution && (
                <div className="bg-white rounded-2xl border border-rose-soft/50 p-6 sm:p-8 shadow-sm">
                  <span className="text-xs font-bold text-rose-elegant uppercase tracking-wider">La solución</span>
                  <p className="mt-3 text-sm text-text-gray leading-relaxed">{cfg.problems.solution}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PLANES */}
      {cfg.sections?.plans !== false && sorted.length > 0 && (
        <section id="planes" className="py-20 bg-gradient-to-b from-rose-soft/10 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-rose-elegant uppercase tracking-wider">Planes</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-dark">Elige tu plan</h2>
              <p className="mt-4 text-lg text-text-gray max-w-2xl mx-auto">
                {isPeru ? 'Paga en soles con Culqi o en dólares con PayPal' : 'Precios en dólares americanos'}
              </p>
            </div>
            <div className={`grid gap-6 mx-auto items-start ${
              sorted.length === 1 ? 'grid-cols-1 max-w-sm' :
              sorted.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl'
            }`}>
              {sorted.map((product, i) => {
                const isPopular = product.badge === 'El mas vendido';
                const priceLabel = isPeru ? `S/ ${product.price}` : `$${usdPrices[i]}`;
                return (
                  <div key={product.id} className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${isPopular ? 'bg-white border-2 border-rose-elegant shadow-xl shadow-rose-elegant/15 scale-[1.02] lg:scale-105 z-10' : 'bg-white border border-rose-soft/50 shadow-md hover:shadow-lg hover:border-rose-elegant/30'}`}>
                    {product.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-rose-elegant text-white text-xs font-semibold whitespace-nowrap">{product.badge}</span>
                    )}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${isPopular ? 'bg-rose-elegant text-white' : 'bg-rose-soft'}`}>{planIcons[i % planIcons.length]}</div>
                      <h3 className="text-xl font-bold text-text-dark mb-2">{product.name}</h3>
                      <p className="text-sm text-text-gray leading-relaxed">{product.tagline}</p>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-text-gray">{isPeru ? 'S/' : '$'}</span>
                        <span className="text-4xl font-bold text-text-dark">{isPeru ? product.price : usdPrices[i]}</span>
                        <span className="text-sm text-text-gray ml-1">pago único</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <ul className="space-y-3">
                        {product.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm">
                            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-rose-elegant' : 'text-rose-elegant/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-text-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={() => setCheckoutProduct({ ...product, price: (isPeru ? product.price : usdPrices[i]) as number })}
                      className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-center text-sm transition-all active:scale-[0.98] ${isPopular ? 'bg-rose-elegant text-white hover:bg-rose-elegant/90 shadow-lg shadow-rose-elegant/25' : 'bg-text-dark text-white hover:bg-text-dark/90'}`}>
                      Comprar ahora · {priceLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      {cfg.sections?.how !== false && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-dark">{cfg.how?.subtitle || 'Obtén tu plantilla en 3 pasos'}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: '1', title: 'Elige tu plan', desc: 'Selecciona el nivel que mejor se adapte a tu negocio' },
                { step: '2', title: 'Paga online', desc: 'Con PayPal (USD) o Culqi (PEN) de forma segura' },
                { step: '3', title: 'Descarga al instante', desc: 'Recibe el link de descarga en tu correo y en Mis Compras' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-elegant flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-rose-elegant/20">{item.step}</div>
                  <h3 className="font-bold text-text-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-text-gray">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      {cfg.sections?.cta !== false && (
        <section className="py-20 bg-gradient-to-br from-rose-elegant to-rose-elegant/90">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{cfg.cta?.title || 'Empieza a organizar tu negocio'}</h2>
            <p className="text-white/80 text-lg mb-8">{cfg.cta?.subtitle || 'Descarga tu plantilla al instante.'}</p>
            <a href="#planes" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-rose-elegant font-bold text-base hover:bg-white/90 transition-all shadow-xl active:scale-[0.98]">
              {cfg.cta?.button || 'Ver planes disponibles'}
            </a>
          </div>
        </section>
      )}

      <footer className="py-10 bg-text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm">© {year} {creator?.name || 'Econova Hub'} · Creado con Econova Hub</p>
          <Link href="/" className="text-white/40 text-xs hover:text-white/60 transition-colors">Econova Hub</Link>
        </div>
      </footer>

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          currency={currency}
          culqiLink={checkoutProduct.payment_url}
          paypalLink={checkoutProduct.paypal_url || ''}
          usdPrice={usdPrices[sorted.findIndex(p => p.id === checkoutProduct.id)] || usdPrices[0]}
          isPeru={isPeru}
          onClose={() => setCheckoutProduct(null)}
          onSuccess={(token) => router.push(`/descargar/${token}`)}
        />
      )}
    </>
  );
}