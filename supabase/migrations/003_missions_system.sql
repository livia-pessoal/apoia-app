-- ============================================
-- MIGRATION 003: Sistema de Missões Educativas
-- ============================================

-- Tabela: missions_content
-- Armazena os conteúdos educativos (textos e vídeos)
CREATE TABLE IF NOT EXISTS missions_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number INTEGER NOT NULL, -- 1, 2, 3, 4
  module_title TEXT NOT NULL,
  mission_number INTEGER NOT NULL, -- 1-40
  title TEXT NOT NULL,
  content TEXT, -- Texto completo (para textos)
  video_url TEXT, -- URL do vídeo (para vídeos)
  video_platform TEXT, -- 'youtube', 'instagram', etc
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'video')),
  duration_minutes INTEGER, -- Tempo estimado de leitura/visualização
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela: user_mission_progress
-- Rastreia o progresso de cada usuária em cada missão
CREATE TABLE IF NOT EXISTS user_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, mission_id) -- Uma usuária pode completar cada missão apenas uma vez
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_missions_module ON missions_content(module_number);
CREATE INDEX IF NOT EXISTS idx_missions_type ON missions_content(content_type);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_mission ON user_mission_progress(mission_id);

-- ============================================
-- INSERIR CONTEÚDOS EDUCATIVOS
-- ============================================

