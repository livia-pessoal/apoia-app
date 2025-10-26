-- ============================================
-- SCRIPT DE TESTE: Criar Notificações de Exemplo
-- ============================================
-- Execute APÓS a Migration 016
-- Substitua 'SEU_USER_ID' pelo ID do seu perfil
-- ============================================

-- PASSO 1: Descobrir seu user_id
-- Execute isso primeiro para pegar seu ID:
SELECT id, display_name, user_type 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- PASSO 2: Substituir 'SEU_USER_ID' abaixo pelo ID que apareceu
-- Depois execute as inserções:

-- Notificação 1: Boas-vindas
INSERT INTO notifications (user_id, title, message, type, metadata)
VALUES (
  'SEU_USER_ID',
  'Bem-vinda ao APOIA! 💜',
  'Explore as missões educativas e conecte-se com sua rede de apoio.',
  'info',
  '{"is_welcome": true}'::jsonb
);

-- Notificação 2: Missão
INSERT INTO notifications (user_id, title, message, type, metadata)
VALUES (
  'SEU_USER_ID',
  'Nova Missão Disponível! 🎯',
  'Complete a missão "Reconhecendo os Sinais" e ganhe 50 pontos!',
  'mission',
  '{"mission_id": 1, "points": 50}'::jsonb
);

-- Notificação 3: Conquista
INSERT INTO notifications (user_id, title, message, type, metadata)
VALUES (
  'SEU_USER_ID',
  'Conquista Desbloqueada! 🏆',
  'Você completou sua primeira missão! Continue assim!',
  'achievement',
  '{"achievement": "first_mission", "points": 100}'::jsonb
);

-- Notificação 4: Rede de Apoio
INSERT INTO notifications (user_id, title, message, type, metadata)
VALUES (
  'SEU_USER_ID',
  'Contato Adicionado! 🤝',
  'Um novo contato foi adicionado à sua rede de apoio.',
  'network',
  '{"contact_name": "Maria Silva"}'::jsonb
);

-- Notificação 5: Chat
INSERT INTO notifications (user_id, title, message, type, metadata)
VALUES (
  'SEU_USER_ID',
  'Nova Mensagem no Chat 💬',
  'Uma apoiadora aceitou seu chamado e está te aguardando.',
  'chat',
  '{"room_id": "abc123"}'::jsonb
);

-- Notificação 6: Alerta
INSERT INTO notifications (user_id, title, message, type, metadata, is_read)
VALUES (
  'SEU_USER_ID',
  'Alerta Importante ⚠️',
  'Lembre-se: você pode usar a Saída Rápida a qualquer momento.',
  'alert',
  '{"priority": "high"}'::jsonb,
  false
);

-- PASSO 3: Verificar se foram criadas
SELECT id, title, type, is_read, created_at 
FROM notifications 
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC;

-- ============================================
-- LIMPEZA (Opcional - se quiser deletar tudo)
-- ============================================

-- DELETE FROM notifications WHERE user_id = 'SEU_USER_ID';
