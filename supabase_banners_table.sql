-- ================================================================
-- TABELA DE BANNERS / ANÚNCIOS PROMOCIONAIS E EVENTOS
-- Portal SEE e Painel Administrativo
-- ================================================================

CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT DEFAULT 'Destaque',
  image_url TEXT NOT NULL,
  link_url TEXT,
  target_blank BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer visitante pode ver banners ativos)
CREATE POLICY "Permitir leitura pública de banners"
  ON public.banners
  FOR SELECT
  USING (true);

-- Política de inserção para qualquer usuário anon/autenticado
CREATE POLICY "Permitir inserção de banners"
  ON public.banners
  FOR INSERT
  WITH CHECK (true);

-- Política de atualização
CREATE POLICY "Permitir atualização de banners"
  ON public.banners
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política de exclusão
CREATE POLICY "Permitir exclusão de banners"
  ON public.banners
  FOR DELETE
  USING (true);

-- Inserção de dados iniciais exemplares
INSERT INTO public.banners (title, subtitle, tag, image_url, link_url, target_blank, is_active, order_index)
VALUES
  (
    'Encontro Pedagógico 2026',
    'Participe das oficinas de formação continuada para docentes.',
    'Evento Especial',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    '/eventos',
    false,
    true,
    1
  ),
  (
    'Biblioteca Virtual do Acre',
    'Mais de 10.000 livros, periódicos e artigos digitais disponíveis gratuitamente.',
    'Acesso Gratuito',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    'https://biblioteca.ac.gov.br',
    true,
    true,
    2
  );
