/**
 * lib/events.js — Funções de acesso à tabela `events` do Supabase.
 *
 * Colunas esperadas na tabela `events`:
 *   id, title, description, date, date_label, time, location,
 *   category, is_upcoming
 */
import { createServerClient } from '@/lib/supabase/server';

/* ── Mapper ────────────────────────────────────────────────────── */
function mapEventRow(row) {
  if (!row) return null;
  return {
    id:          String(row.id),
    title:       row.title,
    description: row.description ?? '',
    date:        row.date,
    dateLabel:   row.date_label   ?? row.date ?? '',
    time:        row.time         ?? '',
    location:    row.location     ?? '',
    category:    row.category     ?? '',
    isUpcoming:  row.is_upcoming  ?? true,
  };
}

/* ── Queries ───────────────────────────────────────────────────── */

/** Próximos eventos (is_upcoming = true), ordenados por data crescente. */
export async function getUpcomingEvents() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_upcoming', true)
    .order('date', { ascending: true });

  if (error) { console.error('[getUpcomingEvents]', error.message); return []; }
  return (data ?? []).map(mapEventRow);
}

/** Eventos realizados (is_upcoming = false), mais recentes primeiro. */
export async function getPastEvents() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_upcoming', false)
    .order('date', { ascending: false });

  if (error) { console.error('[getPastEvents]', error.message); return []; }
  return (data ?? []).map(mapEventRow);
}
