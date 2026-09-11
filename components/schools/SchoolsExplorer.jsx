'use client';

import { useState, useMemo } from 'react';
import SchoolCard from '@/components/schools/SchoolCard';

export default function SchoolsExplorer({ schools = [] }) {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'students-desc' | 'students-asc'

  // Métricas agregadas
  const totalStudents = useMemo(
    () => schools.reduce((acc, s) => acc + (Number(s.studentCount) || 0), 0),
    [schools]
  );

  // Filtros dinâmicos
  const filteredSchools = useMemo(() => {
    return schools
      .filter((school) => {
        const query = search.toLowerCase().trim();
        const matchesQuery =
          !query ||
          school.name?.toLowerCase().includes(query) ||
          school.principal?.toLowerCase().includes(query) ||
          school.shortName?.toLowerCase().includes(query);

        return matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'students-desc') return (b.studentCount || 0) - (a.studentCount || 0);
        if (sortBy === 'students-asc') return (a.studentCount || 0) - (b.studentCount || 0);
        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }, [schools, search, sortBy]);

  return (
    <div className="space-y-stack-lg">
      {/* ── PAINEL DE ESTATÍSTICAS / KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total de Escolas */}
        <div className="relative overflow-hidden bg-white dark:bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow group">
          <div className="absolute top-0 left-0 h-1 w-full bg-secondary/80 group-hover:bg-secondary transition-colors" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Unidades Escolares</p>
              <h3 className="text-3xl font-display-lg text-primary mt-1 font-bold">{schools.length}</h3>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">Polos urbanos em Brasiléia</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[26px]">apartment</span>
            </div>
          </div>
        </div>

        {/* Total de Alunos */}
        <div className="relative overflow-hidden bg-white dark:bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow group">
          <div className="absolute top-0 left-0 h-1 w-full bg-primary/80 group-hover:bg-primary transition-colors" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Alunos Matriculados</p>
              <h3 className="text-3xl font-display-lg text-primary mt-1 font-bold">
                {totalStudents.toLocaleString('pt-BR')}
              </h3>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">Estudantes atendidos</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[26px]">groups</span>
            </div>
          </div>
        </div>

        {/* Gestão & Contato */}
        <div className="relative overflow-hidden bg-white dark:bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow group">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#25D366]/80 group-hover:bg-[#25D366] transition-colors" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Canais de Contato</p>
              <h3 className="text-3xl font-display-lg text-primary mt-1 font-bold">100%</h3>
              <p className="text-xs text-[#075e24] font-medium mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                WhatsApp direto com gestão
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-[#075e24]">
              <span className="material-symbols-outlined text-[26px]">chat</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BARRA DE FERRAMENTAS: BUSCA, ORDENAÇÃO E FEEDBACK ── */}
      <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-outline pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar escola por nome ou gestor..."
            className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low hover:bg-surface-container/60 focus:bg-white text-on-surface text-body-md rounded-lg border border-transparent focus:border-primary/40 outline-none transition-all placeholder:text-outline/70"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-md transition-colors"
              title="Limpar busca"
              aria-label="Limpar busca"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Controles de Ordenação */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-xs text-outline font-medium hidden md:block whitespace-nowrap">
            Ordenar por:
          </label>
          <div className="relative flex-1 sm:flex-initial">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2.5 bg-surface-container-low hover:bg-surface-container text-body-md text-on-surface rounded-lg border border-transparent focus:border-primary/40 outline-none cursor-pointer transition-all"
            >
              <option value="name">Ordem Alfabética (A-Z)</option>
              <option value="students-desc">Mais alunos</option>
              <option value="students-asc">Menos alunos</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* ── FEEDBACK DO RESULTADO DA BUSCA ── */}
      {search && (
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>
            Mostrando <strong>{filteredSchools.length}</strong> de {schools.length} unidades para &quot;{search}&quot;
          </span>
          <button
            onClick={() => setSearch('')}
            className="text-secondary hover:underline font-medium"
          >
            Limpar filtro
          </button>
        </div>
      )}

      {/* ── GRADE DE ESCOLAS ── */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 className="text-lg font-semibold text-primary">Nenhuma escola encontrada</h3>
          <p className="text-body-md text-on-surface-variant max-w-md mt-1 mb-4">
            Não encontramos resultados para &quot;{search}&quot;. Tente verificar a grafia ou buscar por outro termo.
          </p>
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 bg-primary text-white text-caption font-medium rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Redefinir busca
          </button>
        </div>
      )}
    </div>
  );
}
