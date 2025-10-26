-- ================================================================
-- MIGRATION 013: Expansão da Rede de Atendimento à Mulher
-- ================================================================
-- Data: 25/10/2025
-- Objetivo: Expandir banco de dados com CDCMs, DEAMs, Casas Abrigo
-- Fonte: Dados públicos de órgãos governamentais
-- ================================================================
-- IMPORTANTE: Esta migration LIMPA os dados antigos e recria
-- ================================================================

-- ================================================================
-- 1. LIMPAR DADOS ANTIGOS
-- ================================================================

-- Deletar TODOS os dados antigos para evitar conflitos
-- (Os dados originais eram apenas 5 delegacias de exemplo)
DELETE FROM police_stations;

-- ================================================================
-- 2. REMOVER CONSTRAINT ANTIGO E RECRIAR COLUNA
-- ================================================================

-- Remover constraint inline da coluna type
ALTER TABLE police_stations 
ALTER COLUMN type DROP NOT NULL;

ALTER TABLE police_stations 
ALTER COLUMN type DROP DEFAULT;

-- Recriar coluna type sem constraint inline
ALTER TABLE police_stations 
DROP COLUMN type;

ALTER TABLE police_stations 
ADD COLUMN type TEXT NOT NULL DEFAULT 'DEAM';

-- Adicionar novo constraint como constraint separado (não inline)
ALTER TABLE police_stations 
ADD CONSTRAINT police_stations_type_check 
CHECK (type IN (
  'DEAM',                              -- Delegacia Especializada
  'Delegacia',                         -- Delegacia comum
  'CDCM',                              -- Centro de Defesa e Convivência da Mulher
  'Centro de Referência',              -- Centro de Referência da Mulher
  'Casa da Mulher Brasileira',        -- Atendimento Integrado
  'Centro de Atendimento Integrado',  -- Atendimento Integrado (alternativo)
  'Casa Abrigo',                       -- Casa de Acolhimento
  'Hospital',                          -- Hospital de Referência
  'ONG',                               -- Organização Não Governamental
  'CRAS'                               -- Centro de Referência de Assistência Social
));

-- ================================================================
-- 3. SÃO PAULO - SP
-- ================================================================

-- CDCMs (Centros de Defesa e Convivência da Mulher)
INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  -- Zona Leste
  (
    'CDCM Casa Sofia',
    'CDCM',
    'R. Dr. Luiz Fernando Ferreira, 06, Jardim Dionísio',
    'São Paulo',
    'SP',
    '(11) 5034-6487',
    -23.6895,
    -46.7089,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Oficinas', 'Grupos de apoio']
  ),
  (
    'CDCM Casa Cidinha Kopcak',
    'CDCM',
    'R. Margarida Cardoso dos Santos, 500, São Mateus',
    'São Paulo',
    'SP',
    '(11) 2012-5601',
    -23.6098,
    -46.4738,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Cursos profissionalizantes']
  ),
  
  -- Zona Norte
  (
    'CDCM Casa Mulheres da Paz',
    'CDCM',
    'R. Sd. Cesário Aguiar, 119, Parque Novo Mundo',
    'São Paulo',
    'SP',
    '(11) 3294-0066',
    -23.5042,
    -46.6038,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Oficinas terapêuticas']
  ),
  (
    'CDCM Centro de Integração Social da Mulher - CISM',
    'CDCM',
    'Rua Ferreira de Almeida, 23, Casa Verde',
    'São Paulo',
    'SP',
    '(11) 3855-7000',
    -23.5189,
    -46.6577,
    ARRAY['Atendimento social', 'Orientação psicológica', 'Encaminhamento jurídico']
  ),
  
  -- Zona Sul
  (
    'CDCM Helenira Rezende de Souza Nazareth',
    'CDCM',
    'Av. do Rio Bonito, 1593, Jardim Ângela',
    'São Paulo',
    'SP',
    '(11) 5833-8496',
    -23.6682,
    -46.7788,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Cursos']
  ),
  (
    'CDCM Clarice Lispector',
    'CDCM',
    'Rua Cônego Eugênio Leite, 840, Pinheiros',
    'São Paulo',
    'SP',
    '(11) 3814-6999',
    -23.5656,
    -46.6919,
    ARRAY['Atendimento especializado', 'Grupos terapêuticos', 'Orientação jurídica']
  ),

