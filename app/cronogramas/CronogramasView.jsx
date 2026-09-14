'use client';

import { useState } from 'react';

const STATUS_CONFIG = {
  'Em andamento': {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/50',
    icon: 'sync',
  },
  'Previsto': {
    bg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/50',
    icon: 'calendar_today',
  },
  'Urgente': {
    bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/50',
    icon: 'priority_high',
  },
  'Concluído': {
    bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    icon: 'check_circle',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function CronogramasView({ cronogramas = [], sectors = [] }) {
  const [selectedSector, setSelectedSector] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = cronogramas.filter((item) => {
    const matchesSector = selectedSector === 'all' || item.setor === selectedSector;
    const matchesSearch =
      !search.trim() ||
      item.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      item.local?.toLowerCase().includes(search.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* ── Barra de Filtros e Busca ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Pílulas de Setor */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSector('all')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedSector === 'all'
                ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Todos ({cronogramas.length})
          </button>
          {sectors.map((sec) => {
            const count = cronogramas.filter((c) => c.setor === sec.id).length;
            const isSelected = selectedSector === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{sec.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Input de Busca Rápida */}
        <div className="relative md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por palavra..."
            className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-[#163c54] dark:focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* ── Listagem em Grid de Cards ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <span className="material-symbols-outlined text-[36px] text-slate-400 dark:text-slate-600 mb-2">
            event_busy
          </span>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">
            Nenhum cronograma encontrado para o filtro selecionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const sectorMeta = sectors.find((s) => s.id === item.setor);
            const statusConfig =
              STATUS_CONFIG[item.status] || {
                bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                icon: 'info',
              };

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                      {sectorMeta?.label || item.setor}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${statusConfig.bg}`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {statusConfig.icon}
                      </span>
                      {item.status}
                    </span>
                  </div>

                  <h2 className="font-editorial text-[18px] text-slate-900 dark:text-slate-100 font-bold mb-2 leading-snug">
                    {item.titulo}
                  </h2>

                  {item.descricao && (
                    <p className="text-slate-600 dark:text-slate-400 text-[14px] leading-relaxed mb-4">
                      {item.descricao}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">
                      calendar_month
                    </span>
                    <span>
                      {formatDate(item.dataInicio)}
                      {item.dataFim && item.dataFim !== item.dataInicio && (
                        <span> até {formatDate(item.dataFim)}</span>
                      )}
                    </span>
                  </div>

                  {item.local && (
                    <div className="flex items-center gap-1 truncate max-w-48 text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">
                        location_on
                      </span>
                      <span className="truncate">{item.local}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
