'use client';

import { useState, useEffect, useRef } from 'react';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { createBrowserClient } from '@/lib/supabase/client';

function formatCommentDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Agora mesmo';
  if (diffMin < 60) return `Há ${diffMin} min`;
  if (diffHour < 24) return `Há ${diffHour}h`;
  if (diffDay === 1) return 'Ontem';
  if (diffDay < 7) return `Há ${diffDay} dias`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Gera cor de avatar estável baseada nas letras do nome
function getAvatarColor(name = '') {
  const colors = [
    'bg-emerald-600 text-white',
    'bg-teal-600 text-white',
    'bg-blue-600 text-white',
    'bg-amber-600 text-white',
    'bg-indigo-600 text-white',
    'bg-cyan-700 text-white',
  ];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
}

/**
 * ArticleComments — Seção de comentários da comunidade escolar com nome/apelido e tempo real.
 */
export default function ArticleComments({ newsId }) {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fingerprint, setFingerprint] = useState(null);
  const listRef = useRef(null);

  // 1. Carrega dados iniciais do leitor e lista de comentários
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        const fp = await getDeviceFingerprint();
        if (!isMounted) return;
        setFingerprint(fp);

        try {
          const savedName = localStorage.getItem('educa_commenter_name');
          if (savedName && isMounted) setAuthorName(savedName);
        } catch {}

        const res = await fetch(`/api/news/comments?newsId=${newsId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setComments(data.comments || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('[ArticleComments] Erro ao buscar comentários:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, [newsId]);

  // 2. Inscrição no Supabase Realtime para novos comentários aparecerem instantaneamente
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
      .channel(`news-comments-${newsId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news_comments', filter: `news_id=eq.${newsId}` },
        (payload) => {
          const newComment = payload.new;
          setComments((prev) => {
            // Evita duplicatas se o próprio usuário acabou de inserir
            if (prev.some((c) => c.id === newComment.id)) return prev;
            return [...prev, newComment];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsId]);

  // 3. Envio de Comentário com validação de Nome/Apelido
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = authorName.trim();
    const trimmedContent = content.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Por favor, informe seu nome ou apelido para assinar seu comentário.');
      return;
    }

    if (!trimmedContent || trimmedContent.length < 3) {
      setErrorMsg('Por favor, digite seu comentário antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Salva o nome para preenchimento automático nas próximas matérias
      try {
        localStorage.setItem('educa_commenter_name', trimmedName);
      } catch {}

      const res = await fetch('/api/news/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsId,
          authorName: trimmedName,
          content: trimmedContent,
          deviceFingerprint: fingerprint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Não foi possível enviar o comentário.');
        setIsSubmitting(false);
        return;
      }

      // Adiciona o comentário na lista imediatamente
      if (data.comment) {
        setComments((prev) => {
          if (prev.some((c) => c.id === data.comment.id)) return prev;
          return [...prev, data.comment];
        });
      }

      setContent('');
      setSuccessMsg('Comentário publicado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setErrorMsg('Erro de conexão ao enviar comentário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 pt-6 border-t border-outline-variant/60" aria-labelledby="comentarios-titulo">
      {/* ── Cabeçalho dos Comentários ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[24px]">forum</span>
          <h3 id="comentarios-titulo" className="font-editorial text-lg sm:text-xl font-bold text-primary dark:text-slate-100">
            Comentários da Comunidade
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
          {comments.length} {comments.length === 1 ? 'comentário' : 'comentários'}
        </span>
      </div>

      {/* ── Formulário de Envio ── */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Campo Nome ou Apelido */}
          <div className="flex-1 sm:max-w-xs">
            <label htmlFor="author-name" className="block text-xs font-bold text-on-surface mb-1">
              Seu Nome ou Apelido <span className="text-secondary">*</span>
            </label>
            <input
              id="author-name"
              type="text"
              required
              maxLength={50}
              placeholder="Ex: Prof. Carlos, Aluna Júlia..."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
            />
          </div>

          <div className="flex items-end">
            <span className="text-[11px] text-on-surface-variant/80 pb-2">
              Seu nome ficará visível junto ao comentário.
            </span>
          </div>
        </div>

        {/* Campo do Comentário */}
        <div>
          <label htmlFor="comment-content" className="block text-xs font-bold text-on-surface mb-1">
            Comentário <span className="text-secondary">*</span>
          </label>
          <textarea
            id="comment-content"
            rows={3}
            required
            maxLength={1000}
            placeholder="Compartilhe suas ideias, dúvidas ou considerações sobre esta matéria..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y min-h-20"
          />
        </div>

        {/* Mensagens de Feedback */}
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {successMsg}
          </div>
        )}

        {/* Barra de Ação */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-on-surface-variant tabular-nums">
            {content.length}/1000 caracteres
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-secondary hover:bg-secondary/90 text-white shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSubmitting ? 'progress_activity' : 'send'}
            </span>
            {isSubmitting ? 'Enviando...' : 'Publicar Comentário'}
          </button>
        </div>
      </form>

      {/* ── Lista de Comentários Publicados ── */}
      <div ref={listRef} className="flex flex-col gap-3">
        {isLoading ? (
          <div className="py-8 text-center text-on-surface-variant/60 text-xs animate-pulse flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">progress_activity</span>
            Carregando comentários...
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-2xl">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl block mb-2">
              chat_bubble_outline
            </span>
            <p className="text-sm font-semibold text-on-surface">Ainda não há comentários nesta matéria</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Seja o primeiro a compartilhar sua opinião com a rede escolar de Brasiléia!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const initial = (comment.author_name || 'U').charAt(0).toUpperCase();
            const avatarColor = getAvatarColor(comment.author_name);

            return (
              <div
                key={comment.id}
                className="p-3.5 sm:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-2xs flex items-start gap-3 transition-all"
              >
                {/* Avatar com Inicial */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs select-none ${avatarColor}`}
                >
                  {initial}
                </div>

                {/* Conteúdo do Comentário */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="font-bold text-xs sm:text-sm text-primary dark:text-slate-100">
                      {comment.author_name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/80 font-medium">
                      {formatCommentDate(comment.created_at)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line wrap-break-word">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
