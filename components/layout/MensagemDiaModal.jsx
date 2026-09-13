'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * MensagemDiaModal — Modal acessível e responsivo para leitura
 * da Mensagem do Dia completa do Núcleo de Educação de Brasiléia (SEE-AC).
 */
export default function MensagemDiaModal({ isOpen, onClose, mensagem }) {
  // Fecha modal ao pressionar ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const messageText =
    mensagem?.mensagem ||
    'Hoje é dia de Conselho de Classe nas escolas da rede — resultados publicados até sexta-feira, 18/09.';
  const author = mensagem?.autor || 'Núcleo de Educação de Brasiléia';
  const linkUrl = mensagem?.linkUrl;
  const targetBlank = mensagem?.targetBlank;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-mensagem-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="bg-[#0e2736] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
            </span>
            <div>
              <h2 id="modal-mensagem-title" className="font-bold text-[15px] sm:text-[16px] leading-tight text-white">
                Mensagem do Dia
              </h2>
              <p className="text-[11px] text-slate-300">
                Aviso oficial · SEE-AC Brasiléia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar mensagem"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Corpo da Mensagem */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[16px] text-slate-400">verified</span>
            <span>Emitido por: <strong className="text-slate-700">{author}</strong></span>
          </div>

          <blockquote className="font-editorial text-[18px] sm:text-[20px] text-[#0f2938] leading-relaxed border-l-3 border-amber-500 pl-4 py-1 italic bg-amber-50/40 rounded-r">
            “{messageText}”
          </blockquote>

          {linkUrl && (
            <div className="pt-2">
              <Link
                href={linkUrl}
                target={targetBlank ? '_blank' : undefined}
                rel={targetBlank ? 'noopener noreferrer' : undefined}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-secondary hover:bg-on-secondary-fixed-variant text-white font-semibold text-[13px] shadow-xs transition-colors"
              >
                <span>Acessar mais informações</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>

        {/* Rodapé com botão Fechar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
          <span>Portal Educa Brasiléia</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
