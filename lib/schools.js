/**
 * lib/schools.js — Funções de acesso à tabela `schools` do Supabase.
 *
 * Colunas esperadas na tabela `schools`:
 *   id, name, short_name, type, principal, phone, address,
 *   student_count, slug
 */
import { createServerClient } from '@/lib/supabase/server';

/* ── Mapper ────────────────────────────────────────────────────── */
function mapSchoolRow(row) {
  if (!row) return null;
  return {
    id:           String(row.id),
    name:         row.name,
    shortName:    row.short_name    ?? row.name,
    type:         row.type          ?? '',
    principal:    row.principal     ?? '',
    phone:        row.phone         ?? '',
    address:      row.address       ?? '',
    studentCount: row.student_count ?? 0,
    slug:         row.slug,
  };
}

/* ── Queries ───────────────────────────────────────────────────── */

/** Todas as escolas, ordenadas por nome. */
export async function getAllSchools() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('name', { ascending: true });

  if (error) { console.error('[getAllSchools]', error.message); return []; }
  return (data ?? []).map(mapSchoolRow);
}
