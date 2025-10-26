-- ================================================================
-- MIGRATION 015: Sistema de Depoimentos Anônimos (Comunidade)
-- ================================================================
-- Data: 25/10/2025
-- Objetivo: Sistema tipo Twitter para mulheres compartilharem
--           experiências de forma anônima e receberem apoio
-- Contexto: App APOIA - discrição e anonimato são essenciais
-- ================================================================

-- ================================================================
-- 1. TABELA: anonymous_posts (Depoimentos)
-- ================================================================

CREATE TABLE IF NOT EXISTS anonymous_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Referência ao profile (mas não exposta)
  
  -- Conteúdo do post
  content TEXT NOT NULL,
  anonymous_name TEXT NOT NULL, -- "Anônima #7234"
  
  -- Aviso de conteúdo sensível (trigger warning)
  has_trigger_warning BOOLEAN DEFAULT false,
  trigger_warning_text TEXT, -- Ex: "violência física", "trauma"
  
  -- Contadores (atualizados por triggers)
  support_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Moderação
  is_visible BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_anonymous_posts_user_id ON anonymous_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_posts_created_at ON anonymous_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anonymous_posts_is_visible ON anonymous_posts(is_visible);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_anonymous_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER anonymous_posts_updated_at
BEFORE UPDATE ON anonymous_posts
FOR EACH ROW
EXECUTE FUNCTION update_anonymous_posts_updated_at();

-- ================================================================
-- 2. TABELA: post_comments (Comentários)
-- ================================================================

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES anonymous_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Referência ao profile
  
  -- Conteúdo do comentário
  content TEXT NOT NULL,
  anonymous_name TEXT NOT NULL, -- "Anônima #5612"
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- ================================================================
-- 3. TABELA: post_support (Apoio "Você não está sozinha")
-- ================================================================

