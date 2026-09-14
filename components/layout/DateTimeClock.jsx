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

export default function DateTimeClock() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const update = () => {
      setData(getTimeData());
    };

    // Agenda a primeira atualização do cliente de forma assíncrona evitando cascading render síncrono
    const initialTimer = setTimeout(update, 0);
    const intervalTimer = setInterval(update, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2.5 text-slate-200 select-none shrink-0"
      title="Horário oficial local de Brasiléia - Acre (Fuso UTC-5)"
      suppressHydrationWarning
    >
      {/* Data (completa no desktop, compacta no mobile) */}
      <span className="hidden md:inline text-[12px] font-medium text-slate-300" suppressHydrationWarning>
        {data ? (
          <>
            <span className="text-slate-400">{data.weekday}, </span>
            {data.desktopDate}
          </>
        ) : (
          <span className="text-slate-400 opacity-60">Carregando...</span>
        )}
      </span>

      <span className="md:hidden text-[11px] font-semibold text-slate-300 tracking-tight" suppressHydrationWarning>
        {data ? data.mobileDate : '-- --- ----'}
      </span>

      {/* Relógio Digital Elegante e Apresentável com Horário do Acre */}
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#0f2c3f]/90 border border-[#255779] text-amber-300 shadow-xs">
        <span
          className={`w-1.5 h-1.5 rounded-full ${data ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400/40'} shrink-0`}
        />
        <span
          className="font-mono text-[12px] sm:text-[13px] font-bold tracking-wider tabular-nums leading-none min-w-8.5 text-center"
          suppressHydrationWarning
        >
          {data ? data.time : '--:--'}
        </span>
      </div>
    </div>
  );
}

