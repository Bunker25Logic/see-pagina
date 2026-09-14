'use client';

import { useState, useEffect } from 'react';

/**
 * Data e Relógio Oficial de Brasiléia (Acre).
 * Fuso horário oficial do Acre: America/Rio_Branco (UTC-5).
 * Utiliza useState + useEffect com fallback previsível para evitar erros de hidratação (SSR vs Client).
 */

const TIMEZONE = 'America/Rio_Branco';

function getTimeData() {
  const now = new Date();

  // Fuso horário oficial de Brasiléia - Acre (UTC-5)
  const time = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  const rawWeekday = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    weekday: 'short',
  }).format(now).replace('.', '');
  const weekday = rawWeekday.charAt(0).toUpperCase() + rawWeekday.slice(1);

  const day = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    day: 'numeric',
  }).format(now);

  const monthShort = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    month: 'short',
  }).format(now).replace('.', '').toLowerCase();

  const monthFull = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    month: 'long',
  }).format(now);

  const year = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    year: 'numeric',
  }).format(now);

  return {
    weekday,
    desktopDate: `${day} de ${monthFull} de ${year}`,
    mobileDate: `${day} ${monthShort} ${year}`,
    time,
  };
}

export function useAcreDateTime() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const update = () => {
      setData(getTimeData());
    };

    const initialTimer = setTimeout(update, 0);
    const intervalTimer = setInterval(update, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return data;
}

/**
 * DateDisplay — Componente focado exclusivamente na data oficial local do Acre.
 * Posicionado ao lado da previsão do tempo na TopBar com o ano sempre presente.
 */
export function DateDisplay() {
  const data = useAcreDateTime();

  return (
    <div
      className="inline-flex items-center text-slate-200 select-none whitespace-nowrap shrink-0"
      title="Data oficial de Brasiléia - Acre"
      suppressHydrationWarning
    >
      {/* Desktop: Dia da semana + Data completa com ano */}
      <span className="hidden md:inline text-[12px] font-medium text-slate-200/95" suppressHydrationWarning>
        {data ? (
          <>
            <span className="text-slate-300 font-semibold">{data.weekday}, </span>
            <span>{data.desktopDate}</span>
          </>
        ) : (
          <span className="text-slate-400 opacity-60">Carregando...</span>
        )}
      </span>

      {/* Mobile: Formato enxuto com ano garantido */}
      <span className="md:hidden text-[11px] font-medium text-slate-200/90 tracking-tight" suppressHydrationWarning>
        {data ? `${data.weekday}, ${data.mobileDate}` : '-- --- ----'}
      </span>
    </div>
  );
}

/**
 * TimeClock — Relógio digital oficial do Acre.
 * Proporção compacta, elegante e equilibrada com ícone contemporâneo.
 */
export function TimeClock() {
  const data = useAcreDateTime();

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#0c2436] border border-amber-400/35 hover:border-amber-400/50 transition-all text-amber-300 shadow-2xs select-none shrink-0"
      title="Horário oficial local de Brasiléia - Acre (Fuso UTC-5)"
      suppressHydrationWarning
    >
      <span
        className="material-symbols-outlined text-[14px] sm:text-[15px] text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)] shrink-0"
        aria-hidden="true"
      >
        schedule
      </span>
      <span
        className="font-mono text-[12px] sm:text-[13px] font-bold tracking-wider tabular-nums leading-none text-center text-amber-300"
        suppressHydrationWarning
      >
        {data ? data.time : '--:--'}
      </span>
    </div>
  );
}

/**
 * Default export mantido para compatibilidade.
 */
export default function DateTimeClock({ variant = 'both' }) {
  if (variant === 'date') return <DateDisplay />;
  if (variant === 'clock') return <TimeClock />;

  return (
    <div className="inline-flex items-center gap-2.5">
      <DateDisplay />
      <TimeClock />
    </div>
  );
}
