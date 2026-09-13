import { Inter, Merriweather, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PwaManager from '@/components/pwa/PwaManager';

/* ── Fontes otimizadas via next/font ─────────────────────────────
   As variáveis CSS são injetadas no elemento <html> e referenciadas
   no globals.css para títulos editoriais e corpo de texto.
─────────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-loaded',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-editorial-loaded',
  display: 'swap',
  weight: ['300', '400', '700', '900'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-loaded',
  display: 'swap',
  weight: ['400', '600', '700'],
});


export const metadata = {
  title: {
    default: 'Educa Brasiléia — Portal de Notícias e Educação',
    template: '%s | Educa Brasiléia',
  },
  description:
    'Portal oficial Educa Brasiléia – Secretaria de Educação do Estado do Acre. Acompanhe notícias, editais, calendário letivo e eventos das escolas da rede estadual.',
  keywords: ['educação', 'Acre', 'Brasiléia', 'Núcleo de Educação', 'SEE-AC', 'escola pública'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Educa SEE',
  },
  openGraph: {
    title: 'Educa Brasiléia',
    description:
      'Notícias, editais e informações oficiais do Educa Brasiléia.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#002045',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * RootLayout — Layout raiz do Portal SEE.
 * Envolve todas as páginas com Header, Footer e fontes globais.
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${merriweather.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols — ícones de interface */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <PwaManager />
        <Header />

        {/* Conteúdo principal — ocupa o espaço restante */}
        <main className="grow" id="conteudo-principal">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
