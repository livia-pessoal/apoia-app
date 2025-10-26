-- ================================================================
-- MIGRATION 011: Sistema de PIN Anônimo
-- ================================================================
-- Data: 25/10/2025
-- Objetivo: Permitir que vítimas mantenham histórico usando PIN discreto
-- ================================================================

-- 1. Criar tabela de PINs anônimos
CREATE TABLE IF NOT EXISTS anonymous_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pin_code TEXT NOT NULL UNIQUE, -- 6 dígitos únicos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Índices para performance
  CONSTRAINT anonymous_pins_profile_id_key UNIQUE (profile_id),
  CONSTRAINT pin_code_format CHECK (pin_code ~ '^[0-9]{6}$')
);

-- 2. Índices para busca rápida
CREATE INDEX idx_anonymous_pins_pin_code ON anonymous_pins(pin_code) WHERE is_active = TRUE;
CREATE INDEX idx_anonymous_pins_profile_id ON anonymous_pins(profile_id);

-- 3. Função para gerar PIN único
CREATE OR REPLACE FUNCTION generate_unique_pin()
RETURNS TEXT AS $$
DECLARE
  new_pin TEXT;
  pin_exists BOOLEAN;
BEGIN
  LOOP
    -- Gerar 6 dígitos aleatórios
    new_pin := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Verificar se já existe
    SELECT EXISTS(
      SELECT 1 FROM anonymous_pins 
      WHERE pin_code = new_pin AND is_active = TRUE
    ) INTO pin_exists;
    
    -- Se não existe, retornar
    IF NOT pin_exists THEN
      RETURN new_pin;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. Função para criar PIN automaticamente ao criar perfil de vítima
CREATE OR REPLACE FUNCTION create_pin_for_victim()
RETURNS TRIGGER AS $$
BEGIN
  -- Só criar PIN se for perfil de vítima (user)
  IF NEW.user_type = 'user' THEN
    INSERT INTO anonymous_pins (profile_id, pin_code)
    VALUES (NEW.id, generate_unique_pin());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para criar PIN automaticamente
DROP TRIGGER IF EXISTS auto_create_pin_trigger ON profiles;
CREATE TRIGGER auto_create_pin_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_pin_for_victim();

-- 6. Função para validar e fazer login por PIN
CREATE OR REPLACE FUNCTION login_with_pin(pin_input TEXT)
RETURNS TABLE(
  profile_id UUID,
  user_type TEXT,
  display_name TEXT,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  pin_record RECORD;
BEGIN
  -- Buscar PIN ativo
  SELECT ap.profile_id, ap.id as pin_id, p.user_type, p.display_name
  INTO pin_record
  FROM anonymous_pins ap
  JOIN profiles p ON ap.profile_id = p.id
  WHERE ap.pin_code = pin_input
    AND ap.is_active = TRUE
  LIMIT 1;
  
  -- Se encontrou, atualizar last_used e retornar dados
  IF FOUND THEN
    UPDATE anonymous_pins 
    SET last_used_at = NOW()
    WHERE id = pin_record.pin_id;
    
    RETURN QUERY SELECT 
      pin_record.profile_id,
      pin_record.user_type,
      pin_record.display_name,
      TRUE as success,
      'Login realizado com sucesso'::TEXT as message;
  ELSE
    -- PIN inválido
    RETURN QUERY SELECT 
      NULL::UUID,
      NULL::TEXT,
      NULL::TEXT,
      FALSE as success,
      'PIN inválido ou expirado'::TEXT as message;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Função para obter PIN de um perfil
CREATE OR REPLACE FUNCTION get_pin_by_profile(p_profile_id UUID)
RETURNS TEXT AS $$
DECLARE
  pin TEXT;
BEGIN
  SELECT pin_code INTO pin
  FROM anonymous_pins
  WHERE profile_id = p_profile_id
    AND is_active = TRUE;
  
  RETURN pin;
END;
$$ LANGUAGE plpgsql;

-- 8. RLS (Row Level Security)
ALTER TABLE anonymous_pins ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver apenas seu próprio PIN
DROP POLICY IF EXISTS "Users can view their own PIN" ON anonymous_pins;
CREATE POLICY "Users can view their own PIN"
  ON anonymous_pins
  FOR SELECT
  USING (profile_id = (SELECT id FROM profiles WHERE id = profile_id LIMIT 1));

-- Política: Sistema pode criar PINs
DROP POLICY IF EXISTS "System can create PINs" ON anonymous_pins;
CREATE POLICY "System can create PINs"
  ON anonymous_pins
  FOR INSERT
  WITH CHECK (true);

-- Política: Sistema pode atualizar last_used
DROP POLICY IF EXISTS "System can update PINs" ON anonymous_pins;
CREATE POLICY "System can update PINs"
  ON anonymous_pins
  FOR UPDATE
  USING (true);

-- 9. Comentários para documentação
COMMENT ON TABLE anonymous_pins IS 'Armazena PINs de 6 dígitos para acesso anônimo de vítimas';
COMMENT ON COLUMN anonymous_pins.pin_code IS 'PIN de 6 dígitos único e discreto';
COMMENT ON COLUMN anonymous_pins.last_used_at IS 'Última vez que o PIN foi usado para login';
COMMENT ON FUNCTION generate_unique_pin() IS 'Gera um PIN único de 6 dígitos';
COMMENT ON FUNCTION login_with_pin(TEXT) IS 'Valida PIN e retorna dados do perfil';

-- ================================================================
-- FIM DA MIGRATION 011
-- ================================================================
