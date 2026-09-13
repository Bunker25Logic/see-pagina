-- ================================================================
-- TABELA DE MENSAGENS DO DIA (Barra Superior do Portal SEE)
-- Núcleo de Educação de Brasiléia - SEE-AC
-- ================================================================

CREATE TABLE IF NOT EXISTS public.mensagens_dia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mensagem TEXT NOT NULL,
  autor TEXT DEFAULT 'Núcleo de Educação',
  link_url TEXT,
  target_blank BOOLEAN DEFAULT false,
  data_publicacao DATE DEFAULT CURRENT_DATE,
  data_expiracao DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.mensagens_dia ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer visitante pode ler mensagens)
CREATE POLICY "Permitir leitura pública de mensagens do dia"
  ON public.mensagens_dia
  FOR SELECT
  USING (true);

-- Política de inserção (anon / autenticado)
CREATE POLICY "Permitir inserção de mensagens do dia"
  ON public.mensagens_dia
  FOR INSERT
  WITH CHECK (true);

-- Política de atualização
CREATE POLICY "Permitir atualização de mensagens do dia"
  ON public.mensagens_dia
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política de exclusão
CREATE POLICY "Permitir exclusão de mensagens do dia"
  ON public.mensagens_dia
  FOR DELETE
  USING (true);

-- Inserção de dados iniciais
INSERT INTO public.mensagens_dia (mensagem, autor, link_url, is_active, data_publicacao)
VALUES
  (
    'Hoje é dia de Conselho de Classe nas escolas da rede — resultados publicados até sexta-feira, 18/09.',
    'Coordenação Pedagógica',
    '/eventos',
    true,
    CURRENT_DATE
  ),
  (
    'Inscrições abertas para as Olimpíadas de Matemática das Escolas Públicas em Brasiléia.',
    'Núcleo de Educação',
    '/noticias',
    false,
    CURRENT_DATE
  );
