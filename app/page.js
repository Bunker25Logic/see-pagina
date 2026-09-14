import FeaturedStory from '@/components/home/FeaturedStory';
import NewsGrid from '@/components/home/NewsGrid';
import Sidebar from '@/components/sidebar/Sidebar';
import Divider from '@/components/ui/Divider';
import { getFeaturedStory, getSecondaryNews } from '@/lib/news';
import { getActiveBanners } from '@/lib/banners';
import { getActiveCronogramas } from '@/lib/cronogramas';

export const metadata = {
  title: 'Início',
  description:
    'Confira as últimas notícias e informações oficiais do Núcleo de Educação de Brasiléia — Secretaria de Educação do Estado do Acre.',
};

/** Sempre renderiza conteúdo em tempo real (notícias, banners, cronogramas). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * HomePage — Tela inicial do Portal SEE.
 * Server Component assíncrono — busca dados no Supabase em paralelo.
 */
export default async function HomePage() {
  const [featuredStory, secondaryNews, banners, cronogramas] = await Promise.all([
    getFeaturedStory(),
    getSecondaryNews(3),
    getActiveBanners(),
    getActiveCronogramas(),
  ]);

  return (
    <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-4 md:py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter min-w-0">

      {/* ── Área de Conteúdo Principal ── */}
      <div className="min-w-0 md:col-span-8 lg:col-span-9 flex flex-col gap-stack-lg">
        {featuredStory && <FeaturedStory story={featuredStory} />}
        {featuredStory && secondaryNews.length > 0 && <Divider />}
        {secondaryNews.length > 0 && <NewsGrid news={secondaryNews} />}
      </div>

      {/* ── Sidebar com Cronogramas Setoriais (PC/Desktop) e Banners ── */}
      <Sidebar banners={banners} cronogramas={cronogramas} />

    </div>
  );
}
