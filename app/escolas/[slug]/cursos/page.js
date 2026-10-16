import { notFound } from 'next/navigation';
import { getAllSchools } from '@/lib/schools';
import { getCoursesBySchool } from '@/lib/courses';
import InstitutionCoursesView from '@/components/schools/InstitutionCoursesView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const schools = await getAllSchools();
  const school = schools.find((s) => s.slug === slug);

  if (!school) {
    return {
      title: 'Cursos Disponíveis | Educa Brasiléia',
      description: 'Consulte os cursos gratuitos oferecidos pelo Estado em Brasiléia — SEE/AC.',
    };
  }

  return {
    title: `Cursos Disponíveis — ${school.shortName || school.name} | Educa Brasiléia`,
    description: `Confira os cursos gratuitos disponíveis, quantitativo de vagas abertas e faça sua pré-inscrição na ${school.name} pelo Núcleo de Educação de Brasiléia (SEE/AC).`,
  };
}

export default async function SchoolCoursesPage({ params }) {
  const { slug } = await params;
  const schools = await getAllSchools();
  const school = schools.find((s) => s.slug === slug);

  if (!school) {
    notFound();
  }

  const courses = await getCoursesBySchool(slug);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50/50 dark:bg-[#08121a] py-8 sm:py-12 transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InstitutionCoursesView school={school} courses={courses} />
      </main>
    </div>
  );
}
