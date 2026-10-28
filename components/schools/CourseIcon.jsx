'use client';

/**
 * Catálogo dos 15 ícones oficiais de cursos em alta definição vetorial SVG.
 * Representam as principais áreas de formação profissional e tecnológica existentes hoje.
 */
export const COURSE_ICONS = [
  {
    id: 'computer',
    name: 'Informática & Ferramentas Digitais',
    shortName: 'Informática Básica',
    area: 'Tecnologia da Informação',
    colorGradient: 'from-blue-600 via-sky-600 to-indigo-700',
    accentColor: '#0284c7',
    desc: 'Sistemas operacionais, pacote office, digitação e rotinas digitais de escritório.',
  },
  {
    id: 'code',
    name: 'Programação, Web & Software',
    shortName: 'Desenvolvimento Web',
    area: 'Tecnologia da Informação',
    colorGradient: 'from-indigo-600 via-violet-600 to-purple-800',
    accentColor: '#6366f1',
    desc: 'Lógica de programação, criação de sites, algoritmos, HTML/CSS e JavaScript.',
  },
  {
    id: 'robotics',
    name: 'Robótica, IA & Automação',
    shortName: 'Robótica & IA',
    area: 'Tecnologia e Indústria',
    colorGradient: 'from-fuchsia-600 via-pink-600 to-rose-700',
    accentColor: '#d946ef',
    desc: 'Montagem de kits robóticos, sensores, Arduino e introdução à inteligência artificial.',
  },
  {
    id: 'network',
    name: 'Redes & Cibersegurança',
    shortName: 'Redes e Segurança',
    area: 'Tecnologia da Informação',
    colorGradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    accentColor: '#0d9488',
    desc: 'Cabeamento estruturado, roteadores, Wi-Fi seguro, servidores e proteção de dados.',
  },
  {
    id: 'design',
    name: 'Design Gráfico & Mídias Digitais',
    shortName: 'Design & Criação',
    area: 'Comunicação Visual',
    colorGradient: 'from-amber-500 via-orange-600 to-rose-600',
    accentColor: '#f59e0b',
    desc: 'Criação de identidade visual, edição vetorial, peças para mídias sociais e tipografia.',
  },
  {
    id: 'marketing',
    name: 'Marketing Digital & Mídias Sociais',
    shortName: 'Marketing Digital',
    area: 'Gestão & Negócios',
    colorGradient: 'from-rose-500 via-red-600 to-pink-700',
    accentColor: '#f43f5e',
    desc: 'Gestão de redes sociais, anúncios patrocinados, tráfego e vendas online.',
  },
  {
    id: 'admin',
    name: 'Administração, Gestão & Finanças',
    shortName: 'Assistente Administrativo',
    area: 'Gestão & Negócios',
    colorGradient: 'from-sky-700 via-blue-800 to-slate-900',
    accentColor: '#1d4ed8',
    desc: 'Rotinas de escritório, fluxo de caixa, controle de estoque e atendimento ao cliente.',
  },
  {
    id: 'health',
    name: 'Saúde, Enfermagem & Primeiros Socorros',
    shortName: 'Saúde & Socorrismo',
    area: 'Saúde & Bem-Estar',
    colorGradient: 'from-red-600 via-rose-600 to-red-800',
    accentColor: '#dc2626',
    desc: 'Sinais vitais, socorrismo pré-hospitalar, biossegurança e procedimentos básicos.',
  },
  {
    id: 'caring',
    name: 'Cuidador de Idosos & Atenção Social',
    shortName: 'Cuidador de Idosos',
    area: 'Saúde & Bem-Estar',
    colorGradient: 'from-amber-600 via-orange-500 to-yellow-600',
    accentColor: '#ea580c',
    desc: 'Cuidados biopsicossociais, acolhimento, administração assistida e bem-estar na 3ª idade.',
  },
  {
    id: 'culinary',
    name: 'Gastronomia, Panificação & Confeitaria',
    shortName: 'Gastronomia & Cozinha',
    area: 'Indústria & Serviços',
    colorGradient: 'from-amber-600 via-yellow-600 to-stone-700',
    accentColor: '#d97706',
    desc: 'Boas práticas na manipulação de alimentos, panificação artesanal e confeitaria comercial.',
  },
  {
    id: 'solar',
    name: 'Eletricidade Predial & Energia Solar',
    shortName: 'Energia Solar & Elétrica',
    area: 'Infraestrutura & Energia',
    colorGradient: 'from-amber-500 via-yellow-500 to-orange-600',
    accentColor: '#eab308',
    desc: 'Instalações elétricas residenciais, quadros de distribuição e montagem fotovoltaica.',
  },
  {
    id: 'mechanics',
    name: 'Mecânica Automotiva & Manutenção Industrial',
    shortName: 'Mecânica & Manutenção',
    area: 'Indústria & Mecânica',
    colorGradient: 'from-slate-600 via-zinc-700 to-stone-800',
    accentColor: '#475569',
    desc: 'Diagnóstico automotivo, ajuste de motores, freios, suspensão e preventiva industrial.',
  },
  {
    id: 'agriculture',
    name: 'Agroecologia, Meio Ambiente & Jardinagem',
    shortName: 'Agroecologia & Campo',
    area: 'Recursos Naturais',
    colorGradient: 'from-emerald-600 via-green-600 to-lime-700',
    accentColor: '#16a34a',
    desc: 'Cultivo sustentável, hortas comunitárias, defensivos naturais e arborização urbana.',
  },
  {
    id: 'languages',
    name: 'Idiomas & Comunicação Internacional',
    shortName: 'Inglês & Espanhol Instrumental',
    area: 'Idiomas & Comunicação',
    colorGradient: 'from-teal-600 via-cyan-700 to-blue-800',
    accentColor: '#0891b2',
    desc: 'Conversação prática para atendimento ao público, hotelaria, fronteiras e comércio exterior.',
  },
  {
    id: 'beauty',
    name: 'Estética, Beleza, Cabelo & Barbearia',
    shortName: 'Estética & Barbearia',
    area: 'Cuidados Pessoais',
    colorGradient: 'from-purple-600 via-pink-600 to-rose-600',
    accentColor: '#c026d3',
    desc: 'Técnicas de corte, escovação, barbearia clássica, design de sobrancelhas e visagismo.',
  },
];

