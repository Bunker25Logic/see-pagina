import { getAllSchools, FALLBACK_SCHOOLS } from '@/lib/schools';
import { getCoursesBySchool } from '@/lib/courses';
import InstitutionCoursesView from '@/components/schools/InstitutionCoursesView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Cursos Gratuitos | Educa Brasiléia — SEE/AC',
  description: 'Consulte os cursos técnicos e profissionalizantes gratuitos oferecidos pelo Estado em Brasiléia — SEE/AC.',
};

export default async function CursosPage() {
  const schools = await getAllSchools();
  const school =
    schools.find((s) => s.offersCourses) ||
    schools.find((s) => s.slug === 'centro-educacao-profissional-tecnologica-brasileia') ||
    FALLBACK_SCHOOLS.find((s) => s.offersCourses) ||
    FALLBACK_SCHOOLS[FALLBACK_SCHOOLS.length - 1];

  const courses = await getCoursesBySchool(school?.slug || 'centro-educacao-profissional-tecnologica-brasileia');

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50/50 dark:bg-[#08121a] py-8 sm:py-12 transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InstitutionCoursesView school={school} courses={courses} />
      </main>
    </div>
  );
}
