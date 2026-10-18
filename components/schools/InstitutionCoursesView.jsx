'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function InstitutionCoursesView({ school, courses = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'aberto' | 'ultimas_vagas' | 'esgotado'
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // Categorias únicas dos cursos desta instituição
  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  // Turnos disponíveis
  const shifts = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.shift) set.add(c.shift);
    });
    return Array.from(set);
  }, [courses]);

  // Indicadores agregados
  const totalCourses = courses.length;
  const totalVacancies = useMemo(
    () => courses.reduce((acc, c) => acc + (Number(c.totalVacancies) || 0), 0),
    [courses]
  );
  const totalAvailableVacancies = useMemo(
    () => courses.reduce((acc, c) => acc + (Number(c.availableVacancies) || 0), 0),
    [courses]
  );
  const openCoursesCount = useMemo(
    () => courses.filter((c) => c.status === 'aberto' || c.status === 'ultimas_vagas').length,
    [courses]
  );

  // Filtragem combinada
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedShift !== 'all' && c.shift !== selectedShift) return false;
      if (statusFilter === 'aberto' && c.status !== 'aberto' && c.status !== 'ultimas_vagas') return false;
      if (statusFilter === 'ultimas_vagas' && c.status !== 'ultimas_vagas') return false;
      if (statusFilter === 'esgotado' && c.status !== 'esgotado') return false;

      const q = search.toLowerCase().trim();
      if (!q) return true;

      return (
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.requirements?.toLowerCase().includes(q)
      );
    });
  }, [courses, selectedCategory, selectedShift, statusFilter, search]);

  const cleanPhone = school?.phone ? school.phone.replace(/\D/g, '') : '';
  const cleanCoordPhone = school?.coordinatorPhone ? school.coordinatorPhone.replace(/\D/g, '') : '';
  const contactPhone = cleanCoordPhone || cleanPhone;
  const whatsappUrl = contactPhone
    ? `https://wa.me/${contactPhone.startsWith('55') ? contactPhone : `55${contactPhone}`}?text=${encodeURIComponent(
        `Olá! Gostaria de informações sobre as inscrições presenciais para os cursos gratuitos no ${school?.name || 'polo'}.`
      )}`
    : null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${school?.name || 'CEEPT Brasiléia'}, ${school?.address || 'Brasiléia - AC'}`
  )}`;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {/* ── BREADCRUMB INSTITUCIONAL ── */}
      <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link href="/escolas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Instituições
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
          {school?.shortName || school?.name}
        </span>
        <span>/</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
          Cursos Gratuitos
        </span>
      </nav>

      {/* ── HERO BANNER: POLO OFICIAL DE EDUCAÇÃO PROFISSIONAL ── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0c2333] via-[#103046] to-[#184564] text-white p-6 sm:p-10 shadow-xl border border-white/10">
        <div
          className="absolute -top-28 -right-28 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-28 -left-28 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl flex flex-col gap-3.5">
            {/* Selos Oficiais */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cursos Gratuitos do Estado
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold">
                SEE · Governo do Estado do Acre
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                Inscrições Presenciais no Polo
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {school?.name}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Polo oficial de qualificação técnica e profissional gratuita em Brasiléia. Consulte os cursos homologados pelo Estado,
              verifique as vagas disponíveis e confira os horários e documentos necessários para realizar sua matrícula presencialmente na secretaria.
            </p>

            {/* Informações Oficiais de Localização e Atendimento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-3 border-t border-white/15">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider">Local de Matrícula:</span>
                  <span className="font-medium text-white">{school?.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider">Horário da Secretaria:</span>
                  <span className="font-medium text-white">Segunda a Sexta: 08h às 12h e 14h às 21h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Lateral de Contato Direto */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col gap-3 sm:min-w-65">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Secretaria do Polo
            </span>

            {school?.phone && (
              <div className="flex items-center gap-2 text-sm text-white">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">{school.phone}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs shadow-md transition-all"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
                  </svg>
                  <span>Dúvidas no WhatsApp</span>
                </a>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Ver Local no Mapa</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAINEL DE INDICADORES DE VAGAS ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5" aria-label="Indicadores de vagas">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cursos Ofertados
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {totalCourses}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Opções profissionalizantes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Vagas Totais
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#163c54] dark:text-sky-400 mt-1">
            {totalVacancies}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Capacidade homologada</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 shadow-xs bg-linear-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Vagas Livres
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            {totalAvailableVacancies}
          </p>
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Abertas para matrícula presencial
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Turmas Abertas
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
            {openCoursesCount}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Inscrições em andamento no polo</span>
        </div>
      </section>

      {/* ── BARRA UNIFICADA DE PESQUISA & FILTROS ── */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Busca por texto (col-span-6) */}
          <div className="md:col-span-6 relative">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar curso por título, área ou requisito..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                title="Limpar pesquisa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtro por Área / Categoria (col-span-3) */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">Todas as Áreas ({courses.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({courses.filter((c) => c.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Turno (col-span-3) */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">Todos os Turnos</option>
              {shifts.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Status e Contadores */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase text-slate-400 mr-1">Situação:</span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('aberto')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'aberto'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              }`}
            >
              Inscrições Abertas ({courses.filter((c) => c.status === 'aberto' || c.status === 'ultimas_vagas').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ultimas_vagas')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'ultimas_vagas'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
              }`}
            >
              Últimas Vagas ({courses.filter((c) => c.status === 'ultimas_vagas').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('esgotado')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'esgotado'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Esgotados ({courses.filter((c) => c.status === 'esgotado').length})
            </button>
          </div>

          <div className="text-slate-500 dark:text-slate-400">
            Exibindo <strong>{filteredCourses.length}</strong> de {courses.length} opções
          </div>
        </div>
      </section>

      {/* ── LISTAGEM OFICIAL DOS CURSOS ── */}
      <section>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredCourses.map((course) => {
              const occupancy = course.totalVacancies > 0
                ? Math.min(100, Math.round((course.filledVacancies / course.totalVacancies) * 100))
                : 0;

              const isFull = course.availableVacancies <= 0;
              const isLow = course.availableVacancies > 0 && course.availableVacancies <= 5;

              return (
                <article
                  key={course.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 relative overflow-hidden group"
                >
                  {/* Faixa decorativa superior */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${
                      isFull
                        ? 'from-slate-400 to-slate-500'
                        : isLow
                        ? 'from-amber-500 to-rose-500'
                        : 'from-indigo-600 via-sky-500 to-emerald-500'
                    }`}
                  />

                  {/* ── SEÇÃO 1: CABEÇALHO & IDENTIFICAÇÃO DO CURSO ── */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                        {course.category}
                      </span>

                      {/* Status das Vagas no Polo */}
                      {isFull ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Turma Esgotada
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Últimas Vagas!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Inscrições Abertas no Polo
                        </span>
                      )}
                    </div>

                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {course.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* ── SEÇÃO 2: FORMATO ACADÊMICO & ESPECIFICAÇÕES ── */}
                  <div className="bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 grid grid-cols-3 gap-3 divide-x divide-slate-200 dark:divide-slate-700/60">
                    <div className="flex flex-col pl-1 first:pl-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Carga
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100 font-extrabold text-sm sm:text-base mt-0.5">
                        {course.workload}
                      </strong>
                    </div>

                    <div className="flex flex-col pl-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Turno
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100 font-extrabold text-sm sm:text-base mt-0.5">
                        {course.shift}
                      </strong>
                    </div>

                    <div className="flex flex-col pl-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Modalidade
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100 font-extrabold text-sm sm:text-base mt-0.5">
                        {course.modality}
                      </strong>
                    </div>
                  </div>

                  {/* ── SEÇÃO 3: REQUISITOS MÍNIMOS DE INGRESSO ── */}
                  {course.requirements && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <span className="font-bold text-indigo-900 dark:text-indigo-200">Requisitos para Ingresso: </span>
                        <span>{course.requirements}</span>
                      </div>
                    </div>
                  )}

                  {/* ── SEÇÃO 4: COCKPIT DE CONTROLE DE VAGAS ── */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border transition-all ${
                      isFull
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        : isLow
                        ? 'bg-linear-to-br from-amber-50/70 via-orange-50/40 to-white dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-900 border-amber-200 dark:border-amber-800/60'
                        : 'bg-linear-to-br from-emerald-50/70 via-teal-50/40 to-white dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60'
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Disponibilidade de Vagas
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span
                            className={`text-2xl sm:text-3xl font-black ${
                              isFull ? 'text-slate-400' : isLow ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {course.availableVacancies}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            vagas livres de {course.totalVacancies}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {course.filledVacancies} ocupadas
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {occupancy}% preenchido
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isFull
                            ? 'bg-slate-400'
                            : isLow
                            ? 'bg-linear-to-r from-amber-500 to-rose-500'
                            : 'bg-linear-to-r from-emerald-500 to-teal-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>

                    {/* Datas Oficiais */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/40">
                      {course.registrationEnd && (
                        <span>Inscrições até: <strong className="text-slate-700 dark:text-slate-300">{new Date(course.registrationEnd).toLocaleDateString('pt-BR')}</strong></span>
                      )}
                      {course.classesStart && (
                        <span>Aulas em: <strong className="text-slate-700 dark:text-slate-300">{new Date(course.classesStart).toLocaleDateString('pt-BR')}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* ── SEÇÃO 5: LOCAL FÍSICO E BOTÃO PRINCIPAL ── */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">Inscrições presenciais na Secretaria do {school?.shortName || school?.name}</span>
                    </div>

                    {/* Botão Único e Objetivo para Abrir o Modal com Guia Físico */}
                    <button
                      type="button"
                      onClick={() => setSelectedCourseDetails(course)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xs hover:shadow-md transition-all cursor-pointer group/btn"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Ver Informações & Local de Inscrição</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-editorial text-xl font-bold text-slate-900 dark:text-slate-100">
              Nenhum curso encontrado com esses filtros
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mt-1 mb-5">
              Tente redefinir a busca por texto ou alternar para outra área ou turno.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedShift('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Ver todos os cursos
            </button>
          </div>
        )}
      </section>

      {/* ── MODAL PROFISSIONAL: GUIA OFICIAL DE INSCRIÇÃO PRESENCIAL ── */}
      {selectedCourseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto flex flex-col gap-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-course-title"
          >
            {/* Botão Fechar no Topo */}
            <button
              type="button"
              onClick={() => setSelectedCourseDetails(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar janela"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex flex-col gap-2 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                  {selectedCourseDetails.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                  Curso 100% Gratuito
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  SEE · Governo do Acre
                </span>
              </div>

              <h2 id="modal-course-title" className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                {selectedCourseDetails.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedCourseDetails.description}
              </p>
            </div>

            {/* Ficha Resumida do Curso */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-center">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Carga Horária</span>
                <strong className="text-slate-800 dark:text-slate-200 font-extrabold text-sm">{selectedCourseDetails.workload}</strong>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Turno</span>
                <strong className="text-slate-800 dark:text-slate-200 font-extrabold text-sm">{selectedCourseDetails.shift}</strong>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Modalidade</span>
                <strong className="text-slate-800 dark:text-slate-200 font-extrabold text-sm">{selectedCourseDetails.modality}</strong>
              </div>
            </div>

            {/* Aviso Obrigatório: Inscrição Exclusivamente Presencial */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex flex-col gap-0.5">
                <strong className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Inscrição Exclusivamente Presencial no Polo
                </strong>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  Para garantir sua vaga neste curso, você deve comparecer pessoalmente à secretaria do polo com a documentação exigida.
                  O preenchimento de vagas ocorre por ordem de atendimento até o limite da turma.
                </p>
              </div>
            </div>

            {/* Bloco 1: Local Físico de Inscrição */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Onde Realizar sua Matrícula
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Polo Ofertante</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-sm">{school?.name}</strong>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Endereço Completo</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{school?.address}</span>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Setor de Atendimento</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Secretaria Escolar / Setor de Matrículas</span>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Horário de Funcionamento</span>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold text-emerald-700 dark:text-emerald-400">
                    Seg. a Sex.: 08h às 12h e 14h às 21h
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Documentação Obrigatória para Levar */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Documentos Obrigatórios para Apresentar no Polo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span>Documento oficial de identidade com foto (RG ou CNH)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span>CPF do candidato</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span>Comprovante de residência atualizado (últimos 90 dias)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span>Comprovante de escolaridade (Histórico ou Declaração)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span>2 Fotos 3x4 recentes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span>Menores de 18 anos: presença do responsável com RG e CPF</span>
                </div>
              </div>
            </div>

            {/* Bloco 3: Prazos e Vagas Disponíveis */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between flex-wrap gap-3 text-xs">
              <div>
                <span className="block text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400">Vagas Disponíveis Agora</span>
                <span className="text-xl font-black text-indigo-950 dark:text-white">
                  {selectedCourseDetails.availableVacancies} vagas livres
                </span>
                <span className="text-slate-500 dark:text-slate-400"> de {selectedCourseDetails.totalVacancies} homologadas</span>
              </div>

              {selectedCourseDetails.registrationEnd && (
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400">Prazo de Inscrição</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Até {new Date(selectedCourseDetails.registrationEnd).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            {/* Ações do Rodapé do Modal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Traçar Rota no Google Maps</span>
              </a>

              <div className="flex items-center gap-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
                    </svg>
                    <span>Falar no WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedCourseDetails(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
