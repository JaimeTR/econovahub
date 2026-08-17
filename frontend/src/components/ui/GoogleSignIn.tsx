'use client';
import { useEffect, useRef } from 'react';

interface GoogleSignInProps {
  onSuccess: (credential: string) => void;
  mode?: 'login' | 'register';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

export default function GoogleSignIn({ onSuccess, mode = 'login' }: GoogleSignInProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || initialized.current) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => onSuccess(response.credential),
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        shape: 'pill',
        theme: 'outline',
        text: mode === 'login' ? 'signin_with' : 'signup_with',
        size: 'large',
        logo_alignment: 'center',
        width: 280,
      });
      initialized.current = true;
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [onSuccess, mode]);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <div className="flex justify-center">
      <div ref={btnRef} />
    </div>
  );
}