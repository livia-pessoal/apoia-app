-- ============================================
-- MIGRATION 010: Sistema de Conquistas
-- ============================================
-- Gamificação com badges e pontos
-- Data: 19/10/2025
-- ============================================

-- TABELA 1: achievements (conquistas disponíveis)
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  code TEXT NOT NULL UNIQUE,  -- Ex: 'first_mission', 'week_streak'
  title TEXT NOT NULL,         -- Ex: 'Primeira Missão'
  description TEXT NOT NULL,   -- Ex: 'Complete sua primeira missão'
  
  -- Categoria e Visual
  category TEXT NOT NULL CHECK (category IN ('mission', 'network', 'chat', 'time', 'special')),
  icon TEXT NOT NULL,          -- Emoji do badge: '🎯', '🔥', etc
  color TEXT DEFAULT 'purple', -- Cor do card
  
  -- Gamificação
  points INT DEFAULT 0,        -- Pontos ganhos ao desbloquear
  required_count INT DEFAULT 1, -- Quantidade necessária (ex: 5 missões)
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  is_secret BOOLEAN DEFAULT false, -- Conquista secreta (não mostra antes)
  
  -- Ordem de exibição
  display_order INT DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABELA 2: user_achievements (conquistas desbloqueadas)
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  
  -- Progresso
  current_progress INT DEFAULT 0,  -- Progresso atual
  is_unlocked BOOLEAN DEFAULT false,
  
  -- Timestamps
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraint: um usuário não pode ter a mesma conquista duplicada
  UNIQUE(user_id, achievement_id)
);

-- ÍNDICES para performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_code ON achievements(code);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_unlocked ON user_achievements(user_id, is_unlocked);

-- RLS (Row Level Security)
-- ============================================
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ver conquistas disponíveis
CREATE POLICY "Anyone can view achievements"
ON achievements
FOR SELECT
TO PUBLIC
USING (true);

-- Usuário vê apenas suas conquistas
CREATE POLICY "Users can view own achievements"
ON user_achievements
FOR SELECT
TO PUBLIC
USING (true);  -- Por enquanto permissivo

