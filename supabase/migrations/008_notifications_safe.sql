-- ============================================
-- MIGRATION 008: Sistema de Notificações (VERSÃO SEGURA)
-- ============================================
-- Versão que não dá erro se objetos já existirem
-- Data: 19/10/2025
-- ============================================

-- Criar tabela de notificações (só se não existir)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Conteúdo da notificação
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Tipo de notificação
  type TEXT NOT NULL CHECK (type IN (
    'mission',          -- Nova missão disponível
    'chat',             -- Mensagem no chat / Chamado aceito
    'network',          -- Rede de apoio (contato respondeu)
    'alert',            -- Alerta de sistema
    'achievement',      -- Conquista desbloqueada
    'info'              -- Informação geral
  )),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  
  -- Dados adicionais (JSON para flexibilidade)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Ação (opcional - link/redirect)
  action_url TEXT,
  action_label TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Índices para performance (só cria se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_id') THEN
    CREATE INDEX idx_notifications_user_id ON notifications(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_is_read') THEN
    CREATE INDEX idx_notifications_is_read ON notifications(is_read);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_created_at') THEN
    CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_unread') THEN
    CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
  END IF;
END $$;

-- RLS: Usuário só vê suas notificações
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (DROP e CREATE para garantir que estão corretas)
DROP POLICY IF EXISTS "Usuários podem ver suas notificações" ON notifications;
CREATE POLICY "Usuários podem ver suas notificações"
ON notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas notificações" ON notifications;
CREATE POLICY "Usuários podem atualizar suas notificações"
ON notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sistema pode criar notificações" ON notifications;
CREATE POLICY "Sistema pode criar notificações"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET 
    is_read = true,
    read_at = now()
  WHERE id = notification_id
    AND user_id = auth.uid();
END;
$$;

-- Função para marcar todas como lidas
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET 
    is_read = true,
    read_at = now()
  WHERE user_id = p_user_id
    AND is_read = false
    AND user_id = auth.uid();
END;
$$;

-- Função para deletar notificações antigas (cleanup)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deletar notificações lidas com mais de 30 dias
  DELETE FROM notifications
  WHERE is_read = true
    AND read_at < now() - INTERVAL '30 days';
  
  -- Deletar notificações não lidas com mais de 90 dias
  DELETE FROM notifications
  WHERE is_read = false
    AND created_at < now() - INTERVAL '90 days';
END;
$$;

-- ============================================
-- Inserir Notificações de Exemplo (Opcional)
-- ============================================

-- Função para criar notificação de boas-vindas
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar notificação de boas-vindas para novo usuário
  IF NEW.profile_type = 'user' THEN
    INSERT INTO notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.id,
      'Bem-vinda ao APOIA! 💜',
      'Explore as missões educativas e conecte-se com sua rede de apoio.',
      'info',
      jsonb_build_object('is_welcome', true)
    );
  ELSIF NEW.profile_type = 'supporter' THEN
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

-- Trigger para criar notificação de boas-vindas (recria)
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON profiles;
CREATE TRIGGER create_welcome_notification_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_welcome_notification();

-- ============================================
-- FIM DA MIGRATION
-- ============================================
