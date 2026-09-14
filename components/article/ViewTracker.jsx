'use client';

import { useEffect, useRef } from 'react';

/**
 * ViewTracker — Registra visualização da matéria de forma assíncrona ao carregar a página.
 * Inclui proteção contra chamadas duplicadas no mesmo segundo (Strict Mode / re-renders).
 */
export default function ViewTracker({ newsId }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!newsId || hasTracked.current) return;

    // Proteção de debounce por sessão rápida (evita disparo duplicado de StrictMode do React)
    const sessionKey = `view_logged_${newsId}`;
    const lastLogged = sessionStorage.getItem(sessionKey);
    const now = Date.now();

    if (lastLogged && now - Number(lastLogged) < 6000) {
      return;
    }

    hasTracked.current = true;
    sessionStorage.setItem(sessionKey, String(now));

    fetch('/api/news/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsId }),
    }).catch(() => {
      // Falhas de rastreamento não devem quebrar a interface
    });
  }, [newsId]);

  return null;
}
