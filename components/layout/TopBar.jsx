'use client';

import { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import DateTimeClock from './DateTimeClock';
import MensagemDiaModal from './MensagemDiaModal';

/**
 * TopBar — Barra superior institucional do Portal Educa Brasiléia.
 *
 * Contém:
 * 1. Previsão do tempo de Brasiléia-AC com SVGs animados.
 * 2. Botão de Ícone de Mensagem (compacto, sem texto que ocupe todo o cabeçalho).
 * 3. Relógio digital elegante e apresentável, sem cortes em qualquer tela.
 */
export default function TopBar({ mensagem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const preview =
    mensagem?.mensagem ||
    'Hoje é dia de Conselho de Classe nas escolas da rede — resultados publicados até sexta-feira, 18/09.';

  return (
    <>
      <div
        className="w-full bg-[#163c54] text-slate-100 border-b border-[#245373] relative z-40"
        role="region"
        aria-label="Barra informativa superior"
      >
        <div className="max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-1.5 flex items-center justify-between gap-2 min-w-0">

          {/* ── Lado Esquerdo: Clima de Brasiléia ── */}
          <div className="flex items-center gap-2.5 shrink-0">
            <WeatherWidget />
          </div>

          {/* ── Centro: Ícone de Mensagem do Dia (Apenas o Ícone com Badge Pulsante) ── */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/15 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 hover:border-amber-400 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
              title={`Mensagem do Dia: ${preview.slice(0, 60)}... (clique para abrir)`}
              aria-label="Abrir Mensagem do Dia"
            >
              <span className="material-symbols-outlined text-[17px] text-amber-400 group-hover:scale-110 transition-transform">
                chat
              </span>

              {/* Ponto de notificação pulsante */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
            </button>
          </div>

          {/* ── Lado Direito: Relógio e Data Apresentáveis ── */}
          <div className="flex items-center justify-end shrink-0">
            <DateTimeClock />
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
