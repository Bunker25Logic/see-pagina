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
    <div className="flex flex-col gap-stack-md" aria-label="Banners e Anúncios">
      <div className="flex items-center justify-between border-b border-outline-variant pb-unit">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">
            campaign
          </span>
          <h2 className="font-headline-md text-headline-md text-primary">
            Destaques
          </h2>
        </div>
        <span className="font-label-caps text-[11px] uppercase tracking-wider text-outline">
          Anúncios
        </span>
      </div>

      <div className="flex flex-col gap-stack-md">
        {banners.map((banner) => {
          const content = (
            <div className="group relative overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest shadow-xs hover:shadow-md transition-all duration-300 hover:border-secondary/50 flex flex-col">
              {/* Imagem do Banner / Propaganda */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-primary-container">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradiente de sobreposição sutil */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-black/20" />


                {/* Tag / Badge no topo */}
                {banner.tag && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary text-on-secondary shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-on-secondary animate-pulse" />
                      {banner.tag}
                    </span>
                  </div>
                )}

                {/* Selo Publicidade / Propaganda */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-semibold bg-black/40 text-white/90 backdrop-blur-xs">
                    Divulgação
                  </span>
                </div>
              </div>

              {/* Corpo do Anúncio */}
              <div className="p-stack-sm flex flex-col gap-1.5">
                <h3 className="font-headline-md text-[17px] font-bold text-primary group-hover:text-secondary transition-colors leading-snug line-clamp-2">
                  {banner.title}
                </h3>

                {banner.subtitle && (
                  <p className="font-body-md text-caption text-on-surface-variant line-clamp-2 leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}

                {/* Botão de Chamada para Ação (CTA) */}
                <div className="mt-1 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-secondary group-hover:text-primary transition-colors">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold flex items-center gap-1">
                    Saiba mais
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                  {banner.targetBlank && (
                    <span className="material-symbols-outlined text-[14px] text-outline" title="Abre em nova aba">
                      open_in_new
                    </span>
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
