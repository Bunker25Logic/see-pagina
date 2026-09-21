import Link from 'next/link';
import NavLinks from './NavLinks';
import TopBar from './TopBar';
import EducaLogo from '@/components/ui/EducaLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getActiveMensagemDia } from '@/lib/mensagensDia';

/**
 * Header — Barra de navegação superior do Portal SEE.
 * Layout perfeitamente balanceado:
 * - Logo à esquerda
 * - Abas de navegação (Notícias, Escolas, Cronogramas) perfeitamente centralizadas
 * - Alternador de tema à direita com simetria equilibrada
 */
export default async function Header() {
  const mensagem = await getActiveMensagemDia();

  return (
    <header className="w-full bg-[#fdfdfd] dark:bg-[#0c1824] border-b border-[#e2e8f0] dark:border-[#1b3447] sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-colors">
      {/* ── Barra Superior Informativa Reorganizada ── */}
      <TopBar mensagem={mensagem} />

      {/* ── Barra Principal de Navegação Simétrica ── */}
      <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-2 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 sm:gap-4">

          {/* Lado Esquerdo no Desktop / Topo no Mobile (Logo Institucional) */}
          <div className="flex items-center justify-between lg:justify-start lg:w-1/4 min-w-0 shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-95 min-w-0"
              aria-label="Ir para a página inicial Educa Brasiléia"
            >
              <EducaLogo size={38} showText={true} variant="acre" />
            </Link>

            {/* Alternador de Tema no Mobile */}
            <div className="flex items-center lg:hidden shrink-0 ml-2">
              <ThemeToggle size={32} />
            </div>
          </div>

          {/* Centro Perfeito: Abas de Navegação (Notícias, Escolas, Cronogramas) */}
          <div className="w-full lg:flex-1 flex items-center justify-center min-w-0">
            <NavLinks />
          </div>

          {/* Lado Direito no Desktop: Alternador de Tema (Simetria de 1/4) */}
          <div className="hidden lg:flex items-center justify-end lg:w-1/4 shrink-0 text-slate-500">
            <ThemeToggle size={34} />
          </div>

        </div>
      </div>
    </header>
  );
}
