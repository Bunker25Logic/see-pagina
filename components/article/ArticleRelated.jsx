import Image from 'next/image';
import Link from 'next/link';

/**
 * ArticleRelated — Bloco de notícias relacionadas na sidebar do artigo.
 *
 * @param {{ news: Array }} props
 */
export default function ArticleRelated({ news }) {
  if (!news || news.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-stack-md">
      <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-unit">
        Outras Notícias
      </h2>

      <div className="flex flex-col gap-stack-md">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/noticias/${item.slug}`}
            className="flex gap-stack-sm group"
          >
            {/* Thumbnail */}
            {item.imageUrl ? (
              <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
              </div>
            ) : null}

            {/* Texto */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
                {item.category}
              </span>
              <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
