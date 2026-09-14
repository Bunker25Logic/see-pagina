import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Controle de taxa em memória (Rate Limiter) para proteger a cota do Supabase
// Limita no máximo 1 voto a cada 1.2 segundos por aparelho
const rateLimitMap = new Map();

function isRateLimited(key, limitMs = 1200) {
  const now = Date.now();
  const lastTime = rateLimitMap.get(key) || 0;
  if (now - lastTime < limitMs) {
    return true;
  }
  rateLimitMap.set(key, now);

  // Limpeza de entradas antigas a cada 500 registros para economizar memória
  if (rateLimitMap.size > 500) {
    for (const [k, t] of rateLimitMap.entries()) {
      if (now - t > 60000) rateLimitMap.delete(k);
    }
  }
  return false;
}

/**
 * GET /api/news/react?newsId=...&device=...
 * Consulta o estado atual da reação deste aparelho e os contadores da matéria.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');
    const device = searchParams.get('device');

    if (!newsId) {
      return NextResponse.json({ error: 'ID da notícia não fornecido' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Busca contagens atuais da notícia
    const { data: newsData } = await supabase
      .from('news')
      .select('likes_count, dislikes_count')
      .eq('id', newsId)
      .maybeSingle();

    let userReaction = null;

    // Se o aparelho foi informado, verifica se já votou
    if (device) {
      const { data: reactionData } = await supabase
        .from('news_reactions')
        .select('reaction_type')
        .eq('news_id', newsId)
        .eq('device_fingerprint', device)
        .maybeSingle();

      if (reactionData) {
        userReaction = reactionData.reaction_type;
      }
    }

    return NextResponse.json({
      likesCount: Number(newsData?.likes_count) || 0,
      dislikesCount: Number(newsData?.dislikes_count) || 0,
      userReaction,
    });
  } catch (err) {
    console.warn('[API /api/news/react GET] Erro ao consultar reações:', err);
    return NextResponse.json({ likesCount: 0, dislikesCount: 0, userReaction: null });
  }
}

/**
 * POST /api/news/react
 * Alterna voto (Like / Dislike) com proteção antifraude e limitação de requisições.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { newsId, deviceFingerprint, reactionType } = body;

    if (!newsId || !deviceFingerprint || !['like', 'dislike'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos para reação' },
        { status: 400 }
      );
    }

    // 1. Proteção de Taxa (Rate Limit) contra spam / ataques ao limite do Supabase
    const rateLimitKey = `${newsId}:${deviceFingerprint}`;
    if (isRateLimited(rateLimitKey, 1200)) {
      return NextResponse.json(
        { error: 'Aguarde um momento antes de votar novamente.' },
        { status: 429 }
      );
    }

    const supabase = createServerClient();

    // 2. Execução da RPC atômica toggle_news_reaction
    const { data: rpcData, error: rpcError } = await supabase.rpc('toggle_news_reaction', {
      p_news_id: newsId,
      p_device_fingerprint: deviceFingerprint,
      p_reaction_type: reactionType,
    });

    if (!rpcError && rpcData) {
      return NextResponse.json(rpcData);
    }

    // 3. Fallback resiliente: Caso a função RPC ainda não tenha sido criada no Supabase
    // Realiza a lógica manualmente com proteção de unicidade
    const { data: existing } = await supabase
      .from('news_reactions')
      .select('id, reaction_type')
      .eq('news_id', newsId)
      .eq('device_fingerprint', deviceFingerprint)
      .maybeSingle();

    let userReaction = null;

    if (!existing) {
      // Inserção do voto
      await supabase.from('news_reactions').insert({
        news_id: newsId,
        device_fingerprint: deviceFingerprint,
        reaction_type: reactionType,
      });
      userReaction = reactionType;
    } else if (existing.reaction_type === reactionType) {
      // Remoção do voto (toggle off)
      await supabase.from('news_reactions').delete().eq('id', existing.id);
      userReaction = null;
    } else {
      // Troca de voto (like <-> dislike)
      await supabase
        .from('news_reactions')
        .update({ reaction_type: reactionType, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      userReaction = reactionType;
    }

    // Recalcula totais
    const { count: likes } = await supabase
      .from('news_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('news_id', newsId)
      .eq('reaction_type', 'like');

    const { count: dislikes } = await supabase
      .from('news_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('news_id', newsId)
      .eq('reaction_type', 'dislike');

    const likesCount = likes || 0;
    const dislikesCount = dislikes || 0;

    await supabase
      .from('news')
      .update({ likes_count: likesCount, dislikes_count: dislikesCount })
      .eq('id', newsId);

    return NextResponse.json({
      likesCount,
      dislikesCount,
      userReaction,
    });
  } catch (err) {
    console.error('[API /api/news/react POST] Erro ao processar reação:', err);
    return NextResponse.json(
      { error: 'Não foi possível registrar seu voto no momento.' },
      { status: 500 }
    );
  }
}
