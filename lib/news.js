/**
 * lib/news.js — Funções de acesso à tabela `news` do Supabase.
 *
 * Colunas na tabela `news`:
 *   id, title, excerpt, content, category, date, author,
 *   image_url, image_alt, slug, is_featured, published_at,
 *   views_count, likes_count, dislikes_count
 */
import { createServerClient } from '@/lib/supabase/server';

/* ── Mapper: snake_case (DB) → camelCase (componentes) ────────── */
function mapNewsRow(row) {
  if (!row) return null;
  return {
    id:            String(row.id),
    title:         row.title          ?? '',
    excerpt:       row.excerpt        ?? '',
    content:       row.content        ?? '',
    category:      row.category       ?? '',
    date:          row.date           ?? '',
    author:        row.author         ?? '',
    imageUrl:      row.image_url      ?? '',
    imageAlt:      row.image_alt      ?? row.title ?? '',
    slug:          row.slug           ?? '',
    isFeatured:    row.is_featured    ?? false,
    viewsCount:    Number(row.views_count) || 0,
    likesCount:    Number(row.likes_count) || 0,
    dislikesCount: Number(row.dislikes_count) || 0,
  };
}

/* ── Queries Oficiais do Servidor (Supabase) ───────────────────── */

/** Notícia em destaque (is_featured = true ou mais recente publicada). */
export async function getFeaturedStory() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[getFeaturedStory]', error.message);
    }
    if (data) return mapNewsRow(data);

    // Se nenhuma notícia tiver is_featured = true, seleciona a mais recente publicada
    const { data: latestData, error: latestErr } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestErr) {
      console.error('[getFeaturedStory latest]', latestErr.message);
    }
    if (latestData) return mapNewsRow(latestData);
  } catch (err) {
    console.error('[getFeaturedStory] Erro ao consultar Supabase:', err);
  }

  return null;
}

/** Notícias secundárias oficiais (is_featured = false), mais recentes primeiro. */
export async function getSecondaryNews(limit = 3) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_featured', false)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getSecondaryNews]', error.message);
      return [];
    }
    return (data ?? []).map(mapNewsRow);
  } catch (err) {
    console.error('[getSecondaryNews] Erro ao consultar Supabase:', err);
    return [];
  }
}

/** Retorna todas as notícias oficiais cadastradas no servidor para a página /noticias. */
export async function getAllNews() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[getAllNews]', error.message);
      return [];
    }
    return (data ?? []).map(mapNewsRow);
  } catch (err) {
    console.error('[getAllNews] Erro ao consultar Supabase:', err);
    return [];
  }
}

/** Busca uma notícia oficial pelo slug. */
export async function getNewsBySlug(slug) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[getNewsBySlug]', error.message);
      return null;
    }
    return mapNewsRow(data);
  } catch (err) {
    console.error('[getNewsBySlug] Erro ao consultar Supabase:', err);
    return null;
  }
}

/** Todos os slugs publicados oficialmente — usado em generateStaticParams. */
export async function getAllNewsSlugs() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('slug');

    if (error) {
      console.error('[getAllNewsSlugs]', error.message);
      return [];
    }
    return (data ?? []).map((row) => ({ slug: row.slug }));
  } catch (err) {
    console.error('[getAllNewsSlugs] Erro:', err);
    return [];
  }
}

/** Notícias relacionadas oficiais (exclui o slug atual). */
export async function getRelatedNews(currentSlug, count = 3) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(count);

    if (error) {
      console.error('[getRelatedNews]', error.message);
      return [];
    }
    return (data ?? []).map(mapNewsRow);
  } catch (err) {
    console.error('[getRelatedNews] Erro:', err);
    return [];
  }
}

/**
 * As N notícias mais recentes formatadas para o widget "Atualizações"
 * no sidebar. Retorna: { id, timeLabel, text, href }
 */
export async function getRecentNewsForUpdates(count = 3) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('id, title, slug, published_at')
      .order('published_at', { ascending: false })
      .limit(count);

    if (error) {
      console.error('[getRecentNewsForUpdates]', error.message);
      return [];
    }
    return (data ?? []).map((row) => ({
      id:        String(row.id),
      timeLabel: formatRelativeTime(row.published_at),
      text:      row.title,
      href:      `/noticias/${row.slug}`,
    }));
  } catch (err) {
    console.error('[getRecentNewsForUpdates] Erro:', err);
    return [];
  }
}

/**
 * Busca notícias por palavras-chave (título, resumo, categoria ou conteúdo).
 */
export async function searchNews(query, limit = 6) {
  if (!query || typeof query !== 'string' || !query.trim()) return [];
  const clean = query.trim();
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news')
      .select('id, title, excerpt, category, date, slug, image_url, image_alt, views_count, published_at')
      .or(`title.ilike.%${clean}%,excerpt.ilike.%${clean}%,category.ilike.%${clean}%,content.ilike.%${clean}%`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[searchNews]', error.message);
      return [];
    }
    return (data ?? []).map(mapNewsRow);
  } catch (err) {
    console.error('[searchNews] Erro:', err);
    return [];
  }
}

/* ── Utilitário ────────────────────────────────────────────────── */

function formatRelativeTime(isoDate) {
  if (!isoDate) return '';
  const now  = new Date();
  const date = new Date(isoDate);
  const diffMs = now - date;
  const diffH  = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD  = Math.floor(diffH / 24);

  if (diffH < 1)  return 'Há poucos minutos';
  if (diffH < 24) return `Há ${diffH} hora${diffH > 1 ? 's' : ''}`;
  if (diffD === 1) return 'Ontem';
  if (diffD < 7)  return `Há ${diffD} dias`;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}
