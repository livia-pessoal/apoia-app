-- ============================================
-- FIX: Re-executar Migration 010 com segurança
-- ============================================
-- Remove tudo e cria de novo limpo
-- ============================================

-- PASSO 1: Limpar triggers antigos
DROP TRIGGER IF EXISTS give_welcome_achievement_trigger ON profiles;
DROP TRIGGER IF EXISTS track_mission_achievement_trigger ON user_mission_progress;
DROP TRIGGER IF EXISTS track_network_achievement_trigger ON trusted_contacts;

-- PASSO 2: Limpar funções antigas
DROP FUNCTION IF EXISTS give_welcome_achievement();
DROP FUNCTION IF EXISTS track_mission_achievement();
DROP FUNCTION IF EXISTS track_network_achievement();
DROP FUNCTION IF EXISTS unlock_achievement(UUID, TEXT);
DROP FUNCTION IF EXISTS update_achievement_progress(UUID, TEXT, INT);
DROP FUNCTION IF EXISTS get_user_achievements(UUID);

-- PASSO 3: Limpar políticas RLS antigas
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "System can create user achievements" ON user_achievements;
DROP POLICY IF EXISTS "System can update user achievements" ON user_achievements;

-- PASSO 4: Limpar tabelas (cuidado: apaga dados!)
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;

-- ============================================
-- AGORA EXECUTE O 010_achievements_system.sql
-- ============================================

SELECT 'Limpeza completa! Agora execute 010_achievements_system.sql novamente.' as status;
