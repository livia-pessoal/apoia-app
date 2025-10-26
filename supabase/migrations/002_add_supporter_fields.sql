-- =====================================================
-- Adicionar campos para Apoiadoras
-- =====================================================

-- Adicionar novos campos na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS motivation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS causes TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Comentários
COMMENT ON COLUMN profiles.email IS 'Email da apoiadora (apenas para supporters)';
COMMENT ON COLUMN profiles.phone IS 'Telefone de contato da apoiadora';
COMMENT ON COLUMN profiles.motivation IS 'Motivação para ser apoiadora';
COMMENT ON COLUMN profiles.causes IS 'Array de causas que defende (texto livre convertido para array)';
COMMENT ON COLUMN profiles.status IS 'Status de aprovação: pending (aguardando), approved (aprovada), rejected (rejeitada)';

-- Users sempre aprovadas (não precisam de aprovação)
-- Supporters começam como pending
CREATE OR REPLACE FUNCTION set_user_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_type = 'user' THEN
    NEW.status = 'approved';
  ELSIF NEW.user_type = 'supporter' THEN
    NEW.status = 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_status
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_user_status();

-- =====================================================
-- Cole isso no SQL Editor do Supabase
-- =====================================================
