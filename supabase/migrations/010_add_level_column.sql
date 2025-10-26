-- ============================================
-- FIX: Adicionar coluna level em profiles
-- ============================================
-- Seguro: pode executar múltiplas vezes
-- ============================================

-- Adicionar coluna level (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='level'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN level INT DEFAULT 1 NOT NULL;
    
    RAISE NOTICE 'Coluna level adicionada!';
  ELSE
    RAISE NOTICE 'Coluna level já existe!';
  END IF;
END $$;

-- Verificar
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'level';

-- ✅ PRONTO!
