/**
 * lib/courses.js — Acesso à tabela `courses` do Supabase para o Portal SEE.
 * Cursos gratuitos oferecidos pelo Estado (SEE/AC) através de instituições e polos técnicos.
 */
import { createServerClient } from '@/lib/supabase/server';

export const COURSE_CATEGORIES = [
  'Tecnologia da Informação',
  'Gestão & Negócios',
  'Saúde & Bem-Estar',
  'Indústria & Serviços',
  'Idiomas & Comunicação',
  'Artesanato & Empreendedorismo',
];

export const FALLBACK_COURSES = [
  {
    id: 'curso-ti-1',
    schoolId: 'cpt-brasileia-01',
    schoolSlug: 'centro-educacao-profissional-tecnologica-brasileia',
    schoolName: 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia',
    title: 'Informática Básica e Ferramentas Digitais de Escritório',
    category: 'Tecnologia da Informação',
    description: 'Capacitação prática em sistemas operacionais, pacote office (Word, Excel, PowerPoint), navegação segura na internet e rotinas digitais de trabalho.',
    workload: '160h',
    shift: 'Noturno',
    modality: 'Presencial',
    totalVacancies: 35,
    filledVacancies: 22,
    availableVacancies: 13,
    requirements: 'Ensino Fundamental completo e idade mínima de 16 anos.',
    registrationStart: '2026-10-01',
    registrationEnd: '2026-10-31',
    classesStart: '2026-11-10',
    status: 'aberto',
    author: 'Coordenação de Educação Profissional — SEE/AC',
  },
  {
    id: 'curso-gestao-1',
    schoolId: 'cpt-brasileia-01',
    schoolSlug: 'centro-educacao-profissional-tecnologica-brasileia',
    schoolName: 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia',
    title: 'Assistente Administrativo e Financeiro',
    category: 'Gestão & Negócios',
    description: 'Rotinas administrativas, atendimento ao cliente, controle de fluxo de caixa, redação empresarial e noções de recursos humanos.',
    workload: '180h',
    shift: 'Vespertino',
    modality: 'Presencial',
    totalVacancies: 40,
    filledVacancies: 28,
    availableVacancies: 12,
    requirements: 'Ensino Médio em andamento ou concluído.',
    registrationStart: '2026-10-05',
    registrationEnd: '2026-11-05',
    classesStart: '2026-11-17',
    status: 'aberto',
    author: 'Coordenação de Educação Profissional — SEE/AC',
  },
  {
    id: 'curso-ti-2',
    schoolId: 'cpt-brasileia-01',
    schoolSlug: 'centro-educacao-profissional-tecnologica-brasileia',
    schoolName: 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia',
    title: 'Manutenção de Computadores e Redes de Comunicação',
    category: 'Tecnologia da Informação',
    description: 'Montagem e desmontagem de hardware, diagnóstico e reparo de periféricos, crimpagem de cabos de rede e configuração de roteadores Wi-Fi.',
    workload: '200h',
    shift: 'Matutino',
    modality: 'Presencial',
    totalVacancies: 25,
    filledVacancies: 21,
    availableVacancies: 4,
    requirements: 'Ensino Fundamental completo e idade mínima de 16 anos.',
    registrationStart: '2026-09-20',
    registrationEnd: '2026-10-25',
    classesStart: '2026-11-03',
    status: 'ultimas_vagas',
    author: 'Coordenação de Educação Profissional — SEE/AC',
  },
  {
    id: 'curso-mkt-1',
    schoolId: 'cpt-brasileia-01',
    schoolSlug: 'centro-educacao-profissional-tecnologica-brasileia',
    schoolName: 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia',
    title: 'Marketing Digital e Gestão de Mídias Sociais para Negócios',
    category: 'Gestão & Negócios',
    description: 'Criação de conteúdo estratégico, anúncios digitais, fotografia para comércio eletrônico e uso profissional de Instagram e WhatsApp Business.',
    workload: '120h',
    shift: 'Noturno',
    modality: 'Semipresencial',
    totalVacancies: 30,
    filledVacancies: 15,
    availableVacancies: 15,
    requirements: 'Idade mínima de 16 anos e noções básicas de informática.',
    registrationStart: '2026-10-10',
    registrationEnd: '2026-11-10',
    classesStart: '2026-11-20',
    status: 'aberto',
    author: 'Coordenação de Educação Profissional — SEE/AC',
  },
  {
    id: 'curso-saude-1',
    schoolId: 'cpt-brasileia-01',
    schoolSlug: 'centro-educacao-profissional-tecnologica-brasileia',
    schoolName: 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia',
    title: 'Cuidador de Idosos e Primeiros Socorros Comunitários',
    category: 'Saúde & Bem-Estar',
    description: 'Cuidados biopsicossociais com a pessoa idosa, administração segura de medicamentos sob orientação médica, mobilidade e socorrismo pré-hospitalar.',
    workload: '180h',
    shift: 'Vespertino',
    modality: 'Presencial',
    totalVacancies: 30,
    filledVacancies: 8,
    availableVacancies: 22,
    requirements: 'Ensino Fundamental completo e idade mínima de 18 anos.',
    registrationStart: '2026-10-15',
    registrationEnd: '2026-11-15',
    classesStart: '2026-11-25',
    status: 'aberto',
    author: 'Coordenação de Educação Profissional — SEE/AC',
  },
  {
    id: 'curso-ingles-1',
    schoolId: 'cpt-brasileia-01',
    schoolSlug: 'centro-educacao-profissional-tecnologica-brasileia',
    schoolName: 'Centro Estadual de Educação Profissional e Tecnológica — CEEPT Brasiléia',
    title: 'Inglês Básico e Instrumental para o Mercado de Trabalho',
    category: 'Idiomas & Comunicação',
    description: 'Vocabulário essencial para atendimento, conversação diária, redação de e-mails profissionais e preparação para oportunidades no setor de serviços.',
    workload: '160h',
    shift: 'Matutino',
    modality: 'Presencial',
    totalVacancies: 30,
    filledVacancies: 30,
    availableVacancies: 0,
    requirements: 'Ensino Fundamental completo e idade mínima de 15 anos.',
    registrationStart: '2026-09-10',
    registrationEnd: '2026-10-10',
    classesStart: '2026-10-20',
    status: 'esgotado',
    author: 'Coordenação de Educação Profissional — SEE/AC',
  },
];

