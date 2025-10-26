-- ============================================
-- INSERIR DELEGACIAS DE SÃO PAULO
-- ============================================
-- Execute este script no Supabase SQL Editor
-- para adicionar as delegacias de exemplo
-- ============================================

-- Limpar delegacias existentes (se houver)
DELETE FROM police_stations;

-- Inserir 5 delegacias de São Paulo
INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, works_24h, services) VALUES
('DEAM - Delegacia de Defesa da Mulher Centro', 'deam', 'Rua Brigadeiro Tobias, 527 - Luz', 'São Paulo', 'SP', '(11) 3311-3382', -23.5345, -46.6349, true, ARRAY['atendimento_mulher', 'boletim_ocorrencia', 'medida_protetiva']),
('DEAM - Delegacia de Defesa da Mulher Sul', 'deam', 'Rua Bueno de Andrade, 515 - Liberdade', 'São Paulo', 'SP', '(11) 3207-9372', -23.5632, -46.6394, false, ARRAY['atendimento_mulher', 'boletim_ocorrencia', 'orientacao_juridica']),
('DEAM - Delegacia de Defesa da Mulher Norte', 'deam', 'Av. Engenheiro Caetano Álvares, 594 - Mandaqui', 'São Paulo', 'SP', '(11) 3951-5492', -23.4842, -46.6234, false, ARRAY['atendimento_mulher', 'boletim_ocorrencia', 'psicologia']),
('CRAS Centro', 'cras', 'Rua Líbero Badaró, 119 - Centro', 'São Paulo', 'SP', '(11) 3113-9078', -23.5475, -46.6361, false, ARRAY['assistencia_social', 'encaminhamento', 'atendimento_psicologico']),
('Casa Abrigo Helenira Rezende', 'casa_abrigo', 'Endereço sigiloso', 'São Paulo', 'SP', '180', NULL, NULL, true, ARRAY['acolhimento', 'protecao', 'atendimento_psicossocial']);

-- Verificar se inseriu corretamente
SELECT name, city, latitude, longitude FROM police_stations;

-- Deve retornar 5 linhas!
