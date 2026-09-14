import Link from 'next/link';
import NavLinks from './NavLinks';
import TopBar from './TopBar';
import EducaLogo from '@/components/ui/EducaLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getActiveMensagemDia } from '@/lib/mensagensDia';

/**
 * Header — Barra de navegação superior do Portal SEE.
 * Totalmente otimizado para dispositivos móveis e desktop,
 * com TopBar informativa integrada, alternador manual de tema (Sol/Lua),
 * sem dependência de preferências do celular e visual refinado.
 */
export default async function Header() {
  const mensagem = await getActiveMensagemDia();

  return (
    <header className="w-full bg-[#fdfdfd] dark:bg-[#0c1824] border-b border-[#e2e8f0] dark:border-[#1b3447] sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-colors">
      {/* ── Barra Superior Informativa ── */}
      <TopBar mensagem={mensagem} />

      {/* ── Barra Principal de Navegação ── */}
      <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 sm:gap-4">

          {/* Linha Superior no Mobile / Lado Esquerdo no Desktop */}
          <div className="flex items-center justify-between min-w-0">
            <Link
              href="/"
              className="group flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-95 min-w-0"
              aria-label="Ir para a página inicial Educa Brasiléia"
            >
              <EducaLogo size={38} showText={true} variant="acre" />
            </Link>

            {/* Ação no Mobile: Alternador de Tema */}
            <div className="flex items-center lg:hidden shrink-0 ml-2">
              <ThemeToggle size={32} />
            </div>
          </div>

          {/* Navegação + Ações Desktop */}
          <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-8 min-w-0 w-full lg:w-auto">
            <div className="w-full lg:w-auto min-w-0 overflow-x-auto no-scrollbar">
              <NavLinks />
            </div>

            {/* Ação Desktop: Alternador de Tema */}
            <div className="hidden lg:flex items-center text-slate-500 shrink-0">
              <ThemeToggle size={34} />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
