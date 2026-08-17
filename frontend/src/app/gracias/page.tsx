'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function GraciasContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product') || 'tu producto';
  const name = searchParams.get('name') || '';

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-soft/20 to-white flex items-center justify-center px-4 py-12">
      <div className={`max-w-md w-full transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white rounded-3xl border border-rose-soft/50 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-rose-elegant to-rose-elegant/80 px-6 py-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {name ? `${name}, gracias por tu compra!` : 'Gracias por tu compra!'}
            </h1>
            <p className="text-white/80 text-sm">
              Has adquirido: <strong className="text-white">{product}</strong>
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <div className="bg-rose-soft/20 rounded-2xl p-6 mb-6">
              <h2 className="font-semibold text-text-dark mb-3">Que sigue?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-dark">Recibimos tu pedido</p>
                    <p className="text-xs text-text-gray">Te enviaremos un correo de confirmacion cuando verifiquemos el pago.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-dark">Confirmacion del pago</p>
                    <p className="text-xs text-text-gray">Cuando el pago se confirme, recibiras un correo con el link de descarga.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-dark">Descarga tu archivo</p>
                    <p className="text-xs text-text-gray">Accede al link, confirma tu correo y descarga el archivo con su manual.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/mis-compras"
                className="w-full py-3.5 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all shadow-md active:scale-[0.98]">
                Consultar mis compras
              </Link>
              <Link href="/ambar"
                className="w-full py-3 rounded-xl border border-rose-soft/50 text-text-gray text-sm hover:bg-rose-soft/20 transition-all">
                Volver a la tienda
              </Link>
            </div>

            <p className="text-[10px] text-text-gray mt-6">
              Revisa tu bandeja de entrada o spam. Recibiras un correo de confirmacion en breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-rose-soft/20 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
