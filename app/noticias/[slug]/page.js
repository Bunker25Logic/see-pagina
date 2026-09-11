import { notFound } from 'next/navigation';
import { getNewsBySlug, getRelatedNews, getRecentNewsForUpdates } from '@/lib/news';
import { getActiveBanners } from '@/lib/banners';
import ArticleHero from '@/components/article/ArticleHero';
import ArticleBody from '@/components/article/ArticleBody';
import ArticleRelated from '@/components/article/ArticleRelated';
import UpdatesFeed from '@/components/sidebar/UpdatesFeed';
import EventAdBanners from '@/components/sidebar/EventAdBanners';

/** Sempre renderiza conteúdo fresco (conteúdo pode ser editado a qualquer hora). */
export const dynamic = 'force-dynamic';

/**
 * Metadados gerados dinamicamente com base no slug.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getNewsBySlug(slug);
  if (!story) return {};

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [{ url: story.imageUrl, alt: story.imageAlt }],
    },
  };
}

/**
 * NewsArticlePage — Página de notícia individual.
 *
 * Layout:
 *  - Col 8: ArticleHero + ArticleBody
 *  - Col 4: Sidebar (banners + notícias relacionadas + atualizações)
 */
export default async function NewsArticlePage({ params }) {
  const { slug } = await params;

  const [story, relatedNews, updates, banners] = await Promise.all([
    getNewsBySlug(slug),
    getRelatedNews(slug, 3),
    getRecentNewsForUpdates(3),
    getActiveBanners(),
  ]);

  if (!story) notFound();

  return (
    <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

        {/* ── Conteúdo Principal ── */}
        <article className="md:col-span-8 lg:col-span-9 flex flex-col gap-stack-lg">
          <ArticleHero story={story} />
          <ArticleBody content={story.content} />
        </article>

        {/* ── Sidebar ── */}
        <aside
          className="md:col-span-4 lg:col-span-3 flex flex-col gap-stack-lg border-t md:border-t-0 md:border-l border-outline-variant pt-stack-lg md:pt-0 md:pl-gutter"
          aria-label="Barra lateral"
        >
          {banners && banners.length > 0 && <EventAdBanners banners={banners} />}
          <ArticleRelated news={relatedNews} />
          <UpdatesFeed updates={updates} />
        </aside>

      </div>
    </div>
  );
}

