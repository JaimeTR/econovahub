export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-rose-soft/40 to-white overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-soft/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-soft text-rose-elegant mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-elegant animate-pulse" />
              Nueva herramienta digital
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-text-dark mb-6">
              Organiza tus ventas por catálogo y conoce{' '}
              <span className="text-rose-elegant">realmente cuánto ganas</span>
            </h1>

            <p className="text-lg text-text-gray max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Una herramienta simple para controlar clientes, productos, ventas y ganancias desde un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#planes"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-rose-elegant text-white font-semibold text-base hover:bg-rose-elegant/90 transition-all hover:shadow-lg hover:shadow-rose-elegant/25 active:scale-[0.98]"
              >
                Comprar ahora
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-rose-soft text-text-dark font-semibold text-base hover:bg-rose-soft/30 transition-all"
              >
                Cómo funciona
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-elegant/20 to-rose-soft/40 rounded-2xl blur-xl" />
              <div className="relative bg-white rounded-2xl border border-rose-soft shadow-xl shadow-rose-soft/20 p-4 sm:p-6">
                <div className="bg-rose-soft/30 rounded-xl p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-rose-elegant flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-text-dark font-semibold text-lg mb-1">Gestión de Ventas</p>
                  <p className="text-text-gray text-sm">por Catálogo 2025</p>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-rose-elegant/20 rounded-full w-full" />
                    <div className="h-2 bg-rose-elegant/20 rounded-full w-3/4" />
                    <div className="h-2 bg-rose-elegant/20 rounded-full w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
