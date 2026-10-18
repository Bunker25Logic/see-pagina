'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/**
 * Matriz curricular oficial dos cursos profissionalizantes do polo estadual.
 */
const COURSE_MODULES = {
  'curso-ti-1': [
    { title: 'Módulo 1: Fundamentos de Hardware e Windows 11', hours: '30h' },
    { title: 'Módulo 2: Redação de Ofícios e Documentos no Word', hours: '40h' },
    { title: 'Módulo 3: Planilhas e Controle Financeiro no Excel', hours: '45h' },
    { title: 'Módulo 4: Apresentações Executivas no PowerPoint', hours: '25h' },
    { title: 'Módulo 5: Segurança da Informação e Navegação Segura', hours: '20h' },
  ],
  'curso-gestao-1': [
    { title: 'Módulo 1: Rotinas de Escritório e Gestão de Documentos', hours: '35h' },
    { title: 'Módulo 2: Comunicação Empresarial e Redação Oficial', hours: '35h' },
    { title: 'Módulo 3: Fluxo de Caixa, Contas a Pagar e Receber', hours: '45h' },
    { title: 'Módulo 4: Atendimento ao Público e Excelência em Serviços', hours: '35h' },
    { title: 'Módulo 5: Noções de Legislação Trabalhista e Recursos Humanos', hours: '30h' },
  ],
  'curso-ti-2': [
    { title: 'Módulo 1: Arquitetura de Hardware e Eletrônica Básica', hours: '40h' },
    { title: 'Módulo 2: Montagem, Manutenção Preventiva e Corretiva', hours: '45h' },
    { title: 'Módulo 3: Instalação e Configuração de Sistemas Operacionais', hours: '35h' },
    { title: 'Módulo 4: Cabeamento Estruturado e Conectorização RJ45', hours: '40h' },
    { title: 'Módulo 5: Configuração de Roteadores, Switches e Redes Wi-Fi', hours: '40h' },
  ],
  'curso-mkt-1': [
    { title: 'Módulo 1: Estratégias de Branding e Presença Online', hours: '25h' },
    { title: 'Módulo 2: Criação de Conteúdo e Design no Canva', hours: '30h' },
    { title: 'Módulo 3: Produção de Vídeos e Reels para Redes Sociais', hours: '20h' },
    { title: 'Módulo 4: Gestão de Instagram Comercial e WhatsApp Business', hours: '25h' },
    { title: 'Módulo 5: Noções de Tráfego Pago e Anúncios no Meta Ads', hours: '20h' },
  ],
  'curso-saude-1': [
    { title: 'Módulo 1: Processo de Envelhecimento e Fisiologia Geriátrica', hours: '35h' },
    { title: 'Módulo 2: Cuidados de Higiene, Conforto e Alimentação Segura', hours: '40h' },
    { title: 'Módulo 3: Aferição de Sinais Vitais e Rotina de Medicamentos', hours: '40h' },
    { title: 'Módulo 4: Primeiros Socorros e Prevenção de Quedas', hours: '35h' },
    { title: 'Módulo 5: Aspectos Psicológicos, Recreação e Legislação do Idoso', hours: '30h' },
  ],
  'curso-ingles-1': [
    { title: 'Módulo 1: Fonética e Vocabulário de Saudação e Apresentação', hours: '30h' },
    { title: 'Módulo 2: Vocabulário para Atendimento a Turistas e Clientes', hours: '35h' },
    { title: 'Módulo 3: Expressões Cotidianas e Conversação Instrumental', hours: '35h' },
    { title: 'Módulo 4: Redação de E-mails Comerciais e Mensagens Formais', hours: '30h' },
    { title: 'Módulo 5: Técnicas de Leitura Instrumental de Manuais e Textos', hours: '30h' },
  ],
};

