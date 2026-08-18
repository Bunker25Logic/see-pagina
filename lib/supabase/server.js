import { createClient } from '@supabase/supabase-js';

/**
 * Cria um cliente Supabase para uso em Server Components e Route Handlers.
 * Uma nova instância por chamada — evita estado compartilhado entre requests.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false },
    }
  );
}
