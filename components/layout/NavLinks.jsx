'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',        label: 'Notícias' },
  { href: '/escolas', label: 'Escolas'  },
  { href: '/eventos', label: 'Eventos'  },
];

/**
 * NavLinks — Links de navegação com detecção de rota ativa.
 * Client Component necessário para usar usePathname().
 */
export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-gutter md:gap-margin-desktop overflow-x-auto w-full no-scrollbar"
      aria-label="Navegação principal"
    >
      {navLinks.map((link) => {
        const isActive =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

        return isActive ? (
          <Link
            key={link.href}
            href={link.href}
            className="text-primary font-bold border-b-2 border-secondary pb-1 hover:text-secondary transition-colors whitespace-nowrap opacity-80"
            aria-current="page"
          >
            {link.label}
          </Link>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className="text-on-surface-variant font-label-caps text-label-caps hover:text-secondary transition-colors whitespace-nowrap"
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
