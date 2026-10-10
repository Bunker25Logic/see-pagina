import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CronogramasDateModal from '@/components/cronogramas/CronogramasDateModal';

describe('CronogramasDateModal — Modal de Detalhes da Data', () => {
  const mockSectors = [
    { id: 'ensino', label: 'Ensino' },
    { id: 'cultura_esporte', label: 'Cultura e Esporte' },
  ];

  const mockEvents = [
    {
      id: 'item-1',
      setor: 'ensino',
      titulo: 'Conselho de Classe Geral',
      descricao: 'Avaliação de notas e frequência.',
      dataInicio: '2026-10-15',
      dataFim: '2026-10-15',
      status: 'Previsto',
      local: 'Escola Central',
      author: 'Coordenação de Ensino',
    },
  ];

  it('não deve renderizar nada quando isOpen for false', () => {
    const { container } = render(
      <CronogramasDateModal
        isOpen={false}
        onClose={vi.fn()}
        dateKey="2026-10-15"
        cronogramas={mockEvents}
        sectors={mockSectors}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('deve exibir os detalhes do cronograma quando isOpen for true', () => {
    render(
      <CronogramasDateModal
        isOpen={true}
        onClose={vi.fn()}
        dateKey="2026-10-15"
        cronogramas={mockEvents}
        sectors={mockSectors}
      />
    );

    expect(screen.getByText('Conselho de Classe Geral')).toBeDefined();
    expect(screen.getByText('Avaliação de notas e frequência.')).toBeDefined();
    expect(screen.getByText('Escola Central')).toBeDefined();
    expect(screen.getByText(/Coordenação de Ensino/i)).toBeDefined();
    expect(screen.getByText(/15 de outubro de 2026/i)).toBeDefined();
  });

  it('deve chamar onClose ao clicar no botão de fechar', () => {
    const handleClose = vi.fn();

    render(
      <CronogramasDateModal
        isOpen={true}
        onClose={handleClose}
        dateKey="2026-10-15"
        cronogramas={mockEvents}
        sectors={mockSectors}
      />
    );

    const closeButton = screen.getByLabelText('Fechar modal');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve fechar ao pressionar a tecla Escape', () => {
    const handleClose = vi.fn();

    render(
      <CronogramasDateModal
        isOpen={true}
        onClose={handleClose}
        dateKey="2026-10-15"
        cronogramas={mockEvents}
        sectors={mockSectors}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