-- MÓDULO 1: Reconhecendo os Sinais da Violência (Textos 1-10)
INSERT INTO missions_content (module_number, module_title, mission_number, title, content, content_type, duration_minutes) VALUES
(1, 'Reconhecendo os Sinais da Violência', 1, 'O que é violência psicológica?', 
'A violência psicológica é uma das mais silenciosas e perigosas. Ela acontece quando alguém tenta controlar seus sentimentos, diminuir sua autoestima ou te fazer duvidar da própria sanidade. Frases como "ninguém vai te querer além de mim" ou "você está louca, isso é coisa da sua cabeça" são sinais claros dessa manipulação. A vítima passa a se sentir confusa, com medo e sem forças para reagir. É comum achar que "não é tão grave", mas é sim. Essa forma de violência causa danos profundos e, muitas vezes, abre caminho para outras agressões. Reconhecer é o primeiro passo para se libertar.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 2, 'Quando o ciúme vira controle', 
'O ciúme em pequenas doses pode até parecer natural, mas quando ele começa a ditar o que você veste, com quem fala ou para onde vai, deixa de ser cuidado e passa a ser controle. Muitos agressores usam o ciúme como justificativa para invadir a privacidade da parceira, exigir senhas, proibir saídas e monitorar redes sociais. Isso não é amor — é posse. Um relacionamento saudável se baseia na confiança e no respeito pela liberdade do outro. Quando o amor vira vigilância, algo está errado. Amor de verdade não prende, ele dá segurança para ser quem você é.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 3, 'O ciclo da violência', 
'A violência doméstica costuma seguir um padrão repetitivo conhecido como "ciclo da violência". Ele começa com a fase da tensão, quando o agressor se mostra irritado, crítico e imprevisível. Depois, vem a explosão: agressões verbais, físicas ou emocionais. Em seguida, surge o arrependimento — ele chora, pede perdão, promete mudar. Essa fase, chamada de "lua de mel", faz muitas mulheres acreditarem que tudo vai melhorar. Mas, se nada é tratado, o ciclo recomeça. Entender esse padrão é essencial para interrompê-lo. O amor verdadeiro não precisa de desculpas constantes, e a mudança real vem com responsabilidade, não com promessas.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 4, 'Gaslighting: quando fazem você duvidar de si mesma', 
'Gaslighting é uma forma cruel de manipulação emocional. O agressor distorce fatos, nega acontecimentos e faz você acreditar que está exagerando ou imaginando coisas. Aos poucos, você começa a duvidar da própria memória, da sua capacidade e até da sua percepção da realidade. Essa técnica deixa marcas profundas, pois destrói a autoconfiança e isola a vítima. Frases como "você é muito sensível" ou "ninguém mais pensa assim" são comuns. Lembre-se: seus sentimentos são válidos. Se algo te faz mal constantemente, não ignore. Ninguém tem o direito de apagar a sua verdade.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 5, 'Violência verbal também é agressão', 
'Muitas mulheres acreditam que só existe violência quando há agressão física. Mas insultos, humilhações e gritos também machucam — e muito. Quando alguém te ofende, te chama de nomes pejorativos, faz piadas sobre sua aparência ou te rebaixa diante dos outros, está cometendo violência verbal. Esse tipo de agressão corrói a autoestima e causa feridas invisíveis que demoram a cicatrizar. É importante entender que respeito é a base de qualquer relação. Quem te ama não te diminui. O silêncio diante da violência verbal não é paz, é medo — e medo nenhum deve ser normalizado.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 6, 'Controle financeiro é violência patrimonial', 
'A violência patrimonial acontece quando o parceiro tenta controlar seus bens, seu dinheiro ou seu acesso a recursos. Ele pode impedir que você trabalhe, tomar seu cartão, esconder documentos ou te fazer depender financeiramente dele. Esse tipo de abuso muitas vezes prende a mulher em relacionamentos perigosos. A independência econômica é um fator-chave para romper o ciclo da violência. Toda mulher tem direito de decidir sobre seu próprio dinheiro e de ter autonomia sobre sua vida. Controlar o financeiro da parceira não é cuidado — é dominação disfarçada.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 7, 'O isolamento como forma de controle', 
'Um dos primeiros sinais de um relacionamento abusivo é o isolamento. O agressor começa afastando a mulher de amigos, familiares e colegas, dizendo que "eles não te entendem" ou "só atrapalham". Aos poucos, ela perde sua rede de apoio e passa a depender apenas dele. Isso enfraquece emocionalmente e dificulta o pedido de ajuda. Ter laços fora da relação é essencial para manter a saúde mental e a liberdade. Ninguém que te ama de verdade vai te afastar de quem te faz bem. O amor saudável soma, não isola.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 8, 'Quando o medo toma conta', 
'Sentir medo constante de irritar o parceiro, de dizer a coisa errada ou de tomar uma decisão é um alerta vermelho. O medo não deve existir em uma relação amorosa. Quando o medo aparece, é sinal de que há dominação, chantagem ou agressão emocional. Viver sob ameaça — mesmo que velada — desgasta e adoece. Se você se sente intimidada, procure conversar com alguém de confiança e buscar orientação. O medo serve para nos proteger, não para nos prender. Nenhuma mulher deve viver com medo de quem diz que a ama.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 9, 'A manipulação emocional no relacionamento', 
'A manipulação emocional é sutil, mas destrutiva. O agressor usa a culpa e o afeto para controlar a parceira: "você vai me deixar?", "ninguém te amaria como eu". Frases assim visam gerar dependência emocional. Aos poucos, a vítima começa a acreditar que não pode viver sem ele. Esse tipo de manipulação destrói a autonomia emocional e faz com que a mulher se sinta incapaz de sair da relação. Amor verdadeiro não usa chantagem, usa respeito. Reconhecer essas frases é o primeiro passo para se libertar de quem confunde amor com poder.', 
'text', 3),

(1, 'Reconhecendo os Sinais da Violência', 10, 'Amor não dói', 
'Existe uma frase simples, mas poderosa: amor não dói. Se a relação causa sofrimento constante, lágrimas e medo, não é amor, é abuso. Muitas mulheres acreditam que o parceiro vai mudar, que o amor vai curar o comportamento agressivo. Mas o amor não é desculpa para desrespeito. Ele deve trazer leveza, segurança e crescimento. Aceitar o mínimo por medo de ficar sozinha é um ato de sobrevivência, não de amor. Você merece ser amada de forma gentil e segura — e nunca por alguém que te fere e depois pede desculpas.', 
'text', 3);

-- MÓDULO 2: Reagindo e Buscando Ajuda (Textos 11-20)
-- Continuando inserção...
