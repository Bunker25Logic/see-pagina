import FeaturedStory from '@/components/home/FeaturedStory';
import NewsGrid from '@/components/home/NewsGrid';
import Sidebar from '@/components/sidebar/Sidebar';
import Divider from '@/components/ui/Divider';
import { getFeaturedStory, getSecondaryNews, getRecentNewsForUpdates } from '@/lib/news';

export const metadata = {
  title: 'Início',
  description:
    'Confira as últimas notícias e informações oficiais do Núcleo de Educação de Brasiléia — Secretaria de Educação do Estado do Acre.',
};

/** Revalida a página a cada 5 minutos. */
export const revalidate = 300;

/**
 * HomePage — Tela inicial do Portal SEE.
 * Server Component assíncrono — busca dados no Supabase em paralelo.
 */
export default async function HomePage() {
  const [featuredStory, secondaryNews, updates] = await Promise.all([
    getFeaturedStory(),
    getSecondaryNews(3),
    getRecentNewsForUpdates(3),
  ]);

  return (
    <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">

      {/* ── Área de Conteúdo Principal ── */}
      <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-stack-lg">
        {featuredStory && <FeaturedStory story={featuredStory} />}
        {featuredStory && secondaryNews.length > 0 && <Divider />}
        {secondaryNews.length > 0 && <NewsGrid news={secondaryNews} />}
      </div>

      {/* ── Sidebar ── */}
      <Sidebar updates={updates} />

    </div>
  );
}
