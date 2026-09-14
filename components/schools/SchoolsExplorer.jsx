'use client';

import { useState, useMemo } from 'react';
import SchoolCard from '@/components/schools/SchoolCard';

export default function SchoolsExplorer({ schools = [] }) {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'fundamental-medio' | 'fundamental'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'students-desc' | 'students-asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Métricas agregadas
  const totalStudents = useMemo(
    () => schools.reduce((acc, s) => acc + (Number(s.studentCount) || 0), 0),
    [schools]
  );

  // Contagem por modalidade de ensino
  const fundamentalMedioCount = useMemo(
    () => schools.filter((s) => s.type?.toLowerCase().includes('médio')).length,
    [schools]
  );

  const fundamentalCount = useMemo(
    () => schools.filter((s) => !s.type?.toLowerCase().includes('médio')).length,
    [schools]
  );

  // Filtragem e ordenação fluida
  const filteredSchools = useMemo(() => {
    return schools
      .filter((school) => {
        // Filtro por modalidade de ensino
        if (selectedLevel === 'fundamental-medio' && !school.type?.toLowerCase().includes('médio')) {
          return false;
        }
        if (selectedLevel === 'fundamental' && school.type?.toLowerCase().includes('médio')) {
          return false;
        }

        // Busca por texto livre (nome, diretor, endereço)
        const query = search.toLowerCase().trim();
        if (!query) return true;

        const matchesQuery =
          school.name?.toLowerCase().includes(query) ||
          school.principal?.toLowerCase().includes(query) ||
          school.shortName?.toLowerCase().includes(query) ||
          school.address?.toLowerCase().includes(query);

        return matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'students-desc') return (b.studentCount || 0) - (a.studentCount || 0);
        if (sortBy === 'students-asc') return (a.studentCount || 0) - (b.studentCount || 0);
        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }, [schools, search, selectedLevel, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      {/* ── MOSAICO INSTITUCIONAL DE INDICADORES (METRICS SHOWCASE) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {/* Card 1: Unidades */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-label-caps">
                Polos de Ensino
              </span>
              <span className="font-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 leading-none">
                {schools.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Unidades estaduais em Brasiléia
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Alunos */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-label-caps">
                Matrículas Ativas
              </span>
              <span className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#163c54] dark:text-sky-400 mt-1 leading-none">
                {totalStudents.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Estudantes atendidos na rede
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Atendimento Direto */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-label-caps">
                Comunicação Direta
              </span>
              <span className="font-editorial text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 leading-none">
                100%
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Canais oficiais de WhatsApp
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── BARRA DE CONTROLE: SEGMENTAÇÃO, BUSCA E ORDENAÇÃO ── */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
        {/* Linha 1: Abas de Nível de Ensino (Segmented Controls) */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todas as Escolas ({schools.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('fundamental-medio')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedLevel === 'fundamental-medio'
                  ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Fundamental & Médio ({fundamentalMedioCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('fundamental')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedLevel === 'fundamental'
                  ? 'bg-[#163c54] dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Ensino Fundamental ({fundamentalCount})
            </button>
          </div>

          {/* Botões de Modo de Exibição (Grid vs Lista) */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Visualização em Grade"
              aria-label="Visualização em Grade"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Visualização em Lista"
              aria-label="Visualização em Lista"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Linha 2: Campo de Pesquisa & Dropdown de Ordenação */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Input de Busca */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome da escola, gestor(a) ou endereço..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
                title="Limpar pesquisa"
                aria-label="Limpar pesquisa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Seletor de Ordenação */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="school-sort" className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
              Ordenar por:
            </label>
            <div className="relative w-full sm:w-auto">
              <select
                id="school-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-none cursor-pointer transition-all"
              >
                <option value="name">Ordem Alfabética (A-Z)</option>
                <option value="students-desc">Mais Alunos</option>
                <option value="students-asc">Menos Alunos</option>
              </select>
              <svg
                className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEEDBACK DE BUSCA ATIVA ── */}
      {search && (
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1">
          <span>
            Exibindo <strong>{filteredSchools.length}</strong> de {schools.length} escolas para &quot;{search}&quot;
          </span>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* ── GRADE / LISTA DE CARDS DAS ESCOLAS ── */}
      {filteredSchools.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        /* Empty State acolhedor */
        <div className="bg-white dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 sm:p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-editorial text-xl font-bold text-slate-900 dark:text-slate-100">
            Nenhuma escola encontrada
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mt-1 mb-5">
            Não encontramos resultados para a sua busca por &quot;{search}&quot;. Verifique o termo digitado ou redefina os filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedLevel('all');
            }}
            className="px-4 py-2.5 bg-[#163c54] hover:bg-[#102c3f] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Ver todas as escolas</span>
          </button>
        </div>
      )}
    </div>
  );
}
