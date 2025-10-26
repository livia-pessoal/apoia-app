-- ============================================
-- FIX FINAL: Corrigir TUDO de uma vez
-- ============================================
-- Resolve TODOS os problemas das migrations 009 e 010
-- Data: 19/10/2025
-- ============================================

-- PASSO 1: Adicionar coluna level em profiles
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='level'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN level INT DEFAULT 1 NOT NULL;
    
    RAISE NOTICE '✅ Coluna level adicionada!';
  ELSE
    RAISE NOTICE '✅ Coluna level já existe!';
  END IF;
END $$;

-- PASSO 2: Recriar função get_profile_stats CORRETA
-- ============================================
DROP FUNCTION IF EXISTS get_profile_stats(UUID);

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
    -- Total de missões no sistema
    (SELECT COUNT(*)::INT FROM missions_content) as total_missions,
    
    -- Missões completadas pelo usuário
    (SELECT COUNT(*)::INT FROM user_mission_progress WHERE user_id = p_user_id AND completed = true) as completed_missions,
    
    -- Taxa de conclusão
    ROUND(
      (SELECT COUNT(*)::NUMERIC FROM user_mission_progress WHERE user_id = p_user_id AND completed = true) / 
      NULLIF((SELECT COUNT(*)::NUMERIC FROM missions_content), 0) * 100,
      1
    ) as completion_rate,
    
    -- Pontos totais (calculado a partir de conquistas desbloqueadas)
    COALESCE(
      (SELECT SUM(a.points)::INT 
       FROM user_achievements ua 
       JOIN achievements a ON a.id = ua.achievement_id
       WHERE ua.user_id = p_user_id AND ua.is_unlocked = true),
      0
    ) as total_points,
    
    -- Nível atual
    (SELECT COALESCE(level, 1)::INT FROM profiles WHERE id = p_user_id) as current_level,
    
    -- Dias desde criação
    (SELECT DATE_PART('day', now() - created_at)::INT FROM profiles WHERE id = p_user_id) as days_since_join,
    
    -- Total de contatos de confiança
    (SELECT COUNT(*)::INT FROM trusted_contacts WHERE user_id = p_user_id) as total_contacts,
    
    -- Total de alertas SOS enviados
    (SELECT COUNT(*)::INT FROM emergency_alerts WHERE user_id = p_user_id) as total_alerts,
    
    -- Total de notificações
    (SELECT COUNT(*)::INT FROM notifications WHERE user_id = p_user_id) as total_notifications,
    
    -- Notificações não lidas
    (SELECT COUNT(*)::INT FROM notifications WHERE user_id = p_user_id AND is_read = false) as unread_notifications;
END;
$$;

-- PASSO 3: Verificar se tudo está OK
-- ============================================

-- 3.1 - Ver estrutura da tabela profiles
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('id', 'display_name', 'user_type', 'level')
ORDER BY ordinal_position;

-- 3.2 - Ver tabelas de missões
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%mission%';

-- 3.3 - Ver funções criadas
SELECT proname 
FROM pg_proc 
WHERE proname LIKE '%profile%' OR proname LIKE '%achievement%';

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- ✅ Coluna level deve existir em profiles
-- ✅ Função get_profile_stats recriada corretamente
-- ✅ Usa user_mission_progress (nome correto)
-- ✅ Usa coluna level (agora existe)
-- ============================================

SELECT '✅ FIX COMPLETO! Agora pode executar 010_achievements_SAFE.sql' as status;
