'use client';

import { useState, useRef } from 'react';

interface ProductData {
  id: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
}

interface CheckoutModalProps {
  product: ProductData;
  currency: string;
  culqiLink: string;
  paypalLink: string;
  usdPrice: number;
  isPeru: boolean;
  onClose: () => void;
  onSuccess: (downloadToken: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function CheckoutModal({ product, currency, culqiLink, paypalLink, usdPrice, isPeru, onClose, onSuccess }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'culqi'>(paypalLink ? 'paypal' : 'culqi');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'waiting'>('form');
  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<any>(null);

  const isValid = name.trim().length >= 3 && email.includes('@') && email.includes('.');
  const priceLabel = currency === 'PEN' ? `S/ ${product.price}` : `$${usdPrice}`;
  const paymentLink = paymentMethod === 'paypal' ? paypalLink : culqiLink;

  const abrirPago = async () => {
    if (!isValid) { setError('Completa tu nombre y un correo valido'); return; }
    setError('');

    try {
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, name, email, amount: currency === 'PEN' ? product.price : usdPrice }),
      });
    } catch {}

    const w = 520;
    const h = 720;
    const y = window.top!.outerHeight / 2 + window.top!.screenY - h / 2;
    const x = window.top!.outerWidth / 2 + window.top!.screenX - w / 2;

    popupRef.current = window.open(
      paymentLink,
      'pago',
      `toolbar=no,location=no,width=${w},height=${h},top=${y},left=${x}`
    );

    setStep('waiting');

    intervalRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(intervalRef.current);
        // Redirigir a pagina de gracias
        window.location.href = `/gracias?product=${encodeURIComponent(product.name)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
      }
    }, 500);
  };

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
  };

  const irAMisCompras = () => {
    cleanup();
    onClose();
    window.location.href = '/mis-compras';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { cleanup(); onClose(); }} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-rose-elegant to-rose-elegant/80 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-xs font-medium">Finalizar compra</p>
            <button onClick={() => { cleanup(); onClose(); }} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p className="text-white/80 text-sm mt-0.5">{product.tagline}</p>
        </div>

        <div className="px-6 py-5">
          {/* PASO 1: Formulario */}
          {step === 'form' && (
            <>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-medium text-text-dark mb-1.5">Nombre completo</label>
                  <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30 focus:border-rose-elegant bg-rose-soft/10 text-text-dark" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-dark mb-1.5">Correo electronico</label>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30 focus:border-rose-elegant bg-rose-soft/10 text-text-dark" />
                  <p className="text-[10px] text-text-gray mt-1">Con este correo accederas a tus compras y descargas</p>
                </div>
              </div>

              {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">{error}</div>}

              <div className="bg-rose-soft/20 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-gray">{product.name}</span>
                  <span className="text-text-dark font-medium">{priceLabel}</span>
                </div>
                <div className="border-t border-rose-soft/50 my-2" />
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-text-dark">Total</span>
                  <span className="text-rose-elegant text-lg">{priceLabel}</span>
                </div>
              </div>

              <p className="text-xs font-medium text-text-dark mb-3">Elige tu metodo de pago</p>
              <div className="flex gap-2 mb-4">
                {paypalLink && (
                  <button onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      paymentMethod === 'paypal' ? 'border-[#0070ba] bg-[#0070ba]/5 text-[#0070ba]' : 'border-rose-soft/50 text-text-gray'}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H8.625c-.524 0-.972.382-1.058.9l-1.12 7.106z"/>
                    </svg>
                    PayPal
                  </button>
                )}
                <button onClick={() => setPaymentMethod('culqi')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    paymentMethod === 'culqi' ? 'border-rose-elegant bg-rose-soft/30 text-rose-elegant' : 'border-rose-soft/50 text-text-gray'}`}>
                  <span className="text-lg">🇵🇪</span> Culqi
                </button>
              </div>

              <button onClick={abrirPago} disabled={!isValid}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-[0.98] ${
                  paymentMethod === 'paypal'
                    ? (isValid ? 'bg-[#0070ba] text-white hover:bg-[#005fa3]' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                    : (isValid ? 'bg-rose-elegant text-white hover:bg-rose-elegant/90' : 'bg-rose-elegant/50 text-white/80 cursor-not-allowed')
                }`}>
                {paymentMethod === 'paypal' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H8.625c-.524 0-.972.382-1.058.9l-1.12 7.106z"/>
                  </svg>
                ) : <span className="text-lg">🇵🇪</span>}
                {isValid
                  ? `Pagar con ${paymentMethod === 'paypal' ? 'PayPal' : 'Culqi'} · ${priceLabel}`
                  : 'Completa tus datos'}
              </button>
            </>
          )}

          {/* PASO 2: Ventana de pago abierta */}
          {step === 'waiting' && (
            <div className="text-center py-8">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${paymentMethod === 'paypal' ? 'bg-blue-50' : 'bg-rose-soft'} flex items-center justify-center`}>
                {paymentMethod === 'paypal' ? (
                  <svg className="w-8 h-8 text-[#0070ba] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H8.625c-.524 0-.972.382-1.058.9l-1.12 7.106z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-rose-elegant animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <p className="font-semibold text-text-dark mb-1">
                {paymentMethod === 'paypal' ? 'Completa tu pago en PayPal' : 'Completa tu pago en Culqi'}
              </p>
              <p className="text-xs text-text-gray mb-4">La ventana de pago ya esta abierta</p>
              <div className="flex items-center justify-center gap-2 text-[10px] text-text-gray mb-4">
                <div className={`w-2 h-2 rounded-full animate-ping ${paymentMethod === 'paypal' ? 'bg-[#0070ba]' : 'bg-rose-elegant'}`} />
                Esperando confirmacion...
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { cleanup(); window.location.href = `/gracias?product=${encodeURIComponent(product.name)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`; }}
                  className="text-xs text-text-gray underline hover:text-rose-elegant">
                  Ya pague, ir a confirmacion
                </button>
                <button onClick={() => { window.open(paymentLink, 'pago'); }}
                  className="text-xs text-text-gray hover:text-rose-elegant">
                  ¿No ves la ventana? Abrir de nuevo
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-text-gray">
            <svg className="w-3.5 h-3.5 text-rose-elegant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pago seguro encriptado · Tus datos estan protegidos
          </div>
        </div>
      </div>
    </div>
  );
}
