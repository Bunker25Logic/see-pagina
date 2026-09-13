/**
 * lib/cronogramas.js — Acesso à tabela `cronogramas` do Supabase para o Portal SEE.
 * Contém categorias: 'dire', 'ensino', 'transporte', 'cultura_esporte', 'administracao'.
 */
import { createServerClient } from '@/lib/supabase/server';

export const SECTORS = [
  { id: 'dire',            label: 'DIRE',              fullName: 'Diretoria Regional de Educação' },
  { id: 'ensino',          label: 'Ensino',            fullName: 'Coordenação Pedagógica e de Ensino' },
  { id: 'transporte',      label: 'Transporte',        fullName: 'Transporte Escolar Rural e Urbano' },
  { id: 'cultura_esporte', label: 'Cultura e Esporte', fullName: 'Atividades Culturais e Desportivas' },
  { id: 'administracao',   label: 'Administração',     fullName: 'Gestão Administrativa, RH e Finanças' },
];

export const FALLBACK_CRONOGRAMAS = [
  // DIRE
  {
    id: 'c-dire-1',
    setor: 'dire',
    titulo: 'Reunião de Alinhamento com Gestores Escolares',
    descricao: 'Definição das metas pedagógicas e operacionais para o 4º bimestre.',
    dataInicio: '2026-09-18',
    dataFim: '2026-09-18',
    status: 'Previsto',
    local: 'Auditório do Núcleo SEE',
    orderIndex: 1,
  },
  {
    id: 'c-dire-2',
    setor: 'dire',
    titulo: 'Visita Técnica e Acompanhamento Institucional',
    descricao: 'Inspeção in loco nas unidades de ensino da zona urbana de Brasiléia.',
    dataInicio: '2026-09-24',
    dataFim: '2026-09-26',
    status: 'Previsto',
    local: 'Escolas Estaduais',
    orderIndex: 2,
  },

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

  // Transporte
  {
    id: 'c-transporte-1',
    setor: 'transporte',
    titulo: 'Vistoria Semestral da Frota Escolar',
    descricao: 'Inspeção mecânica, cintos de segurança e documentação dos ônibus rurais.',
    dataInicio: '2026-09-21',
    dataFim: '2026-09-23',
    status: 'Previsto',
    local: 'Garagem Central SEE',
    orderIndex: 1,
  },
  {
    id: 'c-transporte-2',
    setor: 'transporte',
    titulo: 'Atualização dos Roteiros da Zona Rural',
    descricao: 'Ajuste de trajetos e horários para atender os ramais no período de chuvas.',
    dataInicio: '2026-10-02',
    dataFim: '2026-10-05',
    status: 'Previsto',
    local: 'Ramais km 14 ao km 45',
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

  // Administração
  {
    id: 'c-admin-1',
    setor: 'administracao',
    titulo: 'Envio da Folha de Frequência e Horas Extras',
    descricao: 'Prazo limite para fechamento da folha dos servidores da educação.',
    dataInicio: '2026-09-20',
    dataFim: '2026-09-20',
    status: 'Urgente',
    local: 'Setor de RH / Protocolo',
    orderIndex: 1,
  },
  {
    id: 'c-admin-2',
    setor: 'administracao',
    titulo: 'Prestação de Contas do PDDE / Caixa Escolar',
    descricao: 'Plantão para entrega e validação de documentos fiscais das diretorias.',
    dataInicio: '2026-09-30',
    dataFim: '2026-10-02',
    status: 'Previsto',
    local: 'Setor Financeiro SEE',
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
      .order('data_inicio', { ascending: true })
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CRONOGRAMAS;
    }

    return data.map(mapCronogramaRow);
  } catch (err) {
    console.error('[getActiveCronogramas] Erro ao carregar cronogramas:', err);
    return FALLBACK_CRONOGRAMAS;
  }
}

/**
 * Agrupa os cronogramas pelas 5 chaves de setor:
 * 'dire', 'ensino', 'transporte', 'cultura_esporte', 'administracao'.
 */
export function groupCronogramasBySector(cronogramas) {
  const grouped = {
    dire: [],
    ensino: [],
    transporte: [],
    cultura_esporte: [],
    administracao: [],
  };

  for (const item of cronogramas) {
    if (grouped[item.setor]) {
      grouped[item.setor].push(item);
    }
  }

  return grouped;
}
