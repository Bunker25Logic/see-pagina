import EventAdBanners from './EventAdBanners';
import CronogramasAside from './CronogramasAside';
import { FALLBACK_CRONOGRAMAS } from '@/lib/cronogramas';

/**
 * Sidebar — Barra lateral do portal com widgets de apoio.
 * - Cronogramas: Exibido exclusivamente na visualização de PC/Desktop (oculto no mobile).
 * - Banners: Divulgação e comunicados institucionais.
 * - Atualizações Recentes: Removido conforme solicitação de simplificação visual.
 *
 * @param {{ updates?: Array, banners?: Array, cronogramas?: Array }} props
 */
export default function Sidebar({ banners = [], cronogramas = [] }) {
  const items = cronogramas && cronogramas.length > 0 ? cronogramas : FALLBACK_CRONOGRAMAS;

  return (
    <aside
      className="min-w-0 md:col-span-4 lg:col-span-3 flex flex-col gap-6 border-t md:border-t-0 md:border-l border-outline-variant pt-6 md:pt-0 md:pl-gutter"
      aria-label="Barra lateral"
    >
      {/* ── Aside de Cronogramas Setoriais em Abas (Visível SOMENTE no PC / Desktop) ── */}
      <div className="hidden md:block">
        <CronogramasAside initialItems={items} />
      </div>

      {/* ── Banners Promocionais e Anúncios de Eventos ── */}
      {banners && banners.length > 0 && <EventAdBanners banners={banners} />}
    </aside>
  );
}
