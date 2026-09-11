import { getAllSchools } from '@/lib/schools';
import SchoolsExplorer from '@/components/schools/SchoolsExplorer';

export const metadata = {
  title: 'Escolas da Rede Estadual',
  description:
    'Guia oficial das escolas estaduais vinculadas ao Núcleo de Educação de Brasiléia — Secretaria de Estado de Educação do Acre.',
};

export const revalidate = 60; // revalida a cada 1 minuto para refletir novos cadastros do painel

/**
 * EscolasPage — Listagem e painel de escolas da rede estadual de Brasiléia.
 */
export default async function EscolasPage() {
  const schools = await getAllSchools();

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-background">
      {/* ── HERO BANNER INSTITUCIONAL ── */}
      <section className="border-b border-outline-variant/60 bg-linear-to-b from-surface-container-low/80 to-background py-10 sm:py-14">
        <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-label-caps font-semibold mb-3">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Rede Pública Estadual • Núcleo de Brasiléia
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display-lg text-primary font-extrabold tracking-tight">
                Escolas de Brasiléia
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 leading-relaxed">
                Conheça as unidades de ensino vinculadas ao Núcleo de Educação de Brasiléia (SEE-AC).
                Consulte equipes gestoras, quantitativo de alunos e conecte-se diretamente pelo canal oficial de WhatsApp.
              </p>
            </div>

            {/* Selo oficial de atendimento */}
            <div className="hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-container-low border border-outline-variant/60 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">support_agent</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary">Atendimento Direto</p>
                <p className="text-[11px] text-on-surface-variant">Gestores conectados à comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTEÚDO PRINCIPAL COM BUSCA, FILTROS E CARDS ── */}
      <main className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-12">
        <SchoolsExplorer schools={schools} />
      </main>
    </div>
  );
}


