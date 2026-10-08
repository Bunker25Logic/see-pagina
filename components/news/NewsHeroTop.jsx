import Image from 'next/image';
import Link from 'next/link';
import NewsViewBadge from '@/components/news/NewsViewBadge';

/**
 * NewsHeroTop — Notícia em destaque principal no topo da página /noticias.
 * É significativamente maior e mais imponente do que o destaque padrão da página inicial,
 * ocupando largura total (tela cheia sem aside) com layout editorial sofisticado.
 *
 * @param {{ story: {
 *   id: string,
 *   title: string,
 *   excerpt: string,
 *   category: string,
 *   date: string,
 *   imageUrl: string,
 *   imageAlt: string,
 *   slug: string,
 *   viewsCount?: number
 * }}} props
 */
export default function NewsHeroTop({ story }) {
  if (!story) return null;

  const { title, excerpt, category, date, author, imageUrl, imageAlt, slug, viewsCount = 0 } = story;

  return (
    <article className="group relative rounded-3xl bg-surface-container-lowest border border-outline-variant/70 shadow-md hover:shadow-2xl hover:border-secondary/40 transition-all duration-300 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-stretch">

        {/* ── Imagem Principal Ampla (Maior e com Aspecto Cinematográfico) ── */}
        <div className="lg:col-span-7 xl:col-span-7 relative min-h-65 sm:min-h-90 lg:min-h-115 overflow-hidden bg-slate-900">
          {imageUrl ? (
            <Link
              href={`/noticias/${slug}`}
              className="absolute inset-0 block w-full h-full"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={imageUrl}
                alt={imageAlt || title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
              {/* Degradê cinematográfico para elegância visual */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-black/35 opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
            </Link>
          ) : (
            <div className="w-full h-full min-h-75 bg-linear-to-br from-primary to-slate-900 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-6xl">newspaper</span>
            </div>
          )}

          {/* Selo Flutuante de Destaque Máximo */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
              <span className="material-symbols-outlined text-[14px]">star</span>
              Destaque Principal
            </span>
          </div>
        </div>

        {/* ── Conteúdo Editorial com Tipografia Imponente (Maior que a Home) ── */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:py-10 lg:pr-10 lg:pl-0">
          <div>
            {/* Metadados: Categoria em pílula + Data + Leitura */}
            <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/25">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                {category || 'Educação'}
              </span>

              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">event</span>
                {date}
              </span>

              {author && (
                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-primary dark:text-amber-400 bg-primary/10 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Por {author}
                </span>
              )}

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant/80">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                4 min de leitura
              </span>
            </div>

            {/* Manchete Principal Maior (text-3xl a text-4xl+) */}
            <h1 className="font-editorial text-[24px] sm:text-[30px] md:text-[34px] lg:text-[36px] xl:text-[40px] text-primary dark:text-slate-50 leading-[1.2] font-black tracking-tight group-hover:text-secondary transition-colors duration-200 wrap-break-word">
              <Link
                href={`/noticias/${slug}`}
                className="block hover:underline decoration-secondary/50 underline-offset-4 first-letter:text-[1.28em] first-letter:font-black first-letter:text-secondary dark:first-letter:text-amber-400"
              >
                {title}
              </Link>
            </h1>

            {/* Resumo com leitura confortável e fonte expandida */}
            <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant dark:text-slate-300 leading-relaxed mt-4 first-letter:text-[1.42em] first-letter:font-editorial first-letter:font-black first-letter:text-primary dark:first-letter:text-amber-400 line-clamp-4">
              {excerpt}
            </p>
          </div>

          {/* Barra de Ação Inferior */}
          <div className="pt-5 mt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <Link
              href={`/noticias/${slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] group-hover:gap-3"
            >
              <span>Ler reportagem completa</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <NewsViewBadge count={viewsCount} />
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider hidden sm:inline">
                {author ? `Por ${author}` : 'SEE-AC Oficial'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
