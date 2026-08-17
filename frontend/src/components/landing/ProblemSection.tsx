const problems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'No sabes cuánto vendiste',
    description: 'Pierdes la noción de tus ventas reales al final del mes.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Pierdes el control de clientes',
    description: 'No llevas registro de quién te compró y qué pidió.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'No sabes tu ganancia real',
    description: 'No distingues entre ingresos brutos y lo que realmente te queda.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: 'Mezclas dinero personal y negocio',
    description: 'Sin separar finanzas, pierdes claridad y tomas malas decisiones.',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-rose-elegant uppercase tracking-wider">
            ¿Te pasa esto?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-dark">
            Deja de perder ventas por falta de control
          </h2>
          <p className="mt-4 text-lg text-text-gray max-w-2xl mx-auto">
            Si te identificas con alguno de estos problemas, esta herramienta es para ti.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-rose-soft/50 bg-white hover:border-rose-elegant/30 hover:shadow-lg hover:shadow-rose-soft/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-soft/60 flex items-center justify-center text-rose-elegant mb-4 group-hover:bg-rose-elegant group-hover:text-white transition-colors">
                {problem.icon}
              </div>
              <h3 className="font-semibold text-text-dark mb-2">{problem.title}</h3>
              <p className="text-sm text-text-gray leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
