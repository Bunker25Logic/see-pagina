import { createClient } from '@supabase/supabase-js';

let client = null;

/**
 * Retorna um singleton do cliente Supabase para uso em Client Components.
 * Use somente em arquivos marcados com 'use client'.
 */
export function createBrowserClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return client;
}
