import SchoolCard from '@/components/schools/SchoolCard';
import { getAllSchools } from '@/lib/schools';

export const metadata = {
  title: 'Escolas',
  description:
    'Conheça as escolas da rede estadual vinculadas ao Núcleo de Educação de Brasiléia — Secretaria de Educação do Acre.',
};

export const revalidate = 3600; // revalida a cada 1 hora

/**
 * EscolasPage — Listagem de escolas da rede estadual de Brasiléia.
 */
export default async function EscolasPage() {
  const schools = await getAllSchools();

  return (
    <div className="w-full max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop">

      {/* Cabeçalho da página */}
      <div className="mb-stack-lg border-b-2 border-outline-variant pb-stack-md">
        <div className="flex items-center gap-unit mb-unit">
          <span className="material-symbols-outlined text-secondary text-[28px]" aria-hidden="true">
            school
          </span>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            Rede Estadual
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg text-primary">
          Escolas de Brasiléia
        </h1>
        {schools.length > 0 && (
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-sm">
            {schools.length} unidade{schools.length !== 1 ? 's' : ''} escolar{schools.length !== 1 ? 'es' : ''} vinculada{schools.length !== 1 ? 's' : ''} ao Núcleo de Educação de Brasiléia.
          </p>
        )}
      </div>

      {/* Grade de escolas */}
      {schools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center py-stack-lg">
          Nenhuma escola cadastrada no momento.
        </p>
      )}
    </div>
  );
}
