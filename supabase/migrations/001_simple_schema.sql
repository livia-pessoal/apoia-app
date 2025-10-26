-- =====================================================
-- APOIA - Schema Simples (MVP Rápido)
-- =====================================================
-- Apenas o essencial para funcionar
-- =====================================================

-- 1. TABELA: profiles (perfis de usuárias)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL CHECK (user_type IN ('user', 'supporter')),
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABELA: emergency_calls (chamados de emergência)
CREATE TABLE emergency_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABELA: organizations (ONGs e delegacias)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  type TEXT CHECK (type IN ('ong', 'police')),
  address TEXT
);

-- Dados iniciais
INSERT INTO organizations (name, phone, type) VALUES
  ('Central 180', '180', 'ong'),
  ('Polícia 190', '190', 'police');

-- Segurança básica (todos podem ver organizations)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view organizations" ON organizations FOR SELECT TO PUBLIC USING (true);

-- =====================================================
-- PRONTO! Cole isso no SQL Editor do Supabase e rode
-- =====================================================
