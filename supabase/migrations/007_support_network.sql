-- ============================================
-- MIGRATION 007: Sistema de Rede de Apoio
-- ============================================
-- Tabelas para gerenciar contatos de confiança e rede
-- Data: 19/10/2025
-- ============================================

-- Criar tabela de contatos de confiança
CREATE TABLE IF NOT EXISTS trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dona do contato
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dados do contato
  name TEXT NOT NULL,
  relationship TEXT, -- Ex: amiga, irmã, mãe, terapeuta
  phone TEXT,
  email TEXT,
  notes TEXT,
  
  -- Preferências
  can_receive_alerts BOOLEAN DEFAULT true,
  priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de alertas enviados
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Quem enviou
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Para quem foi enviado
  contact_id UUID REFERENCES trusted_contacts(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  
  -- Dados do alerta
  alert_type TEXT DEFAULT 'sos' CHECK (alert_type IN ('sos', 'check_in', 'emergency')),
  message TEXT,
  location TEXT,
  
  -- Status
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_trusted_contacts_user_id ON trusted_contacts(user_id);
CREATE INDEX idx_trusted_contacts_priority ON trusted_contacts(priority_level DESC);
CREATE INDEX idx_emergency_alerts_user_id ON emergency_alerts(user_id);
CREATE INDEX idx_emergency_alerts_created_at ON emergency_alerts(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_trusted_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trusted_contacts_updated_at
BEFORE UPDATE ON trusted_contacts
FOR EACH ROW
EXECUTE FUNCTION update_trusted_contacts_updated_at();

-- Row Level Security (RLS)
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas simplificadas (sem autenticação)
CREATE POLICY "Qualquer um pode ver contatos"
ON trusted_contacts
FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Qualquer um pode criar contatos"
ON trusted_contacts
FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar contatos"
ON trusted_contacts
FOR UPDATE
TO PUBLIC
USING (true);

CREATE POLICY "Qualquer um pode deletar contatos"
ON trusted_contacts
FOR DELETE
TO PUBLIC
USING (true);

-- Políticas para alertas
CREATE POLICY "Qualquer um pode ver alertas"
ON emergency_alerts
FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Qualquer um pode criar alertas"
ON emergency_alerts
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- ============================================
-- Dados de exemplo (opcional)
-- ============================================

-- Você pode adicionar contatos de exemplo aqui se quiser
-- INSERT INTO trusted_contacts (user_id, name, relationship, phone) VALUES ...

-- ============================================
-- FIM DA MIGRATION
-- ============================================