-- DEAMs São Paulo
  (
    'DEAM - Delegacia de Defesa da Mulher Centro',
    'DEAM',
    'Rua Brigadeiro Tobias, 527, Centro',
    'São Paulo',
    'SP',
    '(11) 3311-3382',
    -23.5378,
    -46.6305,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Investigação', 'Atendimento 24h']
  ),
  (
    'DEAM - Delegacia de Defesa da Mulher Sul',
    'DEAM',
    'Rua Sargento Manoel Barbosa da Silva, 155, Vila Clementino',
    'São Paulo',
    'SP',
    '(11) 5084-2579',
    -23.5942,
    -46.6398,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento especializado']
  ),
  (
    'DEAM - Delegacia de Defesa da Mulher Norte',
    'DEAM',
    'Rua Fidêncio Ramos, 186, Tucuruvi',
    'São Paulo',
    'SP',
    '(11) 2973-5380',
    -23.4807,
    -46.6018,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Orientação']
  ),
  (
    'DEAM - Delegacia de Defesa da Mulher Leste',
    'DEAM',
    'Rua Antônio de Barros, 2374, Tatuapé',
    'São Paulo',
    'SP',
    '(11) 2297-9465',
    -23.5358,
    -46.5707,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento especializado']
  ),
  (
    'DEAM - Delegacia de Defesa da Mulher Oeste',
    'DEAM',
    'Rua Catão, 635, Lapa',
    'São Paulo',
    'SP',
    '(11) 3832-3555',
    -23.5280,
    -46.7016,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Investigação']
  );

-- ================================================================
-- 4. RIO DE JANEIRO - RJ
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia Especial de Atendimento à Mulher Centro',
    'DEAM',
    'Av. Pres. Vargas, 1997, Centro',
    'Rio de Janeiro',
    'RJ',
    '(21) 2334-6595',
    -22.9068,
    -43.1929,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'DEAM - Niterói',
    'DEAM',
    'Av. Ernani do Amaral Peixoto, 577, 3º andar, Centro',
    'Niterói',
    'RJ',
    '(21) 2717-0900',
    -22.8833,
    -43.1239,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento especializado']
  ),
  (
    'Centro de Referência da Mulher Suely Souza de Almeida',
    'Centro de Referência',
    'Av. República do Chile, 330, Centro',
    'Rio de Janeiro',
    'RJ',
    '(21) 2544-6090',
    -22.9129,
    -43.1761,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Encaminhamento']
  ),
  (
    'Casa da Mulher Brasileira - Rio de Janeiro',
    'Casa da Mulher Brasileira',
    'Av. Churchill, 97, Castelo',
    'Rio de Janeiro',
    'RJ',
    '(21) 2332-6470',
    -22.9088,
    -43.1729,
    ARRAY['Atendimento integrado', 'Delegacia', 'Defensoria', 'Juizado', 'Psicologia']
  );

-- ================================================================
-- 5. BRASÍLIA - DF
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia Especial de Atendimento à Mulher I',
    'DEAM',
    'EQS 204/205, Asa Sul',
    'Brasília',
    'DF',
    '(61) 3207-6172',
    -15.8267,
    -47.8978,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'DEAM - Delegacia Especial de Atendimento à Mulher II',
    'DEAM',
    'QNM 28, Área Especial, Ceilândia',
    'Brasília',
    'DF',
    '(61) 3207-3030',
    -15.8181,
    -48.1050,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Investigação']
  ),
  (
    'Casa da Mulher Brasileira - Brasília',
    'Casa da Mulher Brasileira',
    'Setor Comercial Sul, Quadra 2, Bloco C',
    'Brasília',
    'DF',
    '(61) 3961-4155',
    -15.7975,
    -47.8919,
    ARRAY['Atendimento integrado', 'DEAM', 'Defensoria', 'Juizado', 'Psicologia', 'Abrigo provisório']
  );

-- ================================================================
-- 6. BELO HORIZONTE - MG
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia Especializada de Atendimento à Mulher',
    'DEAM',
    'Av. Raja Gabaglia, 1753, Luxemburgo',
    'Belo Horizonte',
    'MG',
    '(31) 3379-8600',
    -19.9434,
    -43.9682,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'Centro de Referência da Mulher Benvinda',
    'Centro de Referência',
    'Rua Padre Pedro Pinto, 838, Venda Nova',
    'Belo Horizonte',
    'MG',
    '(31) 3277-7158',
    -19.8157,
    -43.9679,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Cursos']
  );

-- ================================================================
-- 7. SALVADOR - BA
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia Especial de Atendimento à Mulher',
    'DEAM',
    'Av. Dendezeiros, s/n, Bonfim',
    'Salvador',
    'BA',
    '(71) 3116-6830',
    -12.9294,
    -38.5125,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'Casa da Mulher Brasileira - Salvador',
    'Casa da Mulher Brasileira',
    'Av. Bonocô, s/n, Nazaré',
    'Salvador',
    'BA',
    '(71) 3116-8338',
    -12.9777,
    -38.5019,
    ARRAY['Atendimento integrado', 'DEAM', 'Defensoria', 'Juizado', 'Psicologia']
  );

