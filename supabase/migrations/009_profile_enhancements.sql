-- ============================================
-- MIGRATION 009: Melhorias no Perfil
-- ============================================
-- Adiciona campos extras para perfil do usuário
-- Data: 19/10/2025
-- ============================================

-- Adicionar novos campos à tabela profiles (se não existirem)
DO $$ 
BEGIN
  -- Bio/Sobre
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='bio') THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;
  
  -- Avatar (cor de fundo)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='avatar_color') THEN
    ALTER TABLE profiles ADD COLUMN avatar_color TEXT DEFAULT 'purple';
  END IF;
  
  -- Email (opcional)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
  
  -- Telefone (opcional)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;
  
  -- Data de nascimento (opcional)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='birth_date') THEN
    ALTER TABLE profiles ADD COLUMN birth_date DATE;
  END IF;
  
  -- Cidade/Estado
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='city') THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='state') THEN
    ALTER TABLE profiles ADD COLUMN state TEXT;
  END IF;
  
  -- Preferências de notificação
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='notification_preferences') THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{"mission": true, "chat": true, "network": true, "alert": true}'::jsonb;
  END IF;
  
  -- Modo de privacidade
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='privacy_mode') THEN
    ALTER TABLE profiles ADD COLUMN privacy_mode TEXT DEFAULT 'normal' CHECK (privacy_mode IN ('normal', 'stealth'));
  END IF;
  
  -- Última vez online
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='last_seen_at') THEN
    ALTER TABLE profiles ADD COLUMN last_seen_at TIMESTAMPTZ;
  END IF;
END $$;

-- Função para atualizar last_seen_at
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET last_seen_at = now()
  WHERE id = auth.uid();
END;
$$;

-- Função para obter estatísticas do perfil
CREATE OR REPLACE FUNCTION get_profile_stats(p_user_id UUID)
RETURNS TABLE(
  total_missions INT,
  completed_missions INT,
  completion_rate NUMERIC,
  total_points INT,
  current_level INT,
  days_since_join INT,
  total_contacts INT,
  total_alerts INT,
  total_notifications INT,
  unread_notifications INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Missões
    (SELECT COUNT(*)::INT FROM missions_content) as total_missions,
    (SELECT COUNT(*)::INT FROM mission_progress WHERE user_id = p_user_id AND completed = true) as completed_missions,
    ROUND(
      (SELECT COUNT(*)::NUMERIC FROM mission_progress WHERE user_id = p_user_id AND completed = true) / 
      NULLIF((SELECT COUNT(*) FROM missions_content), 0) * 100, 
      1
    ) as completion_rate,
    (SELECT COALESCE(SUM(points_earned), 0)::INT FROM mission_progress WHERE user_id = p_user_id) as total_points,
    (SELECT level FROM profiles WHERE id = p_user_id) as current_level,
    (SELECT DATE_PART('day', now() - created_at)::INT FROM profiles WHERE id = p_user_id) as days_since_join,
    (SELECT COUNT(*)::INT FROM trusted_contacts WHERE user_id = p_user_id) as total_contacts,
    (SELECT COUNT(*)::INT FROM emergency_alerts WHERE user_id = p_user_id) as total_alerts,
    (SELECT COUNT(*)::INT FROM notifications WHERE user_id = p_user_id) as total_notifications,
    (SELECT COUNT(*)::INT FROM notifications WHERE user_id = p_user_id AND is_read = false) as unread_notifications;
END;
$$;

-- RLS: Usuários podem atualizar seu próprio perfil
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================
-- FIM DA MIGRATION
-- ============================================
