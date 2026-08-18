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
        <span className="inline-flex items-center bg-secondary text-on-secondary font-label-caps text-label-caps uppercase tracking-wider px-stack-sm py-0.75 rounded-sm">
          {category}
        </span>
        <span className="font-caption text-caption text-on-surface-variant">
          {date}
        </span>
      </div>

      {/* Título */}
      <h1 className="font-display-lg text-display-lg text-primary leading-tight">
        {title}
      </h1>

      {/* Autor */}
      {author && (
        <div className="flex items-center gap-unit text-on-surface-variant border-t border-outline-variant pt-stack-sm">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
          <span className="font-caption text-caption">{author}</span>
        </div>
      )}

      {/* Imagem */}
      {imageUrl ? (
        <div className="relative w-full aspect-video overflow-hidden rounded-sm mt-unit">
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
    </header>
  );
}