/* ── Mapper ────────────────────────────────────────────────────── */
function mapCourseRow(row) {
  if (!row) return null;
  const total = Number(row.total_vacancies) || 0;
  const filled = Number(row.filled_vacancies) || 0;
  const available = row.available_vacancies !== undefined && row.available_vacancies !== null
    ? Number(row.available_vacancies)
    : Math.max(0, total - filled);

  let status = row.status || 'aberto';
  if (available <= 0) {
    status = 'esgotado';
  } else if (available <= 5 && status === 'aberto') {
    status = 'ultimas_vagas';
  }

  return {
    id:                 String(row.id),
    schoolId:           String(row.school_id || ''),
    schoolSlug:         row.school_slug || '',
    schoolName:         row.school_name || 'CEEPT Brasiléia — Cursos Gratuitos',
    title:              row.title || '',
    category:           row.category || 'Educação Profissional',
    description:        row.description || '',
    workload:           row.workload || '160h',
    shift:              row.shift || 'Noturno',
    modality:           row.modality || 'Presencial',
    totalVacancies:     total,
    filledVacancies:    filled,
    availableVacancies: available,
    requirements:       row.requirements || 'Ensino Fundamental completo',
    registrationStart:  row.registration_start || null,
    registrationEnd:    row.registration_end || null,
    classesStart:       row.classes_start || null,
    status:             status,
    author:             row.author || 'SEE/AC',
    createdAt:          row.created_at || null,
  };
}

/* ── Queries ───────────────────────────────────────────────────── */

/**
 * Retorna todos os cursos cadastrados no Supabase com fallback garantido.
 */
export async function getAllCourses() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error && !error.message?.includes('does not exist')) {
        console.error('[getAllCourses] Erro ao consultar cursos no Supabase:', error.message);
      }
      return FALLBACK_COURSES;
    }

    return data.map(mapCourseRow);
  } catch (err) {
    console.error('[getAllCourses] Exceção ao consultar cursos:', err?.message || err);
    return FALLBACK_COURSES;
  }
}

/**
 * Retorna cursos filtrados por instituição (slug ou ID).
 */
export async function getCoursesBySchool(schoolSlugOrId) {
  const allCourses = await getAllCourses();
  if (!schoolSlugOrId) return allCourses;

  const filtered = allCourses.filter(
    (c) =>
      c.schoolSlug === schoolSlugOrId ||
      c.schoolId === schoolSlugOrId ||
      (schoolSlugOrId === 'centro-educacao-profissional-tecnologica-brasileia')
  );

  return filtered.length > 0 ? filtered : allCourses;
}

/**
 * Busca curso individual por ID.
 */
export async function getCourseById(id) {
  const allCourses = await getAllCourses();
  return allCourses.find((c) => c.id === id) || null;
}
