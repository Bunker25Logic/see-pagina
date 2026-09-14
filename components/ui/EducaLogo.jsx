'use client';

import { useId } from 'react';

/**
 * Emblema Vetorial da Bandeira Oficial do Estado do Acre.
 * Inspirado fielmente na bandeira estadual (Lei nº 1.170/1995):
 * - Divisão diagonal: Amarelo Ouro (superior esquerdo) e Verde Amazônico (inferior direito).
 * - Estrela Altaneira vermelha de 5 pontas no quadrante superior.
 * - Formato badge com cantos suaves, acabamento esmaltado e relevo institucional.
 */
function AcreFlagBadge({ size = 38, className = '' }) {
  const clipId = useId();
  const yellowId = useId();
  const greenId = useId();
  const starId = useId();
  const sheenId = useId();

  // Proporção harmônica próxima ao 10:7 oficial da bandeira
  const width = Math.round(size * 1.35);
  const height = size;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 54 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] ${className}`}
      aria-label="Bandeira do Estado do Acre"
      role="img"
    >
      <defs>
        {/* Recorte com cantos suavemente arredondados */}
        <clipPath id={clipId}>
          <rect x="0" y="0" width="54" height="40" rx="6" ry="6" />
        </clipPath>

        {/* Amarelo Ouro Nobre da Bandeira do Acre */}
        <linearGradient id={yellowId} x1="0%" y1="0%" x2="70%" y2="80%">
          <stop offset="0%" stopColor="#ffdc19" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Verde Floresta Amazônica do Acre */}
        <linearGradient id={greenId} x1="30%" y1="20%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00963f" />
          <stop offset="100%" stopColor="#005d25" />
        </linearGradient>

        {/* Estrela Altaneira Vermelha */}
        <linearGradient id={starId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Brilho e profundidade vitrificada */}
        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      {/* Conteúdo com recorte da bandeira */}
      <g clipPath={`url(#${clipId})`}>
        {/* Metade Superior Esquerda — Amarelo Ouro */}
        <polygon points="0,0 54,0 0,40" fill={`url(#${yellowId})`} />

        {/* Metade Inferior Direita — Verde Floresta */}
        <polygon points="54,0 54,40 0,40" fill={`url(#${greenId})`} />

        {/* Estrela Altaneira de 5 pontas */}
        <g transform="translate(16, 13)">
          {/* Sombra sutil para destaque da estrela */}
          <polygon
            points="0,-6.5 1.53,-2.1 6.18,-2.01 2.47,0.8 3.82,5.26 0,2.6 -3.82,5.26 -2.47,0.8 -6.18,-2.01 -1.53,-2.1"
            fill="#7f1d1d"
            opacity="0.25"
            transform="translate(0, 0.5)"
          />
          <polygon
            points="0,-6.5 1.53,-2.1 6.18,-2.01 2.47,0.8 3.82,5.26 0,2.6 -3.82,5.26 -2.47,0.8 -6.18,-2.01 -1.53,-2.1"
            fill={`url(#${starId})`}
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Efeito vitrificado / highlight */}
        <rect width="54" height="40" fill={`url(#${sheenId})`} />
      </g>

      {/* Borda fina e precisa para contraste em qualquer cor de fundo */}
      <rect
        x="0.5"
        y="0.5"
        width="53"
        height="39"
        rx="5.5"
        ry="5.5"
        fill="none"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Logo oficial do Portal Educa Brasiléia (SEE Acre).
 *
 * @param {{ size?: number, showText?: boolean, className?: string, variant?: 'acre' | 'eb' | 'vector' }} props
 */
export default function EducaLogo({
  size = 40,
  showText = true,
  className = '',
  variant = 'acre',
  inverted = false,
}) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant === 'eb' || variant === 'acre' || variant === 'flag' ? (
        /* Emblema Oficial da Bandeira do Acre */
        <AcreFlagBadge size={size} />
      ) : (
        /* Versão Vetorial com Livro Aberto, Chama Verde e Estrela Altaneira */
        <svg
          width={size}
          height={size}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#001d3d" />
              <stop offset="100%" stopColor="#002b5c" />
            </linearGradient>

            <linearGradient id="logoGreenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#006e27" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          <rect width="512" height="512" rx="116" fill="url(#logoBgGrad)" />
          <rect
            x="10"
            y="10"
            width="492"
            height="492"
            rx="106"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
          />

          <g filter="url(#logoGlow)">
            <path
              d="M 256 376 C 215 356 145 356 92 380 C 84 384 76 378 76 369 L 76 219 C 76 212 81 206 88 203 C 142 180 215 182 256 208 Z"
              fill="#ffffff"
            />
            <path
              d="M 256 376 C 297 356 367 356 420 380 C 428 384 436 378 436 369 L 436 219 C 436 212 431 206 424 203 C 370 180 297 182 256 208 Z"
              fill="#f1f5f9"
            />
            <path d="M 254 208 L 254 378 L 258 378 L 258 208 Z" fill="#cbd5e1" />

            <path d="M 124 250 Q 180 234 228 248" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 124 282 Q 180 266 228 280" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 124 314 Q 180 298 228 312" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

            <path d="M 284 248 Q 332 234 388 250" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 284 280 Q 332 266 388 282" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 284 312 Q 332 298 388 314" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

            <path
              d="M 256 106 C 230 146 216 176 226 212 C 235 192 248 182 256 174 C 264 182 277 192 286 212 C 296 176 282 146 256 106 Z"
              fill="url(#logoGreenGrad)"
            />

            <path
              d="M 256 134 C 243 156 238 176 244 196 C 248 186 252 180 256 176 C 260 180 264 186 268 196 C 274 176 269 156 256 134 Z"
              fill="url(#logoGoldGrad)"
            />

            <g transform="translate(256, 84)">
              <polygon
                points="0,-22 6.5,-7 22,-6 10,4.5 14,20 0,11 -14,20 -10,4.5 -22,-6 -6.5,-7"
                fill="url(#logoGoldGrad)"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
            </g>
          </g>
        </svg>
      )}

      {/* Identificação Tipográfica Oficial */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-editorial text-[21px] sm:text-[23px] ${
              inverted ? 'text-white' : 'text-[#0f2938] dark:text-slate-100'
            } tracking-tight font-bold`}
          >
            Educa Brasiléia
          </span>
          <span
            className={`text-[11px] font-medium tracking-wide ${
              inverted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
            } mt-1`}
          >
            Núcleo de Educação · SEE-AC
          </span>
        </div>
      )}
    </div>
  );
}
