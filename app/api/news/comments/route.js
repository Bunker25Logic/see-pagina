import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Rate limiter para comentários: máximo 1 comentário a cada 4 segundos por aparelho
const commentRateLimitMap = new Map();

function isCommentRateLimited(key, limitMs = 4000) {
  const now = Date.now();
  const lastTime = commentRateLimitMap.get(key) || 0;
  if (now - lastTime < limitMs) {
    return true;
  }
  commentRateLimitMap.set(key, now);
  return false;
}

/**
 * GET /api/news/comments?newsId=...
 * Retorna os comentários públicos da matéria ordenados cronologicamente.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');

    if (!newsId) {
      return NextResponse.json({ error: 'ID da matéria não fornecido' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news_comments')
      .select('id, author_name, content, created_at')
      .eq('news_id', newsId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      // Se a tabela ainda não existe no Supabase, retorna lista vazia amigável
      return NextResponse.json({ comments: [] });
    }

    return NextResponse.json({ comments: data || [] });
  } catch (err) {
    console.warn('[API /api/news/comments GET]', err);
    return NextResponse.json({ comments: [] });
  }
}

/**
 * POST /api/news/comments
 * Cadastra um novo comentário com Nome/Apelido e proteção de taxa.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { newsId, authorName, content, deviceFingerprint } = body;

    if (!newsId || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Por favor, digite seu comentário.' },
        { status: 400 }
      );
    }

    // Validação de Nome ou Apelido
    const cleanedName = (authorName || '').trim();
    if (!cleanedName || cleanedName.length < 2) {
      return NextResponse.json(
        { error: 'Por favor, informe seu nome ou apelido para identificar seu comentário.' },
        { status: 400 }
      );
    }

    if (cleanedName.length > 50) {
      return NextResponse.json(
        { error: 'O nome ou apelido deve ter no máximo 50 caracteres.' },
        { status: 400 }
      );
    }

    const cleanedContent = content.trim();
    if (cleanedContent.length > 1000) {
      return NextResponse.json(
        { error: 'O comentário deve ter no máximo 1000 caracteres.' },
        { status: 400 }
      );
    }

    // Rate Limiter contra spam / esgotamento de conexões
    const rateKey = deviceFingerprint || 'anon';
    if (isCommentRateLimited(rateKey, 4000)) {
      return NextResponse.json(
        { error: 'Você está enviando mensagens muito rápido. Aguarde alguns segundos.' },
        { status: 429 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('news_comments')
      .insert({
        news_id: newsId,
        author_name: cleanedName,
        content: cleanedContent,
        device_fingerprint: deviceFingerprint || null,
        is_approved: true,
      })
      .select('id, author_name, content, created_at')
      .single();

    if (error) {
      console.error('[API /api/news/comments POST] Erro Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar comentário. Verifique se a tabela foi configurada no banco.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment: data });
  } catch (err) {
    console.error('[API /api/news/comments POST] Exceção:', err);
    return NextResponse.json(
      { error: 'Falha interna ao processar comentário.' },
      { status: 500 }
    );
  }
}
