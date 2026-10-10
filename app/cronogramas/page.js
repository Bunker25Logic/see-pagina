import { getActiveCronogramas, SECTORS } from '@/lib/cronogramas';
import CronogramasView from './CronogramasView';

export const metadata = {
  title: 'Cronogramas Setoriais',
  description:
    'Consulte os cronogramas oficiais do Núcleo de Educação de Brasiléia (SEE-AC): Coordenações de Ensino e de Cultura & Esporte.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CronogramasPage() {
  const cronogramas = await getActiveCronogramas();

  return (
    <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-8">
      {/* ── Cabeçalho da Página (Compacto & Elegante) ── */}
      <div className="mb-5 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 text-secondary dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[15px]">event_available</span>
          Núcleo de Educação de Brasiléia • SEE-AC
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
          <h1 className="font-editorial text-[22px] sm:text-[26px] text-[#0f2938] dark:text-slate-100 font-bold leading-tight">
            Cronogramas e Calendários Oficiais
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[12.5px] sm:text-[13px] leading-snug">
            Prazos pedagógicos, formações continuadas e eventos da rede estadual.
          </p>
        </div>
      </div>

      {/* ── Componente Interativo com Filtros e Abas ── */}
      <CronogramasView cronogramas={cronogramas} sectors={SECTORS} />
    </div>
  );
}
