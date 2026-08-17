import type { Product } from '@/lib/types';

interface PricingSectionProps {
  products: Product[];
}

const planIcons = [
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
];

export default function PricingSection({ products }: PricingSectionProps) {
  const sortedProducts = [...products].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="planes" className="py-20 bg-rose-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-rose-elegant uppercase tracking-wider">
            Planes
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-dark">
            Elige el plan perfecto para tu negocio
          </h2>
          <p className="mt-4 text-lg text-text-gray max-w-2xl mx-auto">
            Invierte en el control de tu negocio desde solo S/ 15.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {sortedProducts.map((product, i) => {
            const isPopular = i === 1;

            return (
              <div
                key={product.id}
                className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${
                  isPopular
                    ? 'bg-white border-2 border-rose-elegant shadow-xl shadow-rose-elegant/15 scale-[1.02] lg:scale-105 z-10'
                    : 'bg-white border border-rose-soft/50 shadow-md hover:shadow-lg hover:border-rose-elegant/30'
                }`}
              >
                {product.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-rose-elegant text-white text-xs font-semibold whitespace-nowrap">
                    {product.badge}
                  </span>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isPopular ? 'bg-rose-elegant text-white' : 'bg-rose-soft text-rose-elegant'
                  }`}>
                    {planIcons[i] || planIcons[0]}
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">{product.name}</h3>
                  <p className="text-sm text-text-gray leading-relaxed">{product.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-text-gray">S/</span>
                    <span className="text-4xl font-bold text-text-dark">{product.price}</span>
                  </div>
                  <p className="text-xs text-text-gray mt-1">Pago único</p>
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

                <a
                  href={product.payment_url || '#'}
                  target={product.payment_url ? '_blank' : undefined}
                  rel={product.payment_url ? 'noopener noreferrer' : undefined}
                  className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-center text-sm transition-all active:scale-[0.98] ${
                    isPopular
                      ? 'bg-rose-elegant text-white hover:bg-rose-elegant/90 hover:shadow-lg hover:shadow-rose-elegant/25'
                      : 'bg-text-dark text-white hover:bg-text-dark/90'
                  }`}
                >
                  Comprar ahora
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
