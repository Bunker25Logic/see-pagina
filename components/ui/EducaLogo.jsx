'use client';

import Image from 'next/image';
import { useId } from 'react';

/**
 * Brasão Oficial de Armas do Estado do Acre.
 * Renderiza fielmente o brasão histórico e oficial do Estado do Acre (Lei nº 1.170/1995):
 * - Resplendor dourado com a Estrela Vermelha Altaneira no ápice;
 * - Escudo ovalado com a Seringueira, o corte de látex, o leopardo e a cabana seringueira;
 * - Orlado pelos ramos de café frutificado e seringueira, atados pelo listel;
 * - Divisa oficial "NEC LVCEO PLVRIMVS" e datas históricas "6-8-1902" e "24-1-1903".
 */
export function AcreCoatOfArms({ size = 42, className = '' }) {
  const height = Math.round(size * (226 / 230));

  return (
    <div
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center ${className}`}
      style={{ width: size, height }}
    >
      <Image
        src="/brasao-acre.svg"
        alt="Brasão Oficial de Armas do Estado do Acre"
        width={size}
        height={height}
        className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.18)] select-none pointer-events-none"
        priority
      />
    </div>
  );
}

/**
 * Emblema Vetorial da Bandeira do Acre (mantido para compatibilidade).
 */
export function AcreFlagBadge({ size = 38, className = '' }) {
  const clipId = useId();
  const yellowId = useId();
  const greenId = useId();
  const starId = useId();
  const sheenId = useId();

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
        <clipPath id={clipId}>
          <rect x="0" y="0" width="54" height="40" rx="6" ry="6" />
        </clipPath>

        <linearGradient id={yellowId} x1="0%" y1="0%" x2="70%" y2="80%">
          <stop offset="0%" stopColor="#ffdc19" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <linearGradient id={greenId} x1="30%" y1="20%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00963f" />
          <stop offset="100%" stopColor="#005d25" />
        </linearGradient>

        <linearGradient id={starId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <polygon points="0,0 54,0 0,40" fill={`url(#${yellowId})`} />
        <polygon points="54,0 54,40 0,40" fill={`url(#${greenId})`} />

        <g transform="translate(16, 13)">
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

        <rect width="54" height="40" fill={`url(#${sheenId})`} />
      </g>

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
 * Apresenta o Brasão de Armas do Estado do Acre com a identificação institucional.
 *
 * @param {{ size?: number, showText?: boolean, className?: string, variant?: 'acre' | 'brasao' | 'flag' | 'eb', inverted?: boolean }} props
 */
export default function EducaLogo({
  size = 42,
  showText = true,
  className = '',
  variant = 'acre',
  inverted = false,
}) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant === 'flag' ? (
        /* Versão Bandeira do Acre */
        <AcreFlagBadge size={size} />
      ) : (
        /* Brasão Oficial do Estado do Acre (padrão) */
        <AcreCoatOfArms size={size} />
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
