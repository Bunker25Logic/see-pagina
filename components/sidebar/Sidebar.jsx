import UpdatesFeed from './UpdatesFeed';
import EventAdBanners from './EventAdBanners';

/**
 * Sidebar — Barra lateral do portal com widgets de apoio.
 * Agrupa: Banners de eventos/anúncios e Atualizações recentes.
 *
 * @param {{ updates: Array, banners?: Array }} props
 */
export default function Sidebar({ updates, banners = [] }) {
  return (
    <aside
      className="md:col-span-4 lg:col-span-3 flex flex-col gap-stack-lg border-t md:border-t-0 md:border-l border-outline-variant pt-stack-lg md:pt-0 md:pl-gutter"
      aria-label="Barra lateral"
    >
      {/* ── Banners Promocionais e Anúncios de Eventos ── */}
      {banners && banners.length > 0 && <EventAdBanners banners={banners} />}

      {/* ── Atualizações Recentes ── */}
      <UpdatesFeed updates={updates} />
    </aside>
  );
}

