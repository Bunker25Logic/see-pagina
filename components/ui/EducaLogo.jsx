'use client';

/**
 * Logo oficial vetorial do Portal Educa Brasiléia (SEE Acre).
 * Ícone estilizado com Livro Aberto, Chama Verde da Educação & Floresta Acreana,
 * e a Estrela Altaneira do Acre no topo.
 *
 * @param {{ size?: number, showText?: boolean, className?: string }} props
 */
export default function EducaLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon */}
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

        {/* Squircle Badge Background */}
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
          {/* Livro Aberto */}
          <path
            d="M 256 376 C 215 356 145 356 92 380 C 84 384 76 378 76 369 L 76 219 C 76 212 81 206 88 203 C 142 180 215 182 256 208 Z"
            fill="#ffffff"
          />
          <path
            d="M 256 376 C 297 356 367 356 420 380 C 428 384 436 378 436 369 L 436 219 C 436 212 431 206 424 203 C 370 180 297 182 256 208 Z"
            fill="#f1f5f9"
          />
          <path d="M 254 208 L 254 378 L 258 378 L 258 208 Z" fill="#cbd5e1" />

          {/* Linhas das páginas */}
          <path d="M 124 250 Q 180 234 228 248" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <path d="M 124 282 Q 180 266 228 280" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <path d="M 124 314 Q 180 298 228 312" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

          <path d="M 284 248 Q 332 234 388 250" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <path d="M 284 280 Q 332 266 388 282" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <path d="M 284 312 Q 332 298 388 314" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

          {/* Chama Verde da Educação */}
          <path
            d="M 256 106 C 230 146 216 176 226 212 C 235 192 248 182 256 174 C 264 182 277 192 286 212 C 296 176 282 146 256 106 Z"
            fill="url(#logoGreenGrad)"
          />

          {/* Chama Interna Dourada */}
          <path
            d="M 256 134 C 243 156 238 176 244 196 C 248 186 252 180 256 176 C 260 180 264 186 268 196 C 274 176 269 156 256 134 Z"
            fill="url(#logoGoldGrad)"
          />

          {/* Estrela Altaneira */}
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

      {/* Identificação Tipográfica */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            Educa Brasiléia
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mt-0.5">
            Núcleo de Educação • SEE-AC
          </span>
        </div>
      )}
    </div>
  );
}
