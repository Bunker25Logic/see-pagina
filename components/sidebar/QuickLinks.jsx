import Link from 'next/link';

/**
 * QuickLinks — Widget de acesso rápido na sidebar.
 * Exibe uma lista de links institucionais com ícone de seta.
 *
 * @param {{ links: Array<{id: string, label: string, href: string, external: boolean}> }} props
 */
export default function QuickLinks({ links }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-stack-md">
      <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-unit">
        Acesso Rápido
      </h2>

      <ul className="flex flex-col gap-unit" role="list">
        {links.map((link, index) => (
          <li
            key={link.id}
            className={index > 0 ? 'border-t border-outline-variant' : ''}
          >
            <Link
              href={link.href}
              className="flex items-center justify-between p-stack-sm hover:bg-surface-container-high transition-colors text-on-surface group rounded-sm"
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <span className="font-body-md text-body-md">{link.label}</span>
              <span
                className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
