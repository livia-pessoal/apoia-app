-- ================================================================
-- MIGRATION 012: Conquistas Específicas por Perfil
-- ================================================================
-- Data: 25/10/2025
-- Objetivo: Diferenciar conquistas para vítimas e apoiadoras
-- ================================================================

-- 1. Adicionar coluna target_profile na tabela achievements
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS target_profile TEXT DEFAULT 'all' 
CHECK (target_profile IN ('all', 'user', 'supporter'));

COMMENT ON COLUMN achievements.target_profile IS 'Define se a conquista é para todos, apenas vítimas (user) ou apenas apoiadoras (supporter)';

-- 2. Atualizar conquistas existentes com target correto
-- Conquistas que são apenas para vítimas (user)
UPDATE achievements 
SET target_profile = 'user'
WHERE code IN (
  'first_connection',     -- Primeira Conexão (adicionar contato)
  'network_strong',       -- Rede Forte (5 contatos)
  'network_community',    -- Comunidade (10 contatos)
  'sos_courage'           -- Coragem (enviar SOS)
);

-- Conquistas que são para ambos
UPDATE achievements 
SET target_profile = 'all'
WHERE code IN (
  'welcome',              -- Bem-vinda
  'first_mission',        -- Primeira Missão
  'mission_apprentice',   -- Aprendiz (5 missões)
  'mission_scholar',      -- Estudiosa (10 missões)
  'mission_expert',       -- Expert (20 missões)
  'mission_master',       -- Mestre (50 missões)
  'first_chat',           -- Primeira Conversa
  'chat_communicator',    -- Comunicadora (5 chats)
  'time_week',            -- Primeira Semana
  'time_month',           -- Um Mês Forte
  'time_warrior',         -- Guerreira (90 dias)
  'app_explorer'          -- Exploradora (5 abas)
);

-- 3. Criar conquistas específicas para APOIADORAS
INSERT INTO achievements (code, title, description, icon, color, points, required_count, category, target_profile)
VALUES 
  -- Conquistas de Atendimento
  ('supporter_first_help', 'Primeira Ajuda', 'Aceitou seu primeiro chamado de uma vítima', '❤️', 'pink', 100, 1, 'chat', 'supporter'),
  ('supporter_dedicated', 'Dedicada', 'Atendeu 5 chamados diferentes', '🌟', 'blue', 250, 5, 'chat', 'supporter'),
  ('supporter_mentor', 'Mentora', 'Atendeu 20 chamados diferentes', '👑', 'purple', 750, 20, 'chat', 'supporter'),
  ('supporter_hero', 'Heroína', 'Atendeu 50 chamados diferentes', '🦸‍♀️', 'gold', 2000, 50, 'chat', 'supporter'),
  
  -- Conquistas de Comunicação
  ('supporter_listener', 'Ouvinte Atenta', 'Enviou 50 mensagens de apoio', '👂', 'green', 150, 50, 'chat', 'supporter'),
  ('supporter_counselor', 'Conselheira', 'Enviou 200 mensagens de apoio', '💬', 'teal', 500, 200, 'chat', 'supporter'),
  
  -- Conquistas de Tempo
  ('supporter_fast', 'Resposta Rápida', 'Respondeu em menos de 5 minutos em 10 atendimentos', '⚡', 'yellow', 300, 10, 'special', 'supporter'),
  ('supporter_available', 'Sempre Disponível', 'Atendeu chamados em 5 dias diferentes', '📅', 'orange', 400, 5, 'time', 'supporter'),
  
  -- Conquistas de Impacto
  ('supporter_impact', 'Impacto Positivo', 'Ajudou 10 mulheres diferentes', '🌈', 'rainbow', 600, 10, 'special', 'supporter')
ON CONFLICT (code) DO NOTHING;

-- 4. Atualizar função get_user_achievements para filtrar por perfil
-- Primeiro, deletar a função existente (porque estamos mudando o tipo de retorno)
DROP FUNCTION IF EXISTS get_user_achievements(UUID);

