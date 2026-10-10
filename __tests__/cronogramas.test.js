import { describe, it, expect } from 'vitest';
import { groupCronogramasBySector, SECTORS, FALLBACK_CRONOGRAMAS } from '@/lib/cronogramas';

describe('lib/cronogramas — Lógica de Dados', () => {
  it('deve possuir os setores oficiais definidos', () => {
    expect(SECTORS).toHaveLength(2);
    expect(SECTORS.map((s) => s.id)).toEqual(['ensino', 'cultura_esporte']);
  });

  it('deve agrupar cronogramas corretamente por setor', () => {
    const mockCronogramas = [
      { id: '1', setor: 'ensino', titulo: 'Conselho' },
      { id: '2', setor: 'cultura_esporte', titulo: 'Jogos' },
      { id: '3', setor: 'ensino', titulo: 'Formação' },
    ];

    const grouped = groupCronogramasBySector(mockCronogramas);

    expect(grouped.ensino).toHaveLength(2);
    expect(grouped.cultura_esporte).toHaveLength(1);
    expect(grouped.ensino[0].id).toBe('1');
    expect(grouped.ensino[1].id).toBe('3');
    expect(grouped.cultura_esporte[0].id).toBe('2');
  });

  it('deve lidar com lista vazia sem quebrar', () => {
    const grouped = groupCronogramasBySector([]);
    expect(grouped.ensino).toEqual([]);
    expect(grouped.cultura_esporte).toEqual([]);
  });

  it('todos os itens do FALLBACK_CRONOGRAMAS devem ter propriedades válidas', () => {
    expect(FALLBACK_CRONOGRAMAS.length).toBeGreaterThan(0);

    for (const item of FALLBACK_CRONOGRAMAS) {
      expect(item.id).toBeDefined();
      expect(['ensino', 'cultura_esporte']).toContain(item.setor);
      expect(item.titulo).toBeTruthy();
      expect(item.dataInicio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (item.dataFim) {
        expect(item.dataFim).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(item.dataFim >= item.dataInicio).toBe(true);
      }
      expect(['Previsto', 'Em andamento', 'Urgente', 'Concluído']).toContain(item.status);
    }
  });
});
