-- ================================================================
-- MIGRATION 012: Conquistas Específicas por Perfil (REVISADO)
-- ================================================================
-- Data: 25/10/2025
-- Objetivo: Diferenciar conquistas para vítimas e apoiadoras
-- ANÁLISE: Baseado nas funcionalidades REAIS de cada perfil
-- ================================================================

-- 1. Adicionar coluna target_profile na tabela achievements
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS target_profile TEXT DEFAULT 'all' 
CHECK (target_profile IN ('all', 'user', 'supporter'));

COMMENT ON COLUMN achievements.target_profile IS 'Define se a conquista é para todos, apenas vítimas (user) ou apenas apoiadoras (supporter)';

-- ================================================================
-- 2. ATUALIZAR CONQUISTAS EXISTENTES
-- ================================================================

-- ----------------
-- VÍTIMAS (user)
-- ----------------
-- Funcionalidades: Rede de apoio, SOS, Iniciar chat, Registrar ocorrências

UPDATE achievements 
SET target_profile = 'user'
WHERE code IN (
  -- Rede de Apoio
  'first_connection',     -- Adicionar primeiro contato
  'network_strong',       -- 5 contatos
  'network_community',    -- 10 contatos
  
  -- SOS
  'sos_courage'           -- Enviar primeiro SOS
);

-- ----------------
-- AMBOS (all)
-- ----------------
-- Funcionalidades: Missões, Tempo no app, Navegação

-- Primeiro criar/garantir que existem
INSERT INTO achievements (code, title, description, icon, color, points, required_count, category, target_profile)
VALUES 
  -- Boas-vindas
  ('welcome', 'Bem-vinda', 'Bem-vinda ao APOIA!', '🎉', 'purple', 10, 1, 'special', 'all'),
  
  -- Missões (ambos têm acesso)
  ('first_mission', 'Primeira Missão', 'Complete sua primeira missão', '🎯', 'blue', 50, 1, 'mission', 'all'),
  ('mission_apprentice', 'Aprendiz', 'Complete 5 missões', '📚', 'purple', 100, 5, 'mission', 'all'),
  ('mission_scholar', 'Estudiosa', 'Complete 10 missões', '🧠', 'blue', 200, 10, 'mission', 'all'),
  ('mission_expert', 'Expert', 'Complete 20 missões', '👑', 'gold', 500, 20, 'mission', 'all'),
  ('mission_master', 'Mestre', 'Complete 50 missões', '⭐', 'rainbow', 1000, 50, 'mission', 'all'),
  
  -- Tempo no app
  ('time_week', 'Primeira Semana', 'Passou 7 dias no app', '🔥', 'orange', 100, 7, 'time', 'all'),
  ('time_month', 'Um Mês Forte', 'Passou 30 dias no app', '💎', 'cyan', 500, 30, 'time', 'all'),
  ('time_warrior', 'Guerreira', 'Passou 90 dias no app', '👸', 'gold', 1500, 90, 'time', 'all'),
  
  -- Exploração do app
  ('app_explorer', 'Exploradora', 'Acessou 5 abas diferentes', '📱', 'pink', 50, 5, 'special', 'all')
  
ON CONFLICT (code) DO UPDATE SET
  target_profile = EXCLUDED.target_profile,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- ----------------
-- DELETAR conquistas ambíguas/incorretas
-- ----------------
-- 'first_chat' e 'chat_communicator' são ambíguas
-- Vítima INICIA chat, Apoiadora ACEITA chamado (são ações diferentes)

DELETE FROM achievements WHERE code IN ('first_chat', 'chat_communicator');

-- ================================================================
-- 3. CRIAR CONQUISTAS ESPECÍFICAS PARA VÍTIMAS
-- ================================================================

INSERT INTO achievements (code, title, description, icon, color, points, required_count, category, target_profile)
VALUES 
  -- Chat (iniciar conversa)
  ('user_first_help', 'Pediu Ajuda', 'Iniciou sua primeira conversa anônima', '💬', 'blue', 100, 1, 'chat', 'user'),
  ('user_brave', 'Corajosa', 'Iniciou 3 conversas buscando apoio', '💪', 'orange', 200, 3, 'chat', 'user'),
  
  -- SOS Extra
  ('user_sos_network', 'Rede Ativada', 'Enviou 5 alertas SOS', '🚨', 'red', 250, 5, 'network', 'user'),
  
  -- Recursos de Emergência
  ('user_first_report', 'Documentou', 'Registrou sua primeira ocorrência', '📝', 'purple', 150, 1, 'special', 'user'),
  ('user_informed', 'Bem Informada', 'Consultou o mapa de delegacias 5 vezes', '🗺️', 'green', 100, 5, 'special', 'user')
  
