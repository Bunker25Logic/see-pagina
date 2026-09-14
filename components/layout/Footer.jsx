import Link from 'next/link';
import EducaLogo from '@/components/ui/EducaLogo';

/**
 * Links institucionais e de navegação do rodapé.
 */
const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/escolas', label: 'Escolas' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/cronogramas', label: 'Cronogramas' },
  { href: '/calendario', label: 'Calendário' },
];

const serviceLinks = [
  { href: '/transparencia', label: 'Transparência' },
  { href: '/privacidade', label: 'Privacidade' },
  { href: '/portal-professor', label: 'Portal do Professor' },
  {
    href: 'https://see.ac.gov.br',
    label: 'SEE / Acre',
    external: true,
  },
  {
    href: 'https://www.ac.gov.br',
    label: 'Governo do Acre',
    external: true,
  },
];

/**
 * Footer — Rodapé Institucional do Portal Educa Brasiléia.
 * Estrutura otimizada e ultra-compacta no mobile (grid de 2 colunas para links,
 * cartões condensados e paddings enxutos) com expansão editorial completa no desktop.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0d2131] dark:bg-[#07131c] text-slate-300 border-t border-[#1b3d56] dark:border-slate-800 transition-colors">
      {/* Faixa decorativa com as cores oficiais do Acre (Amarelo Ouro e Verde Amazônico) */}
      <div
        className="h-1 w-full bg-linear-to-r from-amber-400 via-emerald-500 to-green-600"
        aria-hidden="true"
      />

      {/* Conteúdo principal do rodapé */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          {/* Coluna 1: Identidade e Missão (lg:col-span-3) */}
          <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-2.5 sm:gap-4">
            <Link
              href="/"
              className="inline-block group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg w-fit"
            >
              <EducaLogo inverted={true} size={36} className="sm:scale-105 origin-left" />
            </Link>

            {/* Texto curto e direto no mobile; parágrafo completo no desktop */}
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm">
              <span className="sm:hidden">
                Comunicação oficial e transparência pedagógica do Núcleo de Educação de Brasiléia (SEE/AC).
              </span>
              <span className="hidden sm:inline">
                Canal oficial de comunicação pedagógica e transparência do Núcleo de Educação de Brasiléia,
                vinculado à Secretaria de Estado de Educação, Cultura e Esportes do Acre (SEE/AC).
              </span>
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                Brasiléia · Acre
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                Rede Estadual de Ensino
              </span>
            </div>
          </div>

          {/* Colunas 2 e 3 agrupadas: no Mobile ficam lado a lado (grid-cols-2), no Desktop se distribuem (lg:col-span-4) */}
          <div className="md:col-span-1 lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Navegação */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 font-label-caps">
                Navegação
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-white transition-colors duration-200 inline-block py-0.5 hover:translate-x-0.5 transform"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Serviços & Transparência */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 font-label-caps">
                Serviços
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                {serviceLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 py-0.5 hover:translate-x-0.5 transform"
                      {...(item.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.external && (
                        <svg
                          className="w-2.5 h-2.5 opacity-60 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna 4: Atendimento & Localização Oficial com Minimapa (lg:col-span-5) */}
          <div className="md:col-span-2 lg:col-span-5 flex flex-col gap-2.5 sm:gap-3">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 font-label-caps flex items-center justify-between">
              <span>Atendimento & Localização</span>
              <span className="text-[10px] font-medium text-emerald-400 normal-case tracking-normal">
                Sede Oficial
              </span>
            </h3>

            {/* Card com endereço oficial, horário e minimapa */}
            <div className="bg-white/5 dark:bg-black/20 p-3 sm:p-3.5 rounded-xl border border-white/10 flex flex-col gap-3 text-xs text-slate-300/90 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  <svg
                    className="w-4 h-4"
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
                </div>
                <div className="flex flex-col min-w-0">
                  <strong className="text-white font-semibold text-xs sm:text-sm leading-snug">
                    Núcleo de Educação de Brasiléia (SEE/AC)
                  </strong>
                  <span className="text-slate-200 mt-0.5 font-medium">
                    AV Benjamin Constant, Nº 68 — Bairro Centro
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Brasiléia · Acre · CEP 69932-000
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <svg
                    className="w-3.5 h-3.5 text-amber-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Seg a Sex · 07h às 17h <span className="opacity-75">(Acre)</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <svg
                    className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:see.brasileia@ac.gov.br"
                    className="hover:text-white transition-colors underline-offset-2 hover:underline truncate"
                  >
                    see.brasileia@ac.gov.br
                  </a>
                </div>
              </div>

              {/* Minimapa do Google Maps nas coordenadas do Núcleo */}
              <div className="relative w-full h-32 sm:h-36 rounded-lg overflow-hidden border border-white/15 bg-slate-900/80 shadow-inner group mt-0.5">
                <iframe
                  title="Localização do Núcleo de Educação de Brasiléia no Google Maps"
                  src="https://maps.google.com/maps?q=-11.0148913,-68.7457419&hl=pt-BR&z=16&output=embed"
                  className="w-full h-full border-0 filter contrast-[1.05] opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Minimapa do Google Maps na Av. Benjamin Constant, 68, Centro, Brasiléia"
                />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=-11.0148913,-68.7457419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-white bg-slate-950/85 hover:bg-emerald-600 backdrop-blur-md rounded-md shadow-md border border-white/15 transition-all hover:scale-[1.02]"
                >
                  <span>Ver no Maps</span>
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória e sub-rodapé ultra-enxuto */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-[11px] text-slate-400">
          <p className="text-center sm:text-left">
            © {currentYear} Educa Brasiléia · Secretaria de Estado de Educação do Acre.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Governo do Acre</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/90 font-medium">Visão de Futuro, Respeito pelo Povo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
