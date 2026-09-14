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
    <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xs transition-all duration-300">
      <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2.5">
        <span className="material-symbols-outlined text-secondary text-[20px]">
          bolt
        </span>
        <h2 className="font-editorial text-[16px] sm:text-[17px] font-bold text-primary dark:text-slate-100">
          Últimas Atualizações
        </h2>
      </div>

      <div className="flex flex-col gap-3.5">
        {updates.map((update, index) => (
          <div
            key={update.id}
            className={`group relative flex items-start gap-3 ${
              index < updates.length - 1 ? 'border-b border-outline-variant/30 pb-3' : ''
            }`}
          >
            {/* Ponto indicador de timeline */}
            <span className="w-2 h-2 rounded-full bg-secondary/80 mt-1.5 shrink-0 group-hover:scale-125 group-hover:bg-secondary transition-all" />

            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="font-bold text-[10px] uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full w-fit">
                {update.timeLabel}
              </span>
              <Link
                href={update.href}
                className="font-body-md text-[13px] sm:text-body-md text-on-surface hover:text-secondary transition-colors leading-snug line-clamp-2"
              >
                {update.text}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
