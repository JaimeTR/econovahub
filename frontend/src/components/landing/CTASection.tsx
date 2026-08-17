export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-rose-elegant to-rose-elegant/80 rounded-3xl p-10 sm:p-14 text-white shadow-xl shadow-rose-elegant/20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Lista para tomar el control de tu negocio?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Deja de improvisar. Empieza a gestionar tus ventas por catálogo como una profesional.
          </p>
          <a
            href="#planes"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-rose-elegant font-semibold text-base hover:bg-white/95 transition-all active:scale-[0.98] shadow-md"
          >
            Ver planes
          </a>
        </div>
      </div>
    </section>
  );
}