const CATEGORY_CONFIG = {
  'Tecnologia da Informação': {
    badge: 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
    barGradient: 'from-cyan-500 via-sky-500 to-indigo-600',
    ring: 'focus:ring-sky-500',
    iconBg: 'bg-sky-600',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  'Gestão & Negócios': {
    badge: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    barGradient: 'from-amber-500 via-orange-500 to-emerald-600',
    ring: 'focus:ring-amber-500',
    iconBg: 'bg-amber-600',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  'Saúde & Bem-Estar': {
    badge: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    barGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    ring: 'focus:ring-emerald-500',
    iconBg: 'bg-emerald-600',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  'Idiomas & Comunicação': {
    badge: 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    barGradient: 'from-purple-500 via-indigo-500 to-pink-600',
    ring: 'focus:ring-purple-500',
    iconBg: 'bg-purple-600',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
};

const DEFAULT_CATEGORY_STYLE = {
  badge: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
  barGradient: 'from-indigo-500 via-sky-500 to-emerald-500',
  ring: 'focus:ring-indigo-500',
  iconBg: 'bg-indigo-600',
  icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

const REQUIRED_DOCUMENTS = [
  { id: 'doc-rg', label: 'Documento de Identidade com foto (RG ou CNH)', required: true },
  { id: 'doc-cpf', label: 'Cadastro de Pessoa Física (CPF)', required: true },
  { id: 'doc-res', label: 'Comprovante de Residência recente em Brasiléia', required: true },
  { id: 'doc-hist', label: 'Comprovante de Escolaridade (Histórico ou Declaração)', required: true },
  { id: 'doc-foto', label: '2 Fotos 3x4 recentes e coloridas', required: true },
];

/**
 * Retorna se a secretaria física está em horário de atendimento (Seg a Sex, 08h-12h e 14h-21h).
 */
function getSecretariatStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 6 = Sábado
  if (day === 0 || day === 6) {
    return { isOpen: false, text: 'Secretaria Fechada (Abre na Segunda-feira às 08h)' };
  }
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  const isMorning = time >= 8 && time < 12;
  const isAfternoonNight = time >= 14 && time < 21;

  if (isMorning || isAfternoonNight) {
    return { isOpen: true, text: 'Secretaria Aberta Agora (Atendimento Presencial Ativo)' };
  }
  if (time >= 12 && time < 14) {
    return { isOpen: false, text: 'Intervalo de Almoço (Reabre às 14h)' };
  }
  return { isOpen: false, text: 'Secretaria Fechada no Momento (Reabre amanhã às 08h)' };
}

export default function InstitutionCoursesView({ school, courses = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'aberto' | 'ultimas_vagas' | 'esgotado'
  const [sortBy, setSortBy] = useState('vacancies-desc'); // 'vacancies-desc' | 'vacancies-asc' | 'workload-desc' | 'name'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [expandedCurriculumId, setExpandedCurriculumId] = useState(null);

  // Modal de Guia Presencial
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});

  const secretariatStatus = useMemo(() => getSecretariatStatus(), []);

  // Categorias únicas
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

  // Indicadores
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

  // Filtragem e ordenação
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
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
      })
      .sort((a, b) => {
        if (sortBy === 'vacancies-desc') return (b.availableVacancies || 0) - (a.availableVacancies || 0);
        if (sortBy === 'vacancies-asc') return (a.availableVacancies || 0) - (b.availableVacancies || 0);
        if (sortBy === 'workload-desc') {
          const numA = parseInt(a.workload, 10) || 0;
          const numB = parseInt(b.workload, 10) || 0;
          return numB - numA;
        }
        return a.title.localeCompare(b.title, 'pt-BR');
      });
  }, [courses, selectedCategory, selectedShift, statusFilter, sortBy, search]);

  const cleanPhone = school?.phone ? school.phone.replace(/\D/g, '') : '';
  const cleanCoordPhone = school?.coordinatorPhone ? school.coordinatorPhone.replace(/\D/g, '') : '';
  const contactPhone = cleanCoordPhone || cleanPhone;
  const whatsappUrl = contactPhone
    ? `https://wa.me/${contactPhone.startsWith('55') ? contactPhone : `55${contactPhone}`}?text=${encodeURIComponent(
        `Olá! Estou consultando pelo Portal SEE Brasiléia e gostaria de informações sobre as inscrições presenciais no polo.`
      )}`
    : null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${school?.name || 'CEEPT Brasiléia'}, ${school?.address || 'Brasiléia - AC'}`
  )}`;

  const toggleDocCheck = (id) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalCheckedDocs = Object.values(checkedDocs).filter(Boolean).length;
  const docsProgress = Math.round((totalCheckedDocs / REQUIRED_DOCUMENTS.length) * 100);

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
          {school?.shortName || school?.name || 'Polo de Cursos'}
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
              {school?.name || 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia'}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Catálogo oficial de qualificação técnica e profissional gratuita. Consulte as turmas disponíveis,
              verifique o conteúdo programático de cada curso e compareça com os documentos necessários para matrícula presencial na secretaria acadêmica.
            </p>

            {/* Status e Localização em Destaque */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-3 border-t border-white/15">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider">Secretaria do Polo:</span>
                  <span className="font-medium text-white">{school?.address || 'Brasiléia - AC'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider">Atendimento Presencial:</span>
                  <span className="font-medium text-white">Segunda a Sexta: 08h às 12h e 14h às 21h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Lateral de Contato Direto & Status */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col gap-3 sm:min-w-65">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Secretaria Acadêmica
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  secretariatStatus.isOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${secretariatStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {secretariatStatus.isOpen ? 'Aberta Agora' : 'Fechada'}
              </span>
            </div>

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
                <span>Ver Local no Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAINEL DE INDICADORES DE VAGAS ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5" aria-label="Indicadores de vagas">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cursos Ofertados
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {totalCourses}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Opções profissionalizantes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Vagas Totais
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#163c54] dark:text-sky-400 mt-1">
            {totalVacancies}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Capacidade da instituição</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 shadow-xs bg-linear-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Vagas Livres
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            {totalAvailableVacancies}
          </p>
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Matrículas presenciais abertas
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Turmas com Vagas
          </span>
          <p className="font-editorial text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
            {openCoursesCount}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Disponíveis na secretaria</span>
        </div>
      </section>

      {/* ── BARRA UNIFICADA DE PESQUISA, FILTROS & ORDENAÇÃO DINÂMICA ── */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
        {/* Linha 1: Input de Busca e Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Busca por texto */}
          <div className="lg:col-span-5 relative">
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
              placeholder="Buscar curso por título, ementa ou requisito..."
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

          {/* Filtro por Área / Categoria */}
          <div className="lg:col-span-3">
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

          {/* Filtro por Turno */}
          <div className="lg:col-span-2">
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">Todos Turnos</option>
              {shifts.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
            >
              <option value="vacancies-desc">Mais Vagas Livres</option>
              <option value="vacancies-asc">Menos Vagas (Urgente)</option>
              <option value="workload-desc">Maior Carga Horária</option>
              <option value="name">Ordem Alfabética</option>
            </select>
          </div>
        </div>

        {/* Linha 2: Filtros de Situação & Alternância de Visualização */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase text-slate-400 mr-1">Situação:</span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('aberto')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'aberto'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Inscrições Abertas ({courses.filter((c) => c.status === 'aberto' || c.status === 'ultimas_vagas').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ultimas_vagas')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === 'ultimas_vagas'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
              }`}
            >
              Últimas Vagas ({courses.filter((c) => c.status === 'ultimas_vagas').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('esgotado')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === 'esgotado'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Turmas Lotadas ({courses.filter((c) => c.status === 'esgotado').length})
            </button>
          </div>

          {/* Alternância de Modo de Visualização */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              Exibindo <strong>{filteredCourses.length}</strong> de {courses.length} opções
            </span>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Exibição em Cards Detalhados"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Exibição em Tabela de Vagas"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Tabela</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── LISTAGEM OFICIAL DOS CURSOS (DUAL VIEW: CARDS OU TABELA) ── */}
      <section>
        {filteredCourses.length > 0 ? (
          viewMode === 'cards' ? (
            /* Visualização em Cards Ricos & Dinâmicos */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {filteredCourses.map((course) => {
                const categoryStyle = CATEGORY_CONFIG[course.category] || DEFAULT_CATEGORY_STYLE;
                const modules = COURSE_MODULES[course.id] || [];
                const isCurriculumExpanded = expandedCurriculumId === course.id;

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
                    {/* Faixa decorativa superior temática */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${categoryStyle.barGradient}`}
                    />

                    {/* Topo do Card: Categoria + Status */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${categoryStyle.badge}`}>
                          {categoryStyle.icon}
                          <span>{course.category}</span>
                        </span>

                        {isFull ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            Turma Lotada
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Últimas {course.availableVacancies} Vagas!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Inscrições Presenciais
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

                    {/* Ficha Técnica: Especificações */}
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

                    {/* Requisitos de Ingresso */}
                    {course.requirements && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div>
                          <strong className="text-slate-900 dark:text-slate-100 font-bold">Requisitos Mínimos: </strong>
                          <span>{course.requirements}</span>
                        </div>
                      </div>
                    )}

                    {/* Ementa / Módulos Interativos (Accordion Dinâmico) */}
                    {modules.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedCurriculumId(isCurriculumExpanded ? null : course.id)}
                          className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer py-1 group/acc"
                        >
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {isCurriculumExpanded ? 'Ocultar Conteúdo Programático' : `Ver Grade Curricular (${modules.length} Módulos)`}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isCurriculumExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isCurriculumExpanded && (
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {modules.map((mod, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 text-xs py-1 border-b border-slate-200/60 dark:border-slate-700/60 last:border-none">
                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                  {mod.title}
                                </span>
                                <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 text-[11px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md">
                                  {mod.hours}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Painel de Controle de Vagas */}
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
                            Quadro de Vagas
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
                            {course.filledVacancies} inscritos
                          </span>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {occupancy}% da turma preenchida
                          </div>
                        </div>
                      </div>

                      {/* Barra de Progresso com Preenchimento Gradiente */}
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
                    </div>

                    {/* Rodapé do Card: Local Físico & Botão para Modal Oficial */}
                    <div className="flex flex-col gap-2.5 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">Inscrição presencial: Secretaria do {school?.shortName || school?.name}</span>
                      </div>

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
            /* Visualização em Tabela Rápida de Vagas */
            <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/90 dark:border-slate-700">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Curso & Categoria</th>
                    <th scope="col" className="px-4 py-3.5">Carga & Turno</th>
                    <th scope="col" className="px-4 py-3.5">Vagas Livres</th>
                    <th scope="col" className="px-4 py-3.5">Situação</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCourses.map((course) => {
                    const isFull = course.availableVacancies <= 0;
                    const isLow = course.availableVacancies > 0 && course.availableVacancies <= 5;

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {course.title}
                          </div>
                          <span className="inline-block mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{course.workload}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{course.shift} · {course.modality}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <strong className={`text-base font-extrabold ${isFull ? 'text-slate-400' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {course.availableVacancies}
                            </strong>
                            <span className="text-xs text-slate-500 dark:text-slate-400">/ {course.totalVacancies}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isFull ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                              Esgotado
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Últimas Vagas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Vagas Abertas
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedCourseDetails(course)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            <span>Local de Inscrição</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
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
              Tente redefinir o campo de busca ou alternar para outra área ou turno.
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

            {/* Ficha Resumida */}
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
                  Matrícula Exclusivamente Presencial no Polo
                </strong>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  Para garantir sua vaga, compareça pessoalmente à secretaria do polo com os documentos exigidos abaixo.
                  As vagas são preenchidas por ordem de chegada presencial até o limite da turma.
                </p>
              </div>
            </div>

            {/* Bloco 1: Local Físico e Horários */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col gap-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Local Físico de Atendimento
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    secretariatStatus.isOpen
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${secretariatStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {secretariatStatus.text}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Unidade / Polo</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-sm">{school?.name || 'CEEPT Brasiléia'}</strong>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Endereço Completo</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{school?.address || 'Brasiléia - AC'}</span>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Setor de Matrículas</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Secretaria Acadêmica — Sala 02</span>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px]">Horário de Atendimento</span>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold text-emerald-700 dark:text-emerald-400">
                    Seg. a Sex.: 08h às 12h e 14h às 21h
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Checklist Interativo de Documentos */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      Documentos Necessários (Checklist)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Marque os itens que você já separou para levar à secretaria:
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {totalCheckedDocs} de {REQUIRED_DOCUMENTS.length} prontos ({docsProgress}%)
                </span>
              </div>

              {/* Barra de progresso dos documentos */}
              <div className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${docsProgress}%` }}
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const isChecked = !!checkedDocs[doc.id];
                  return (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-600 text-slate-900 dark:text-slate-100 font-semibold'
                          : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDocCheck(doc.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                        {doc.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Ações no Rodapé do Modal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Traçar Rota no Google Maps</span>
              </a>

              {whatsappUrl && (
                <a
                  href={`https://wa.me/${contactPhone.startsWith('55') ? contactPhone : `55${contactPhone}`}?text=${encodeURIComponent(
                    `Olá! Estou com meus documentos e gostaria de confirmar o atendimento para o curso de ${selectedCourseDetails.title} no CEEPT Brasiléia.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
                  </svg>
                  <span>Dúvidas no WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
