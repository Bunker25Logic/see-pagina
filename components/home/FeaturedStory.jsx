import Image from 'next/image';
import Link from 'next/link';

/**
 * FeaturedStory — Notícia em destaque com padrão editorial jornalístico contemporâneo.
 * Ocupa a posição principal da página inicial (headline) com elevação tátil e microinterações.
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
    <article className="group bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 sm:p-6 flex flex-col gap-stack-md shadow-xs hover:shadow-xl hover:border-secondary/40 transition-all duration-300">
      {/* Imagem de destaque com aspect ratio cinematográfico e zoom suave */}
      {imageUrl ? (
        <Link
          href={`/noticias/${slug}`}
          className="w-full aspect-video relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {/* Gradiente sutil inferior */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        </Link>
      ) : null}

      {/* Conteúdo Editorial */}
      <div className="flex flex-col gap-3">
        {/* Metadados: Categoria em pílula + Data + Tempo de leitura */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/25">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            {category}
          </span>

          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">event</span>
            {date}
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant/80">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            3 min de leitura
          </span>
        </div>

        {/* Título Principal (h1 semântico) */}
        <h1 className="font-editorial text-[22px] sm:text-[28px] md:text-[32px] text-primary dark:text-slate-50 leading-[1.24] font-extrabold tracking-tight group-hover:text-secondary transition-colors duration-200 wrap-break-word">
          <Link
            href={`/noticias/${slug}`}
            className="hover:underline decoration-secondary/50 underline-offset-4"
          >
            {title}
          </Link>
        </h1>

        {/* Resumo com entrelinha jornalística */}
        <p className="font-body-lg text-[15px] sm:text-body-lg text-on-surface-variant dark:text-slate-300 leading-relaxed">
          {excerpt}
        </p>

        {/* Barra de Ação Inferior */}
        <div className="pt-2 mt-1 flex items-center justify-between border-t border-outline-variant/40">
          <Link
            href={`/noticias/${slug}`}
            className="inline-flex items-center gap-1.5 font-semibold text-[13px] sm:text-[14px] text-secondary hover:underline group-hover:gap-2 transition-all"
          >
            <span>Ler reportagem completa</span>
            <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>

          <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
            SEE-AC Oficial
          </span>
        </div>
      </div>
    </article>
  );
}
