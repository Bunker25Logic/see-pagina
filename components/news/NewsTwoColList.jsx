'use client';

import { useState, useMemo } from 'react';
import NewsTwoColCard from './NewsTwoColCard';

/**
 * NewsTwoColList — Lista de notícias organizadas em duas colunas (lado a lado),
 * com tamanhos menores, filtros de categoria e pesquisa instantânea.
 *
 * @param {{ news: Array }} props
 */
export default function NewsTwoColList({ news = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extrai categorias únicas disponíveis nas notícias
  const categories = useMemo(() => {
    const set = new Set();
    news.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return Array.from(set);
  }, [news]);

  // Filtra as notícias com base na categoria e busca
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  return (
    <section className="flex flex-col gap-6" aria-label="Todas as notícias organizadas em duas colunas">

      {/* ── Barra de Filtros e Busca ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-surface-container-low/70 dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-outline-variant/50 transition-colors">

        {/* Pílulas de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-styled pb-1.5 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-primary dark:bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-outline-variant/40'
            }`}
          >
            Todas ({news.length})
          </button>

          {categories.map((cat) => {
            const count = news.filter((n) => n.category?.toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-primary dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-outline-variant/40'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full sm:w-64 shrink-0">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-400 pointer-events-none"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar nesta lista..."
            className="w-full pl-9 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-outline-variant/50 rounded-xl text-[13px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-emerald-500/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Limpar pesquisa"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Grade em Duas Colunas (Lado a Lado) ── */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {filteredNews.map((item) => (
            <NewsTwoColCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Não encontramos reportagens com os filtros ou termo de busca selecionados.
          </p>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 text-xs font-bold text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-colors cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

    </section>
  );
}
