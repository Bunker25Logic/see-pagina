'use client';

import { useState, useMemo } from 'react';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Cria chave de data 'YYYY-MM-DD'
 */
function makeDateKey(year, month, day) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/**
 * Extrai chave de mês 'YYYY-MM'
 */
function getMonthKey(year, month) {
  return `${year}-${pad2(month)}`;
}

export default function CronogramasCalendar({
  cronogramas = [],
  sectors = [],
  onSelectDate,
}) {
  // Pega data atual do sistema para inicializar o calendário
  const today = useMemo(() => {
    const d = new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1, // 1-12
      day: d.getDate(),
      dateKey: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    };
  }, []);

  // Determina mês inicial: se há cronogramas no mês atual, usa hoje; senão usa o mês do primeiro cronograma mais relevante
  const initialMonth = useMemo(() => {
    if (cronogramas.length > 0) {
      // Se houver cronograma no mês atual, fica nele
      const currentMonthKey = getMonthKey(today.year, today.month);
      const hasInCurrent = cronogramas.some((c) => {
        const start = c.dataInicio || '';
        const end = c.dataFim || start;
        return (
          start.startsWith(currentMonthKey) ||
          end.startsWith(currentMonthKey) ||
          (start <= currentMonthKey + '-31' && end >= currentMonthKey + '-01')
        );
      });
      if (hasInCurrent) {
        return { year: today.year, month: today.month };
      }

      // Senão pega o primeiro cronograma disponível
      const firstDate = cronogramas[0]?.dataInicio;
      if (firstDate) {
        const [y, m] = firstDate.split('-').map(Number);
        return { year: y, month: m };
      }
    }
    return { year: today.year, month: today.month };
  }, [cronogramas, today]);

  const [currentYear, setCurrentYear] = useState(initialMonth.year);
  const [currentMonth, setCurrentMonth] = useState(initialMonth.month); // 1-12

  // Lista de meses recentes/disponíveis onde há cronogramas cadastrados
  const monthsWithEvents = useMemo(() => {
    const map = new Map();
    for (const c of cronogramas) {
      if (!c.dataInicio) continue;
      const [y, m] = c.dataInicio.split('-').map(Number);
      const key = `${y}-${pad2(m)}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          year: y,
          month: m,
          label: `${MONTH_NAMES[m - 1]} ${y}`,
          count: 0,
        });
      }
      map.get(key).count += 1;
    }

    // Garante que o mês de "hoje" também esteja disponível se não estiver na lista
    const todayKey = `${today.year}-${pad2(today.month)}`;
    if (!map.has(todayKey)) {
      map.set(todayKey, {
        key: todayKey,
        year: today.year,
        month: today.month,
        label: `${MONTH_NAMES[today.month - 1]} ${today.year}`,
        count: 0,
      });
    }

    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [cronogramas, today]);

  // Navegação
  function handlePrevMonth() {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function handleGoToToday() {
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
  }

  // Gera as células da grade do mês
  const calendarCells = useMemo(() => {
    // Primeiro dia da semana do mês (0 = Dom, 1 = Seg, ..., 6 = Sáb)
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    // Total de dias no mês atual
    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
    // Total de dias no mês anterior
    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

    const cells = [];

    // Preenchimento do mês anterior
    const prevMonthVal = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYearVal = currentMonth === 1 ? currentYear - 1 : currentYear;
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateKey = makeDateKey(prevYearVal, prevMonthVal, day);
      cells.push({
        day,
        month: prevMonthVal,
        year: prevYearVal,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === today.dateKey,
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateKey = makeDateKey(currentYear, currentMonth, day);
      cells.push({
        day,
        month: currentMonth,
        year: currentYear,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === today.dateKey,
      });
    }

    // Preenchimento do próximo mês para completar semanas cheias (múltiplo de 7)
    const nextMonthVal = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYearVal = currentMonth === 12 ? currentYear + 1 : currentYear;
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const dateKey = makeDateKey(nextYearVal, nextMonthVal, day);
      cells.push({
        day,
        month: nextMonthVal,
        year: nextYearVal,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === today.dateKey,
      });
    }

    return cells;
  }, [currentYear, currentMonth, today.dateKey]);

  // Mapeia eventos para cada célula da grade
  const cellsWithEvents = useMemo(() => {
    return calendarCells.map((cell) => {
      const events = cronogramas.filter((item) => {
        const start = item.dataInicio;
        const end = item.dataFim || item.dataInicio;
        return cell.dateKey >= start && cell.dateKey <= end;
      });

      return {
        ...cell,
        events,
        hasEvents: events.length > 0,
      };
    });
  }, [calendarCells, cronogramas]);

  // Total de eventos no mês visível
  const totalEventsInMonth = useMemo(() => {
    const monthKey = getMonthKey(currentYear, currentMonth);
    return cronogramas.filter((c) => {
      const start = c.dataInicio || '';
      const end = c.dataFim || start;
      return (
        start.startsWith(monthKey) ||
        end.startsWith(monthKey) ||
        (start <= monthKey + '-31' && end >= monthKey + '-01')
      );
    }).length;
  }, [cronogramas, currentYear, currentMonth]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all max-w-4xl mx-auto w-full">
      {/* ── Topo do Calendário: Navegação e Meses Recentes (Compacto) ── */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col gap-2.5">
        {/* Barra de Título e Botões de Controle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#163c54] dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-[16.5px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-none">
                  {MONTH_NAMES[currentMonth - 1]} de {currentYear}
                </h2>
                {totalEventsInMonth > 0 && (
                  <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    {totalEventsInMonth} {totalEventsInMonth === 1 ? 'atividade' : 'atividades'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Clique nas datas marcadas para ver os detalhes
              </p>
            </div>
          </div>

          {/* Botões de Navegação */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={handleGoToToday}
              className="px-2.5 py-1 rounded-md text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
              title="Ir para o mês atual"
            >
              <span className="material-symbols-outlined text-[14px]">today</span>
              <span>Hoje</span>
            </button>

            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-800">
              <button
                onClick={handlePrevMonth}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Mês anterior"
                title="Mês anterior"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700" />
              <button
                onClick={handleNextMonth}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Próximo mês"
                title="Próximo mês"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Pílulas de Atalho para Meses Recentes ── */}
        {monthsWithEvents.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-styled pt-0.5 pb-1">
            <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-0.5 shrink-0">
              <span className="material-symbols-outlined text-[13px]">history</span>
              Meses:
            </span>
            {monthsWithEvents.map((item) => {
              const isSelected = item.year === currentYear && item.month === currentMonth;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentYear(item.year);
                    setCurrentMonth(item.month);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span
                      className={`text-[9.5px] px-1.2 py-0.1 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Grade do Calendário (Compacta & Charmosa) ── */}
      <div className="p-2.5 sm:p-3.5">
        {/* Cabeçalho dos Dias da Semana */}
        <div className="grid grid-cols-7 mb-1 text-center">
          {WEEKDAY_NAMES_SHORT.map((dayName, idx) => {
            const isWeekend = idx === 0 || idx === 6;
            return (
              <div
                key={dayName}
                className={`text-[10.5px] font-bold uppercase tracking-wider py-1 ${
                  isWeekend
                    ? 'text-rose-500/80 dark:text-rose-400/80'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {dayName}
              </div>
            );
          })}
        </div>

        {/* Células dos Dias */}
        <div className="grid grid-cols-7 gap-1">
          {cellsWithEvents.map((cell) => {
            const { day, isCurrentMonth, isToday, hasEvents, events, dateKey } = cell;

            // Determina classes visuais da célula
            let containerBg = 'bg-slate-50/40 dark:bg-slate-800/20';
            let borderColor = 'border-slate-200/50 dark:border-slate-800/50';
            let textColor = isCurrentMonth
              ? 'text-slate-800 dark:text-slate-200'
              : 'text-slate-400 dark:text-slate-600';

            if (hasEvents) {
              containerBg =
                'bg-emerald-50/60 dark:bg-emerald-950/25 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40';
              borderColor =
                'border-emerald-300/80 dark:border-emerald-800/80 hover:border-emerald-400';
            } else if (isCurrentMonth) {
              containerBg = 'bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800';
              borderColor = 'border-slate-200/80 dark:border-slate-700/60';
            }

            // Identifica se há eventos de diferentes setores para colorir os pontos de notificação
            const hasEnsino = events.some((e) => e.setor === 'ensino');
            const hasCultura = events.some((e) => e.setor === 'cultura_esporte');
            const hasUrgent = events.some((e) => e.status === 'Urgente');
            const hasActive = events.some((e) => e.status === 'Em andamento');

            return (
              <button
                key={dateKey}
                onClick={() => onSelectDate?.(dateKey, events)}
                className={`relative group rounded-lg p-1 sm:p-1.5 border ${containerBg} ${borderColor} min-h-[44px] sm:min-h-[50px] flex flex-col items-center justify-between transition-all duration-200 text-center cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 ${
                  isToday ? 'ring-1.5 ring-[#163c54] dark:ring-emerald-500 font-bold' : ''
                } ${hasEvents ? 'shadow-2xs hover:shadow-xs hover:-translate-y-0.5' : ''}`}
                aria-label={`${day} de ${MONTH_NAMES[cell.month - 1]} de ${cell.year}${
                  hasEvents ? `, ${events.length} cronogramas cadastrados` : ''
                }`}
              >
                {/* Número do Dia */}
                <div className="flex items-center justify-center w-full">
                  <span
                    className={`inline-flex items-center justify-center w-5.5 h-5.5 rounded-full text-[11.5px] sm:text-[12px] font-semibold leading-none ${
                      isToday
                        ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs font-bold'
                        : textColor
                    }`}
                  >
                    {day}
                  </span>
                </div>

                {/* ── Pontos de Notificação & Indicadores Discretos ── */}
                <div className="w-full flex items-center justify-center gap-1 h-3">
                  {hasEvents && (
                    <div className="flex items-center gap-1">
                      {hasEnsino && (
                        <span
                          className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2"
                          title="Coordenação de Ensino"
                        >
                          {hasActive && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          )}
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
                        </span>
                      )}
                      {hasCultura && (
                        <span
                          className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2"
                          title="Cultura e Esporte"
                        >
                          {hasActive && !hasEnsino && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                          )}
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500" />
                        </span>
                      )}
                      {hasUrgent && (
                        <span
                          className="inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-rose-500"
                          title="Atenção/Urgente"
                        />
                      )}
                      {events.length > 2 && (
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-none">
                          +{events.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tooltip Hover no Desktop */}
                {hasEvents && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 w-48 p-2 bg-slate-900 text-white text-[10.5px] rounded-lg shadow-xl border border-slate-700 animate-in fade-in duration-150 text-left">
                    <div className="font-bold text-emerald-400 mb-1 leading-tight">
                      {day} de {MONTH_NAMES[cell.month - 1]}:
                    </div>
                    <ul className="space-y-1">
                      {events.map((e) => (
                        <li key={e.id} className="line-clamp-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="truncate">{e.titulo}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1 pt-1 border-t border-slate-800 text-[9.5px] text-slate-400 text-center">
                      Clique para ver detalhes
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Rodapé do Calendário: Legenda Enxuta ── */}
      <div className="px-3 py-2 sm:py-2.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
        {/* Legenda de Notificação */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-slate-600 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Legenda:
          </span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Ensino</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>Cultura e Esporte</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Em andamento</span>
          </div>
        </div>

        {/* Dica de Ação */}
        <div className="text-slate-500 dark:text-slate-400 text-[10.5px] flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-emerald-600 dark:text-emerald-400">
            touch_app
          </span>
          <span>Clique em uma data marcada para abrir</span>
        </div>
      </div>
    </div>
  );
}
