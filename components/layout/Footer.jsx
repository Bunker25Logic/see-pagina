import Link from 'next/link';

/**
 * Links institucionais do rodapé.
 * Adicione `external: true` para abrir em nova aba.
 */
const footerLinks = [
  { href: '/transparencia',    label: 'Transparência',     external: false },
  { href: '/privacidade',      label: 'Privacidade',       external: false },
  { href: '/portal-professor', label: 'Portal do Professor', external: false },
  {
    href: 'https://www.ac.gov.br',
    label: 'Governo do Estado',
    external: true,
  },
];

/**
 * Footer — Rodapé do Portal SEE.
 * Exibe o título institucional, links e copyright.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-stack-lg px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center bg-primary border-t-2 border-secondary">
      {/* Título */}
      <p className="font-headline-md text-headline-md text-on-primary mb-stack-md">
        Educa Brasiléia
      </p>

      {/* Links */}
      <nav
        className="flex flex-wrap justify-center gap-gutter mb-stack-md"
        aria-label="Links institucionais do rodapé"
      >
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-label-caps text-label-caps text-primary-fixed-dim hover:text-secondary-fixed transition-colors"
            {...(link.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Copyright */}
      <p className="font-body-md text-body-md text-on-primary opacity-80">
        © {currentYear} Educa Brasiléia — Secretaria de Educação do Acre
      </p>
    </footer>
  );
}