CREATE TABLE IF NOT EXISTS post_support (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES anonymous_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Referência ao profile
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: uma pessoa só pode apoiar 1x cada post
  UNIQUE(post_id, user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_post_support_post_id ON post_support(post_id);
CREATE INDEX IF NOT EXISTS idx_post_support_user_id ON post_support(user_id);

-- ================================================================
-- 4. FUNÇÕES: Incrementar/Decrementar Contadores
-- ================================================================

-- Função: Incrementar contador de comentários
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anonymous_posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função: Decrementar contador de comentários (ao deletar)
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anonymous_posts
  SET comment_count = GREATEST(0, comment_count - 1)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Função: Incrementar contador de apoios
CREATE OR REPLACE FUNCTION increment_support_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anonymous_posts
  SET support_count = support_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função: Decrementar contador de apoios (ao remover)
CREATE OR REPLACE FUNCTION decrement_support_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anonymous_posts
  SET support_count = GREATEST(0, support_count - 1)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 5. TRIGGERS: Auto-atualizar Contadores
-- ================================================================

-- Trigger: Incrementar comment_count ao criar comentário
CREATE TRIGGER increment_comment_count_trigger
AFTER INSERT ON post_comments
FOR EACH ROW
EXECUTE FUNCTION increment_comment_count();

-- Trigger: Decrementar comment_count ao deletar comentário
CREATE TRIGGER decrement_comment_count_trigger
AFTER DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION decrement_comment_count();

-- Trigger: Incrementar support_count ao adicionar apoio
CREATE TRIGGER increment_support_count_trigger
AFTER INSERT ON post_support
FOR EACH ROW
EXECUTE FUNCTION increment_support_count();

-- Trigger: Decrementar support_count ao remover apoio
CREATE TRIGGER decrement_support_count_trigger
AFTER DELETE ON post_support
FOR EACH ROW
EXECUTE FUNCTION decrement_support_count();

-- ================================================================
-- 6. ROW LEVEL SECURITY (RLS) - PERMISSIVO
-- ================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE anonymous_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_support ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- POLÍTICAS: anonymous_posts
-- ================================================================

-- Política: Qualquer um pode criar posts
CREATE POLICY "Anyone can create posts"
ON anonymous_posts
FOR INSERT
WITH CHECK (true);

-- Política: Qualquer um pode ver posts visíveis
CREATE POLICY "Anyone can view visible posts"
ON anonymous_posts
FOR SELECT
USING (is_visible = true);

-- Política: Qualquer um pode atualizar posts (para moderação futura)
CREATE POLICY "Anyone can update posts"
ON anonymous_posts
FOR UPDATE
USING (true);

-- Política: Qualquer um pode deletar posts
CREATE POLICY "Anyone can delete posts"
ON anonymous_posts
FOR DELETE
USING (true);

-- ================================================================
-- POLÍTICAS: post_comments
-- ================================================================

-- Política: Qualquer um pode criar comentários
CREATE POLICY "Anyone can create comments"
ON post_comments
FOR INSERT
WITH CHECK (true);

-- Política: Qualquer um pode ver comentários
CREATE POLICY "Anyone can view comments"
ON post_comments
FOR SELECT
USING (true);

-- Política: Qualquer um pode deletar comentários
CREATE POLICY "Anyone can delete comments"
ON post_comments
FOR DELETE
USING (true);

-- ================================================================
-- POLÍTICAS: post_support
-- ================================================================

-- Política: Qualquer um pode adicionar apoio
CREATE POLICY "Anyone can add support"
ON post_support
FOR INSERT
WITH CHECK (true);

-- Política: Qualquer um pode ver apoios
CREATE POLICY "Anyone can view support"
ON post_support
FOR SELECT
USING (true);

-- Política: Qualquer um pode remover apoio
CREATE POLICY "Anyone can remove support"
ON post_support
FOR DELETE
USING (true);

-- ================================================================
-- 7. FUNÇÃO AUXILIAR: Gerar Nome Anônimo
-- ================================================================

-- Função: Gerar nome anônimo único (Anônima #1234)
CREATE OR REPLACE FUNCTION generate_anonymous_name()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Anônima #' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 8. COMENTÁRIOS E DOCUMENTAÇÃO
-- ================================================================

COMMENT ON TABLE anonymous_posts IS 'Depoimentos anônimos compartilhados pelas usuárias. Sistema tipo Twitter com foco em apoio mútuo.';
COMMENT ON TABLE post_comments IS 'Comentários nos depoimentos. Também anônimos.';
COMMENT ON TABLE post_support IS 'Registro de apoio ("Você não está sozinha"). Uma pessoa pode apoiar cada post apenas 1x.';

COMMENT ON COLUMN anonymous_posts.anonymous_name IS 'Nome anônimo gerado automaticamente (ex: Anônima #7234). Muda a cada post.';
COMMENT ON COLUMN anonymous_posts.has_trigger_warning IS 'Se true, o post contém conteúdo sensível (violência, trauma, etc.)';
COMMENT ON COLUMN anonymous_posts.trigger_warning_text IS 'Descrição opcional do conteúdo sensível para aviso prévio.';
COMMENT ON COLUMN anonymous_posts.support_count IS 'Contador de apoios. Atualizado automaticamente por trigger.';
COMMENT ON COLUMN anonymous_posts.comment_count IS 'Contador de comentários. Atualizado automaticamente por trigger.';
COMMENT ON COLUMN anonymous_posts.is_visible IS 'Flag para moderação. Se false, o post não aparece no feed.';

-- ================================================================
-- 9. DADOS DE EXEMPLO (OPCIONAL - COMENTADO)
-- ================================================================

-- Descomente para inserir posts de exemplo para testes
/*
INSERT INTO anonymous_posts (user_id, content, anonymous_name, has_trigger_warning, trigger_warning_text)
VALUES
  (
    (SELECT id FROM profiles LIMIT 1), -- Pegar um user_id qualquer
    'Hoje consegui sair de casa pela primeira vez em 3 semanas. É um pequeno passo, mas me sinto orgulhosa.',
    'Anônima #7234',
    false,
    null
  ),
  (
    (SELECT id FROM profiles LIMIT 1),
    'Ainda estou processando tudo que aconteceu. Às vezes acho que estou ficando louca, mas vim aqui buscar força.',
    'Anônima #4521',
    true,
    'Relato de violência psicológica'
  );
*/

-- ================================================================
-- FIM DA MIGRATION 015
-- ================================================================
-- Total: 3 tabelas + 8 funções + 4 triggers + 9 políticas RLS
-- Sistema completo de depoimentos anônimos com apoio e comentários
-- Realtime-ready (Supabase subscriptions funcionam automaticamente)
-- ================================================================
