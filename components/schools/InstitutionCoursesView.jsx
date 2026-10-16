'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function InstitutionCoursesView({ school, courses = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'aberto' | 'ultimas_vagas'
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const [enrollmentForm, setEnrollmentForm] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Filtragem
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedShift !== 'all' && c.shift !== selectedShift) return false;
      if (statusFilter === 'aberto' && c.status !== 'aberto' && c.status !== 'ultimas_vagas') return false;
      if (statusFilter === 'ultimas_vagas' && c.status !== 'ultimas_vagas') return false;

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

  const cleanPhone = school.phone ? school.phone.replace(/\D/g, '') : '';
  const cleanCoordPhone = school.coordinatorPhone ? school.coordinatorPhone.replace(/\D/g, '') : '';
  const contactPhone = cleanCoordPhone || cleanPhone;
  const whatsappUrl = contactPhone
    ? `https://wa.me/${contactPhone.startsWith('55') ? contactPhone : `55${contactPhone}`}?text=${encodeURIComponent(
        `Olá! Estou entrando em contato pelo Portal Educa Brasiléia para informações sobre os cursos gratuitos disponíveis na ${school.name}.`
      )}`
    : null;

  function handleOpenEnrollment(course) {
    setSelectedCourseForEnrollment(course);
    setEnrollmentSuccess(null);
    setEnrollmentForm({
      fullName: '',
      cpf: '',
      phone: '',
      email: '',
      notes: '',
    });
  }

  function handleCloseEnrollment() {
    setSelectedCourseForEnrollment(null);
    setEnrollmentSuccess(null);
  }

  function handleEnrollmentSubmit(e) {
    e.preventDefault();
    if (!enrollmentForm.fullName.trim() || !enrollmentForm.phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const protocol = 'SEE-' + Math.floor(100000 + Math.random() * 900000);
      setEnrollmentSuccess({
        protocol,
        course: selectedCourseForEnrollment.title,
        candidateName: enrollmentForm.fullName,
      });
    }, 700);
  }

  return (
    <div className="flex flex-col gap-10">
      {/* ── BREADCRUMB & VOLTAR AO MENU DE INSTITUIÇÕES ── */}
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
          {school.shortName || school.name}
        </span>
        <span>/</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
          Cursos Disponíveis
        </span>
      </nav>

      {/* ── HERO BANNER DA INSTITUIÇÃO & POLO DE CURSOS GRATUITOS ── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0e2738] via-[#12364e] to-[#1a4f73] text-white p-6 sm:p-10 shadow-xl border border-white/10">
        {/* Elementos visuais decorativos de fundo */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl flex flex-col gap-3">
            {/* Badges Oficiais */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cursos Gratuitos do Estado
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold">
                SEE · Governo do Estado do Acre
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {school.name}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mt-1">
              Polo de formação técnica e profissionalizante gratuita em Brasiléia. Consulte os cursos com inscrições abertas,
              o controle de vagas disponíveis em tempo real e realize a sua pré-inscrição gratuita.
            </p>

            {/* Informações de Localização e Gestão do Polo */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 mt-2 pt-3 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{school.address}</span>
              </div>

              {school.coordinator && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Coordenação: <strong>{school.coordinator}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Card Flutuante de Atendimento Rápido */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col gap-3 min-w-65">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Canais Oficiais do Polo
            </span>

            {school.phone && (
              <div className="flex items-center gap-2 text-sm text-white">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">{school.phone}</span>
              </div>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs shadow-md transition-all"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
                </svg>
                <span>Falar com o Polo no WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── PAINEL DE INDICADORES DE VAGAS ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cursos Ofertados
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {totalCourses}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Opções profissionalizantes</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Vagas Totais
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#163c54] dark:text-sky-400 mt-1">
            {totalVacancies}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Capacidade homologada</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 shadow-xs bg-linear-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Vagas Disponíveis
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            {totalAvailableVacancies}
          </p>
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Vagas abertas para ingresso
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Turmas Abertas
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
            {openCoursesCount}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Inscrições em andamento</span>
        </div>
      </section>

      {/* ── BARRA DE PESQUISA & FILTROS ── */}
      <section className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Busca por texto */}
          <div className="relative flex-1">
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
              placeholder="Buscar curso por nome, área ou requisito..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
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

          {/* Filtro por Turno */}
          <div className="flex items-center gap-2">
            <label htmlFor="shift-filter" className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
              Turno:
            </label>
            <select
              id="shift-filter"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">Todos os Turnos</option>
              {shifts.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
              Vagas:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">Todas as Situações</option>
              <option value="aberto">Apenas Vagas Abertas</option>
              <option value="ultimas_vagas">Últimas Vagas</option>
            </select>
          </div>
        </div>

        {/* Abas de Categorias / Áreas do Conhecimento */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-styled py-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todas as Áreas ({courses.length})
            </button>
            {categories.map((cat) => {
              const count = courses.filter((c) => c.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── LISTAGEM DOS CURSOS DISPONÍVEIS & VAGAS ── */}
      <section>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const occupancy = course.totalVacancies > 0
                ? Math.min(100, Math.round((course.filledVacancies / course.totalVacancies) * 100))
                : 0;

              const isFull = course.availableVacancies <= 0;
              const isLow = course.availableVacancies > 0 && course.availableVacancies <= 5;

              return (
                <article
                  key={course.id}
                  className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden group"
                >
                  {/* Faixa decorativa no topo */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${
                      isFull
                        ? 'from-slate-400 to-slate-500'
                        : isLow
                        ? 'from-amber-500 to-rose-500'
                        : 'from-indigo-600 to-teal-500'
                    }`}
                  />

                  <div className="flex flex-col gap-3.5">
                    {/* Topo do Card: Categoria + Badge de Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                        {course.category}
                      </span>

                      {/* Status das Vagas */}
                      {isFull ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Vagas Esgotadas
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Últimas Vagas!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Inscrições Abertas
                        </span>
                      )}
                    </div>

                    {/* Título do Curso */}
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {course.title}
                    </h2>

                    {/* Descrição / Ementa */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Ficha Rápida: Carga Horária, Turno e Modalidade */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Carga Horária</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">{course.workload}</strong>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Turno</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">{course.shift}</strong>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modalidade</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">{course.modality}</strong>
                      </div>
                    </div>

                    {/* Requisitos */}
                    {course.requirements && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Requisitos: <strong>{course.requirements}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* ── BLOCO DE CONTROLE E VISUALIZAÇÃO DE VAGAS DISPONÍVEIS ── */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Disponibilidade de Vagas
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        <strong className={`text-base ${isFull ? 'text-slate-400' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {course.availableVacancies}
                        </strong> / {course.totalVacancies} disponíveis
                      </span>
                    </div>

                    {/* Barra de Progresso de Vagas */}
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isFull
                            ? 'bg-slate-400'
                            : isLow
                            ? 'bg-linear-to-r from-amber-500 to-rose-500'
                            : 'bg-linear-to-r from-emerald-500 to-teal-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                        title={`${occupancy}% das vagas preenchidas`}
                      />
                    </div>

                    {/* Datas / Previsão */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      {course.registrationEnd && (
                        <span>Inscrições até: <strong>{new Date(course.registrationEnd).toLocaleDateString('pt-BR')}</strong></span>
                      )}
                      {course.classesStart && (
                        <span>Aulas em: <strong>{new Date(course.classesStart).toLocaleDateString('pt-BR')}</strong></span>
                      )}
                    </div>

                    {/* Ação: Botão de Inscrição / Interesse */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEnrollment(course)}
                        disabled={isFull}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                          isFull
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-500/20 hover:shadow-md'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{isFull ? 'Lista de Espera / Esgotado' : 'Garantir Vaga Gratuita'}</span>
                      </button>

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                          title="Tirar dúvidas sobre este curso com o polo no WhatsApp"
                          aria-label="Tirar dúvidas no WhatsApp"
                        >
                          <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                            <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
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

      {/* ── MODAL DE PRÉ-INSCRIÇÃO ONLINE ── */}
      {selectedCourseForEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-course-title"
          >
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={handleCloseEnrollment}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fechar formulário"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {enrollmentSuccess ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Pré-Inscrição Confirmada!
                </span>
                <h3 className="font-editorial text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Vaga Reservada com Sucesso
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Olá, <strong>{enrollmentSuccess.candidateName}</strong>! Sua solicitação para o curso{' '}
                  <strong>{enrollmentSuccess.course}</strong> foi acolhida com sucesso.
                </p>

                <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-full text-left text-xs">
                  <p className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    Protocolo Oficial de Atendimento
                  </p>
                  <p className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {enrollmentSuccess.protocol}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-1">
                    <p>📍 Compareça ao polo: <strong>{school.name}</strong></p>
                    <p>📋 Leve RG, CPF e comprovante de escolaridade no início das aulas.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseEnrollment}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Concluir e Voltar
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrollmentSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Pré-Inscrição Gratuita
                  </span>
                  <h3 id="modal-course-title" className="font-editorial text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                    {selectedCourseForEnrollment.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {school.name} · {selectedCourseForEnrollment.workload} · Turno {selectedCourseForEnrollment.shift}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                  <span>Vagas Disponíveis Agora:</span>
                  <strong className="text-sm font-black text-indigo-700 dark:text-indigo-300">
                    {selectedCourseForEnrollment.availableVacancies} vagas
                  </strong>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollmentForm.fullName}
                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, fullName: e.target.value })}
                    placeholder="Seu nome completo"
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      WhatsApp / Telefone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={enrollmentForm.phone}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, phone: e.target.value })}
                      placeholder="(68) 99999-9999"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={enrollmentForm.cpf}
                      onChange={(e) => setEnrollmentForm({ ...enrollmentForm, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    value={enrollmentForm.email}
                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, email: e.target.value })}
                    placeholder="exemplo@email.com"
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Curso 100% gratuito oferecido pelo Estado do Acre através da SEE.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseEnrollment}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? 'Processando...' : 'Confirmar Reserva de Vaga'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
