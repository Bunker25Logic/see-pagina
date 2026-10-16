import { describe, it, expect } from 'vitest';
import { FALLBACK_COURSES, COURSE_CATEGORIES } from '@/lib/courses';
import { FALLBACK_SCHOOLS } from '@/lib/schools';

describe('lib/courses & lib/schools — Cursos Disponíveis e Instituição de Cursos', () => {
  it('deve possuir categorias de cursos profissionais definidas', () => {
    expect(COURSE_CATEGORIES.length).toBeGreaterThan(0);
    expect(COURSE_CATEGORIES).toContain('Tecnologia da Informação');
    expect(COURSE_CATEGORIES).toContain('Gestão & Negócios');
  });

  it('deve conter cursos no FALLBACK_COURSES com cálculo coerente de vagas', () => {
    expect(FALLBACK_COURSES.length).toBeGreaterThan(0);

    for (const course of FALLBACK_COURSES) {
      expect(course.id).toBeDefined();
      expect(course.title).toBeTruthy();
      expect(course.totalVacancies).toBeGreaterThan(0);
      expect(course.filledVacancies).toBeGreaterThanOrEqual(0);
      expect(course.availableVacancies).toBe(course.totalVacancies - course.filledVacancies);
      expect(['aberto', 'ultimas_vagas', 'esgotado', 'em_breve']).toContain(course.status);
    }
  });

  it('deve identificar a instituição CEEPT com a flag offersCourses ativada', () => {
    const ceept = FALLBACK_SCHOOLS.find((s) => s.slug === 'centro-educacao-profissional-tecnologica-brasileia');
    expect(ceept).toBeDefined();
    expect(ceept.offersCourses).toBe(true);
    expect(ceept.type).toContain('Cursos Gratuitos');
  });
});
