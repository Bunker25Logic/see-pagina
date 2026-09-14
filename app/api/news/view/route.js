import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/news/view
 * Contabiliza visualização na notícia sempre que alguém acessa a matéria.
 */
export async function POST(request) {
  try {
    const { newsId } = await request.json();

    if (!newsId) {
      return NextResponse.json({ error: 'ID da notícia não fornecido' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Tenta primeiro chamar a RPC atômica increment_news_view
    const { data, error: rpcError } = await supabase.rpc('increment_news_view', {
      p_news_id: newsId,
    });

    if (!rpcError) {
      return NextResponse.json({ success: true, viewsCount: data });
    }

    // Fallback: Se a RPC ainda não tiver sido criada no Supabase pelo usuário,
    // busca a contagem atual e incrementa diretamente
    const { data: newsItem } = await supabase
      .from('news')
      .select('views_count')
      .eq('id', newsId)
      .maybeSingle();

    const currentViews = Number(newsItem?.views_count) || 0;
    const nextViews = currentViews + 1;

    await supabase
      .from('news')
      .update({ views_count: nextViews })
      .eq('id', newsId);

    return NextResponse.json({ success: true, viewsCount: nextViews });
  } catch (err) {
    console.warn('[API /api/news/view] Erro ao registrar visualização:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
