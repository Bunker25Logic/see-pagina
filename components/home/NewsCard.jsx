import Image from 'next/image';
import Link from 'next/link';

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
    <article className="bg-surface-container-lowest border border-outline-variant p-stack-sm flex flex-col gap-stack-sm hover:shadow-md transition-shadow rounded-sm">
      {/* Imagem */}
      {imageUrl ? (
        <div className="relative w-full aspect-4/3 overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          />
        </div>
      ) : null}

      {/* Conteúdo */}
      <div className="flex flex-col gap-unit">
        <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
          {category}
        </span>

        <h3 className="font-headline-md text-headline-md text-primary leading-tight">
          <Link
            href={`/noticias/${slug}`}
            className="hover:text-secondary transition-colors"
          >
            {title}
          </Link>
        </h3>

        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
          {excerpt}
        </p>
      </div>
    </article>
  );
}
