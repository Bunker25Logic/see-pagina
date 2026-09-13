'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',             label: 'Notícias' },
  { href: '/escolas',      label: 'Escolas'  },
  { href: '/eventos',      label: 'Eventos'  },
  { href: '/cronogramas',  label: 'Cronogramas' },
];

/**
 * NavLinks — Links de navegação com detecção de rota ativa.
 * Otimizado com gap proporcional e sem overflow em telas mobile.
 */
export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar py-0.5 w-full"
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
            className={`font-semibold text-[14px] sm:text-[15px] pb-1 transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? 'text-[#0f2938] border-b-[2.5px] border-[#b45309] font-bold'
                : 'text-slate-600 hover:text-[#0f2938] border-b-[2.5px] border-transparent font-medium'
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
