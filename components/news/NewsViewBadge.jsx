'use client';

/**
 * Formata números grandes de visualizações (ex: 1250 -> 1.250 ou 15400 -> 15.4k)
 */
function formatViews(count = 0) {
  const num = Number(count) || 0;
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1).replace('.', ',')}k`;
  }
  return num.toLocaleString('pt-BR');
}

/**
 * NewsViewBadge — Contador de visualizações com o ícone de "olhinho".
 * Utilizado na página inicial (FeaturedStory e NewsCard) e na matéria aberta.
 */
export default function NewsViewBadge({ count = 0, size = 'sm', showLabel = false }) {
  const formatted = formatViews(count);
  const isLg = size === 'lg';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium select-none text-slate-500 dark:text-slate-400 ${
        isLg ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'
      }`}
      title={`${Number(count) || 0} visualizações registradas`}
      aria-label={`${Number(count) || 0} visualizações`}
    >
      <span
        className={`material-symbols-outlined shrink-0 text-slate-400 dark:text-slate-500 ${
          isLg ? 'text-[17px] sm:text-[19px]' : 'text-[14px] sm:text-[15px]'
        }`}
        aria-hidden="true"
      >
        visibility
      </span>
      <span className="font-semibold tabular-nums tracking-tight">{formatted}</span>
      {showLabel && <span className="opacity-80">views</span>}
    </span>
  );
}
