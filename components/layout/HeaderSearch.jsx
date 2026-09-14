'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * HeaderSearch — Lupa de pesquisa interativa com animação de expansão e busca de notícias em tempo real.
 * Substitui o relógio digital na barra superior (TopBar).
 */
export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setIsLoading(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // Foco automático no input ao abrir a lupa
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Fechar ao clicar fora ou pressionar a tecla Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Busca em tempo real com debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/news/search?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error('Falha na busca');
        const data = await res.json();
        setResults(data.results || []);
        setHasSearched(true);
      } catch (err) {
        console.warn('[HeaderSearch] Erro ao buscar notícias:', err);
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, 280);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        const topSlug = results[0].slug;
        handleClose();
        router.push(`/noticias/${topSlug}`);
      }
    }
  };

  const handleSelectResult = () => {
    handleClose();
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {!isOpen ? (
        // ── Botão da Lupa (Estado Fechado) ──
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
          title="Pesquisar notícias no portal"
          aria-label="Abrir pesquisa de notícias"
        >
          <span className="material-symbols-outlined text-[17px] sm:text-[18px] transition-transform duration-200 group-hover:scale-110">
            search
          </span>
        </button>
      ) : (
        // ── Campo de Pesquisa Expandido com Animação ──
        <div className="flex items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="relative flex items-center w-48 xs:w-56 sm:w-72 md:w-80">
            {/* Ícone de busca dentro do input */}
            <span
              className="absolute left-2.5 material-symbols-outlined text-[17px] text-slate-300 pointer-events-none"
              aria-hidden="true"
            >
              search
            </span>

            {/* Input com design institucional escuro harmonizado com a TopBar */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Buscar notícias..."
              className="w-full h-7.5 sm:h-8 pl-8 pr-7 text-xs sm:text-sm rounded-full bg-[#0d2c41] text-white placeholder:text-slate-300/70 border border-white/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-hidden transition-all shadow-inner"
              aria-label="Digite termos para pesquisar notícias"
            />

            {/* Indicador de carregamento ou botão fechar */}
            {isLoading ? (
              <span className="absolute right-2.5 material-symbols-outlined text-[15px] text-amber-300 animate-spin">
                progress_activity
              </span>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-2 flex items-center justify-center w-4 h-4 rounded-full text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                title="Fechar pesquisa"
                aria-label="Fechar pesquisa"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Dropdown de Resultados em Tempo Real ── */}
      {isOpen && (query.trim().length >= 2 || isLoading) && (
        <div className="absolute right-0 top-full mt-2 w-72 xs:w-80 sm:w-96 max-h-[75vh] overflow-y-auto bg-surface-container-lowest text-on-surface border border-outline-variant/80 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading && results.length === 0 ? (
            <div className="py-6 px-4 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] animate-spin text-secondary">
                progress_activity
              </span>
              <span>Pesquisando notícias...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="px-2.5 py-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40 flex items-center justify-between">
                <span>Notícias Encontradas</span>
                <span className="text-[10px] text-secondary font-semibold">
                  {results.length} resultado{results.length > 1 ? 's' : ''}
                </span>
              </div>

              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.slug}`}
                  onClick={handleSelectResult}
                  className="group/item flex items-start gap-2.5 p-2 rounded-xl hover:bg-secondary/10 transition-colors"
                >
                  {/* Miniatura ou Ícone */}
                  {item.imageUrl ? (
                    <div className="relative w-14 h-11 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || item.title}
                        fill
                        sizes="56px"
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-11 shrink-0 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[20px]">newspaper</span>
                    </div>
                  )}

                  {/* Detalhes da Notícia */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-primary dark:text-slate-100 group-hover/item:text-secondary line-clamp-2 leading-snug transition-colors">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-on-surface-variant">
                      <span className="font-semibold text-secondary">{item.category}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      {typeof item.viewsCount === 'number' && item.viewsCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">visibility</span>
                            {item.viewsCount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              <div className="mt-1 pt-1.5 border-t border-outline-variant/40 px-2 py-1 flex items-center justify-between text-[10px] text-on-surface-variant/80">
                <span>Pressione Enter para ir à 1ª notícia</span>
                <span>Esc para fechar</span>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="py-6 px-4 text-center">
              <span className="material-symbols-outlined text-slate-400 text-3xl block mb-1">
                search_off
              </span>
              <p className="text-xs font-semibold text-on-surface">Nenhuma notícia encontrada</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Tente buscar por outras palavras-chave ou termos mais gerais.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
