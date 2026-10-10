'use client';

import { useEffect } from 'react';

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

const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const MONTHS_FULL = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function formatDateExtenso(dateStr) {
  if (!dateStr) return '';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Cria objeto Date no horário local
  const dateObj = new Date(year, month - 1, day);
  const weekdayName = WEEKDAYS[dateObj.getDay()] || '';
  const monthName = MONTHS_FULL[month - 1] || '';

  return {
    weekday: weekdayName,
    formatted: `${day} de ${monthName} de ${year}`,
    short: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
  };
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function CronogramasDateModal({
  isOpen,
  onClose,
  dateKey,
  cronogramas = [],
  sectors = [],
}) {
  // Fecha modal com ESC e bloqueia scroll de fundo
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dateInfo = formatDateExtenso(dateKey);
  const count = cronogramas.length;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-date-title"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Cabeçalho do Modal ── */}
        <div className="bg-[#0f2938] text-white p-5 flex items-start justify-between gap-4 border-b border-slate-700/50">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-amber-400">
              <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {dateInfo.weekday}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
                <span className="text-[12px] text-slate-300 font-medium">
                  {dateInfo.short}
                </span>
              </div>
              <h2
                id="modal-date-title"
                className="font-editorial text-[20px] sm:text-[22px] font-bold text-white leading-tight"
              >
                {dateInfo.formatted}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ── Sub-barra Informativa ── */}
        <div className="bg-slate-50 dark:bg-slate-950/60 px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[13px]">
          <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#163c54] dark:text-emerald-400">
              event_note
            </span>
            <span>
              {count === 0
                ? 'Nenhum cronograma registrado'
                : count === 1
                ? '1 cronograma programado para esta data'
                : `${count} cronogramas programados para esta data`}
            </span>
          </span>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            SEE-AC • Brasiléia
          </span>
        </div>

        {/* ── Corpo: Lista de Cronogramas ── */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {count === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <span className="material-symbols-outlined text-[40px] text-slate-400 dark:text-slate-500 mb-2">
                event_available
              </span>
              <h3 className="font-editorial text-[16px] text-slate-800 dark:text-slate-200 font-bold mb-1">
                Sem eventos marcados
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Não há cronogramas ou atividades específicas agendadas para o dia {dateInfo.short}.
              </p>
            </div>
          ) : (
            cronogramas.map((item) => {
              const sectorMeta = sectors.find((s) => s.id === item.setor);
              const statusCfg =
                STATUS_CONFIG[item.status] || {
                  bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                  icon: 'info',
                };

              const isStartDay = item.dataInicio === dateKey;
              const isEndDay = item.dataFim === dateKey;
              const isSingleDay = item.dataInicio === (item.dataFim || item.dataInicio);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col gap-3"
                >
                  {/* Topo do Card */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.8 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                        {sectorMeta?.label || item.setor}
                      </span>
                      {isSingleDay ? (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                          Evento de 1 dia
                        </span>
                      ) : isStartDay ? (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50">
                          Início hoje
                        </span>
                      ) : isEndDay ? (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/50">
                          Término hoje
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/50">
                          Em andamento
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${statusCfg.bg}`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {statusCfg.icon}
                      </span>
                      {item.status}
                    </span>
                  </div>

                  {/* Título e Descrição */}
                  <div>
                    <h3 className="font-editorial text-[17px] text-slate-900 dark:text-slate-100 font-bold mb-1.5 leading-snug">
                      {item.titulo}
                    </h3>
                    {item.descricao && (
                      <p className="text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.descricao}
                      </p>
                    )}
                  </div>

                  {/* Informações detalhadas */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12.5px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400 shrink-0">
                        date_range
                      </span>
                      <span>
                        Período: <strong>{formatDateShort(item.dataInicio)}</strong>
                        {item.dataFim && item.dataFim !== item.dataInicio && (
                          <span> até <strong>{formatDateShort(item.dataFim)}</strong></span>
                        )}
                      </span>
                    </div>

                    {item.local && (
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 shrink-0">
                          location_on
                        </span>
                        <span>{item.local}</span>
                      </div>
                    )}
                  </div>

                  {item.author && (
                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-200/70 dark:border-slate-800">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        person
                      </span>
                      <span>
                        Responsável: <strong className="text-slate-700 dark:text-slate-300">{item.author}</strong>
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Rodapé do Modal ── */}
        <div className="bg-slate-50 dark:bg-slate-950/80 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Dica: você também pode consultar a listagem geral abaixo.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0f2938] hover:bg-[#163c54] text-white text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
