import Image from 'next/image';
import Link from 'next/link';

/**
 * ArticleHero — Área de cabeçalho da página de notícia.
 * Exibe: breadcrumb, categoria, título, autor/data e imagem.
 */
export default function ArticleHero({ story }) {
  const { title, category, date, author, imageUrl, imageAlt, slug } = story;

  return (
    <header className="flex flex-col gap-stack-md">
      {/* Breadcrumb */}
      <nav aria-label="Caminho de navegação" className="flex items-center gap-unit text-on-surface-variant">
        <Link
          href="/"
          className="font-label-caps text-label-caps hover:text-secondary transition-colors flex items-center gap-unit"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">home</span>
          Início
        </Link>
        <span className="material-symbols-outlined text-[14px] opacity-50" aria-hidden="true">chevron_right</span>
        <Link
          href="/"
          className="font-label-caps text-label-caps hover:text-secondary transition-colors"
        >
          Notícias
        </Link>
        <span className="material-symbols-outlined text-[14px] opacity-50" aria-hidden="true">chevron_right</span>
        <span className="font-label-caps text-label-caps text-on-surface opacity-60 truncate max-w-50">
          {title}
        </span>
      </nav>

      {/* Categoria + Data */}
      <div className="flex items-center gap-stack-sm flex-wrap">
        <span className="inline-flex items-center bg-secondary text-on-secondary font-label-caps text-label-caps uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-2xs">
          {category}
        </span>
        <span className="font-caption text-caption text-on-surface-variant font-medium">
          Publicado em {date}
        </span>
      </div>

      {/* Título com padrão editorial jornalístico */}
      <h1 className="font-display-lg text-display-lg text-primary leading-[1.2] md:leading-[1.22] tracking-tight font-bold">
        {title}
      </h1>

      {/* Autor com layout editorial */}
      {author && (
        <div className="flex items-center gap-2.5 text-on-surface-variant border-y border-outline-variant/60 py-2.5 my-1">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {author.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">Redação SEE</span>
            <span className="text-sm font-semibold text-primary">{author}</span>
          </div>
        </div>
      )}

      {/* Imagem com proporção cinematográfica e legenda opcional */}
      {imageUrl ? (
        <figure className="flex flex-col gap-1.5 mt-1">
          <div className="relative w-full aspect-16/10 md:aspect-video overflow-hidden rounded-md bg-surface-container-high border border-outline-variant/50 shadow-xs">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {imageAlt && (
            <figcaption className="text-caption text-on-surface-variant italic px-1">
              Foto: {imageAlt}
            </figcaption>
          )}
        </figure>
      ) : null}
    </header>
  );
}


