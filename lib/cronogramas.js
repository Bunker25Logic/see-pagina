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
    status: 'Em andamento',
    local: 'Todas as Escolas',
    orderIndex: 1,
  },
  {
    id: 'c-ensino-2',
    setor: 'ensino',
    titulo: 'Formação Continuada para Professores',
    descricao: 'Oficina prática de novas metodologias ativas e tecnologias educacionais.',
    dataInicio: '2026-09-28',
    dataFim: '2026-09-29',
    status: 'Previsto',
    local: 'Centro de Capacitação',
    orderIndex: 2,
  },

  // Cultura e Esporte
  {
    id: 'c-cultura-1',
    setor: 'cultura_esporte',
    titulo: 'Fase Municipal dos Jogos Escolares do Acre',
    descricao: 'Disputas de futsal, voleibol e atletismo entre as escolas de Brasiléia.',
    dataInicio: '2026-10-08',
    dataFim: '2026-10-12',
    status: 'Previsto',
    local: 'Ginásio Eduardo Lopes Pessoa',
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
    orderIndex: 2,
  },
];

function mapCronogramaRow(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    setor: row.setor,
    titulo: row.titulo,
    descricao: row.descricao ?? '',
    dataInicio: row.data_inicio,
    dataFim: row.data_fim ?? row.data_inicio,
    status: row.status ?? 'Previsto',
    local: row.local ?? '',
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
