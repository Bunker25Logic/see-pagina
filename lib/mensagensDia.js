/**
 * lib/mensagensDia.js — Acesso à tabela `mensagens_dia` do Supabase para o Portal SEE.
 * Retorna a mensagem do dia atualmente ativa com fallback seguro.
 */
import { createServerClient } from '@/lib/supabase/server';

export const FALLBACK_MENSAGEM_DIA = {
  id: 'm-default',
  mensagem: 'Hoje é dia de Conselho de Classe nas escolas da rede — resultados publicados até sexta-feira, 18/09.',
  autor: 'Coordenação Pedagógica',
  linkUrl: '/eventos',
  targetBlank: false,
  isActive: true,
  dataPublicacao: '2026-09-13',
};

function mapMensagemRow(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    mensagem: row.mensagem,
    autor: row.autor ?? 'Núcleo de Educação',
    linkUrl: row.link_url ?? '',
    targetBlank: Boolean(row.target_blank),
    isActive: Boolean(row.is_active),
    dataPublicacao: row.data_publicacao ?? '',
  };
}

/**
 * Busca a mensagem do dia atualmente ativa no portal.
 */
export async function getActiveMensagemDia() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('mensagens_dia')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('[getActiveMensagemDia] Usando mensagem de fallback:', error.message);
      return FALLBACK_MENSAGEM_DIA;
    }

    if (!data || data.length === 0) {
      return FALLBACK_MENSAGEM_DIA;
    }

    return mapMensagemRow(data[0]);
  } catch (err) {
    console.error('[getActiveMensagemDia] Erro ao carregar mensagem do dia:', err);
    return FALLBACK_MENSAGEM_DIA;
  }
}
