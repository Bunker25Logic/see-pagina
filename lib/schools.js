/**
 * lib/schools.js — Funções de acesso à tabela `schools` do Supabase com fallback resiliente.
 *
 * Colunas esperadas na tabela `schools`:
 *   id, name, short_name, type, principal, coordinator, coordinator_phone,
 *   phone, address, student_count, slug
 */
import { createServerClient } from '@/lib/supabase/server';

export const FALLBACK_SCHOOLS = [
  {
    id: '60afcc66-a08d-4fcd-a02a-60df022454b0',
    name: 'Escola Coronel Manoel Fontenele de Castro',
    shortName: 'Escola Cel. Manoel Fontenele',
    type: 'Ensino Fundamental e Médio',
    principal: 'Ramiege Rodrigues da Silva',
    coordinator: 'Prof.ª Maria Aldenora de Souza',
    coordinatorPhone: '(68) 99912-3456',
    phone: '(68) 99971-9941',
    address: 'Av. Gen. Manoel Fontenele de Castro, Centro',
    studentCount: 674,
    slug: 'escola-coronel-manoel-fontenele-de-castro',
  },
  {
    id: 'f6d22b5a-50ea-43a3-8fe9-565e3202df5e',
    name: 'Escola Getúlio Vargas',
    shortName: 'Escola Getúlio Vargas',
    type: 'Ensino Fundamental',
    principal: 'Lucrécia Ribeiro Gadelha Lopes',
    coordinator: 'Prof. Antônio Carlos da Silva',
    coordinatorPhone: '(68) 99923-4567',
    phone: '(68) 99964-9735',
    address: 'Rua Benjamin Constant, Centro',
    studentCount: 520,
    slug: 'escola-getulio-vargas',
  },
  {
    id: '31274caf-dc8f-4321-93ba-bf4d3006aac2',
    name: 'Escola Instituto Odilon Pratagi',
    shortName: 'Instituto Odilon Pratagi',
    type: 'Ensino Fundamental e Médio',
    principal: 'Simone de Souza Lima',
    coordinator: 'Prof.ª Raimunda Nonata Pinho',
    coordinatorPhone: '(68) 99934-5678',
    phone: '(68) 99969-9579',
    address: 'Av. Prefeito Rolando Moreira, Centro',
    studentCount: 745,
    slug: 'escola-instituto-odilon-pratagi',
  },
  {
    id: '6b499a2a-f24c-4c94-a31a-741273115b28',
    name: 'Escola Kairala José Kairala',
    shortName: 'Escola Kairala José Kairala',
    type: 'Ensino Fundamental e Médio',
    principal: 'Francisco das Chagas Martins Lopes',
    coordinator: 'Prof. Sebastião Mendes de Alencar',
    coordinatorPhone: '(68) 99988-4086',
    phone: '(68) 99988-4086',
    address: 'Rua Marechal Deodoro, Eldorado',
    studentCount: 323,
    slug: 'escola-kairala-jose-kairala',
  },
  {
    id: 'efcfc715-04d3-416a-bb08-b91ed9058888',
    name: 'Escola Maria das Graças Rocha Rodrigues',
    shortName: 'Escola Maria das Graças',
    type: 'Ensino Fundamental',
    principal: 'Genesio Jose Silva da Costa',
    coordinator: 'Prof.ª Francinete Bezerra de Lima',
    coordinatorPhone: '(68) 99937-4071',
    phone: '(68) 99937-4071',
    address: 'Rua Rui Barbosa, Bairro Leonardo Barbosa',
    studentCount: 622,
    slug: 'escola-maria-das-gracas-rocha-rodrigues',
  },
  {
    id: '683eba90-f6a8-41f0-a62f-46b743fbd150',
    name: 'Escola Valéria Bispo Sabala',
    shortName: 'Escola Valéria Bispo Sabala',
    type: 'Ensino Fundamental e Médio',
    principal: 'Simião Rodrigues de Meneses Petter',
    coordinator: 'Prof. Marcos Vinícius de Oliveira',
    coordinatorPhone: '(68) 99250-6716',
    phone: '(68) 99250-6716',
    address: 'Rua Senador Guiomard, Bairro José Moreira',
    studentCount: 780,
    slug: 'escola-valeria-bispo-sabala',
  },
];

/* ── Mapper ────────────────────────────────────────────────────── */
function mapSchoolRow(row) {
  if (!row) return null;
  return {
    id:               String(row.id),
    name:             row.name,
    shortName:        row.short_name        ?? row.name,
    type:             row.type              ?? 'Rede Estadual',
    principal:        row.principal         ?? '',
    coordinator:      row.coordinator       ?? row.teaching_coordinator ?? '',
    coordinatorPhone: row.coordinator_phone ?? '',
    phone:            row.phone             ?? '',
    address:          row.address           ?? 'Brasiléia - AC',
    studentCount:     Number(row.student_count) || 0,
    slug:             row.slug              ?? '',
  };
}

/* ── Queries ───────────────────────────────────────────────────── */

/**
 * Todas as escolas cadastradas no banco (via painel administrativo),
 * ordenadas por nome com fallback garantido.
 */
export async function getAllSchools() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error('[getAllSchools] Erro ao consultar escolas no Supabase:', error.message);
      }
      return FALLBACK_SCHOOLS;
    }

    return data.map((row) => {
      const mapped = mapSchoolRow(row);
      // Se o endereço estiver vazio no banco, preenche com padrão do bairro de Brasiléia
      if (!mapped.address || mapped.address.trim() === '' || mapped.address === 'Brasiléia - AC') {
        const fallback = FALLBACK_SCHOOLS.find((f) => f.name.toLowerCase() === mapped.name.toLowerCase());
        if (fallback) mapped.address = fallback.address;
      }
      return mapped;
    });
  } catch (err) {
    console.error('[getAllSchools] Exceção ao consultar escolas:', err?.message || err);
    return FALLBACK_SCHOOLS;
  }
}