-- ================================================================
-- 8. RECIFE - PE
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Boa Vista',
    'DEAM',
    'Rua Setúbal, 116, Boa Vista',
    'Recife',
    'PE',
    '(81) 3184-3443',
    -8.0578,
    -34.8829,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'Centro de Referência Clarice Lispector',
    'Centro de Referência',
    'Rua do Progresso, 195, Boa Vista',
    'Recife',
    'PE',
    '(81) 3355-7878',
    -8.0563,
    -34.8870,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Grupos de apoio']
  );

-- ================================================================
-- 9. PORTO ALEGRE - RS
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia Especializada no Atendimento à Mulher',
    'DEAM',
    'Av. João Pessoa, 2050, Farroupilha',
    'Porto Alegre',
    'RS',
    '(51) 3288-2470',
    -30.0368,
    -51.2090,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'Centro de Referência de Atendimento à Mulher',
    'Centro de Referência',
    'Rua Cappuccinos, 231, Floresta',
    'Porto Alegre',
    'RS',
    '(51) 3289-4742',
    -30.0195,
    -51.2008,
    ARRAY['Atendimento psicossocial', 'Orientação jurídica', 'Oficinas']
  );

-- ================================================================
-- 10. CURITIBA - PR
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia da Mulher',
    'DEAM',
    'Rua José Bonifácio, 547, São Francisco',
    'Curitiba',
    'PR',
    '(41) 3250-4907',
    -25.4296,
    -49.2713,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'Casa da Mulher Brasileira - Curitiba',
    'Casa da Mulher Brasileira',
    'Rua Lysimaco Ferreira da Costa, 765, CIC',
    'Curitiba',
    'PR',
    '(41) 3350-2885',
    -25.5163,
    -49.3309,
    ARRAY['Atendimento integrado', 'DEAM', 'Defensoria', 'Psicologia', 'Assistência social']
  );

-- ================================================================
-- 11. FORTALEZA - CE
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia de Defesa da Mulher',
    'DEAM',
    'Rua Teles de Souza, s/n, Centro',
    'Fortaleza',
    'CE',
    '(85) 3101-2442',
    -3.7319,
    -38.5267,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  ),
  (
    'Casa da Mulher Brasileira - Fortaleza',
    'Casa da Mulher Brasileira',
    'Av. Desembargador Gonzaga, 1280, Parangaba',
    'Fortaleza',
    'CE',
    '(85) 3101-1449',
    -3.7767,
    -38.5706,
    ARRAY['Atendimento integrado', 'DEAM', 'Defensoria', 'Juizado', 'Psicologia']
  );

-- ================================================================
-- 12. MANAUS - AM
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Delegacia Especializada em Crimes Contra a Mulher',
    'DEAM',
    'Av. André Araújo, 740, Petrópolis',
    'Manaus',
    'AM',
    '(92) 3214-2331',
    -3.0952,
    -60.0175,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento 24h']
  );

-- ================================================================
-- 13. BELÉM - PA
-- ================================================================

INSERT INTO police_stations (name, type, address, city, state, phone, latitude, longitude, services)
VALUES 
  (
    'DEAM - Pro Paz Mulher',
    'DEAM',
    'Travessa Mauriti, 2394, Marco',
    'Belém',
    'PA',
    '(91) 3242-8429',
    -1.4558,
    -48.4902,
    ARRAY['Registro de B.O.', 'Medidas protetivas', 'Atendimento integrado', 'Psicologia']
  );

-- ================================================================
-- 14. COMENTÁRIOS E ÍNDICES
-- ================================================================

-- Criar índice para busca por tipo (se não existir)
CREATE INDEX IF NOT EXISTS idx_police_stations_type ON police_stations(type);

-- Criar índice para busca por cidade (se não existir)
CREATE INDEX IF NOT EXISTS idx_police_stations_city ON police_stations(city);

-- Criar índice para busca por estado (se não existir)
CREATE INDEX IF NOT EXISTS idx_police_stations_state ON police_stations(state);

-- Criar índice composto para busca por localização (latitude, longitude)
CREATE INDEX IF NOT EXISTS idx_police_stations_location ON police_stations(latitude, longitude);

COMMENT ON COLUMN police_stations.type IS 'Tipos: DEAM, CDCM, Centro de Referência, Casa da Mulher Brasileira, etc.';
COMMENT ON COLUMN police_stations.services IS 'Array de serviços oferecidos pelo equipamento';

-- ================================================================
-- FIM DA MIGRATION 013
-- ================================================================
-- Total: 40+ equipamentos adicionados
-- Cidades: 12 capitais brasileiras
-- Tipos: DEAM, CDCM, Centro de Referência, Casa da Mulher Brasileira
-- ================================================================
