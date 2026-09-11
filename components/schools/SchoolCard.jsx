'use client';

import { useState } from 'react';

/**
 * SchoolCard — Card institucional de escola com microinterações e feedback visual.
 *
 * @param {{ school: {
 *   id: string,
 *   name: string,
 *   shortName?: string,
 *   type: string,
 *   principal: string,
 *   phone: string,
 *   address: string,
 *   studentCount: number,
 *   slug: string
 * }}} props
 */
export default function SchoolCard({ school }) {
  const { name, type, principal, phone, address, studentCount } = school;
  const [copied, setCopied] = useState(false);

  // Formatação para WhatsApp
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const whatsappNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Olá, gestor(a) da ${name}. Gostaria de obter informações pelo canal oficial.`
      )}`
    : null;

  const handleCopyPhone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!phone) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-white dark:bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-secondary/50 group">
      {/* Indicador de acento visual no topo */}
      <div className="absolute top-0 left-6 right-6 h-0.5 bg-linear-to-r from-secondary/0 via-secondary/40 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {type || 'Rede Estadual'}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant/90 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/40">
            <span className="material-symbols-outlined text-[15px] text-outline">
              location_on
            </span>
            {address || 'Brasiléia - AC'}
          </span>
        </div>

        {/* Nome da Escola */}
        <h2 className="text-xl sm:text-2xl font-display-lg text-primary font-bold leading-snug group-hover:text-secondary transition-colors duration-200">
          {name}
        </h2>

        {/* Informações detalhadas */}
        <div className="mt-4 pt-4 border-t border-outline-variant/40 space-y-3">
          {/* Gestor(a) */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low/60 group-hover:bg-surface-container-low transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">
                manage_accounts
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Gestão Escolar
              </p>
              <p className="text-sm sm:text-base font-semibold text-on-surface truncate">
                {principal || 'Não informado'}
              </p>
            </div>
          </div>

          {/* Contato & WhatsApp */}
          {phone && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#25D366]/5 border border-[#25D366]/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#075e24] flex items-center justify-center shrink-0">
                  {/* WhatsApp SVG */}
                  <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.46 3.486 1.332 5.006L2 22l5.12-1.306A9.957 9.957 0 0 0 12.004 22c5.523 0 10.004-4.48 10.004-9.996C22.008 6.48 17.527 2 12.004 2zm5.82 14.343c-.244.684-1.215 1.306-1.996 1.472-.534.113-1.233.203-3.578-.772-2.993-1.246-4.925-4.29-5.074-4.488-.148-.198-1.215-1.616-1.215-3.082 0-1.466.768-2.188 1.04-2.486.273-.298.595-.373.794-.373.199 0 .397.002.57.01.184.01.43-.07.672.511.248.595.845 2.062.919 2.211.074.149.124.323.025.522-.099.199-.149.323-.298.497-.148.174-.313.389-.447.522-.149.149-.304.31-.13.61.173.298.774 1.277 1.662 2.067 1.144 1.018 2.106 1.334 2.404 1.482.298.149.472.124.646-.074.174-.199.744-.868.943-1.166.198-.298.397-.248.67-.149.273.099 1.737.82 2.035.969.298.149.496.223.57.347.075.124.075.72-.169 1.404z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#075e24] uppercase tracking-wider">
                    Contato Direto
                  </p>
                  <span className="text-sm font-bold text-on-surface tracking-wide">
                    {phone}
                  </span>
                </div>
              </div>

              {/* Botão de Cópia com feedback visual */}
              <button
                type="button"
                onClick={handleCopyPhone}
                className="self-end sm:self-center px-2 py-1 text-xs text-on-surface-variant hover:text-primary hover:bg-black/5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Copiar número de telefone"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé do Card: Quantitativo e Ação Principal */}
      <div className="mt-5 pt-4 border-t border-outline-variant/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Alunos matriculados */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">
              school
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-medium">Matrículas</p>
            <p className="text-sm font-bold text-on-surface">
              {Number(studentCount || 0).toLocaleString('pt-BR')}{' '}
              <span className="font-normal text-on-surface-variant text-xs">alunos</span>
            </p>
          </div>
        </div>

        {/* Botão de Ação: WhatsApp */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-semibold text-sm shadow-xs hover:shadow-md transition-all duration-200 group/btn"
          >
            <span>Conversar</span>
            <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-0.5 transition-transform">
              chat
            </span>
          </a>
        )}
      </div>
    </div>
  );
}


