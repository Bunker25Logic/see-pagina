import Link from 'next/link';
import NavLinks from './NavLinks';
import TopBar from './TopBar';
import EducaLogo from '@/components/ui/EducaLogo';
import { getActiveMensagemDia } from '@/lib/mensagensDia';

/**
 * Header — Barra de navegação superior do Portal SEE.
 * Totalmente otimizado para dispositivos móveis e desktop,
 * com TopBar informativa integrada, sem a lupa de busca (conforme solicitado),
 * e visual refinado e limpo em telas pequenas.
 */
export default async function Header() {
  const mensagem = await getActiveMensagemDia();

  return (
    <header className="w-full bg-[#fdfdfd] border-b border-[#e2e8f0] sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
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
              <EducaLogo size={38} showText={true} variant="eb" />
            </Link>

            {/* Ícone de Calendário no Mobile */}
            <div className="flex items-center lg:hidden shrink-0 ml-2">
              <Link
                href="/cronogramas"
                aria-label="Ver cronogramas e calendário"
                className="w-8 h-8 rounded border border-[#b91c1c] overflow-hidden flex flex-col items-center bg-white shadow-xs hover:opacity-90 transition-opacity"
                title="Calendário e Cronogramas"
              >
                <div className="w-full bg-[#b91c1c] h-2.5" />
                <span className="text-[10px] font-bold text-slate-700 leading-none mt-1">
                  {new Date().getDate()}
                </span>
              </Link>
            </div>
          </div>

          {/* Navegação + Ações Desktop */}
          <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-8 min-w-0 w-full lg:w-auto">
            <div className="w-full lg:w-auto min-w-0 overflow-x-auto no-scrollbar">
              <NavLinks />
            </div>

            {/* Ícone de Calendário no Desktop */}
            <div className="hidden lg:flex items-center text-slate-500 shrink-0">
              <Link
                href="/cronogramas"
                aria-label="Ver calendário e cronogramas oficiais"
                className="w-7 h-7 rounded border border-[#b91c1c] overflow-hidden flex flex-col items-center bg-white shadow-xs hover:scale-105 transition-transform"
                title="Calendário e Cronogramas"
              >
                <div className="w-full bg-[#b91c1c] h-2" />
                <span className="text-[10px] font-bold text-slate-700 leading-none mt-0.5">
                  {new Date().getDate()}
                </span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
