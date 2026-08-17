const steps = [
  {
    number: '1',
    title: 'Elige tu plan',
    description: 'Selecciona el plan que mejor se adapte a las necesidades de tu negocio y catálogo.',
  },
  {
    number: '2',
    title: 'Realiza el pago',
    description: 'Completa tu pago de forma segura a través de Culqi con cualquier tarjeta.',
  },
  {
    number: '3',
    title: 'Recibe el archivo digital',
    description: 'Recibirás tu herramienta digital directamente en tu correo electrónico.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-rose-elegant uppercase tracking-wider">
            ¿Cómo funciona?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-dark">
            Empieza en 3 pasos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-elegant text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-elegant/20">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{step.title}</h3>
              <p className="text-sm text-text-gray leading-relaxed">{step.description}</p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8">
                  <svg className="w-8 h-8 text-rose-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