ON CONFLICT (code) DO NOTHING;

-- ================================================================
-- 4. CRIAR CONQUISTAS ESPECÍFICAS PARA APOIADORAS
-- ================================================================

INSERT INTO achievements (code, title, description, icon, color, points, required_count, category, target_profile)
VALUES 
  -- Atendimento
  ('supporter_first_help', 'Primeira Ajuda', 'Aceitou seu primeiro chamado', '❤️', 'pink', 100, 1, 'chat', 'supporter'),
  ('supporter_dedicated', 'Dedicada', 'Atendeu 5 chamados diferentes', '🌟', 'blue', 250, 5, 'chat', 'supporter'),
  ('supporter_mentor', 'Mentora', 'Atendeu 20 chamados diferentes', '👑', 'purple', 750, 20, 'chat', 'supporter'),
  ('supporter_hero', 'Heroína', 'Atendeu 50 chamados diferentes', '🦸‍♀️', 'gold', 2000, 50, 'chat', 'supporter'),
  
  -- Comunicação
  ('supporter_listener', 'Ouvinte Atenta', 'Enviou 50 mensagens de apoio', '👂', 'green', 150, 50, 'chat', 'supporter'),
  ('supporter_counselor', 'Conselheira', 'Enviou 200 mensagens de apoio', '💬', 'teal', 500, 200, 'chat', 'supporter'),
  
  -- Tempo de Resposta
  ('supporter_fast', 'Resposta Rápida', 'Respondeu em menos de 5 minutos em 10 atendimentos', '⚡', 'yellow', 300, 10, 'special', 'supporter'),
  
  -- Dedicação
  ('supporter_available', 'Sempre Disponível', 'Atendeu chamados em 5 dias diferentes', '📅', 'orange', 400, 5, 'time', 'supporter'),
  ('supporter_impact', 'Impacto Positivo', 'Ajudou 10 mulheres diferentes', '🌈', 'rainbow', 600, 10, 'special', 'supporter'),
  
  -- Qualidade
  ('supporter_complete', 'Atendimento Completo', 'Fechou 10 chamados com sucesso', '✅', 'green', 350, 10, 'chat', 'supporter')
  
ON CONFLICT (code) DO NOTHING;

-- ================================================================
-- 5. ATUALIZAR FUNÇÃO get_user_achievements
-- ================================================================

-- Deletar função antiga (mudamos o retorno)
DROP FUNCTION IF EXISTS get_user_achievements(UUID);

-- Criar nova versão com filtro por perfil
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

  -- Se não encontrou o perfil, retornar vazio
  IF user_profile_type IS NULL THEN
    RETURN;
  END IF;

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
  -- FILTRO: Mostrar apenas conquistas relevantes para o perfil
  WHERE a.target_profile = 'all' 
     OR a.target_profile = user_profile_type
  ORDER BY 
    -- 1. Desbloqueadas primeiro
    CASE WHEN ua.is_unlocked THEN 0 ELSE 1 END,
    -- 2. Não desbloqueadas: mais fáceis primeiro (menor required_count)
    a.required_count ASC,
    -- 3. Se empatar: menos pontos primeiro
    a.points ASC;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 6. TRIGGER DE BOAS-VINDAS (PARA TODOS)
-- ================================================================

-- Função que dá boas-vindas ao criar perfil
CREATE OR REPLACE FUNCTION give_welcome_achievement()
RETURNS TRIGGER AS $$
BEGIN
  -- Desbloquear conquista de boas-vindas
  PERFORM unlock_achievement(NEW.id, 'welcome');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger ao criar perfil
DROP TRIGGER IF EXISTS give_welcome_achievement_trigger ON profiles;
CREATE TRIGGER give_welcome_achievement_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION give_welcome_achievement();

-- ================================================================
-- 7. TRIGGERS PARA MISSÕES (TODOS)
-- ================================================================

