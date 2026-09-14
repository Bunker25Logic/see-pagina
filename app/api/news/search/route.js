import { NextResponse } from 'next/server';
import { searchNews } from '@/lib/news';

export const dynamic = 'force-dynamic';

/**
 * GET /api/news/search?q=...
 * Busca notícias por termos-chave em tempo real com sanitização e limite.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    // Sanitiza caracteres especiais para evitar quebras em expressões SQL
    const sanitized = query.trim().replace(/[%,_]/g, ' ').trim();
    if (!sanitized) {
      return NextResponse.json({ results: [] });
    }

    const results = await searchNews(sanitized, 6);
    return NextResponse.json({ results });
  } catch (err) {
    console.error('[API /api/news/search]', err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
