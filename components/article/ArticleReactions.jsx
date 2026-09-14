'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { createBrowserClient } from '@/lib/supabase/client';

/**
 * ArticleReactions — Sistema de Like / Dislike em tempo real com proteção antifraude por aparelho.
 *
 * Garante que:
 * 1. Cada celular vote apenas uma vez, mesmo após limpar cache ou mudar de Wi-Fi para 4G.
 * 2. O usuário pode alternar entre like e dislike ou cancelar o voto clicando novamente.
 * 3. Rate-limiter no cliente e servidor para poupar cotas do Supabase.
 * 4. Contadores atualizados em tempo real via Supabase Realtime.
 */
export default function ArticleReactions({ newsId, initialLikes = 0, initialDislikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [fingerprint, setFingerprint] = useState(null);
  const lastClickRef = useRef(0);

  // 1. Carrega a assinatura do aparelho e busca estado inicial do voto
  useEffect(() => {
    let isMounted = true;

    async function initDeviceReaction() {
      try {
        const fp = await getDeviceFingerprint();
        if (!isMounted) return;
        setFingerprint(fp);

        // Consulta estado do voto para este aparelho
        const res = await fetch(`/api/news/react?newsId=${newsId}&device=${encodeURIComponent(fp)}`);
        if (!res.ok) return;
        const data = await res.json();

        if (isMounted) {
          if (typeof data.likesCount === 'number') setLikes(data.likesCount);
          if (typeof data.dislikesCount === 'number') setDislikes(data.dislikesCount);
          if (data.userReaction) setUserReaction(data.userReaction);
        }
      } catch (err) {
        console.warn('[ArticleReactions] Erro ao carregar voto do dispositivo:', err);
      }
    }

    initDeviceReaction();

    return () => {
      isMounted = false;
    };
  }, [newsId]);

  // 2. Inscrição Realtime no canal da tabela news_reactions
  useEffect(() => {
    if (typeof window === 'undefined' || !newsId) return;

    let supabase;
    try {
      supabase = createBrowserClient();
    } catch {
      return;
    }
    if (!supabase) return;

    const channel = supabase
      .channel(`news-reactions-${newsId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_reactions', filter: `news_id=eq.${newsId}` },
        () => {
          // Atualiza contagens frescas da API
          if (fingerprint) {
            fetch(`/api/news/react?newsId=${newsId}&device=${encodeURIComponent(fingerprint)}`)
              .then((r) => r.json())
              .then((d) => {
                if (typeof d.likesCount === 'number') setLikes(d.likesCount);
                if (typeof d.dislikesCount === 'number') setDislikes(d.dislikesCount);
              })
              .catch(() => {});
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsId, fingerprint]);

  // 3. Ação de Voto com Cooldown / Debounce
  const handleVote = async (type) => {
    // Proteção contra cliques em sequência rápida (mínimo 1 segundo)
    const now = Date.now();
    if (now - lastClickRef.current < 1000) {
      setFeedbackMsg('Aguarde um instante antes de votar novamente.');
      setTimeout(() => setFeedbackMsg(''), 2500);
      return;
    }
    lastClickRef.current = now;

    if (!fingerprint) {
      setFeedbackMsg('Identificando dispositivo...');
      return;
    }

    const previousReaction = userReaction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    // Atualização otimista imediata na UI
    let nextReaction = userReaction;
    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (userReaction === type) {
      // Desfaz o voto
      nextReaction = null;
      if (type === 'like') nextLikes = Math.max(0, nextLikes - 1);
      if (type === 'dislike') nextDislikes = Math.max(0, nextDislikes - 1);
    } else {
      // Novo voto ou alternância
      if (userReaction === 'like') nextLikes = Math.max(0, nextLikes - 1);
      if (userReaction === 'dislike') nextDislikes = Math.max(0, nextDislikes - 1);

      nextReaction = type;
      if (type === 'like') nextLikes += 1;
      if (type === 'dislike') nextDislikes += 1;
    }

    setUserReaction(nextReaction);
    setLikes(nextLikes);
    setDislikes(nextDislikes);

    startTransition(async () => {
      try {
        const res = await fetch('/api/news/react', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newsId,
            deviceFingerprint: fingerprint,
            reactionType: type,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          // Reverte estado anterior caso ocorra erro ou rate-limit
          setUserReaction(previousReaction);
          setLikes(previousLikes);
          setDislikes(previousDislikes);
          setFeedbackMsg(result.error || 'Não foi possível registrar o voto.');
          setTimeout(() => setFeedbackMsg(''), 3000);
          return;
        }

        // Sincroniza com o retorno exato do banco
        if (typeof result.likesCount === 'number') setLikes(result.likesCount);
        if (typeof result.dislikesCount === 'number') setDislikes(result.dislikesCount);
        setUserReaction(result.userReaction);

        if (result.userReaction === 'like') {
          setFeedbackMsg('Você curtiu esta matéria!');
        } else if (result.userReaction === 'dislike') {
          setFeedbackMsg('Avaliação registrada.');
        } else {
          setFeedbackMsg('Voto removido.');
        }
        setTimeout(() => setFeedbackMsg(''), 2500);
      } catch {
        setUserReaction(previousReaction);
        setLikes(previousLikes);
        setDislikes(previousDislikes);
        setFeedbackMsg('Erro de conexão ao registrar voto.');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Texto de Engajamento */}
      <div>
        <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[18px]">thumb_up</span>
          O que você achou desta publicação?
        </h4>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Deixe sua reação para apoiar a divulgação das notícias da nossa rede escolar.
        </p>
      </div>

      {/* Botões de Like e Dislike */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Botão de Curtir (Like) */}
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleVote('like')}
          aria-label="Gostei desta notícia"
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-70 ${
            userReaction === 'like'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-surface-container-lowest text-on-surface hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 border border-outline-variant/60'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[17px] sm:text-[19px] ${
              userReaction === 'like' ? 'fill-current' : ''
            }`}
          >
            thumb_up
          </span>
          <span className="tabular-nums font-mono">{likes}</span>
          <span className="hidden xs:inline text-xs font-medium">Gostei</span>
        </button>

        {/* Botão de Não Curtir (Dislike) */}
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleVote('dislike')}
          aria-label="Não gostei desta notícia"
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-70 ${
            userReaction === 'dislike'
              ? 'bg-slate-700 dark:bg-slate-700 text-white'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-on-surface border border-outline-variant/60'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[17px] sm:text-[19px] ${
              userReaction === 'dislike' ? 'fill-current' : ''
            }`}
          >
            thumb_down
          </span>
          <span className="tabular-nums font-mono">{dislikes}</span>
          <span className="hidden xs:inline text-xs font-medium">Não gostei</span>
        </button>
      </div>

      {/* Mensagem de Feedback Rápido */}
      {feedbackMsg && (
        <span className="text-[11px] font-semibold text-secondary animate-in fade-in duration-200">
          {feedbackMsg}
        </span>
      )}
    </div>
  );
}
