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
      {/* ── Cabeçalho da Página ── */}
      <div className="mb-8 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-2 text-secondary font-bold text-[12px] uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">event_available</span>
          Núcleo de Educação de Brasiléia • SEE-AC
        </div>
        <h1 className="font-editorial text-[30px] md:text-[38px] text-[#0f2938] font-bold leading-tight mb-3">
          Cronogramas e Calendários Oficiais
        </h1>
        <p className="text-slate-600 text-[16px] max-w-3xl leading-relaxed">
          Acompanhe os prazos pedagógicos, formações continuadas, conselhos de classe e atividades esportivas e culturais da rede estadual em Brasiléia.
        </p>
      </div>

      {/* ── Componente Interativo com Filtros e Abas ── */}
      <CronogramasView cronogramas={cronogramas} sectors={SECTORS} />
    </div>
  );
}
