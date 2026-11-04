/**
 * lib/cronogramas.js — Acesso à tabela `cronogramas` do Supabase para o Portal SEE.
 * Suporta abas dinâmicas de instituições e setores oficiais.
 */
import { createServerClient } from '@/lib/supabase/server';

export const CORE_SECTORS = [
  { id: 'ensino',          label: 'Ensino',            fullName: 'Coordenação Pedagógica e de Ensino', type: 'core' },
  { id: 'cultura_esporte', label: 'Cultura e Esporte', fullName: 'Atividades Culturais e Desportivas', type: 'core' },
];

export const SECTORS = CORE_SECTORS;

export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatSectorLabel(id) {
  if (!id) return 'Geral';
  const match = CORE_SECTORS.find(s => s.id === id);
  if (match) return match.label;
  if (id === 'dire') return 'DIRE';
  if (id === 'administracao') return 'Administração';
  if (id === 'transporte') return 'Transporte';
  return id
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function getActiveSectors() {
  const map = new Map();

  // 1. Setores Oficiais Padrão
  CORE_SECTORS.forEach(s => {
    map.set(s.id, { ...s });
  });

  try {
    const supabase = createServerClient();

    // 2. Escolas cadastradas com has_cronograma = true
    try {
      const { data: schools } = await supabase
        .from('schools')
        .select('*');

      if (Array.isArray(schools)) {
        schools.forEach(sch => {
          if (sch.has_cronograma) {
            const id = sch.slug || slugify(sch.short_name || sch.name);
            map.set(id, {
              id,
              label: sch.short_name || sch.name,
              fullName: sch.name,
              schoolId: sch.id,
              slug: sch.slug,
              type: 'escola',
            });
          }
        });
      }
    } catch (err) {
      console.warn('[getActiveSectors] Erro ao buscar escolas:', err);
    }

    // 3. Usuários/publicadores com cronograma ativado
    try {
      const { data: users } = await supabase
        .from('painel_users')
        .select('escola_setor, cronograma_active, permissions')
        .eq('is_active', true);

      if (Array.isArray(users)) {
        users.forEach(u => {
          if (u.escola_setor && (u.cronograma_active || u.permissions?.includes('cronogramas'))) {
            const id = slugify(u.escola_setor);
            if (!map.has(id)) {
              map.set(id, {
                id,
                label: u.escola_setor,
                fullName: u.escola_setor,
                type: 'instituicao',
              });
            }
          }
        });
      }
    } catch (err) {
      console.warn('[getActiveSectors] Erro ao buscar usuários:', err);
    }

    // 4. Cronogramas ativos para garantir que qualquer instituição ou setor com atividade já publicada apareça
    try {
      const { data: cronos } = await supabase
        .from('cronogramas')
        .select('setor')
        .eq('is_active', true);

      if (Array.isArray(cronos)) {
        cronos.forEach(c => {
          if (c.setor) {
            const id = slugify(c.setor);
            if (!map.has(c.setor) && !map.has(id)) {
              if (c.setor === 'dire') {
                map.set('dire', { id: 'dire', label: 'DIRE', fullName: 'Diretoria Regional de Educação', type: 'core' });
              } else if (c.setor === 'administracao') {
                map.set('administracao', { id: 'administracao', label: 'Administração', fullName: 'Gestão e Prestação de Contas', type: 'core' });
              } else if (c.setor === 'transporte') {
                map.set('transporte', { id: 'transporte', label: 'Transporte', fullName: 'Transporte e Logística Escolar', type: 'core' });
              } else {
                map.set(c.setor, {
                  id: c.setor,
                  label: formatSectorLabel(c.setor),
                  fullName: formatSectorLabel(c.setor),
                  type: 'instituicao',
                });
              }
            }
          }
        });
      }
    } catch (err) {
      console.warn('[getActiveSectors] Erro ao buscar setores de cronogramas:', err);
    }
  } catch (outerErr) {
    console.warn('[getActiveSectors] Erro geral:', outerErr);
  }

  return Array.from(map.values());
}

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
      : row.setor === 'ensino'
      ? 'Coordenação Pedagógica e de Ensino'
      : 'Núcleo de Educação';

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
