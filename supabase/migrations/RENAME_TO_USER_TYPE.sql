-- ============================================
-- RENOMEAR: profile_type → user_type
-- ============================================
-- Execução rápida e simples
-- ============================================

-- 1. Renomear coluna
ALTER TABLE profiles 
RENAME COLUMN profile_type TO user_type;

-- 2. Verificar estrutura atualizada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Ver perfis existentes com novo nome
SELECT id, display_name, user_type, created_at 
FROM profiles 
LIMIT 5;

-- ✅ PRONTO! Agora profile_type virou user_type
