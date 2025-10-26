-- ============================================
-- MIGRATION 005: Sistema de Registro de Ocorrências
-- ============================================
-- Tabela para armazenar registros seguros de incidentes
-- Data: 19/10/2025
-- ============================================

-- Criar tabela de registros de ocorrências
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informações do incidente
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMPTZ NOT NULL,
  incident_location TEXT,
  
  -- Tipo de violência
  incident_type TEXT NOT NULL CHECK (incident_type IN (
    'fisica',           -- Violência Física
    'psicologica',      -- Violência Psicológica
    'sexual',           -- Violência Sexual
    'patrimonial',      -- Violência Patrimonial
    'moral',            -- Violência Moral
    'outro'             -- Outro tipo
  )),
  
  -- Gravidade
  severity TEXT NOT NULL DEFAULT 'media' CHECK (severity IN (
    'baixa',
    'media',
    'alta',
    'critica'
  )),
  
  -- Testemunhas
  has_witnesses BOOLEAN DEFAULT false,
  witnesses_details TEXT,
  
  -- Evidências
  has_evidence BOOLEAN DEFAULT false,
  evidence_description TEXT,
  
  -- Autoridades contactadas
  police_contacted BOOLEAN DEFAULT false,
  police_report_number TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'registrado' CHECK (status IN (
    'registrado',       -- Apenas registrado
    'compartilhado',    -- Compartilhado com apoiadora
    'denunciado',       -- Denunciado às autoridades
    'resolvido'         -- Caso resolvido
  )),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices
  CONSTRAINT valid_incident_date CHECK (incident_date <= NOW())
);

-- Criar índices para performance
CREATE INDEX idx_incident_reports_user_id ON incident_reports(user_id);
CREATE INDEX idx_incident_reports_incident_date ON incident_reports(incident_date DESC);
CREATE INDEX idx_incident_reports_status ON incident_reports(status);
CREATE INDEX idx_incident_reports_severity ON incident_reports(severity);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_incident_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER incident_reports_updated_at
BEFORE UPDATE ON incident_reports
FOR EACH ROW
EXECUTE FUNCTION update_incident_reports_updated_at();

-- Row Level Security (RLS)
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;

-- Política: Usuárias podem ver apenas seus próprios registros
CREATE POLICY "Usuárias podem ver próprios registros"
ON incident_reports
FOR SELECT
USING (user_id = auth.uid() OR user_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
));

-- Política: Usuárias podem criar registros
CREATE POLICY "Usuárias podem criar registros"
ON incident_reports
FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
));

-- Política: Usuárias podem atualizar próprios registros
CREATE POLICY "Usuárias podem atualizar próprios registros"
ON incident_reports
FOR UPDATE
USING (user_id = auth.uid() OR user_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
));

-- Política: Usuárias podem deletar próprios registros
CREATE POLICY "Usuárias podem deletar próprios registros"
ON incident_reports
FOR DELETE
USING (user_id = auth.uid() OR user_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
));

-- ============================================
-- Tabela de Delegacias/Serviços de Emergência
-- ============================================

CREATE TABLE IF NOT EXISTS police_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'deam',             -- Delegacia Especializada de Atendimento à Mulher
    'delegacia',        -- Delegacia comum
    'cras',             -- Centro de Referência de Assistência Social
    'casa_abrigo'       -- Casa de abrigo
  )),
  
  -- Localização
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'SP',
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contato
  phone TEXT,
  phone_emergency TEXT,
  email TEXT,
  
  -- Horário de funcionamento
  opening_hours TEXT,
  works_24h BOOLEAN DEFAULT false,
  
  -- Serviços disponíveis
  services TEXT[], -- Array de serviços oferecidos
  
  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca de delegacias
CREATE INDEX idx_police_stations_city ON police_stations(city);
CREATE INDEX idx_police_stations_state ON police_stations(state);
CREATE INDEX idx_police_stations_type ON police_stations(type);
CREATE INDEX idx_police_stations_location ON police_stations(latitude, longitude);

-- Trigger para updated_at
CREATE TRIGGER police_stations_updated_at
BEFORE UPDATE ON police_stations
FOR EACH ROW
EXECUTE FUNCTION update_incident_reports_updated_at();

-- RLS: Qualquer pessoa pode ler delegacias
ALTER TABLE police_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode ver delegacias"
ON police_stations
FOR SELECT
TO public
USING (is_active = true);

-- ============================================
-- Inserir dados de exemplo de Delegacias (SP)
-- ============================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, works_24h, services) VALUES
('DEAM - Delegacia de Defesa da Mulher Centro', 'deam', 'Rua Brigadeiro Tobias, 527 - Luz', 'São Paulo', 'SP', '(11) 3311-3382', -23.5345, -46.6349, true, ARRAY['atendimento_mulher', 'boletim_ocorrencia', 'medida_protetiva']),
('DEAM - Delegacia de Defesa da Mulher Sul', 'deam', 'Rua Bueno de Andrade, 515 - Liberdade', 'São Paulo', 'SP', '(11) 3207-9372', -23.5632, -46.6394, false, ARRAY['atendimento_mulher', 'boletim_ocorrencia', 'orientacao_juridica']),
('DEAM - Delegacia de Defesa da Mulher Norte', 'deam', 'Av. Engenheiro Caetano Álvares, 594 - Mandaqui', 'São Paulo', 'SP', '(11) 3951-5492', -23.4842, -46.6234, false, ARRAY['atendimento_mulher', 'boletim_ocorrencia', 'psicologia']),
('CRAS Centro', 'cras', 'Rua Líbero Badaró, 119 - Centro', 'São Paulo', 'SP', '(11) 3113-9078', -23.5475, -46.6361, false, ARRAY['assistencia_social', 'encaminhamento', 'atendimento_psicologico']),
('Casa Abrigo Helenira Rezende', 'casa_abrigo', 'Endereço sigiloso', 'São Paulo', 'SP', '180', NULL, NULL, true, ARRAY['acolhimento', 'protecao', 'atendimento_psicossocial']);

-- ============================================
-- FIM DA MIGRATION
-- ============================================
