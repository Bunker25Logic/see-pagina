import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://louuilnalooyrwywwnnn.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdXVpbG5hbG9veXJ3eXd3bm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0OTExMTQsImV4cCI6MjEwMjA2NzExNH0._L2afgh7ucWmxpQg9M7-tdBjvDzUKF5gtIUTi5rlokI';

/**
 * Cria um cliente Supabase para uso em Server Components e Route Handlers.
 * Uma nova instância por chamada com cache 'no-store' — garante dados em tempo real.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false },
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  );
}
