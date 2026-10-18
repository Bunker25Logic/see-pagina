'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',            label: 'Início' },
  { href: '/noticias',    label: 'Notícias' },
  { href: '/escolas',     label: 'Instituições' },
  { href: '/cursos',      label: 'Cursos Gratuitos' },
  { href: '/cronogramas', label: 'Cronogramas' },
];

/**
 * NavLinks — Abas de navegação principais do Portal SEE.
 * Perfeitamente centralizadas e com destaque tipográfico editorial aprimorado.
 */
export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar py-0.5 sm:py-1 w-full mx-auto px-1"
      aria-label="Navegação principal"
    >
      {navLinks.map((link) => {
        const isActive =
          link.href === '/'
            ? pathname === '/'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs xs:text-[13px] sm:text-[14px] md:text-[14.5px] px-1.5 sm:px-2 py-1 tracking-tight transition-all duration-200 whitespace-nowrap shrink-0 relative ${
              isActive
                ? 'text-primary dark:text-amber-400 font-extrabold border-b-[2.5px] border-amber-500 dark:border-amber-400'
                : 'text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white font-semibold border-b-[2.5px] border-transparent hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
