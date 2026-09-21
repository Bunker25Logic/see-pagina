'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',            label: 'Notícias' },
  { href: '/escolas',     label: 'Escolas'  },
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
      className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar py-1 w-full mx-auto"
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
            className={`text-[15px] sm:text-[16px] tracking-tight py-1 transition-all duration-200 whitespace-nowrap shrink-0 relative ${
              isActive
                ? 'text-primary dark:text-amber-400 font-extrabold border-b-[3px] border-amber-500 dark:border-amber-400'
                : 'text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white font-bold border-b-[3px] border-transparent hover:border-slate-300 dark:hover:border-slate-600'
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