-- Trigger: Completar missão
CREATE OR REPLACE FUNCTION track_mission_achievement()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar progresso das conquistas de missões
  IF NEW.completed = TRUE AND (OLD.completed IS NULL OR OLD.completed = FALSE) THEN
    PERFORM update_achievement_progress(NEW.user_id, 'first_mission', 1);
    PERFORM update_achievement_progress(NEW.user_id, 'mission_apprentice', 1);
    PERFORM update_achievement_progress(NEW.user_id, 'mission_scholar', 1);
    PERFORM update_achievement_progress(NEW.user_id, 'mission_expert', 1);
    PERFORM update_achievement_progress(NEW.user_id, 'mission_master', 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_mission_achievement_trigger ON user_mission_progress;
CREATE TRIGGER track_mission_achievement_trigger
  AFTER INSERT OR UPDATE ON user_mission_progress
  FOR EACH ROW
  EXECUTE FUNCTION track_mission_achievement();

-- Trigger: Adicionar contato (conquistas de rede)
CREATE OR REPLACE FUNCTION track_network_achievement()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_achievement_progress(NEW.user_id, 'first_connection', 1);
  PERFORM update_achievement_progress(NEW.user_id, 'network_strong', 1);
  PERFORM update_achievement_progress(NEW.user_id, 'network_community', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_network_achievement_trigger ON trusted_contacts;
CREATE TRIGGER track_network_achievement_trigger
  AFTER INSERT ON trusted_contacts
  FOR EACH ROW
  EXECUTE FUNCTION track_network_achievement();

-- ================================================================
-- 8. TRIGGERS PARA VÍTIMAS
-- ================================================================

-- Trigger: Iniciar chat anônimo
CREATE OR REPLACE FUNCTION track_user_chat_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas se a sala foi criada por uma vítima (victim_id preenchido)
  IF NEW.victim_id IS NOT NULL THEN
    -- Atualizar progresso da conquista 'user_first_help'
    PERFORM update_achievement_progress(NEW.victim_id, 'user_first_help', 1);
    PERFORM update_achievement_progress(NEW.victim_id, 'user_brave', 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_user_chat_init_trigger ON chat_rooms;
CREATE TRIGGER track_user_chat_init_trigger
  AFTER INSERT ON chat_rooms
  FOR EACH ROW
  EXECUTE FUNCTION track_user_chat_trigger();

-- Trigger: Registrar ocorrência
CREATE OR REPLACE FUNCTION track_incident_report_trigger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_achievement_progress(NEW.user_id, 'user_first_report', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_incident_trigger ON incident_reports;
CREATE TRIGGER track_incident_trigger
  AFTER INSERT ON incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION track_incident_report_trigger();

-- ================================================================
-- 9. TRIGGERS PARA APOIADORAS
-- ================================================================

-- Trigger: Aceitar chamado (quando supporter_id é preenchido)
CREATE OR REPLACE FUNCTION track_supporter_accept_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas se a sala passou de waiting para active E tem supporter
  IF OLD.status = 'waiting' 
     AND NEW.status = 'active' 
     AND NEW.supporter_id IS NOT NULL THEN
    
    -- Atualizar conquistas de atendimento
    PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_first_help', 1);
    PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_dedicated', 1);
    PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_mentor', 1);
    PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_hero', 1);
  END IF;
  
  -- Fechar chamado com sucesso
  IF OLD.status = 'active' 
     AND NEW.status = 'closed' 
     AND NEW.supporter_id IS NOT NULL THEN
    PERFORM update_achievement_progress(NEW.supporter_id, 'supporter_complete', 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_supporter_accept ON chat_rooms;
CREATE TRIGGER track_supporter_accept
  AFTER UPDATE ON chat_rooms
  FOR EACH ROW
  EXECUTE FUNCTION track_supporter_accept_trigger();

-- Trigger: Enviar mensagens (apoiadora)
CREATE OR REPLACE FUNCTION track_supporter_messages_trigger()
RETURNS TRIGGER AS $$
DECLARE
  room_supporter_id UUID;
BEGIN
  -- Buscar supporter_id da sala
  SELECT supporter_id INTO room_supporter_id
  FROM chat_rooms
  WHERE id = NEW.room_id;
  
  -- Se a mensagem foi enviada pela apoiadora (sender_id = supporter_id)
  IF NEW.sender_id = room_supporter_id THEN
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
  EXECUTE FUNCTION track_supporter_messages_trigger();

-- ================================================================
-- 10. COMENTÁRIOS
-- ================================================================

COMMENT ON COLUMN achievements.target_profile IS 'Define quem pode obter esta conquista: all, user (vítimas) ou supporter (apoiadoras)';
COMMENT ON FUNCTION get_user_achievements(UUID) IS 'Retorna conquistas filtradas por tipo de perfil do usuário com cálculo de progresso';

-- ================================================================
-- FIM DA MIGRATION 012 (VERSÃO CORRIGIDA)
-- ================================================================
