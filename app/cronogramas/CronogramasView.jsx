'use client';

import { useState } from 'react';
import CronogramasCalendar from '@/components/cronogramas/CronogramasCalendar';
import CronogramasDateModal from '@/components/cronogramas/CronogramasDateModal';

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
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const [selectedSector, setSelectedSector] = useState('all');
  const [search, setSearch] = useState('');

  // Estado do Modal de Cronogramas por Data
  const [modalState, setModalState] = useState({
    isOpen: false,
    dateKey: '',
    events: [],
  });

  // Filtra cronogramas conforme setor e termo de busca
  const filtered = cronogramas.filter((item) => {
    const matchesSector = selectedSector === 'all' || item.setor === selectedSector;
    const matchesSearch =
      !search.trim() ||
      item.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      item.local?.toLowerCase().includes(search.toLowerCase()) ||
      item.author?.toLowerCase().includes(search.toLowerCase());
    return matchesSector && matchesSearch;
  });

  // Abre modal ao clicar em uma data do calendário ou em um card
  function handleSelectDate(dateKey, events = []) {
    // Se não foram passados eventos explicitamente (ex: clique via card), filtra os eventos que caem na data
    const dayEvents =
      events.length > 0
        ? events
        : cronogramas.filter((c) => {
            const start = c.dataInicio;
            const end = c.dataFim || c.dataInicio;
            return dateKey >= start && dateKey <= end;
          });

    setModalState({
      isOpen: true,
      dateKey,
      events: dayEvents,
    });
  }

  function handleCloseModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Barra Superior: Alternador de Visualização e Controles ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-slate-900 p-1.5 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Abas de Modo de Visualização */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 sm:p-1 rounded-xl">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-[#163c54] dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">calendar_month</span>
            <span>Calendário</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-[#163c54] dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">view_agenda</span>
            <span>Lista</span>
            <span className="text-[10px] sm:text-[11px] px-1.2 py-0.1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold ml-0.5">
              {filtered.length}
            </span>
          </button>
        </div>

        {/* Indicador de Status Geral */}
        <div className="hidden lg:flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400 px-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Atualizado em tempo real com a rede escolar de Brasiléia</span>
        </div>
      </div>

      {/* ── Barra de Filtros e Busca Rápida ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Pílulas de Setor */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-styled pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSector('all')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[12px] sm:text-[12.5px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[12px] sm:text-[12.5px] font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{sec.label}</span>
                <span
                  className={`text-[10px] px-1.2 py-0.1 rounded-full font-bold ${
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
        <div className="relative md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por título, local ou autor..."
            className="w-full pl-9 pr-8 py-1.5 text-[13px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-[#163c54] dark:focus:border-emerald-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Limpar busca"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Conteúdo Principal Conforme Modo de Visualização ── */}
      {viewMode === 'calendar' ? (
        <div className="flex flex-col gap-5">
          {/* Calendário Interativo */}
          <CronogramasCalendar
            cronogramas={filtered}
            sectors={sectors}
            onSelectDate={handleSelectDate}
          />

          {/* Seção Complementar: Próximos Cronogramas Filtrados (Compacta) */}
          <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div>
                <h3 className="font-editorial text-[16.5px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100">
                  Compromissos Cadastrados
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Clique no card ou no calendário para abrir os detalhes da data.
                </p>
              </div>
              <button
                onClick={() => setViewMode('list')}
                className="text-[12px] font-semibold text-[#163c54] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Ver lista completa</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <span className="material-symbols-outlined text-[36px] text-slate-400 mb-2">
                  event_busy
                </span>
                <p className="text-[14px] text-slate-600 dark:text-slate-400">
                  Nenhum cronograma corresponde ao filtro aplicado.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                            {sectorMeta?.label || item.setor}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full border inline-flex items-center gap-0.5 ${statusConfig.bg}`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {statusConfig.icon}
                            </span>
                            {item.status}
                          </span>
                        </div>

                        <h4 className="font-editorial text-[15px] font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug line-clamp-2">
                          {item.titulo}
                        </h4>

                        {item.descricao && (
                          <p className="text-slate-600 dark:text-slate-400 text-[12.5px] leading-relaxed mb-3 line-clamp-2">
                            {item.descricao}
                          </p>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11.5px]">
                        <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">
                            event
                          </span>
                          <span>{formatDate(item.dataInicio)}</span>
                        </span>

                        <button
                          onClick={() => handleSelectDate(item.dataInicio)}
                          className="text-[#163c54] dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Abrir modal</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Listagem em Grid de Cards Tradicional ── */
        <div>
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
                        <p className="text-slate-600 dark:text-slate-400 text-[14px] leading-relaxed mb-3">
                          {item.descricao}
                        </p>
                      )}

                      {item.author && (
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-600 dark:text-slate-300 mb-3.5 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 w-fit">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-emerald-400">
                            badge
                          </span>
                          <span>
                            Publicado por:{' '}
                            <strong className="font-semibold text-slate-900 dark:text-slate-100">
                              {item.author}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleSelectDate(item.dataInicio)}
                        className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Ver cronogramas desta data"
                      >
                        <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500">
                          calendar_month
                        </span>
                        <span>
                          {formatDate(item.dataInicio)}
                          {item.dataFim && item.dataFim !== item.dataInicio && (
                            <span> até {formatDate(item.dataFim)}</span>
                          )}
                        </span>
                        <span className="material-symbols-outlined text-[14px] ml-0.5 opacity-70">
                          open_in_new
                        </span>
                      </button>

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
      )}

      {/* ── Modal da Data Selecionada ── */}
      <CronogramasDateModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        dateKey={modalState.dateKey}
        cronogramas={modalState.events}
        sectors={sectors}
      />
    </div>
  );
}
