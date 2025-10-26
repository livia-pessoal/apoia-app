-- ============================================
-- FIX: Garantir que coluna user_type existe
-- ============================================

-- 1. Verificar estrutura atual
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Adicionar coluna user_type se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='user_type'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN user_type TEXT NOT NULL DEFAULT 'user' 
    CHECK (user_type IN ('user', 'supporter'));
    
    RAISE NOTICE 'Coluna user_type adicionada!';
  ELSE
    RAISE NOTICE 'Coluna user_type já existe!';
  END IF;
END $$;

-- 3. Se tinha profile_type, copiar valores
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='profile_type'
  ) THEN
    -- Copiar valores de profile_type para user_type
    UPDATE profiles SET user_type = profile_type WHERE profile_type IS NOT NULL;
    
    RAISE NOTICE 'Valores copiados de profile_type para user_type!';
  END IF;
END $$;

-- 4. Verificar resultado final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name IN ('user_type', 'profile_type')
ORDER BY column_name;

-- 5. Ver alguns perfis existentes
SELECT id, display_name, user_type FROM profiles LIMIT 5;
