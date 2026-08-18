import Image from 'next/image';
import Link from 'next/link';

/**
 * FeaturedStory — Notícia em destaque com imagem grande.
 * Ocupa a posição principal da página inicial (headline).
 *
 * @param {{ story: {
 *   id: string,
 *   title: string,
 *   excerpt: string,
 *   category: string,
 *   date: string,
 *   imageUrl: string,
 *   imageAlt: string,
 *   slug: string
 * }}} props
 */
export default function FeaturedStory({ story }) {
  const { title, excerpt, category, date, imageUrl, imageAlt, slug } = story;

  return (
    <article className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-stack-md">
      {/* Imagem de destaque */}
      {imageUrl ? (
        <div className="w-full aspect-video relative overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      ) : null}

      {/* Conteúdo */}
      <div className="flex flex-col gap-stack-sm">
        {/* Categoria + Data */}
        <div className="flex items-center gap-unit flex-wrap">
          <span className="font-label-caps text-label-caps text-secondary border-l-2 border-secondary pl-unit uppercase tracking-wider">
            {category}
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            • {date}
          </span>
        </div>

        {/* Título principal (h1 semântico — único na página) */}
        <h1 className="font-display-lg text-display-lg text-primary">
          <Link
            href={`/noticias/${slug}`}
            className="hover:text-secondary transition-colors"
          >
            {title}
          </Link>
        </h1>

        {/* Resumo */}
        <p className="font-body-lg text-body-lg text-on-surface">
          {excerpt}
        </p>
      </div>
    </article>
  );
}
