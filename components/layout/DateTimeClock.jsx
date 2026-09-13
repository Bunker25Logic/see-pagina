'use client';

import { useSyncExternalStore } from 'react';

/**
 * Modern React 19 External Store para Data e Relógio Oficial de Brasiléia (Acre).
 * Fuso horário oficial do Acre: America/Rio_Branco (UTC-5).
 */

const TIMEZONE = 'America/Rio_Branco';

function subscribe(callback) {
  const timer = setInterval(callback, 10000);
  return () => clearInterval(timer);
}

function getSnapshot() {
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
  }).format(now).replace('.', '').toUpperCase();

  const monthFull = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    month: 'long',
  }).format(now);

  return JSON.stringify({
    weekday,
    desktopDate: `${day} de ${monthFull}`,
    mobileDate: `${day} ${monthShort}`,
    time,
  });
}

function getServerSnapshot() {
  return JSON.stringify({
    weekday: 'Dom',
    desktopDate: '13 de setembro',
    mobileDate: '13 SET',
    time: '18:50',
  });
}

export default function DateTimeClock() {
  const rawData = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const data = JSON.parse(rawData);

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2.5 text-slate-200 select-none shrink-0"
      title="Horário oficial local de Brasiléia - Acre (Fuso UTC-5)"
    >
      {/* Data (completa no desktop, compacta no mobile) */}
      <span className="hidden md:inline text-[12px] font-medium text-slate-300">
        <span className="text-slate-400">{data.weekday}, </span>
        {data.desktopDate}
      </span>

      <span className="md:hidden text-[11px] font-semibold text-slate-300 tracking-tight">
        {data.mobileDate}
      </span>

      {/* Relógio Digital Elegante e Apresentável com Horário do Acre */}
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#163a4e]/90 border border-[#2d5d78] text-amber-300 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-mono text-[12px] sm:text-[13px] font-bold tracking-wider tabular-nums leading-none">
          {data.time}
        </span>
      </div>
    </div>
  );
}
