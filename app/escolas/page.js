import { getAllSchools } from '@/lib/schools';
import SchoolsExplorer from '@/components/schools/SchoolsExplorer';

export const metadata = {
  title: 'Escolas da Rede Estadual | Educa Brasiléia',
  description:
    'Guia oficial das escolas estaduais vinculadas ao Núcleo de Educação de Brasiléia — Secretaria de Estado de Educação do Acre (SEE/AC). Consulte equipes gestoras, quantitativo de alunos e canais de atendimento.',
};

export const revalidate = 60; // revalida a cada 1 minuto para refletir novos cadastros

/**
 * EscolasPage — Painel de excelência das escolas da rede estadual de Brasiléia.
 */
export default async function EscolasPage() {
  const schools = await getAllSchools();

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50/50 dark:bg-[#08121a] transition-colors">
      {/* ── HERO BANNER INSTITUCIONAL ARTÍSTICO ── */}
      <section className="relative border-b border-slate-200/80 dark:border-slate-800 bg-linear-to-b from-white via-slate-50 to-slate-100/70 dark:from-[#0d1e2c] dark:via-[#091520] dark:to-[#08121a] py-10 sm:py-14 overflow-hidden">
        {/* Detalhes de iluminação e gradientes decorativos no fundo */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 right-10 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/3"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              {/* Badge Oficial */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Rede Pública Estadual · Núcleo de Brasiléia
              </div>

              {/* Título Principal Editorial */}
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Rede Escolar de Brasiléia
              </h1>

              {/* Descrição com tom acolhedor e transparente */}
              <p className="font-body-lg text-slate-600 dark:text-slate-300 mt-3 text-base sm:text-lg leading-relaxed">
                Conheça as unidades de ensino da rede estadual, consulte as equipes gestoras,
                o quantitativo de matrículas e entre em contato direto pelo canal oficial da escola.
              </p>
            </div>

            {/* Painel de Compromisso Pedagógico */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xs max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="text-xs">
                <strong className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Gestão Escolar Participativa
                </strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Canais diretos para aproximar família, estudantes e corpo docente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTEÚDO PRINCIPAL: MOSAICO, FILTROS E CARDS ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SchoolsExplorer schools={schools} />
      </main>
    </div>
  );
}
