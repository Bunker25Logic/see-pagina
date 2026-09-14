'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * BannerItem — Card individual de anúncio com detecção inteligente de proporção.
 * Se a imagem for portrait (cartaz/flyer vertical) ou landscape (horizontal),
 * ela é exibida integralmente sem nenhum corte ('sem cortar nada').
 */
function BannerCard({ banner, onOpenZoom }) {
  const [aspectType, setAspectType] = useState('auto'); // 'portrait' | 'landscape' | 'square' | 'auto'
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  const handleLoad = (e) => {
    const target = e?.currentTarget || e?.target;
    if (target && target.naturalWidth && target.naturalHeight) {
      const ratio = target.naturalWidth / target.naturalHeight;
      if (ratio < 0.88) {
        setAspectType('portrait'); // Cartaz vertical (ex: 4:5, 9:16, A4)
      } else if (ratio > 1.15) {
        setAspectType('landscape'); // Banner horizontal (ex: 16:9, 16:10)
      } else {
        setAspectType('square'); // Formato quadrado (1:1)
      }
      setIsLoaded(true);
    }
  };

  // Detecta se a imagem já estava em cache no navegador ao montar
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleLoad({ currentTarget: imgRef.current });
    }
  }, []);


  const hasLink = Boolean(banner.linkUrl);
  const isExternal =
    hasLink &&
    (banner.linkUrl.startsWith('http://') ||
      banner.linkUrl.startsWith('https://') ||
      banner.targetBlank);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* ── ÁREA DA IMAGEM INTELIGENTE (SEM CORTES) ── */}
      <div className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center min-h-40">
        {/* Fundo ambiente desfocado com as cores da própria imagem para visual imersivo */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-20 dark:opacity-25 pointer-events-none transition-opacity duration-500"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
          aria-hidden="true"
        />

        {/* Imagem com proporção 100% preservada (object-contain e w-full h-auto) */}
        <div className="relative z-10 w-full flex items-center justify-center p-1 sm:p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={banner.imageUrl}
            alt={banner.title || 'Anúncio ou divulgação escolar'}
            onLoad={handleLoad}
            loading="lazy"
            className={`w-full h-auto max-h-145 object-contain rounded-xl transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
            } group-hover:scale-[1.01]`}
          />

          {/* Skeleton enquanto a imagem carrega */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-xl">
              <span className="material-symbols-outlined text-slate-400 text-3xl">image</span>
            </div>
          )}
        </div>

        {/* Badges superiores flutuantes */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
          {banner.tag ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {banner.tag}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold bg-slate-900/70 text-white backdrop-blur-xs shadow-2xs">
              {aspectType === 'portrait' ? 'Cartaz' : 'Divulgação'}
            </span>
          )}
        </div>

        {/* Botão de Zoom/Ampliar no canto superior direito */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenZoom(banner);
          }}
          title="Ver cartaz em tamanho real"
          aria-label="Ampliar cartaz"
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/85 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-xs hover:scale-105 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">zoom_in</span>
        </button>
      </div>

      {/* ── CORPO INFORMATIVO DO ANÚNCIO ── */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-1.5 bg-white dark:bg-slate-900">
        {banner.title && (
          <h3 className="font-editorial text-[15px] sm:text-[16px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
            {banner.title}
          </h3>
        )}

        {banner.subtitle && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {banner.subtitle}
          </p>
        )}

        {/* Barra de ações inferior */}
        <div className="mt-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {/* Botão de Ampliar */}
          <button
            type="button"
            onClick={() => onOpenZoom(banner)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">fullscreen</span>
            Ampliar
          </button>

          {/* Botão de Ação / Link Oficial se houver */}
          {hasLink ? (
            isExternal ? (
              <a
                href={banner.linkUrl}
                target={banner.targetBlank ? '_blank' : '_self'}
                rel={banner.targetBlank ? 'noopener noreferrer' : undefined}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                Acessar link
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            ) : (
              <Link
                href={banner.linkUrl}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                Saiba mais
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            )
          ) : (
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Oficial
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * EventAdBanners — Banner estilo anúncio/propaganda para a barra lateral.
 * Detecta inteligentemente orientações portrait (cartazes verticais) e landscape (horizontais),
 * exibindo a arte por completo sem nenhum corte, com lightbox de ampliação integrado.
 */
export default function EventAdBanners({ banners }) {
  const [zoomedBanner, setZoomedBanner] = useState(null);

  // Fecha o modal de zoom ao pressionar a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomedBanner(null);
      }
    };
    if (zoomedBanner) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [zoomedBanner]);

  if (!banners || banners.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-3" aria-label="Banners e Anúncios">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[20px]"
              aria-hidden="true"
            >
              campaign
            </span>
            <h2 className="font-editorial text-[17px] font-bold text-slate-900 dark:text-slate-100">
              Destaques
            </h2>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-label-caps">
            Divulgação
          </span>
        </div>

        {/* Lista de Banners Inteligentes */}
        <div className="flex flex-col gap-4">
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onOpenZoom={(b) => setZoomedBanner(b)}
            />
          ))}
        </div>
      </div>

      {/* ── MODAL LIGHTBOX PARA VISUALIZAR CARTAZ COMPLETO EM ALTA RESOLUÇÃO ── */}
      {zoomedBanner && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoomedBanner.title || 'Cartaz ampliado'}
          onClick={() => setZoomedBanner(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Conteúdo do Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[92vh] w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Barra de título do Modal */}
            <div className="p-3.5 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-emerald-400 text-xl shrink-0">
                  image
                </span>
                <span className="text-sm font-semibold truncate text-slate-200">
                  {zoomedBanner.title || 'Cartaz Informativo Oficial'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZoomedBanner(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Fechar visualizador"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Imagem do Cartaz em Tamanho Integral */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedBanner.imageUrl}
                alt={zoomedBanner.title || 'Cartaz em alta resolução'}
                className="max-w-full max-h-[74vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Rodapé com detalhes e link se houver */}
            {(zoomedBanner.subtitle || zoomedBanner.linkUrl) && (
              <div className="p-3.5 px-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                {zoomedBanner.subtitle && (
                  <p className="text-slate-300 leading-relaxed max-w-md line-clamp-2">
                    {zoomedBanner.subtitle}
                  </p>
                )}
                {zoomedBanner.linkUrl && (
                  <a
                    href={zoomedBanner.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    Acessar Link Oficial
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
