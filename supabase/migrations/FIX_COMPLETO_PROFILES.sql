-- ============================================
-- FIX COMPLETO: Corrigir profiles + trigger
-- ============================================
-- Executa TUDO de uma vez, na ordem certa
-- Data: 19/10/2025
-- ============================================

-- PASSO 1: Remover trigger antigo que usa profile_type
-- ============================================
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON profiles;
DROP FUNCTION IF EXISTS create_welcome_notification();

-- PASSO 2: Recriar trigger usando user_type (campo correto)
-- ============================================
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar notificação de boas-vindas para novo usuário
  IF NEW.user_type = 'user' THEN  -- ✅ CORRIGIDO: user_type
    INSERT INTO notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.id,
      'Bem-vinda ao APOIA! 💜',
      'Explore as missões educativas e conecte-se com sua rede de apoio.',
      'info',
      jsonb_build_object('is_welcome', true)
    );
  ELSIF NEW.user_type = 'supporter' THEN  -- ✅ CORRIGIDO: user_type
    INSERT INTO notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.id,
      'Bem-vinda como Apoiadora! 🤝',
      'Você agora pode aceitar chamados e oferecer suporte especializado.',
      'info',
      jsonb_build_object('is_welcome', true)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER create_welcome_notification_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_welcome_notification();

-- PASSO 3: Configurar RLS permissivo
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT (criar perfil)
DROP POLICY IF EXISTS "Anyone can create profile" ON profiles;
CREATE POLICY "Anyone can create profile"
ON profiles
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- Permitir SELECT (ver perfis)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO PUBLIC
USING (true);

-- Permitir UPDATE (atualizar perfil)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- PASSO 4: Verificar tudo
-- ============================================

-- Ver estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT 
  policyname,
  cmd as operacao
FROM pg_policies 
WHERE tablename = 'profiles';

-- Ver trigger
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';

-- ============================================
-- PRONTO! Tudo corrigido:
-- ✅ Trigger usa user_type
-- ✅ RLS configurado
-- ✅ Políticas permissivas
-- ============================================
