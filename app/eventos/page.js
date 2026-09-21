import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Redirecionamento da rota legada de eventos para os cronogramas oficiais.
 */
export default function EventosRedirectPage() {
  redirect('/cronogramas');
}
