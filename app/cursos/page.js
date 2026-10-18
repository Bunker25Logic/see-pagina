import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CursosPage() {
  redirect('/escolas?tab=cursos');
}
