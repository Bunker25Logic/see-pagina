-- ================================================================
-- TABELA DE CRONOGRAMAS SETORIAIS
-- Setores: dire, ensino, transporte, cultura_esporte, administracao
-- Núcleo de Educação de Brasiléia - SEE-AC
-- ================================================================

CREATE TABLE IF NOT EXISTS public.cronogramas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setor TEXT NOT NULL CHECK (setor IN ('dire', 'ensino', 'transporte', 'cultura_esporte', 'administracao')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  status TEXT DEFAULT 'Previsto', -- 'Previsto', 'Em andamento', 'Concluído', 'Urgente'
  local TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_cronogramas_setor ON public.cronogramas(setor);
CREATE INDEX IF NOT EXISTS idx_cronogramas_data ON public.cronogramas(data_inicio);

-- Ativar RLS
ALTER TABLE public.cronogramas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de cronogramas"
  ON public.cronogramas
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de cronogramas"
  ON public.cronogramas
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de cronogramas"
  ON public.cronogramas
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de cronogramas"
  ON public.cronogramas
  FOR DELETE
  USING (true);

-- Dados iniciais representativos para cada setor
INSERT INTO public.cronogramas (setor, titulo, descricao, data_inicio, data_fim, status, local, order_index)
VALUES
  -- DIRE
  ('dire', 'Reunião de Alinhamento com Gestores Escolares', 'Definição das metas pedagógicas e operacionais para o 4º bimestre.', '2026-09-18', '2026-09-18', 'Previsto', 'Auditório do Núcleo SEE', 1),
  ('dire', 'Visita Técnica e Acompanhamento Institucional', 'Inspeção in loco nas unidades de ensino da zona urbana de Brasiléia.', '2026-09-24', '2026-09-26', 'Previsto', 'Escolas Estaduais', 2),

  -- Ensino
  ('ensino', 'Conselho de Classe do 3º Bimestre', 'Avaliação do desempenho acadêmico dos estudantes e planejamento de reforço.', '2026-09-15', '2026-09-19', 'Em andamento', 'Todas as Escolas', 1),
  ('ensino', 'Formação Continuada para Professores de Matemática', 'Oficina prática de novas metodologias ativas e uso de tecnologias educacionais.', '2026-09-28', '2026-09-29', 'Previsto', 'Centro de Capacitação', 2),

  -- Transporte
  ('transporte', 'Vistoria Semestral da Frota Escolar', 'Inspeção mecânica, cintos de segurança e documentação dos ônibus rurais.', '2026-09-21', '2026-09-23', 'Previsto', 'Garagem Central SEE', 1),
  ('transporte', 'Atualização dos Roteiros da Zona Rural', 'Ajuste de trajetos e horários para atender os ramais no período de chuvas.', '2026-10-02', '2026-10-05', 'Previsto', 'Ramais km 14 ao km 45', 2),

  -- Cultura e Esporte
  ('cultura_esporte', 'Fase Municipal dos Jogos Escolares do Acre', 'Disputas de futsal, voleibol e atletismo entre as escolas públicas.', '2026-10-08', '2026-10-12', 'Previsto', 'Ginásio Eduardo Lopes Pessoa', 1),
  ('cultura_esporte', 'Mostra Estudantil de Arte e Cultura Regional', 'Apresentações teatrais, dança folclórica e exposição de artes visuais.', '2026-10-22', '2026-10-23', 'Previsto', 'Praça Hugo Poli', 2),

  -- Administração
  ('administracao', 'Envio da Folha de Frequência e Horas Extras', 'Prazo limite para fechamento da folha dos servidores da educação.', '2026-09-20', '2026-09-20', 'Urgente', 'Setor de RH / Protocolo', 1),
  ('administracao', 'Prestação de Contas do PDDE / Caixa Escolar', 'Plantão para entrega e validação de documentos fiscais das diretorias.', '2026-09-30', '2026-10-02', 'Previsto', 'Setor Financeiro SEE', 2);
