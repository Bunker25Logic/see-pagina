import Link from 'next/link';

/**
 * UpdatesFeed — Widget de atualizações recentes na sidebar.
 * Exibe notícias curtas com indicador de tempo relativo.
 *
 * Quando integrado ao Supabase, o campo `timeLabel` será calculado
 * dinamicamente a partir do campo `created_at` (ex.: com date-fns ou dayjs).
 *
 * @param {{ updates: Array<{id: string, timeLabel: string, text: string, href: string}> }} props
 */
export default function UpdatesFeed({ updates }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-stack-md">
      <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-unit">
        Atualizações
      </h2>

      <div className="flex flex-col gap-stack-sm">
        {updates.map((update, index) => (
          <div
            key={update.id}
            className={[
              'flex flex-col gap-1',
              index < updates.length - 1
                ? 'border-b border-outline-variant pb-stack-sm'
                : '',
            ].join(' ')}
          >
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
              {update.timeLabel}
            </span>
            <Link
              href={update.href}
              className="font-body-md text-body-md text-on-surface hover:text-primary transition-colors hover:underline"
            >
              {update.text}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
