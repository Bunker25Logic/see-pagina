'use client';

import { useState } from 'react';
import Link from 'next/link';

const TABS = [
  { id: 'ensino',          label: 'Ensino' },
  { id: 'cultura_esporte', label: 'Cultura e Esporte' },
];

const STATUS_COLORS = {
  'Em andamento': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Previsto':     'bg-blue-50 text-blue-700 border-blue-200',
  'Urgente':      'bg-red-100 text-red-800 border-red-200',
  'Concluído':    'bg-slate-100 text-slate-600 border-slate-200',
};

/**
 * Formata data 'YYYY-MM-DD' para badge compacto: dia e mês abreviado
 */
function formatDateBadge(dateString) {
  if (!dateString) return { day: '--', month: '---' };
  const parts = dateString.split('-');
  if (parts.length < 3) return { day: '--', month: '---' };

  const day = parts[2];
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const month = months[monthIndex] || '---';

  return { day, month };
}

export default function CronogramasAside({ initialItems = [] }) {
  const [activeTab, setActiveTab] = useState('ensino');

  // Filtra itens pelo setor da aba ativa
  const currentItems = initialItems.filter(item => item.setor === activeTab);

  return (
    <aside
      className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl shadow-xs overflow-hidden flex flex-col transition-all duration-300"
      aria-label="Cronogramas Setoriais"
    >
      {/* ── Cabeçalho do Widget ── */}
      <div className="px-3.5 py-3 bg-surface-container-low dark:bg-surface-container border-b border-outline-variant/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary dark:text-amber-400 text-[20px] shrink-0" aria-hidden="true">
            calendar_clock
          </span>
          <h2 className="font-editorial text-[15px] sm:text-[16px] font-bold text-primary dark:text-slate-100 leading-none truncate">
            Cronogramas
          </h2>
        </div>
        <Link
          href="/cronogramas"
          className="text-[12px] font-semibold text-secondary dark:text-emerald-400 hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0"
        >
          <span>Ver todos</span>
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">arrow_forward</span>
        </Link>
      </div>

      {/* ── Abas de Navegação pelos Setores (2 Setores Ativos: Ensino, Cultura e Esporte) ── */}
      <div
        className="grid grid-cols-2 gap-1.5 p-2 bg-surface-container-lowest dark:bg-surface-container-low/40 border-b border-outline-variant/40"
        role="tablist"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = initialItems.filter(i => i.setor === tab.id).length;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center min-w-0 ${
                isActive
                  ? 'bg-primary dark:bg-amber-400 text-white dark:text-slate-900 shadow-2xs font-bold'
                  : 'text-on-surface-variant hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-on-surface'
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                    isActive
                      ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Lista de Eventos / Prazos da Aba Ativa ── */}
      <div className="p-3 flex flex-col divide-y divide-outline-variant/30 max-h-85 overflow-y-auto">
        {currentItems.length === 0 ? (
          <div className="py-6 text-center text-on-surface-variant/70 text-[13px]">
            Nenhum compromisso agendado para este setor no momento.
          </div>
        ) : (
          currentItems.map((item) => {
            const { day, month } = formatDateBadge(item.dataInicio);
            const statusClass =
              STATUS_COLORS[item.status] || 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-2.5">
                {/* Badge de Data com estilo folhinha */}
                <div className="shrink-0 w-11 h-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-center shadow-2xs">
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">
                    {month}
                  </span>
                  <span className="text-[16px] font-black text-primary dark:text-slate-100 leading-none mt-0.5">
                    {day}
                  </span>
                </div>

                {/* Conteúdo do Cronograma */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 ${statusClass}`}>
                      {item.status}
                    </span>
                    {item.local && (
                      <span className="text-[11px] text-on-surface-variant truncate flex items-center gap-0.5 min-w-0">
                        <span className="material-symbols-outlined text-[12px] shrink-0" aria-hidden="true">location_on</span>
                        <span className="truncate">{item.local}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-[13px] font-semibold text-on-surface leading-snug line-clamp-2 wrap-break-word">
                    {item.titulo}
                  </h3>

                  {item.descricao && (
                    <p className="text-[12px] text-on-surface-variant leading-normal line-clamp-2 wrap-break-word">
                      {item.descricao}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Rodapé Informativo ── */}
      <div className="p-2.5 bg-surface-container-low dark:bg-surface-container border-t border-outline-variant/30 text-center">
        <Link
          href="/cronogramas"
          className="text-[11px] font-semibold text-primary dark:text-amber-400 hover:text-secondary transition-colors inline-block leading-normal"
        >
          Consultar calendário letivo oficial completo →
        </Link>
      </div>
    </aside>
  );
}