-- Sistema pode criar conquistas de usuário
CREATE POLICY "System can create user achievements"
ON user_achievements
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- Sistema pode atualizar progresso
CREATE POLICY "System can update user achievements"
ON user_achievements
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função: Desbloquear conquista
CREATE OR REPLACE FUNCTION unlock_achievement(
  p_user_id UUID,
  p_achievement_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_achievement_id UUID;
  v_points INT;
  v_already_unlocked BOOLEAN;
BEGIN
  -- Buscar conquista
  SELECT id, points INTO v_achievement_id, v_points
  FROM achievements
  WHERE code = p_achievement_code;
  
  IF v_achievement_id IS NULL THEN
    RAISE NOTICE 'Conquista não encontrada: %', p_achievement_code;
    RETURN false;
  END IF;
  
  -- Verificar se já está desbloqueada
  SELECT is_unlocked INTO v_already_unlocked
  FROM user_achievements
  WHERE user_id = p_user_id AND achievement_id = v_achievement_id;
  
  IF v_already_unlocked = true THEN
    RAISE NOTICE 'Conquista já desbloqueada';
    RETURN false;
  END IF;
  
  -- Criar/atualizar registro
  INSERT INTO user_achievements (user_id, achievement_id, is_unlocked, unlocked_at, current_progress)
  VALUES (p_user_id, v_achievement_id, true, now(), 1)
  ON CONFLICT (user_id, achievement_id) 
  DO UPDATE SET 
    is_unlocked = true,
    unlocked_at = now(),
    current_progress = user_achievements.current_progress + 1;
  
  -- Adicionar pontos ao perfil
  UPDATE profiles
  SET level = COALESCE(level, 0) + (v_points / 100)  -- 100 pts = 1 nível
  WHERE id = p_user_id;
  
  -- Criar notificação
  INSERT INTO notifications (user_id, title, message, type, metadata)
  SELECT 
    p_user_id,
    '🏆 Conquista Desbloqueada!',
    'Você ganhou: ' || a.title || ' (+' || a.points || ' pts)',
    'achievement',
    jsonb_build_object('achievement_code', p_achievement_code, 'points', a.points, 'icon', a.icon)
  FROM achievements a
  WHERE a.id = v_achievement_id;
  
  RETURN true;
END;
$$;

-- Função: Atualizar progresso de conquista
CREATE OR REPLACE FUNCTION update_achievement_progress(
  p_user_id UUID,
  p_achievement_code TEXT,
  p_increment INT DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_achievement_id UUID;
  v_required_count INT;
  v_current_progress INT;
BEGIN
  -- Buscar conquista
  SELECT id, required_count INTO v_achievement_id, v_required_count
  FROM achievements
  WHERE code = p_achievement_code;
  
  IF v_achievement_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Inserir ou atualizar progresso
  INSERT INTO user_achievements (user_id, achievement_id, current_progress)
  VALUES (p_user_id, v_achievement_id, p_increment)
  ON CONFLICT (user_id, achievement_id)
  DO UPDATE SET current_progress = user_achievements.current_progress + p_increment;
  
  -- Verificar se atingiu meta
  SELECT current_progress INTO v_current_progress
  FROM user_achievements
  WHERE user_id = p_user_id AND achievement_id = v_achievement_id;
  
  IF v_current_progress >= v_required_count THEN
    PERFORM unlock_achievement(p_user_id, p_achievement_code);
  END IF;
END;
$$;

-- Função: Ver conquistas do usuário
CREATE OR REPLACE FUNCTION get_user_achievements(p_user_id UUID)
RETURNS TABLE(
  achievement_code TEXT,
  achievement_title TEXT,
  achievement_description TEXT,
  category TEXT,
  icon TEXT,
  color TEXT,
  points INT,
  required_count INT,
  current_progress INT,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMPTZ,
  progress_percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.code,
    a.title,
    a.description,
    a.category,
    a.icon,
    a.color,
    a.points,
    a.required_count,
    COALESCE(ua.current_progress, 0) as current_progress,
    COALESCE(ua.is_unlocked, false) as is_unlocked,
    ua.unlocked_at,
    ROUND((COALESCE(ua.current_progress, 0)::NUMERIC / a.required_count::NUMERIC) * 100, 1) as progress_percentage
  FROM achievements a
  LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = p_user_id
  ORDER BY a.display_order, a.created_at;
END;
$$;

-- ============================================
-- DADOS INICIAIS: Conquistas
-- ============================================

INSERT INTO achievements (code, title, description, category, icon, color, points, required_count, display_order) VALUES

-- Categoria: Missões (5 conquistas)
('welcome', 'Bem-vinda! 🎉', 'Criou sua conta no APOIA', 'special', '🎉', 'purple', 10, 1, 1),
('first_mission', 'Primeira Missão 🎯', 'Complete sua primeira missão educativa', 'mission', '🎯', 'purple', 50, 1, 2),
('apprentice', 'Aprendiz 📚', 'Complete 5 missões educativas', 'mission', '📚', 'blue', 100, 5, 3),
('scholar', 'Estudiosa 🧠', 'Complete 10 missões educativas', 'mission', '🧠', 'blue', 200, 10, 4),
('expert', 'Expert 👑', 'Complete 20 missões educativas', 'mission', '👑', 'purple', 500, 20, 5),
('master', 'Mestre ⭐', 'Complete todas as 50 missões', 'mission', '⭐', 'yellow', 1000, 50, 6),

-- Categoria: Rede de Apoio (3 conquistas)
('first_contact', 'Primeira Conexão 🤝', 'Adicione seu primeiro contato de confiança', 'network', '🤝', 'green', 50, 1, 7),
('strong_network', 'Rede Forte 💪', 'Adicione 5 contatos de confiança', 'network', '💪', 'green', 150, 5, 8),
('community', 'Comunidade 🌟', 'Adicione 10 contatos de confiança', 'network', '🌟', 'green', 300, 10, 9),

-- Categoria: Chat (2 conquistas)
('first_chat', 'Primeira Conversa 💬', 'Use o chat anônimo pela primeira vez', 'chat', '💬', 'blue', 50, 1, 10),
('communicator', 'Comunicadora 🗣️', 'Use o chat 5 vezes', 'chat', '🗣️', 'blue', 150, 5, 11),

-- Categoria: Tempo no App (3 conquistas)
('week_streak', 'Primeira Semana 🔥', '7 dias no APOIA', 'time', '🔥', 'orange', 100, 7, 12),
('month_strong', 'Um Mês Forte 💎', '30 dias no APOIA', 'time', '💎', 'purple', 500, 30, 13),
('warrior', 'Guerreira 👸', '90 dias no APOIA', 'time', '👸', 'yellow', 1500, 90, 14),

-- Categoria: Especial (2 conquistas)
('explorer', 'Exploradora 📱', 'Visitou todas as abas do app', 'special', '📱', 'cyan', 50, 5, 15),
('first_sos', 'Coragem 💪', 'Usou o botão SOS pela primeira vez', 'special', '💪', 'red', 100, 1, 16)

ON CONFLICT (code) DO NOTHING;

-- ============================================
-- TRIGGERS AUTOMÁTICOS
-- ============================================

-- Trigger: Conquista de Boas-Vindas
CREATE OR REPLACE FUNCTION give_welcome_achievement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM unlock_achievement(NEW.id, 'welcome');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS give_welcome_achievement_trigger ON profiles;
CREATE TRIGGER give_welcome_achievement_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION give_welcome_achievement();

-- Trigger: Progresso de Missões
CREATE OR REPLACE FUNCTION track_mission_achievement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    PERFORM update_achievement_progress(NEW.user_id, 'first_mission');
    PERFORM update_achievement_progress(NEW.user_id, 'apprentice');
    PERFORM update_achievement_progress(NEW.user_id, 'scholar');
    PERFORM update_achievement_progress(NEW.user_id, 'expert');
    PERFORM update_achievement_progress(NEW.user_id, 'master');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS track_mission_achievement_trigger ON user_mission_progress;
CREATE TRIGGER track_mission_achievement_trigger
AFTER UPDATE ON user_mission_progress
FOR EACH ROW
EXECUTE FUNCTION track_mission_achievement();

-- Trigger: Progresso de Contatos
CREATE OR REPLACE FUNCTION track_network_achievement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM update_achievement_progress(NEW.user_id, 'first_contact');
  PERFORM update_achievement_progress(NEW.user_id, 'strong_network');
  PERFORM update_achievement_progress(NEW.user_id, 'community');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS track_network_achievement_trigger ON trusted_contacts;
CREATE TRIGGER track_network_achievement_trigger
AFTER INSERT ON trusted_contacts
FOR EACH ROW
EXECUTE FUNCTION track_network_achievement();

-- ============================================
-- FIM DA MIGRATION
-- ============================================
