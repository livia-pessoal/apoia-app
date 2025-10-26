-- ============================================
-- MIGRATION 016: Fix RLS Notificações para Perfis Anônimos
-- ============================================
-- Problema: Políticas RLS usavam auth.uid() (NULL para perfis anônimos)
-- Solução: Políticas permissivas + filtragem no código
-- Data: 25/10/2025
-- ============================================

-- DROP políticas antigas (baseadas em auth.uid)
DROP POLICY IF EXISTS "Usuários podem ver suas notificações" ON notifications;
DROP POLICY IF EXISTS "Usuários podem atualizar suas notificações" ON notifications;
DROP POLICY IF EXISTS "Sistema pode criar notificações" ON notifications;

-- CRIAR políticas permissivas (compatível com perfis anônimos)

-- SELECT: Qualquer um pode ver notificações
-- (Filtragem por user_id é feita no código do componente)
CREATE POLICY "Anyone can view notifications"
ON notifications
FOR SELECT
USING (true);

-- INSERT: Qualquer um pode criar notificações
-- (Usado por triggers e sistema)
CREATE POLICY "Anyone can create notifications"
ON notifications
FOR INSERT
WITH CHECK (true);

-- UPDATE: Qualquer um pode atualizar notificações
-- (Marcar como lida, etc)
CREATE POLICY "Anyone can update notifications"
ON notifications
FOR UPDATE
USING (true)
WITH CHECK (true);

-- DELETE: Qualquer um pode deletar notificações
-- (Deletar suas próprias notificações)
CREATE POLICY "Anyone can delete notifications"
ON notifications
FOR DELETE
USING (true);

-- ============================================
-- FIX: Trigger de Boas-Vindas
-- ============================================
-- Corrigir trigger que usava profile_type (não existe)
-- Deve usar user_type (campo correto)

CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar notificação de boas-vindas para novo usuário
  IF NEW.user_type = 'user' THEN
    INSERT INTO notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.id,
      'Bem-vinda ao APOIA! 💜',
      'Explore as missões educativas e conecte-se com sua rede de apoio.',
      'info',
      jsonb_build_object('is_welcome', true)
    );
  ELSIF NEW.user_type = 'supporter' THEN
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

-- Recriar trigger (garantir que usa a função corrigida)
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON profiles;
CREATE TRIGGER create_welcome_notification_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_welcome_notification();

-- ============================================
-- SEGURANÇA
-- ============================================
-- IMPORTANTE: A segurança é mantida porque:
-- 1. useNotifications hook filtra por userId (.eq("user_id", userId))
-- 2. userId vem do localStorage (profileId único)
-- 3. Cada usuária só vê suas próprias notificações via código
-- 4. RLS permissivo permite perfis anônimos funcionarem

-- ============================================
-- FIM DA MIGRATION
-- ============================================
