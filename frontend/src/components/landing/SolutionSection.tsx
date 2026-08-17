const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Más control',
    description: 'Registra cada venta, cada cliente y cada producto en un solo lugar.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Menos errores',
    description: 'Fórmulas automatizadas evitan confusiones y cálculos manuales.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: 'Mejor organización',
    description: 'Visualiza tu negocio con claridad. Reportes simples y efectivos.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    title: 'Decisiones con datos',
    description: 'Deja de adivinar. Toma decisiones basadas en información real de tu negocio.',
  },
];

export default function SolutionSection() {
  return (
    <section className="py-20 bg-rose-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-rose-elegant uppercase tracking-wider">
            La solución
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-dark">
            Econova Hub te ayuda a ordenar tu negocio
          </h2>
          <p className="mt-4 text-lg text-text-gray max-w-2xl mx-auto">
            Una herramienta diseñada por una economista para que manejes tus finanzas con profesionalismo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex gap-5 p-5 rounded-2xl bg-white border border-rose-soft/30">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-elegant/10 flex items-center justify-center text-rose-elegant">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-1">{benefit.title}</h3>
                <p className="text-sm text-text-gray leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
