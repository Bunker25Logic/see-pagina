import Image from 'next/image';
import Link from 'next/link';
import NewsViewBadge from '@/components/news/NewsViewBadge';

/**
 * NewsTwoColCard — Card de notícia compacto para a grade em 2 colunas.
 * Apresenta tamanho reduzido e proporção horizontal equilibrada,
 * perfeito para a disposição lado a lado em tela cheia na página /noticias.
 *
 * @param {{ news: {
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
export default function NewsTwoColCard({ news }) {
  if (!news) return null;

  const { title, excerpt, category, date, imageUrl, imageAlt, slug, viewsCount = 0 } = news;

  return (
    <article className="group bg-surface-container-lowest border border-outline-variant/65 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row gap-4 shadow-2xs hover:shadow-lg hover:border-secondary/45 transition-all duration-300">
      {/* ── Imagem Compacta (Lateral no Desktop/Tablet, Superior no Mobile) ── */}
      {imageUrl ? (
        <Link
          href={`/noticias/${slug}`}
          className="relative w-full sm:w-44 md:w-40 lg:w-48 aspect-16/10 sm:aspect-auto shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 block self-stretch min-h-35"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 200px, 240px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
        </Link>
      ) : null}

      {/* ── Conteúdo Compacto e Editorial ── */}
      <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
        <div>
          {/* Metadados: Categoria + Data */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20">
              {category || 'Notícia'}
            </span>

            {date && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">event</span>
                {date}
              </span>
            )}
          </div>

          {/* Título com 2 linhas */}
          <h2 className="font-editorial text-[16px] sm:text-[17px] font-bold text-primary dark:text-slate-100 group-hover:text-secondary transition-colors leading-snug line-clamp-2">
            <Link
              href={`/noticias/${slug}`}
              className="block hover:underline decoration-secondary/40 underline-offset-2 first-letter:text-[1.22em] first-letter:font-black first-letter:text-secondary dark:first-letter:text-amber-400"
            >
              {title}
            </Link>
          </h2>

          {/* Resumo compacto (2 linhas) */}
          <p className="font-body-md text-[13px] text-on-surface-variant dark:text-slate-300 line-clamp-2 leading-relaxed mt-1.5 first-letter:text-[1.28em] first-letter:font-editorial first-letter:font-bold first-letter:text-primary dark:first-letter:text-amber-400">
            {excerpt}
          </p>
        </div>

        {/* Rodapé do Card: Link e Visualizações */}
        <div className="pt-2.5 border-t border-outline-variant/30 flex items-center justify-between mt-auto">
          <Link
            href={`/noticias/${slug}`}
            className="text-[12px] font-semibold text-secondary hover:underline inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
          >
            <span>Continuar lendo</span>
            <span className="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </Link>

          <NewsViewBadge count={viewsCount} />
        </div>
      </div>
    </article>
  );
}
