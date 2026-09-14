import Image from 'next/image';
import Link from 'next/link';
import NewsViewBadge from '@/components/news/NewsViewBadge';

/**
 * NewsCard — Card de notícia individual para a grade secundária.
 *
 * @param {{ news: {
 *   id: string,
 *   title: string,
 *   excerpt: string,
 *   category: string,
 *   imageUrl: string,
 *   imageAlt: string,
 *   slug: string
 * }}} props
 */
export default function NewsCard({ news }) {
  const { title, excerpt, category, imageUrl, imageAlt, slug } = news;

  return (
    <article className="group bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md hover:border-secondary/40 transition-all duration-300">
      <div>
        {/* Imagem */}
        {imageUrl ? (
          <Link
            href={`/noticias/${slug}`}
            className="relative w-full aspect-16/10 overflow-hidden rounded-lg block bg-slate-100 dark:bg-slate-800 mb-3"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            />
          </Link>
        ) : null}

        {/* Conteúdo */}
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full w-fit">
            <span className="w-1 h-1 rounded-full bg-secondary" />
            {category}
          </span>

          <h3 className="font-editorial text-[16px] sm:text-[17px] font-bold text-primary dark:text-slate-100 group-hover:text-secondary transition-colors leading-snug line-clamp-2">
            <Link
              href={`/noticias/${slug}`}
              className="block first-letter:text-[1.24em] first-letter:font-black first-letter:text-secondary dark:first-letter:text-amber-400"
            >
              {title}
            </Link>
          </h3>

          <p className="font-body-md text-[13px] text-on-surface-variant dark:text-slate-300 line-clamp-3 leading-relaxed first-letter:text-[1.32em] first-letter:font-editorial first-letter:font-black first-letter:text-primary dark:first-letter:text-amber-400">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Ação rápida */}
      <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
        <Link
          href={`/noticias/${slug}`}
          className="text-[12px] font-semibold text-secondary hover:underline inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
        >
          <span>Continuar lendo</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
        <NewsViewBadge count={news.viewsCount} />
      </div>
    </article>
  );
}
