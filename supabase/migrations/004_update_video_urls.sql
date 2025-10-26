-- ============================================
-- MIGRATION 004: Atualizar URLs dos Vídeos
-- ============================================
-- Substitui URLs placeholder por vídeos reais do YouTube
-- Data: 19/10/2025
-- ============================================

-- Atualizar vídeos com URLs reais
UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=lCcS8bTL3HA'
WHERE mission_number = 41;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=xKfwHuE7d10',
  video_platform = 'youtube'
WHERE mission_number = 42;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=8Lw-vwkn_g0'
WHERE mission_number = 43;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=Ew-VruAckjs'
WHERE mission_number = 44;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=zoBqruxyGS4'
WHERE mission_number = 45;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=Ly2wv-uU8gY'
WHERE mission_number = 46;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=0UWliMyKCyY'
WHERE mission_number = 47;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=JoBkcrAKrRw'
WHERE mission_number = 48;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=0mVGbFG0KU8'
WHERE mission_number = 49;

UPDATE missions_content SET 
  video_url = 'https://www.youtube.com/watch?v=tuT__DRuG-U'
WHERE mission_number = 50;

-- Verificar se as atualizações foram aplicadas
SELECT 
  mission_number,
  title,
  video_url,
  video_platform
FROM missions_content
WHERE content_type = 'video'
ORDER BY mission_number;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
