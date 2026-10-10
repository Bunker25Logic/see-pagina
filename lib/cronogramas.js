/**
 * lib/cronogramas.js — Acesso à tabela `cronogramas` do Supabase para o Portal SEE.
 * Setores ativos: 'ensino' e 'cultura_esporte'.
 */
import { createServerClient } from '@/lib/supabase/server';

export const SECTORS = [
  { id: 'ensino',          label: 'Ensino',            fullName: 'Coordenação Pedagógica e de Ensino' },
  { id: 'cultura_esporte', label: 'Cultura e Esporte', fullName: 'Atividades Culturais e Desportivas' },
];

export const FALLBACK_CRONOGRAMAS = [
  // Ensino
  {
    id: 'c-ensino-1',
    setor: 'ensino',
    titulo: 'Conselho de Classe do 3º Bimestre',
    descricao: 'Avaliação do desempenho acadêmico e planejamento de reforço escolar.',
    dataInicio: '2026-09-15',
    dataFim: '2026-09-19',
    status: 'Concluído',
    local: 'Todas as Escolas',
    author: 'Coordenação Pedagógica e de Ensino',
    orderIndex: 1,
  },
  {
    id: 'c-ensino-2',
    setor: 'ensino',
    titulo: 'Formação Continuada para Professores',
    descricao: 'Oficina prática de novas metodologias ativas e tecnologias educacionais.',
    dataInicio: '2026-09-28',
    dataFim: '2026-09-29',
    status: 'Concluído',
    local: 'Centro de Capacitação',
    author: 'Coordenação Pedagógica e de Ensino',
    orderIndex: 2,
  },
  {
    id: 'c-ensino-3',
    setor: 'ensino',
    titulo: 'Encontro Pedagógico dos Coordenadores Regionais',
    descricao: 'Alinhamento dos planos de ação para o fechamento do ano letivo de 2026.',
    dataInicio: '2026-10-15',
    dataFim: '2026-10-15',
    status: 'Previsto',
    local: 'Auditório do Núcleo de Educação',
    author: 'Coordenação Pedagógica e de Ensino',
    orderIndex: 3,
  },
  {
    id: 'c-ensino-4',
    setor: 'ensino',
    titulo: 'Aplicação das Avaliações Diagnósticas e Simulado Estadual',
    descricao: 'Avaliação diagnóstica de Língua Portuguesa e Matemática para o Ensino Fundamental e Médio.',
    dataInicio: '2026-11-04',
    dataFim: '2026-11-06',
    status: 'Previsto',
    local: 'Todas as Escolas Estaduais',
    author: 'Coordenação Pedagógica e de Ensino',
    orderIndex: 4,
  },

  // Cultura e Esporte
  {
    id: 'c-cultura-1',
    setor: 'cultura_esporte',
    titulo: 'Fase Municipal dos Jogos Escolares do Acre',
    descricao: 'Disputas de futsal, voleibol e atletismo entre as escolas de Brasiléia.',
    dataInicio: '2026-10-08',
    dataFim: '2026-10-12',
    status: 'Em andamento',
    local: 'Ginásio Eduardo Lopes Pessoa',
    author: 'Setor de Esportes • Núcleo SEE',
    orderIndex: 1,
  },
  {
    id: 'c-cultura-2',
    setor: 'cultura_esporte',
    titulo: 'Mostra Estudantil de Arte e Cultura Regional',
    descricao: 'Apresentações teatrais, dança folclórica e exposição de artes visuais.',
    dataInicio: '2026-10-22',
    dataFim: '2026-10-23',
    status: 'Previsto',
    local: 'Praça Hugo Poli',
    author: 'Coordenação Cultural e Desportiva',
    orderIndex: 2,
  },
  {
    id: 'c-cultura-3',
    setor: 'cultura_esporte',
    titulo: 'Festival da Consciência Negra e Diversidade Cultural',
    descricao: 'Apresentações culturais, debates temáticos e oficinas interdisciplinares.',
    dataInicio: '2026-11-20',
    dataFim: '2026-11-20',
    status: 'Previsto',
    local: 'Escola Kairala José Kairala',
    author: 'Coordenação Cultural e Desportiva',
    orderIndex: 3,
  },
  {
    id: 'c-cultura-4',
    setor: 'cultura_esporte',
    titulo: 'Torneio Interescolar de Xadrez e Jogos de Raciocínio',
    descricao: 'Competição de raciocínio lógico e xadrez rápido entre estudantes da rede.',
    dataInicio: '2026-11-27',
    dataFim: '2026-11-28',
    status: 'Previsto',
    local: 'Centro de Juventude de Brasiléia',
    author: 'Setor de Esportes • Núcleo SEE',
    orderIndex: 4,
  },
];

function mapCronogramaRow(row) {
  if (!row) return null;
  const defaultAuthor =
    row.setor === 'cultura_esporte'
      ? 'Coordenação de Cultura e Esporte'
      : 'Coordenação Pedagógica e de Ensino';

  return {
    id: String(row.id),
    setor: row.setor,
    titulo: row.titulo,
    descricao: row.descricao ?? '',
    dataInicio: row.data_inicio,
    dataFim: row.data_fim ?? row.data_inicio,
    status: row.status ?? 'Previsto',
    local: row.local ?? '',
    author: row.author || row.created_by || defaultAuthor,
    createdBy: row.created_by ?? '',
    isActive: Boolean(row.is_active),
    orderIndex: row.order_index ?? 0,
  };
}

/**
 * Busca todos os cronogramas ativos ordenados por data de início.
 */
export async function getActiveCronogramas() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('cronogramas')
      .select('*')
      .eq('is_active', true)
      .in('setor', ['ensino', 'cultura_esporte'])
      .order('data_inicio', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.warn('[getActiveCronogramas] Supabase indisponível, usando fallback:', error);
      return FALLBACK_CRONOGRAMAS;
    }

    if (!data) return [];

    return data.map(mapCronogramaRow);
  } catch (err) {
    console.error('[getActiveCronogramas] Erro ao carregar cronogramas:', err);
    return FALLBACK_CRONOGRAMAS;
  }
}

/**
 * Agrupa os cronogramas pelas 2 chaves de setor:
 * 'ensino' e 'cultura_esporte'.
 */
export function groupCronogramasBySector(cronogramas) {
  const grouped = {
    ensino: [],
    cultura_esporte: [],
  };

  for (const item of cronogramas) {
    if (grouped[item.setor]) {
      grouped[item.setor].push(item);
    }
  }

  return grouped;
}
