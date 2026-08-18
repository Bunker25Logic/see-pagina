import EventCard from '@/components/events/EventCard';
import { getUpcomingEvents, getPastEvents } from '@/lib/events';

export const metadata = {
  title: 'Eventos',
  description:
    'Confira os próximos eventos e atividades promovidos pelo Núcleo de Educação de Brasiléia — Secretaria de Educação do Acre.',
};

export const revalidate = 300; // revalida a cada 5 minutos

/**
 * EventosPage — Próximos eventos e eventos realizados.
 */
export default async function EventosPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop flex flex-col gap-stack-lg">

      {/* Cabeçalho da página */}
      <div className="border-b-2 border-outline-variant pb-stack-md">
        <div className="flex items-center gap-unit mb-unit">
          <span className="material-symbols-outlined text-secondary text-[28px]" aria-hidden="true">
            event
          </span>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            Agenda
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg text-primary">
          Eventos
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm">
          Próximas atividades e eventos da rede estadual de Brasiléia.
        </p>
      </div>

      {/* Próximos eventos */}
      {upcomingEvents.length > 0 && (
        <section aria-labelledby="proximos-titulo">
          <h2
            id="proximos-titulo"
            className="font-headline-md text-headline-md text-primary mb-stack-md flex items-center gap-stack-sm"
          >
            <span className="w-1 h-6 bg-secondary rounded-sm inline-block" aria-hidden="true" />
            Próximos Eventos
          </h2>
          <div className="flex flex-col gap-stack-md">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Estado vazio */}
      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center py-stack-lg">
          Nenhum evento cadastrado no momento.
        </p>
      )}

      {/* Eventos passados */}
      {pastEvents.length > 0 && (
        <section aria-labelledby="passados-titulo">
          <h2
            id="passados-titulo"
            className="font-headline-md text-headline-md text-on-surface-variant mb-stack-md flex items-center gap-stack-sm"
          >
            <span className="w-1 h-6 bg-outline-variant rounded-sm inline-block" aria-hidden="true" />
            Eventos Realizados
          </h2>
          <div className="flex flex-col gap-stack-md opacity-70">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
