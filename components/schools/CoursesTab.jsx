'use client';

import { useState, useMemo } from 'react';
import CourseIcon, { COURSE_ICONS, normalizeIconType } from '@/components/schools/CourseIcon';

/**
 * CoursesTab — Visualização e Catálogo dos Cursos Gratuitos da SEE-AC.
 * Executado rigorosamente conforme a especificação editorial de `remodel cursos/code.html` e `DESIGN.md`.
 */
export default function CoursesTab({ courses = [], onBack, selectedSchool = null }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  // Categorias disponíveis dinamicamente com base nos cursos
  const categories = useMemo(() => {
    const list = [
      { id: 'all', label: 'Todos os Cursos & Polos' },
      { id: 'Tecnologia & Robótica', label: 'Tecnologia & Robótica' },
      { id: 'Gestão & Negócios', label: 'Gestão & Negócios' },
      { id: 'Idiomas Aplicados', label: 'Idiomas Aplicados' },
      { id: 'Ensino Médio Integrado', label: 'Ensino Médio Integrado' },
    ];
    return list;
  }, []);

  // Métricas agregadas de cursos e vagas
  const totalCourses = courses.length;
  const totalVacancies = useMemo(
    () => courses.reduce((acc, c) => acc + (Number(c.vacancies) || 0), 0),
    [courses]
  );

  // Filtragem e ordenação
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Filtro por categoria / trilha
        if (selectedCategory !== 'all') {
          const matchTrack = course.track?.toLowerCase() === selectedCategory.toLowerCase();
          const matchCat = course.category?.toLowerCase().includes(selectedCategory.toLowerCase());
          if (!matchTrack && !matchCat) return false;
        }

        // Filtro textual
        if (!search.trim()) return true;
        const q = search.toLowerCase().trim();
        return (
          course.title?.toLowerCase().includes(q) ||
          course.category?.toLowerCase().includes(q) ||
          course.track?.toLowerCase().includes(q) ||
          course.description?.toLowerCase().includes(q) ||
          course.schoolName?.toLowerCase().includes(q) ||
          course.shift?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'vacancies-desc') return (b.vacancies || 0) - (a.vacancies || 0);
        if (sortBy === 'vacancies-asc') return (a.vacancies || 0) - (b.vacancies || 0);
        if (sortBy === 'hours') {
          const hA = parseInt(a.workload, 10) || 0;
          const hB = parseInt(b.workload, 10) || 0;
          return hB - hA;
        }
        return a.title.localeCompare(b.title, 'pt-BR');
      });
  }, [courses, selectedCategory, search, sortBy]);

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn" data-purpose="courses-tab-view">
      {/* ── BARRA SUPERIOR DE RETORNO / BREADCRUMBS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar para Instituições</span>
          </button>

          <nav className="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
            <span>SEE-AC</span>
            <span>/</span>
            <span>Brasiléia</span>
            <span>/</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Educação Profissional & Tecnológica
            </span>
          </nav>
        </div>

        {/* Indicador de Unidade Ofertante */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {selectedSchool ? selectedSchool.name : 'Polo NTE Brasiléia & Rede Estadual'}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Vagas Abertas
          </span>
        </div>
      </div>

      {/* ── HERO BANNER DESCRITIVO & INDICADORES (METRICS SHOWCASE) ── */}
      <section className="bg-linear-to-b from-slate-100/90 to-white dark:from-[#0d1e2c] dark:to-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              Educação Profissional e Tecnologia · Cursos Gratuitos
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Cursos Ofertados e Vagas Abertas
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Formações gratuitas com certificado oficial da SEE-AC. Garanta sua vaga com atendimento
              humanizado e direto pelo WhatsApp do polo formativo em Brasiléia.
            </p>
          </div>

          {/* Estatísticas resumidas idênticas ao mockup remodel cursos */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Cursos Ofertados */}
            <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                {totalCourses}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-label-caps">
                  Cursos Ofertados
                </p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Gratuitos e com Vagas
                </p>
              </div>
            </div>

            {/* 2. Vagas Abertas */}
            <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                {totalVacancies > 0 ? totalVacancies : 480}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-label-caps">
                  Vagas Abertas
                </p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Turmas 2026/1
                </p>
              </div>
            </div>

            {/* 3. Certificação Oficial */}
            <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.794s.448-1.273.607-1.446c.16-.174.348-.217.464-.217.116 0 .232.001.333.006.106.005.249-.04.39.299.145.348.492 1.2.535 1.288.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.184.227-.263.305-.088.086-.179.18-.077.355.101.174.45 1.018 1.222 1.705.992.884 1.828 1.157 2.088 1.288.261.13.414.116.568-.058.154-.174.66-1.144.834-1.536.174-.391.348-.328.58-.242.232.087 1.47.693 1.722.819.252.126.42.188.481.29.061.102.061.59-.083.995z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-label-caps">
                  Certificação Oficial
                </p>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  100% Gratuito SEE-AC
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRA DE CONTROLE: PILL TABS, BUSCA E ORDENAÇÃO ── */}
      <section className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Linha 1: Abas Pill de Categorias + Modo de Visualização */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar" role="tablist">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos os Cursos & Polos ({totalCourses})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('Tecnologia & Robótica')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                selectedCategory === 'Tecnologia & Robótica'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>Tecnologia & Robótica</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('Gestão & Negócios')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'Gestão & Negócios'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Gestão & Negócios
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('Idiomas Aplicados')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'Idiomas Aplicados'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Idiomas Aplicados
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('Ensino Médio Integrado')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'Ensino Médio Integrado'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Ensino Médio Integrado
            </button>
          </div>

          {/* Toggle Grade / Lista */}
          <div className="hidden md:flex items-center space-x-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Visualização em Grade"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Visualização em Lista"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Linha 2: Barra de Pesquisa + Dropdown de Ordenação */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por curso, modalidade, polo ou turno (ex: robótica, informática, noite)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder:text-slate-400 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Limpar pesquisa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <label htmlFor="course-sort" className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Ordenar por:
            </label>
            <div className="relative">
              <select
                id="course-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="name">Ordem Alfabética (A-Z)</option>
                <option value="vacancies-desc">Mais Vagas Disponíveis</option>
                <option value="vacancies-asc">Menos Vagas</option>
                <option value="hours">Maior Carga Horária</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRID DOS PANFLETOS DE CURSOS (EXACT FLYERS DESIGN) ── */}
      {filteredCourses.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
              : 'flex flex-col gap-5'
          }
        >
          {filteredCourses.map((course) => {
            const rawPhone = course.whatsapp || course.phone || '68999128877';
            const cleanPhone = rawPhone.replace(/\D/g, '');
            const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
            const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(
              `Olá! Gostaria de garantir minha vaga e obter informações sobre a inscrição no curso gratuito de *${course.title}* ofertado em Brasiléia.`
            )}`;

            const iconType = course.iconType || course.icon_type || course.icon || 'computer';
            const iconMeta = COURSE_ICONS.find((i) => i.id === normalizeIconType(iconType)) || COURSE_ICONS[0];
            const flyerGradient = course.gradient || iconMeta.colorGradient || 'from-emerald-600 via-teal-600 to-cyan-700';
            const vacanciesDisplay =
              course.vacancies ??
              course.availableVacancies ??
              course.available_vacancies ??
              course.totalVacancies ??
              course.total_vacancies ??
              30;
            const courseHighlights =
              course.highlights && course.highlights.length > 0
                ? course.highlights
                : [
                    `Carga: ${course.workload || '160h'}`,
                    `Turno: ${course.shift || 'Noturno'}`,
                    `Modalidade: ${course.modality || 'Presencial'}`,
                    'Certificado oficial SEE-AC',
                  ];
            const startDate =
              course.startDate ||
              (course.classesStart ? new Date(course.classesStart + 'T00:00:00').toLocaleDateString('pt-BR') : null) ||
              (course.classes_start ? new Date(course.classes_start + 'T00:00:00').toLocaleDateString('pt-BR') : 'A definir');
            const phoneFormatted = course.whatsappPhoneFormatted || course.phone || '(68) 99912-8877';

            return (
              <article
                key={course.id}
                className="school-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* ── TOPO FLYER COM GRADIENTE TEMÁTICO DINÂMICO ── */}
                <div
                  className={`bg-linear-to-r ${flyerGradient} p-5 text-white relative`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${iconMeta.accentColor}, #0f172a)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/30">
                      {course.badgeTop || 'Vagas Abertas 2026'}
                    </span>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
                      {course.freeBadge || '100% Gratuito'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-semibold text-white/80 uppercase tracking-wide truncate">
                        {course.category}
                      </p>
                      <h2 className="text-xl font-bold leading-tight font-editorial">
                        {course.title}
                      </h2>
                    </div>

                    <div
                      className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-xs"
                      title={iconMeta.name}
                    >
                      <CourseIcon type={iconType} className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Chips informativos */}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-white/95">
                    <span className="bg-black/20 px-2 py-0.5 rounded-md">
                      Carga: {course.workload}
                    </span>
                    <span className="bg-black/20 px-2 py-0.5 rounded-md">
                      Turno: {course.shift}
                    </span>
                    <span className="bg-black/20 px-2 py-0.5 rounded-md">
                      {vacanciesDisplay} Vagas
                    </span>
                  </div>
                </div>

                {/* ── CORPO DO CARD ── */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Descrição Curricular */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Destaques do Panfleto (Grid 2x2 com Checkmark) */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block font-label-caps">
                        Destaques do Panfleto
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                        {courseHighlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 min-w-0">
                            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="truncate">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Polo e Localização */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-2 truncate">
                        <div className={`w-6 h-6 rounded-full ${course.schoolInitialsBg || 'bg-emerald-100 text-emerald-700'} flex items-center justify-center font-bold text-[10px] shrink-0`}>
                          {course.schoolInitials || 'NTE'}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {course.schoolName}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                            {course.schoolAddress}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full shrink-0">
                        {course.schoolBadge || 'Matrícula Presencial/Online'}
                      </span>
                    </div>
                  </div>

                  {/* ── RODAPÉ COM BOTÃO DE WHATSAPP DIRETO ── */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm transition"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.794s.448-1.273.607-1.446c.16-.174.348-.217.464-.217.116 0 .232.001.333.006.106.005.249-.04.39.299.145.348.492 1.2.535 1.288.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.184.227-.263.305-.088.086-.179.18-.077.355.101.174.45 1.018 1.222 1.705.992.884 1.828 1.157 2.088 1.288.261.13.414.116.568-.058.154-.174.66-1.144.834-1.536.174-.391.348-.328.58-.242.232.087 1.47.693 1.722.819.252.126.42.188.481.29.061.102.061.59-.083.995z" />
                      </svg>
                      <span>Garantir Vaga no WhatsApp</span>
                    </a>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium px-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Início: {startDate}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {phoneFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 sm:p-14 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-editorial text-lg font-bold text-slate-900 dark:text-slate-100">
            Nenhum curso encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
            Não encontramos turmas abertas para &quot;{search}&quot;. Experimente redefinir a busca ou a categoria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold rounded-xl transition"
          >
            Ver todos os cursos
          </button>
        </div>
      )}

      {/* ── PAGINAÇÃO / RESUMO DO CATÁLOGO ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800 pt-5">
        <p>
          Mostrando <strong>{filteredCourses.length}</strong> de {courses.length} panfletos de cursos com inscrições ativas em Brasiléia · 100% Gratuitos SEE-AC
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 sm:mt-0 text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
        >
          ← Retornar à lista de instituições
        </button>
      </div>
    </div>
  );
}
