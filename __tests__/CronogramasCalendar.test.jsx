import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CronogramasCalendar from '@/components/cronogramas/CronogramasCalendar';

describe('CronogramasCalendar — Componente de Calendário Interativo', () => {
  const mockSectors = [
    { id: 'ensino', label: 'Ensino' },
    { id: 'cultura_esporte', label: 'Cultura e Esporte' },
  ];

  const mockCronogramas = [
    {
      id: '1',
      setor: 'ensino',
      titulo: 'Formação Pedagógica',
      dataInicio: '2026-10-15',
      dataFim: '2026-10-15',
      status: 'Previsto',
    },
    {
      id: '2',
      setor: 'cultura_esporte',
      titulo: 'Jogos Estudantis',
      dataInicio: '2026-10-20',
      dataFim: '2026-10-22',
      status: 'Em andamento',
    },
  ];

  it('deve renderizar os cabeçalhos dos dias da semana', () => {
    render(<CronogramasCalendar cronogramas={mockCronogramas} sectors={mockSectors} />);

    expect(screen.getByText('Dom')).toBeDefined();
    expect(screen.getByText('Seg')).toBeDefined();
    expect(screen.getByText('Ter')).toBeDefined();
    expect(screen.getByText('Qua')).toBeDefined();
    expect(screen.getByText('Qui')).toBeDefined();
    expect(screen.getByText('Sex')).toBeDefined();
    expect(screen.getByText('Sáb')).toBeDefined();
  });

  it('deve exibir os atalhos de meses com eventos cadastrados', () => {
    render(<CronogramasCalendar cronogramas={mockCronogramas} sectors={mockSectors} />);

    // Deve conter a pílula de Outubro 2026
    const monthPill = screen.getByText(/Outubro 2026/i);
    expect(monthPill).toBeDefined();
  });

  it('deve chamar onSelectDate ao clicar em uma data com eventos', () => {
    const handleSelectDate = vi.fn();

    render(
      <CronogramasCalendar
        cronogramas={mockCronogramas}
        sectors={mockSectors}
        onSelectDate={handleSelectDate}
      />
    );

    // Encontra o botão do dia 15
    const day15Button = screen.getByLabelText(/15 de Outubro de 2026/i);
    expect(day15Button).toBeDefined();

    fireEvent.click(day15Button);

    expect(handleSelectDate).toHaveBeenCalledTimes(1);
    expect(handleSelectDate).toHaveBeenCalledWith('2026-10-15', expect.any(Array));
    expect(handleSelectDate.mock.calls[0][1][0].titulo).toBe('Formação Pedagógica');
  });

  it('deve navegar para o próximo mês ao clicar no botão de próximo', () => {
    render(<CronogramasCalendar cronogramas={mockCronogramas} sectors={mockSectors} />);

    const nextButton = screen.getByTitle('Próximo mês');
    fireEvent.click(nextButton);

    expect(screen.getByText(/Novembro de 2026/i)).toBeDefined();
  });

  it('deve navegar para o mês anterior ao clicar no botão de anterior', () => {
    render(<CronogramasCalendar cronogramas={mockCronogramas} sectors={mockSectors} />);

    const prevButton = screen.getByTitle('Mês anterior');
    fireEvent.click(prevButton);

    expect(screen.getByText(/Setembro de 2026/i)).toBeDefined();
  });
});
