-- ============================================
-- FIX: Adicionar/Corrigir campo profile_type
-- ============================================

-- Opção 1: Se o campo não existe, adicionar
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='profile_type'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN profile_type TEXT CHECK (profile_type IN ('user', 'supporter'));
    
    RAISE NOTICE 'Campo profile_type adicionado!';
  ELSE
    RAISE NOTICE 'Campo profile_type já existe!';
  END IF;
END $$;

-- Opção 2: Se o campo tem outro nome (ex: user_type), renomear
-- Descomente se necessário:
-- ALTER TABLE profiles RENAME COLUMN user_type TO profile_type;

-- Verificar estrutura final
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
