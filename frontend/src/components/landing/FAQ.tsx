'use client';

import { useState } from 'react';

const faqs = [
  {
    question: '¿Cómo recibo el archivo?',
    answer: 'Después de completar tu pago en Culqi, recibirás un correo electrónico con un link de descarga. El archivo digital se enviará al email que registres durante el proceso de compra.',
  },
  {
    question: '¿Puedo usarlo desde Excel?',
    answer: 'Sí. La herramienta está diseñada para ser utilizada en Microsoft Excel o Google Sheets. Solo necesitas tener instalado Excel o una cuenta de Google para abrir y usar el archivo.',
  },
  {
    question: '¿Funciona para cualquier catálogo?',
    answer: 'Sí. La herramienta es flexible y se adapta a cualquier tipo de catálogo: ropa, cosméticos, accesorios, productos de limpieza, alimentos, y más. Puedes personalizar los nombres de productos y categorías.',
  },
  {
    question: '¿Tiene actualizaciones?',
    answer: 'El archivo incluye la versión actual. En futuras fases de la plataforma, ofreceremos actualizaciones y nuevas funcionalidades que podrás adquirir con descuento por ser cliente.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-rose-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-rose-elegant uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-dark">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-rose-soft/30 overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-text-dark pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-rose-elegant flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-200 ${
                  openIndex === i ? 'max-h-40 pb-5 px-5' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-sm text-text-gray leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
