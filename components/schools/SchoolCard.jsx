'use client';

import { useState, useId } from 'react';

/**
 * Paletas de cores institucionais personalizadas para cada escola de Brasiléia.
 */
const SCHOOL_THEMES = {
  'escola-coronel-manoel-fontenele-de-castro': {
    initials: 'CF',
    gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
    accentColor: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
  },
  'escola-getulio-vargas': {
    initials: 'GV',
    gradient: 'from-blue-600 via-indigo-700 to-slate-800',
    accentColor: 'text-blue-700 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
  },
  'escola-instituto-odilon-pratagi': {
    initials: 'OP',
    gradient: 'from-amber-600 via-amber-700 to-yellow-800',
    accentColor: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
  },
  'escola-kairala-jose-kairala': {
    initials: 'KJ',
    gradient: 'from-teal-600 via-cyan-700 to-slate-800',
    accentColor: 'text-teal-700 dark:text-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/40',
  },
  'escola-maria-das-gracas-rocha-rodrigues': {
    initials: 'MG',
    gradient: 'from-purple-600 via-violet-700 to-indigo-800',
    accentColor: 'text-purple-700 dark:text-purple-400',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
  },
  'escola-valeria-bispo-sabala': {
    initials: 'VB',
    gradient: 'from-rose-600 via-red-700 to-rose-800',
    accentColor: 'text-rose-700 dark:text-rose-400',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
  },
};

/**
 * SchoolCard — Card de unidade escolar de padrão editorial e artesanal.
 * Destaca o brasão da unidade, dados da direção, quantitativo e canais oficiais.
 */
export default function SchoolCard({ school, viewMode = 'grid' }) {
  const { name, type, principal, coordinator, coordinatorPhone, phone, address, studentCount, slug } = school;
  const [copied, setCopied] = useState(false);
  const cardId = useId();

  // Configuração visual temática da escola
  const theme = SCHOOL_THEMES[slug] || {
    initials: name.slice(0, 2).toUpperCase(),
    gradient: 'from-[#163c54] to-[#0c2331]',
    accentColor: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
  };

  // Tratamento de WhatsApp
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const whatsappNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Olá! Estou entrando em contato pelo Portal Educa Brasiléia para informações com a equipe gestora da ${name}.`
      )}`
    : null;

  const handleCopyPhone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!phone) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <article
      aria-labelledby={`school-title-${cardId}`}
      className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Faixa decorativa superior com gradiente sutil no hover */}
      <div
        className={`h-1.5 w-full bg-linear-to-r ${theme.gradient} transition-opacity duration-300 opacity-90 group-hover:opacity-100`}
      />

      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Topo: Brasão / Monograma + Tipo de Ensino */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Monograma / Emblema da Escola */}
            <div
              className={`w-12 h-12 rounded-xl bg-linear-to-br ${theme.gradient} text-white flex items-center justify-center font-editorial font-bold text-lg shadow-sm shrink-0 select-none group-hover:scale-105 transition-transform duration-300`}
              aria-hidden="true"
            >
              {theme.initials}
            </div>

            <div className="flex flex-col">
              {/* Badge de Modalidade / Nível */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${theme.badgeBg} w-fit`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {type || 'Ensino Fundamental'}
              </span>

              {/* Selo Rede Estadual */}
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                SEE · Núcleo de Brasiléia
              </span>
            </div>
          </div>

          {/* Quantitativo de Alunos */}
          {studentCount > 0 && (
            <div className="text-right shrink-0 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="block text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                {studentCount.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                Alunos
              </span>
            </div>
          )}
        </div>

        {/* Nome da Escola */}
        <div>
          <h2
            id={`school-title-${cardId}`}
            className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug"
          >
            {name}
          </h2>

          {/* Localização / Endereço */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <svg
              className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate font-medium">{address || 'Brasiléia - AC'}</span>
          </div>
        </div>

        {/* Caixa de Gestão Escolar */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 dark:border-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Direção Escolar
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {principal || 'Gestão Escolar Oficial'}
            </p>
          </div>
        </div>

        {/* Caixa de Coordenação de Ensino — Posicionada abaixo do Gestor com Telefone */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs border border-emerald-200/70 dark:border-emerald-800/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Coordenação de Ensino
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {coordinator || 'Coordenação Pedagógica'}
              </p>
            </div>
          </div>

          {coordinatorPhone && (
            <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
              <a
                href={`tel:${coordinatorPhone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                title={`Ligar para coordenação de ensino: ${coordinatorPhone}`}
              >
                <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{coordinatorPhone}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé do Card: Ações de Contato & Interatividade */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Telefone com Ação de Cópia e Discagem */}
        {phone ? (
          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
            <a
              href={`tel:${cleanPhone}`}
              className="font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              title="Ligar para a escola"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{phone}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyPhone}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
              title="Copiar telefone"
              aria-label="Copiar número de telefone"
            >
              {copied ? (
                <span className="text-[11px] font-bold px-1">Copiado!</span>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Contato pelo Núcleo SEE</span>
        )}

        {/* Botão de WhatsApp Oficial da Escola */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all duration-200"
          >
            {/* Ícone oficial do WhatsApp */}
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z" />
            </svg>
            <span>Falar no WhatsApp</span>
          </a>
        )}
      </div>
    </article>
  );
}
