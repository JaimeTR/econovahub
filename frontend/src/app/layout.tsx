import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/components/ui/NotificationProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Econova Hub - Gestión de Ventas por Catálogo',
  description:
    'Organiza tus ventas por catálogo y conoce realmente cuánto ganas. Herramienta digital para emprendedores y negocios pequeños.',
  keywords: ['ventas por catálogo', 'gestión de ventas', 'herramienta digital', 'control de clientes', 'finanzas'],
  openGraph: {
    title: 'Econova Hub - Gestión de Ventas por Catálogo',
    description: 'Organiza tus ventas por catálogo y conoce realmente cuánto ganas.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
