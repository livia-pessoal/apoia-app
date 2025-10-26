-- ============================================
-- FIX: Configurar RLS para profiles
-- ============================================

-- 1. Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Permitir qualquer pessoa CRIAR perfil (INSERT)
DROP POLICY IF EXISTS "Anyone can create profile" ON profiles;
CREATE POLICY "Anyone can create profile"
ON profiles
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- 3. Permitir ver apenas próprio perfil (SELECT)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO PUBLIC
USING (true);  -- Por enquanto, todos podem ver (você pode restringir depois)

-- 4. Permitir atualizar apenas próprio perfil (UPDATE)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO PUBLIC
USING (true)  -- Por enquanto permissivo
WITH CHECK (true);

-- 5. Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE tablename = 'profiles';

-- Deve retornar 3 políticas: INSERT, SELECT, UPDATE
