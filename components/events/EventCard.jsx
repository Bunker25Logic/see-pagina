/**
 * EventCard — Card de evento para a listagem.
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
  const parts = dateLabel.split(' ');
  const day   = parts[0];
  const month = parts[2]?.slice(0, 3).toUpperCase() ?? '';

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-sm hover:shadow-md transition-shadow flex overflow-hidden">
      {/* Badge de data */}
      <div className="bg-primary text-on-primary flex flex-col items-center justify-center px-stack-md py-stack-sm min-w-18 shrink-0">
        <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-wider">
          {month}
        </span>
        <span className="font-display-lg text-[28px] leading-none font-bold">
          {day}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-stack-md flex flex-col gap-unit flex-1 min-w-0">
        {/* Categoria + status */}
        <div className="flex items-center gap-stack-sm flex-wrap">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            {category}
          </span>
          {isUpcoming && (
            <span className="font-label-caps text-label-caps bg-secondary text-on-secondary uppercase tracking-wider px-stack-sm py-0.75 rounded-sm">
              Próximo
            </span>
          )}
        </div>

        {/* Título */}
        <h2 className="font-headline-md text-headline-md text-primary leading-tight">
          {title}
        </h2>

        {/* Descrição */}
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
          {description}
        </p>

        {/* Horário e local */}
        <div className="flex flex-wrap gap-stack-md mt-unit border-t border-outline-variant pt-stack-sm">
          <div className="flex items-center gap-unit text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">schedule</span>
            <span className="font-caption text-caption">{time}h</span>
          </div>
          <div className="flex items-center gap-unit text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">location_on</span>
            <span className="font-caption text-caption">{location}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