/**
 * Normaliza apelidos legados para o identificador correspondente.
 */
export function normalizeIconType(type) {
  if (!type) return 'computer';
  const clean = String(type).trim().toLowerCase();
  if (clean === 'robot') return 'robotics';
  if (clean === 'language') return 'languages';
  if (clean === 'medic' || clean === 'medicine') return 'health';
  if (clean === 'elderly') return 'caring';
  if (clean === 'electric' || clean === 'energy') return 'solar';
  if (clean === 'food' || clean === 'chef') return 'culinary';
  if (clean === 'agro' || clean === 'nature') return 'agriculture';
  if (clean === 'barber') return 'beauty';
  return clean;
}

/**
 * Componente SVG de Alta Definição com Estilo Profissional.
 */
export default function CourseIcon({ type = 'computer', className = 'w-6 h-6 text-white' }) {
  const norm = normalizeIconType(type);

  switch (norm) {
    case 'code':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="3.5" width="20" height="15" rx="2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9.5L4.5 12l3 2.5m9-5l3 2.5-3 2.5m-5.5 3l2-6M6 6.5h.01M9 6.5h.01M12 6.5h.01" />
        </svg>
      );

    case 'robotics':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="6" width="16" height="13" rx="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m-3-4h6M2 12.5h2m16 0h2M9 15.5h6" />
          <circle cx="8.5" cy="11.5" r="1.5" fill="currentColor" />
          <circle cx="15.5" cy="11.5" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'network':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5l7 3v5.5c0 4.8-3.2 8.7-7 10.5-3.8-1.8-7-5.7-7-10.5V5.5l7-3z" />
          <rect x="9.5" y="11" width="5" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 11V9.5a1.5 1.5 0 013 0V11" />
        </svg>
      );

    case 'design':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l7-7 3 3-7 7-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );

    case 'marketing':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 11v2a2 2 0 002 2h2l5 4V5L7 9H5a2 2 0 00-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.5a4.5 4.5 0 010 7m3-10a8 8 0 010 13M6 15v5a1 1 0 001 1h1a1 1 0 001-1v-5" />
        </svg>
      );

    case 'admin':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="7" width="18" height="14" rx="2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 6v3m3-5v5m3-2v2" />
          <line x1="3" y1="11.5" x2="21" y2="11.5" />
        </svg>
      );

    case 'health':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5v4.5a3.5 3.5 0 007 0V4.5m0 4.5a3.5 3.5 0 007 0V4.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a4 4 0 008 0v-4.5" />
          <circle cx="12" cy="18.5" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 7h3M12 5.5v3" />
        </svg>
      );

    case 'caring':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5C10.5 2.5 7 2.5 5 4.5S4 9 7 12l5 5 5-5c3-3 3-5.5 1-7.5s-5.5-2-6-1.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 13.5l3 2 4-2m9 0l-3 2-4-2" />
          <circle cx="12" cy="8.5" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'culinary':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 13h12a3 3 0 003-3c0-1.8-1.2-3.3-2.9-3.7A4.5 4.5 0 009.9 5 4.5 4.5 0 003.9 6.3 3 3 0 006 13z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 13v6a2 2 0 002 2h8a2 2 0 002-2v-6m-8 4h4" />
        </svg>
      );

    case 'solar':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2.5m0 15V22M4.5 12H2m20 0h-2.5M5.5 5.5l2 2m9 9l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2" />
          <polygon strokeLinecap="round" strokeLinejoin="round" points="13 7 8 13.5 12 13.5 11 18 16 11.5 12 11.5 13 7" fill="currentColor" fillOpacity={0.2} />
        </svg>
      );

    case 'mechanics':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );

    case 'agriculture':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V11m0 0a5 5 0 015-5c3.5 0 5 3 5 5 0 4-5 6-10 6m0-6a5 5 0 00-5-5C3.5 6 2 9 2 11c0 4 5 6 10 6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 22h8" />
        </svg>
      );

    case 'languages':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18m1-18a17 17 0 010 18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17l4 4m0-4l-4 4" />
        </svg>
      );

    case 'beauty':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12l.7-1.4 1.4-.7-1.4-.7L19 7.8l-.7 1.4-1.4.7 1.4.7.7 1.4z" />
        </svg>
      );

    case 'computer':
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="3.5" width="20" height="13" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 20.5h8m-4-4v4M6.5 8h11M6.5 11.5h7" />
        </svg>
      );
  }
}