-- Agora criar a nova versão com target_profile
CREATE OR REPLACE FUNCTION get_user_achievements(p_user_id UUID)
RETURNS TABLE (
  achievement_id UUID,
  achievement_code TEXT,
  achievement_title TEXT,
  achievement_description TEXT,
  icon TEXT,
  color TEXT,
  points INTEGER,
  required_count INTEGER,
  category TEXT,
  current_progress INTEGER,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  progress_percentage NUMERIC,
  target_profile TEXT
) AS $$
DECLARE
  user_profile_type TEXT;
BEGIN
  -- Buscar tipo de perfil do usuário
  SELECT user_type INTO user_profile_type
  FROM profiles
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT 
    a.id as achievement_id,
    a.code as achievement_code,
    a.title as achievement_title,
    a.description as achievement_description,
    a.icon,
    a.color,
    a.points,
    a.required_count,
    a.category,
    COALESCE(ua.current_progress, 0) as current_progress,
    COALESCE(ua.is_unlocked, FALSE) as is_unlocked,
    ua.unlocked_at,
    CASE 
      WHEN a.required_count > 0 THEN 
        ROUND((COALESCE(ua.current_progress, 0)::NUMERIC / a.required_count::NUMERIC) * 100, 2)
      ELSE 0
    END as progress_percentage,
    a.target_profile
  FROM achievements a
  LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = p_user_id
  -- Filtrar conquistas que são para este tipo de perfil ou para todos
  WHERE a.target_profile = 'all' 
     OR a.target_profile = user_profile_type
  ORDER BY 
    CASE 
      WHEN ua.is_unlocked THEN 1 
      ELSE 0 
    END,
    a.points DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar triggers para conquistas de apoiadoras

-- Trigger: Primeira Ajuda (ao aceitar primeiro chamado)
CREATE OR REPLACE FUNCTION track_supporter_first_help()
RETURNS TRIGGER AS $$
BEGIN
  -- Se sala mudou de waiting para active E tem supporter_id
  IF OLD.status = 'waiting' AND NEW.status = 'active' AND NEW.supporter_id IS NOT NULL THEN
    -- Dar conquista de primeira ajuda
    PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_first_help', 1);
    
    -- Contar total de chamados aceitos para outras conquistas
    DECLARE
      total_accepted INT;
    BEGIN
      SELECT COUNT(DISTINCT id) INTO total_accepted
      FROM chat_rooms
      WHERE supporter_id = NEW.supporter_id;
      
      -- Atualizar progresso das conquistas baseadas em quantidade
      PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_dedicated', 1);
      PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_mentor', 1);
      PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_hero', 1);
      PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_impact', 1);
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_supporter_help_trigger ON chat_rooms;
CREATE TRIGGER track_supporter_help_trigger
  AFTER UPDATE ON chat_rooms
  FOR EACH ROW
  EXECUTE FUNCTION track_supporter_first_help();

-- Trigger: Conquistas de mensagens enviadas
CREATE OR REPLACE FUNCTION track_supporter_messages()
RETURNS TRIGGER AS $$
BEGIN
  -- Se mensagem foi enviada por apoiadora (não é mensagem do sistema)
  IF NEW.sender_type = 'supporter' AND NEW.is_system_message IS NOT TRUE THEN
    PERFORM update_achievement_progress(NEW.sender_id, 'supporter_listener', 1);
    PERFORM update_achievement_progress(NEW.sender_id, 'supporter_counselor', 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_supporter_messages_trigger ON chat_messages;
CREATE TRIGGER track_supporter_messages_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION track_supporter_messages();

-- 6. Comentários
COMMENT ON COLUMN achievements.target_profile IS 'Define quem pode obter esta conquista: all, user (vítimas) ou supporter (apoiadoras)';
COMMENT ON FUNCTION get_user_achievements(UUID) IS 'Retorna conquistas filtradas por tipo de perfil do usuário (inclui coluna target_profile)';

-- ================================================================
-- FIM DA MIGRATION 012
-- ================================================================
