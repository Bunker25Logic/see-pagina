import Link from 'next/link';
import Image from 'next/image';

/**
 * EventAdBanners — Banner estilo anúncio/propaganda para a barra lateral (aside).
 * Perfeito para divulgar eventos da rede de ensino, campanhas institucionais e anúncios.
 *
 * @param {{ banners: Array<{
 *   id: string,
 *   title: string,
 *   subtitle: string,
 *   tag: string,
 *   imageUrl: string,
 *   linkUrl: string,
 *   targetBlank: boolean
 * }> }} props
 */
export default function EventAdBanners({ banners }) {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-3" aria-label="Banners e Anúncios">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[20px]" aria-hidden="true">
            campaign
          </span>
          <h2 className="font-editorial text-[17px] font-bold text-slate-900 dark:text-slate-100">
            Destaques
          </h2>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-label-caps">
          Anúncios
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {banners.map((banner) => {
          const content = (
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              {/* Imagem do Banner / Propaganda */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradiente de sobreposição sutil */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-black/20" />

                {/* Tag / Badge no topo */}
                {banner.tag && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {banner.tag}
                    </span>
                  </div>
                )}

                {/* Selo Publicidade / Propaganda */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-semibold bg-black/50 text-white/90 backdrop-blur-xs">
                    Divulgação
                  </span>
                </div>
              </div>

              {/* Corpo do Anúncio */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-editorial text-[16px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                  {banner.title}
                </h3>

                {banner.subtitle && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}

                {/* Botão de Chamada para Ação (CTA) */}
                <div className="mt-1 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                  <span className="text-xs uppercase tracking-wider font-bold flex items-center gap-1">
                    Saiba mais
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  {banner.targetBlank && (
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );

          if (banner.linkUrl) {
            const isExternal = banner.linkUrl.startsWith('http://') || banner.linkUrl.startsWith('https://');
            if (isExternal || banner.targetBlank) {
              return (
                <a
                  key={banner.id}
                  href={banner.linkUrl}
                  target={banner.targetBlank ? '_blank' : '_self'}
                  rel={banner.targetBlank ? 'noopener noreferrer' : undefined}
                  className="block no-underline"
                >
                  {content}
                </a>
              );
            }
            return (
              <Link key={banner.id} href={banner.linkUrl} className="block no-underline">
                {content}
              </Link>
            );
          }

          return (
            <div key={banner.id} className="block">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
