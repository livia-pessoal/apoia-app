-- ============================================
-- MIGRATION 006: Sistema de Chat Anônimo
-- ============================================
-- Tabelas para chat em tempo real entre vítimas e apoiadoras
-- Data: 19/10/2025
-- ============================================

-- Criar tabela de salas de chat
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participantes
  victim_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Status da sala
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN (
    'waiting',      -- Aguardando apoiadora
    'active',       -- Chat ativo
    'closed'        -- Encerrado
  )),
  
  -- Informações da vítima (anônimas)
  victim_display_name TEXT DEFAULT 'Anônima',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  
  -- Remetente
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('victim', 'supporter')),
  
  -- Conteúdo
  message TEXT NOT NULL,
  
  -- Flags
  is_read BOOLEAN DEFAULT false,
  is_system_message BOOLEAN DEFAULT false,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_chat_rooms_victim_id ON chat_rooms(victim_id);
CREATE INDEX idx_chat_rooms_supporter_id ON chat_rooms(supporter_id);
CREATE INDEX idx_chat_rooms_status ON chat_rooms(status);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER chat_rooms_updated_at
BEFORE UPDATE ON chat_rooms
FOR EACH ROW
EXECUTE FUNCTION update_incident_reports_updated_at();

-- Row Level Security (RLS)
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de chat_rooms
CREATE POLICY "Vítimas veem suas próprias salas"
ON chat_rooms
FOR SELECT
USING (victim_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
));

CREATE POLICY "Apoiadoras veem salas que estão atendendo"
ON chat_rooms
FOR SELECT
USING (supporter_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
) OR (status = 'waiting' AND EXISTS (
  SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND user_type = 'supporter'
)));

CREATE POLICY "Vítimas podem criar salas"
ON chat_rooms
FOR INSERT
WITH CHECK (victim_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
));

CREATE POLICY "Apoiadoras podem aceitar salas"
ON chat_rooms
FOR UPDATE
USING (supporter_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
) OR (status = 'waiting' AND EXISTS (
  SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND user_type = 'supporter'
)));

-- Políticas de chat_messages
CREATE POLICY "Participantes veem mensagens da sala"
ON chat_messages
FOR SELECT
USING (room_id IN (
  SELECT id FROM chat_rooms 
  WHERE victim_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
     OR supporter_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
));

CREATE POLICY "Participantes podem enviar mensagens"
ON chat_messages
FOR INSERT
WITH CHECK (sender_id IN (
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
) AND room_id IN (
  SELECT id FROM chat_rooms 
  WHERE victim_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
     OR supporter_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
));

CREATE POLICY "Participantes podem marcar como lida"
ON chat_messages
FOR UPDATE
USING (room_id IN (
  SELECT id FROM chat_rooms 
  WHERE victim_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
     OR supporter_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
));

-- ============================================
-- FIM DA MIGRATION
-- ============================================
