/**
 * EventCard — Card de evento institucional moderno.
 * Cantos arredondados (rounded-2xl), suporte total a modo escuro,
 * bloco de calendário com contraste alto e micro-interações.
 *
 * @param {{ event: {
 *   id: string,
 *   title: string,
 *   description: string,
 *   dateLabel: string,
 *   time: string,
 *   location: string,
 *   category: string,
 *   isUpcoming: boolean
 * }}} props
 */
export default function EventCard({ event }) {
  const { title, description, dateLabel, time, location, category, isUpcoming } = event;

  // Extrai dia e mês da label (ex: "16 de Fevereiro, 2024" → "16" / "FEV")
  const parts = dateLabel ? dateLabel.split(' ') : [];
  const day = parts[0] || '--';
  const month = parts[2]?.slice(0, 3).toUpperCase() || 'CAL';

  return (
    <article className="group bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row">
      {/* Bloco de Data Estilo Folha de Calendário */}
      <div className="bg-linear-to-br from-[#163c54] via-[#102c3f] to-[#0c2331] text-white flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:py-5 sm:w-28 shrink-0 relative">
        <div className="flex items-center sm:flex-col gap-2 sm:gap-1 text-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400 font-label-caps">
            {month}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight">
            {day}
          </span>
        </div>

        {/* Em telas menores, exibe badge "Próximo" aqui se couber */}
        {isUpcoming && (
          <span className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
            Próximo
          </span>
        )}

        {/* Detalhe de borda sutil na transição */}
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-0.75 bg-emerald-500" />
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 flex-1 min-w-0">
        <div className="flex flex-col gap-2">
          {/* Categorias e Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              {category}
            </span>
            {isUpcoming && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                Próximo
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
            {title}
          </h3>

          {/* Descrição */}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Metadados: Horário e Localização */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          {time && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{time}h</span>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-amber-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium truncate max-w-xs">{location}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
