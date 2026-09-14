'use client';

import { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import { DateDisplay } from './DateTimeClock';
import HeaderSearch from './HeaderSearch';
import MensagemDiaModal from './MensagemDiaModal';

/**
 * TopBar — Barra superior institucional do Portal Educa Brasiléia.
 *
 * Layout:
 * - Lado Esquerdo: Previsão do Tempo de Brasiléia + Data Oficial do Acre coladinha.
 * - Lado Direito: Lupa de Busca Animada + Ícone da Mensagem do Dia no canto.
 */
export default function TopBar({ mensagem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const preview =
    mensagem?.mensagem ||
    'Acompanhe as diretrizes, notícias e comunicados oficiais da rede estadual de ensino.';

  return (
    <>
      <div
        className="w-full bg-[#163c54] text-slate-100 border-b border-[#245373] relative z-40"
        role="region"
        aria-label="Barra informativa superior"
      >
        <div className="max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-1.5 flex items-center justify-between gap-3 min-w-0">

          {/* ── LADO ESQUERDO: Previsão do Tempo + Data perfeitamente alinhadas lado a lado ── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Previsão do Tempo de Brasiléia */}
            <div className="shrink-0">
              <WeatherWidget />
            </div>

            {/* Separador sutil tipo bullet */}
            <span className="text-slate-400/60 text-[11px] select-none shrink-0" aria-hidden="true">•</span>

            {/* Data oficial de Brasiléia (Acre) coladinha na Previsão */}
            <DateDisplay />
          </div>

          {/* ── LADO DIREITO: Lupa de Busca Animada + Ícone de Mensagem do Dia no Canto ── */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
            {/* Lupa de Busca de Notícias */}
            <HeaderSearch />

            {/* Separador vertical sutil */}
            <span className="w-px h-3.5 bg-white/20 shrink-0" aria-hidden="true" />

            {/* Ícone de Mensagem do Dia no canto direito */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-amber-400/15 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 hover:border-amber-400 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer shrink-0"
              title={`Mensagem do Dia: ${preview.slice(0, 60)}... (clique para abrir)`}
              aria-label="Abrir Mensagem do Dia"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[17px] text-amber-400 group-hover:scale-110 transition-transform">
                chat
              </span>

              {/* Ponto de notificação pulsante */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-400" />
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Modal com a Mensagem do Dia Completa */}
      <MensagemDiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mensagem={mensagem}
      />
    </>
  );
}
