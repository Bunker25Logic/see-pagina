import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/* ── Fontes otimizadas via next/font ─────────────────────────────
   As variáveis CSS são injetadas no elemento <html> e referenciadas
   no globals.css via --font-inter-loaded e --font-playfair-loaded.
─────────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-loaded',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-loaded',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata = {
  title: {
    default: 'Portal SEE — Núcleo de Educação de Brasiléia',
    template: '%s | Núcleo de Educação - Brasiléia',
  },
  description:
    'Portal oficial do Núcleo de Educação de Brasiléia – Secretaria de Educação do Estado do Acre. Acompanhe notícias, editais, calendário letivo e eventos das escolas da rede estadual.',
  keywords: ['educação', 'Acre', 'Brasiléia', 'Núcleo de Educação', 'SEE-AC', 'escola pública'],
  openGraph: {
    title: 'Portal SEE — Núcleo de Educação de Brasiléia',
    description:
      'Notícias, editais e informações oficiais do Núcleo de Educação de Brasiléia.',
    locale: 'pt_BR',
    type: 'website',
  },
};

/**
 * RootLayout — Layout raiz do Portal SEE.
 * Envolve todas as páginas com Header, Footer e fontes globais.
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols — ícones de interface */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
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
