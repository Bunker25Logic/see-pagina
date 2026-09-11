/**
 * lib/banners.js — Acesso à tabela `banners` do Supabase para o Portal SEE.
 * Inclui dados padrão de fallback gracioso para manter visual refinado caso
 * a tabela ainda não tenha sido populada no banco.
 */
import { createServerClient } from '@/lib/supabase/server';

export const FALLBACK_BANNERS = [
  {
    id: 'b1-demo',
    title: 'Encontro Pedagógico 2026',
    subtitle: 'Participe das oficinas de formação continuada para docentes.',
    tag: 'Evento Especial',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    linkUrl: '/eventos',
    targetBlank: false,
    isActive: true,
    orderIndex: 1,
  },
  {
    id: 'b2-demo',
    title: 'Biblioteca Virtual do Acre',
    subtitle: 'Mais de 10.000 livros, periódicos e artigos digitais gratuitos.',
    tag: 'Acesso Gratuito',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    linkUrl: 'https://biblioteca.ac.gov.br',
    targetBlank: true,
    isActive: true,
    orderIndex: 2,
  },
];

function mapBannerRow(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title,
    subtitle: row.subtitle ?? '',
    tag: row.tag ?? 'Destaque',
    imageUrl: row.image_url,
    linkUrl: row.link_url ?? '',
    targetBlank: Boolean(row.target_blank),
    isActive: row.is_active ?? true,
    orderIndex: row.order_index ?? 0,
  };
}

/**
 * Busca banners ativos ordenados por order_index.
 * Retorna fallback caso a tabela não exista ou esteja vazia.
 */
export async function getActiveBanners() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[getActiveBanners] Usando fallback de banners:', error.message);
      return FALLBACK_BANNERS;
    }

    if (!data || data.length === 0) {
      return FALLBACK_BANNERS;
    }

    return data.map(mapBannerRow);
  } catch (err) {
    console.error('[getActiveBanners] Erro ao carregar banners:', err);
    return FALLBACK_BANNERS;
  }
}
