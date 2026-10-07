import { getAllNews, getFeaturedStory } from '@/lib/news';
import NewsHeroTop from '@/components/news/NewsHeroTop';
import NewsTwoColList from '@/components/news/NewsTwoColList';

export const metadata = {
  title: 'Notícias | Educa Brasiléia',
  description:
    'Acompanhe as notícias, reportagens especiais e comunicados oficiais do Núcleo de Educação de Brasiléia — Secretaria de Estado de Educação do Acre (SEE/AC).',
};

/** Sempre renderiza conteúdo dinâmico e atualizado do Supabase. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * NoticiasPage — Página completa de notícias do Portal SEE.
 * Layout em tela cheia (sem barra lateral/aside):
 * - Notícia de destaque no topo, maior e mais imponente
 * - Grade abaixo organizada em duas colunas (lado a lado), com tamanhos menores
 */
export default async function NoticiasPage() {
  const [allNews, featuredStory] = await Promise.all([
    getAllNews(),
    getFeaturedStory(),
  ]);

  // Define a notícia principal do topo (a destacada ou a mais recente)
  const topStory = featuredStory || (allNews.length > 0 ? allNews[0] : null);

  // Notícias secundárias para a grade de duas colunas (exclui a notícia do topo)
  const secondaryNews = allNews.filter((item) => item.id !== topStory?.id);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50/40 dark:bg-[#07131d] transition-colors py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 sm:gap-10">

        {/* ── Cabeçalho Institucional da Página ── */}
        <header className="border-b border-outline-variant/60 pb-5 sm:pb-6">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[18px]">newspaper</span>
            Portal de Notícias · Núcleo de Educação de Brasiléia (SEE-AC)
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-primary dark:text-slate-50 tracking-tight leading-tight">
            Notícias e Coberturas Oficiais
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mt-2 leading-relaxed">
            Acompanhe as principais informações pedagógicas, conquistas estudantis, editais e acontecimentos que transformam a educação pública em Brasiléia.
          </p>
        </header>

        {/* ── 1. Notícia Maior no Topo (Destaque Principal) ── */}
        {topStory && (
          <section aria-label="Notícia em destaque principal">
            <NewsHeroTop story={topStory} />
          </section>
        )}

        {/* ── 2. Seção de Colunas Abaixo (Organizadas Lado a Lado em Duas Disposições) ── */}
        {secondaryNews.length > 0 && (
          <section className="flex flex-col gap-5 pt-2" aria-label="Mais notícias em duas colunas">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-outline-variant/50 pb-3">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-primary dark:text-slate-100">
                  Mais Reportagens e Comunicados
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Matérias organizadas em duas colunas com coberturas completas das escolas.
                </p>
              </div>
            </div>

            {/* Componente Interativo com Grade de 2 Colunas */}
            <NewsTwoColList news={secondaryNews} />
          </section>
        )}

      </div>
    </div>
  );
}
