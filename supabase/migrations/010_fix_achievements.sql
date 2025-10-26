-- ============================================
-- FIX: Corrigir triggers de conquistas
-- ============================================
-- Usa nomes corretos das tabelas
-- ============================================

-- REMOVER triggers com nomes errados
DROP TRIGGER IF EXISTS track_mission_achievement_trigger ON mission_progress;
DROP TRIGGER IF EXISTS track_mission_achievement_trigger ON user_mission_progress;
DROP FUNCTION IF EXISTS track_mission_achievement();

-- RECRIAR trigger com nome CORRETO da tabela
CREATE OR REPLACE FUNCTION track_mission_achievement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Só conta se a missão foi completada (false → true)
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

-- Criar trigger na tabela CORRETA: user_mission_progress
CREATE TRIGGER track_mission_achievement_trigger
AFTER UPDATE ON user_mission_progress  -- ✅ NOME CORRETO!
FOR EACH ROW
EXECUTE FUNCTION track_mission_achievement();

-- ✅ PRONTO! Trigger corrigido
SELECT 'Trigger de missões corrigido com sucesso!' as status;
