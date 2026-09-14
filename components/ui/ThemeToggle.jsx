'use client';

import { useState, useEffect } from 'react';

/**
 * ThemeToggle — Botão interativo com animação vetorial SVG de Sol e Lua.
 *
 * REQUISITO MANDATÓRIO:
 * O portal NÃO segue o padrão de modo escuro dos dispositivos (celulares/SO).
 * O tema padrão é SEMPRE claro, a menos que o usuário clique explicitamente neste botão.
 */
export default function ThemeToggle({ className = '', size = 34 }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          setIsDark(true);
          document.documentElement.classList.add('dark');
        } else {
          setIsDark(false);
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // Fallback seguro
      }
    };

    const timer = setTimeout(sync, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    try {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch {
      // Ignora erro de storage privado
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-lg transition-all duration-300 active:scale-90 cursor-pointer overflow-hidden border ${
        isDark
          ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-amber-400/50 shadow-xs'
          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-amber-600 hover:border-amber-300 shadow-xs'
      } ${className}`}
      style={{ width: size, height: size }}
      title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      suppressHydrationWarning
    >
      {/* ── ÍCONE ANIMADO SOL (Exibido no modo claro) ── */}
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute transition-all duration-500 transform ${
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      >
        {/* Raios do Sol */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="23" />
          <line x1="1" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="4.22" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.78" y2="19.78" />
          <line x1="4.22" y1="19.78" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.78" y2="4.22" />
        </g>
        {/* Núcleo do Sol */}
        <circle cx="12" cy="12" r="5" fill="currentColor" />
      </svg>

      {/* ── ÍCONE ANIMADO LUA (Exibido no modo escuro) ── */}
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute transition-all duration-500 transform ${
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-amber-300'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      >
        {/* Lua crescente */}
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Estrelinha cintilante de apoio */}
        <circle cx="18" cy="5" r="0.9" fill="currentColor" className="animate-pulse" />
      </svg>
    </button>
  );
}
