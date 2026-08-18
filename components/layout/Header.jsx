import Link from 'next/link';
import NavLinks from './NavLinks';

/**
 * Header — Barra de navegação superior do Portal SEE.
 * Server Component: apenas o NavLinks é client (usePathname).
 */
export default function Header() {
  return (
    <header className="bg-surface text-primary border-b border-outline-variant sticky top-0 z-50">
      <div className="flex flex-col items-center w-full px-margin-mobile md:px-margin-desktop max-w-300 mx-auto py-stack-sm">

        {/* Linha superior: Título + Ícones */}
        <div className="flex items-center justify-between w-full mb-stack-sm">
          <Link
            href="/"
            className="font-headline-lg text-headline-lg text-primary border-b-4 border-secondary pb-1 transition-opacity hover:opacity-80"
            aria-label="Ir para a página inicial"
          >
            Núcleo de Educação — Brasiléia
          </Link>

          <div className="flex items-center gap-gutter text-on-surface-variant">
            <button
              aria-label="Abrir pesquisa"
              className="hover:text-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              aria-label="Ver calendário"
              className="hover:text-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">calendar_today</span>
            </button>
          </div>
        </div>

        {/* Navegação com estado ativo dinâmico */}
        <NavLinks />
      </div>
    </header>
  );
}
