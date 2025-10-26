-- ================================================================
-- FIX: Desbloquear "Bem-vinda" para perfis existentes
-- ================================================================
-- Este script dá a conquista "Bem-vinda" para todos os perfis
-- que já existiam antes do trigger ser criado
-- ================================================================

-- Para cada perfil que ainda não tem a conquista "Bem-vinda"
DO $$
DECLARE
  profile_record RECORD;
  welcome_achievement_id UUID;
BEGIN
  -- Buscar ID da conquista "Bem-vinda"
  SELECT id INTO welcome_achievement_id
  FROM achievements
  WHERE code = 'welcome';

  -- Se não encontrou, criar a conquista
  IF welcome_achievement_id IS NULL THEN
    INSERT INTO achievements (code, title, description, icon, color, points, required_count, category, target_profile)
    VALUES ('welcome', 'Bem-vinda', 'Bem-vinda ao APOIA!', '🎉', 'purple', 10, 1, 'special', 'all')
    RETURNING id INTO welcome_achievement_id;
    
    RAISE NOTICE 'Conquista "Bem-vinda" criada com ID: %', welcome_achievement_id;
  END IF;

  -- Para cada perfil existente
  FOR profile_record IN 
    SELECT p.id, p.display_name
    FROM profiles p
    LEFT JOIN user_achievements ua 
      ON ua.user_id = p.id 
      AND ua.achievement_id = welcome_achievement_id
    WHERE ua.id IS NULL  -- Perfis que NÃO têm a conquista ainda
  LOOP
    -- Criar user_achievement desbloqueada
    INSERT INTO user_achievements (user_id, achievement_id, current_progress, is_unlocked, unlocked_at)
    VALUES (profile_record.id, welcome_achievement_id, 1, TRUE, NOW());
    
    -- Criar notificação
    INSERT INTO notifications (user_id, title, message, type, metadata)
    VALUES (
      profile_record.id,
      '🎉 Conquista desbloqueada!',
      'Você ganhou a conquista "Bem-vinda" (+10 pontos)',
      'achievement',
      jsonb_build_object('achievement_code', 'welcome')
    );
    
    RAISE NOTICE 'Conquista "Bem-vinda" desbloqueada para: %', profile_record.display_name;
  END LOOP;
  
  RAISE NOTICE 'Processo concluído!';
END;
$$;

-- ================================================================
-- FIM DO FIX
-- ================================================================
