-- ============================================
-- MIGRATION 003: Dados das Missões Educativas
-- IMPORTANTE: Execute 003_missions_system.sql ANTES deste arquivo
-- ============================================

-- MÓDULO 2: Reagindo e Buscando Ajuda (Textos 11-20)
INSERT INTO missions_content (module_number, module_title, mission_number, title, content, content_type, duration_minutes) VALUES
(2, 'Reagindo e Buscando Ajuda', 11, 'Você não está sozinha', 
'Muitas mulheres passam por situações de abuso todos os dias, e uma das primeiras lições é saber que você não está sozinha. Sentir medo, confusão ou insegurança não é fraqueza — é sinal de que você está vivendo uma situação difícil. Buscar ajuda é um ato de coragem. Conversar com alguém de confiança, procurar profissionais de saúde, psicólogos ou serviços especializados pode fazer toda a diferença. A solidariedade e o apoio são ferramentas poderosas para se proteger e criar alternativas seguras. Cada passo que você dá em direção à ajuda é um passo rumo à liberdade e à sua própria força.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 12, 'Ligue 180: um canal seguro', 
'O disque 180 é um serviço gratuito, disponível 24 horas, criado para acolher denúncias e orientar mulheres que estão sofrendo qualquer tipo de violência. Você pode relatar abuso físico, psicológico, sexual ou patrimonial. Além disso, os atendentes podem informar sobre serviços de apoio próximos, delegacias especializadas, medidas protetivas e encaminhamentos legais. Ligar para 180 não é apenas registrar um caso, mas receber orientação especializada para cuidar da sua segurança. A informação é poder — e buscar orientação é o primeiro passo para sair de uma situação de risco.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 13, 'Como registrar um boletim de ocorrência', 
'Registrar um boletim de ocorrência (B.O.) é um direito seu e uma maneira de proteger sua vida e de outras mulheres. Ele pode ser feito em qualquer delegacia, mas as Delegacias da Mulher (DEAM) são especializadas e oferecem atendimento mais humanizado. O B.O. garante registro legal da agressão, serve como prova em processos e permite que medidas protetivas sejam solicitadas. Mesmo que você ainda não se sinta segura para denunciar o agressor criminalmente, ter um registro formal é uma proteção inicial. Lembre-se: não há vergonha em pedir ajuda. Buscar seus direitos é um ato de coragem e autocuidado.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 14, 'Medidas protetivas de urgência', 
'Se você está em perigo, pode solicitar medidas protetivas de urgência, que obrigam o agressor a se afastar, a não se aproximar ou até mesmo a deixar a residência. Essas medidas podem ser solicitadas na delegacia ou com o auxílio do Ministério Público. Elas oferecem segurança imediata, garantindo que você possa se proteger sem depender apenas da própria força física. É importante entender que essas medidas são um direito da mulher e um recurso legal eficaz. Você tem direito a proteção e a segurança — nunca aceite ameaças como algo normal.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 15, 'Construindo uma rede de apoio', 
'Uma rede de apoio é essencial para enfrentar situações de violência. Amigos, familiares, vizinhos, profissionais de saúde e psicólogos podem oferecer orientação, escuta e suporte emocional. Ter pessoas de confiança por perto ajuda a manter a força para tomar decisões seguras e buscar ajuda legal. A dependência emocional isolada do agressor é um dos fatores que mantém o ciclo da violência. Construir e fortalecer sua rede é investir na sua proteção e no seu bem-estar. Compartilhar experiências e pedir ajuda não é fraqueza — é estratégia para se proteger.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 16, 'Atendimento psicológico gratuito', 
'O apoio psicológico é fundamental para lidar com traumas, entender padrões de abuso e recuperar autoestima. Muitas instituições públicas, ONGs e centros de referência oferecem acompanhamento gratuito. Ter um espaço seguro para falar sobre o que você vive, sem julgamentos, ajuda a compreender os sinais da violência e a tomar decisões conscientes. Terapia não é luxo — é ferramenta de sobrevivência e autocuidado. Buscar acompanhamento é um passo para restaurar sua força emocional e aumentar sua segurança diante do agressor.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 17, 'Atendimento policial especializado', 
'As Delegacias da Mulher (DEAM) são preparadas para atender vítimas de violência, oferecendo acolhimento e orientações jurídicas. Os profissionais estão capacitados para lidar com situações delicadas, acolher relatos e encaminhar medidas protetivas. Procurar a DEAM não é apenas denunciar, mas também receber informações sobre direitos, serviços sociais e apoio psicológico. Se sentir insegura, peça para ir acompanhada de alguém de confiança. Procurar ajuda especializada aumenta a proteção e garante que você tenha respaldo legal adequado.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 18, 'Aplicativos de segurança', 
'Hoje existem aplicativos de segurança voltados para mulheres, permitindo enviar alertas de emergência a contatos de confiança, registrar ocorrências ou localizar serviços próximos. Ferramentas digitais podem ajudar a criar rotinas mais seguras e dar suporte em situações de risco. O uso consciente desses recursos, combinado com orientação profissional e apoio legal, fortalece sua proteção diária. Lembre-se: tecnologia é aliada quando utilizada com cuidado, e conhecer essas opções aumenta sua capacidade de agir rapidamente em momentos críticos.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 19, 'Denúncia anônima', 
'Se você tem medo de represálias, ainda assim é possível denunciar anonimamente casos de violência. Disque 180, SaferNet e outros canais aceitam denúncias sem revelar a identidade da vítima. A denúncia ajuda a polícia e instituições a agir, mesmo quando você não se sente pronta para se expor. Além disso, contribui para identificar padrões de violência em sua comunidade e evitar que outros sofram. Denunciar é um ato de coragem, e a proteção do anonimato garante que você possa agir sem se colocar em risco.', 
'text', 3),

(2, 'Reagindo e Buscando Ajuda', 20, 'Planejando uma saída segura', 
'Se você está considerando sair de um relacionamento abusivo, planejar a saída é essencial para sua segurança. Identifique amigos e familiares de confiança, locais seguros, transporte confiável e documentos importantes. Tenha um plano de emergência caso o agressor tente impedir sua saída ou se aproximar. A preparação não é sinal de medo, mas de estratégia e autocuidado. Cada passo planejado aumenta a proteção e reduz o risco de violência. Você merece um ambiente seguro, onde possa viver sem medo e reconstruir sua vida com autonomia.', 
'text', 3);

-- MÓDULO 3: Autoconhecimento e Fortalecimento (Textos 21-30)
INSERT INTO missions_content (module_number, module_title, mission_number, title, content, content_type, duration_minutes) VALUES
(3, 'Autoconhecimento e Fortalecimento', 21, 'Você merece respeito e amor saudável', 
'Todo relacionamento saudável se baseia em respeito, confiança e liberdade. Amor não deve doer nem limitar seus sonhos. Se alguém te critica constantemente, te humilha ou tenta controlar suas escolhas, isso não é amor — é abuso. Reconhecer isso é um passo fundamental para proteger sua autoestima. Fortalecer a confiança em si mesma e acreditar que você merece cuidado genuíno são atitudes de empoderamento. Amar a si mesma é a base para criar limites claros e se proteger de relações prejudiciais.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 22, 'Aprendendo a dizer "não"', 
'Dizer "não" é essencial para proteger seus limites e sua saúde emocional. Muitas vezes, mulheres em relacionamentos abusivos têm dificuldade de negar pedidos ou vontades do parceiro por medo de brigas ou rejeição. Estabelecer limites claros demonstra respeito próprio e segurança. Nenhuma mulher precisa abrir mão de sua autonomia ou aceitar situações que a fazem mal. A prática constante de afirmar seu ponto de vista ajuda a fortalecer autoestima e reduz o risco de manipulação. O "não" é um ato de coragem e amor-próprio.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 23, 'A força da autoestima', 
'A autoestima é uma ferramenta poderosa contra a violência. Quando você se valoriza, reconhece suas conquistas e acredita no próprio potencial, fica mais difícil aceitar comportamentos abusivos. Dedique tempo para cuidar de si mesma, seja através de hobbies, estudos, exercícios físicos ou momentos de lazer. Cultivar a autoestima ajuda a identificar relações tóxicas e aumenta a confiança para buscar ajuda. Cada pequeno cuidado consigo mesma fortalece sua proteção emocional e ajuda a romper padrões prejudiciais.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 24, 'Violência patrimonial: identificando o abuso', 
'Violência patrimonial é quando alguém tenta controlar seu dinheiro, bens ou recursos. Isso inclui impedir que você trabalhe, tomar documentos ou exigir que dependa financeiramente dele. Esse controle limita sua liberdade e força dependência. Reconhecer esses sinais é crucial para proteger sua autonomia. Você tem direito de gerir sua vida financeira e tomar decisões sobre seus bens. Estar atenta a essas situações é um passo de empoderamento que contribui para romper ciclos de abuso e fortalecer sua independência.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 25, 'Isolamento é um alerta', 
'Se alguém tenta te afastar de amigos, familiares ou colegas, isso é um sinal de alerta. O isolamento é usado para enfraquecer sua rede de apoio e aumentar a dependência emocional. Ter contatos de confiança fora da relação é essencial para manter segurança e clareza de pensamento. Manter vínculos saudáveis permite que você busque orientação, conforto e estratégias de proteção. Amor verdadeiro não isola, ele soma. Esteja atenta a qualquer tentativa de afastamento — sua rede de apoio é um recurso vital.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 26, 'Reconhecendo o medo excessivo', 
'Viver com medo constante de irritar o parceiro ou de tomar decisões é um sinal claro de relacionamento abusivo. O medo não é natural em uma relação saudável; ele indica dominação emocional ou física. Observar e validar seus sentimentos é importante para perceber que não há normalidade nesse sofrimento. Compartilhar essa percepção com alguém de confiança ou profissional de saúde pode ajudar a planejar saídas seguras. Entender o medo como sinal de alerta é um passo essencial para reconquistar segurança e autonomia.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 27, 'Manipulação emocional', 
'A manipulação emocional ocorre quando o parceiro usa culpa, ameaças ou afeto para controlar sua vida. Frases como "você vai me deixar?" ou "ninguém te amaria como eu" criam dependência emocional e reduzem sua confiança. Reconhecer essas táticas ajuda a manter a clareza e a tomar decisões conscientes. Amor saudável não envolve chantagem nem manipulação; ele respeita limites e valoriza a autonomia. Estar atenta a sinais de manipulação fortalece a autoestima e a capacidade de proteção.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 28, 'Violência verbal', 
'Ofensas, humilhações e gritos são formas de violência que deixam marcas invisíveis. Muitas vezes, as mulheres acreditam que só a agressão física é grave, mas a violência verbal corrói a autoestima e o bem-estar. Identificar essas situações é o primeiro passo para buscar ajuda e criar estratégias de proteção. Lembre-se: respeito é essencial. Ninguém que te ama de verdade vai te diminuir. Reconhecer a violência verbal ajuda a recuperar poder sobre sua vida e estabelecer limites claros.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 29, 'Amor não dói', 
'Se a relação causa sofrimento, medo ou insegurança constantes, isso não é amor — é abuso. A ideia de que o parceiro vai mudar com o tempo ou que o amor cura tudo é perigosa. Relações saudáveis geram segurança, confiança e felicidade, não lágrimas e dor constante. Aceitar o mínimo por medo de ficar sozinha não é amor, é sobrevivência. Valorizar a si mesma e reconhecer seus direitos emocionais é fundamental para romper padrões prejudiciais e reconstruir a vida de maneira segura e saudável.', 
'text', 3),

(3, 'Autoconhecimento e Fortalecimento', 30, 'Valorize sua autonomia', 
'Ser autônoma significa tomar decisões sobre sua vida, seus sonhos e seu corpo. A autonomia protege contra dependência emocional, abuso e manipulação. Cada decisão tomada por você fortalece sua autoestima e a capacidade de se proteger. Valorizar a própria voz, expressar sentimentos e buscar informações sobre direitos e proteção são atos de empoderamento. Quanto mais você se conhece e se valoriza, mais difícil será ser manipulada ou controlada. Autonomia é liberdade e segurança — você merece isso.', 
'text', 3);

-- MÓDULO 4: Conhecendo seus Direitos (Textos 31-40)
INSERT INTO missions_content (module_number, module_title, mission_number, title, content, content_type, duration_minutes) VALUES
(4, 'Conhecendo seus Direitos', 31, 'A Lei Maria da Penha', 
'A Lei nº 11.340/2006, conhecida como Lei Maria da Penha, protege mulheres contra violência doméstica e familiar. Ela garante medidas de proteção, punição do agressor e apoio às vítimas. A lei é fruto da luta de Maria da Penha, que transformou sua dor em força para milhares de mulheres. Conhecer seus direitos é essencial para se proteger. Cada mulher tem direito a viver sem medo, violência ou opressão. Informação é poder, e conhecer a lei é um passo concreto de empoderamento e segurança.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 32, 'Violência sexual e consentimento', 
'Violência sexual acontece sempre que não há consentimento explícito. Nenhuma roupa, bebida, situação ou relação anterior justifica abuso. Reconhecer o direito sobre seu próprio corpo é essencial. Buscar apoio legal e psicológico após uma agressão ajuda a lidar com traumas e a proteger seus direitos. Educação sobre consentimento fortalece a autonomia e contribui para prevenir novas situações de abuso. Toda mulher tem direito de viver com segurança, respeito e liberdade sobre seu corpo.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 33, 'Violência institucional', 
'Às vezes, o sistema que deveria proteger também falha. A violência institucional ocorre quando profissionais te desrespeitam ou duvidam da sua palavra. Isso não é culpa sua. Denunciar essas situações ao Ministério Público ou órgãos de fiscalização é essencial. Entender que existe respaldo legal protege e empodera. Buscar direitos não é apenas uma questão de justiça, mas de proteção. Você tem direito de ser ouvida, respeitada e assistida adequadamente pelo sistema.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 34, 'Atendimento psicológico gratuito', 
'Centros de referência e ONGs oferecem apoio psicológico gratuito para mulheres vítimas de violência. Esse acompanhamento ajuda a lidar com traumas, recuperar autoestima e fortalecer a capacidade de tomar decisões seguras. A terapia oferece um espaço de escuta sem julgamentos e estratégias para romper padrões abusivos. Buscar apoio psicológico é um ato de coragem e autocuidado, fundamental para reconstruir a vida e garantir proteção emocional.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 35, 'Delegacias da Mulher', 
'As Delegacias da Mulher (DEAM) são especializadas no atendimento a vítimas de violência. Elas oferecem acolhimento, orientação jurídica e encaminhamento para medidas protetivas. Procurar uma DEAM aumenta sua segurança e garante que o agressor seja responsabilizado. Mesmo que você ainda não esteja pronta para denunciar, buscar informações já é um passo importante. Essas delegacias trabalham com empatia e conhecimento sobre violência doméstica, proporcionando suporte seguro e confiável.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 36, 'Medidas protetivas de urgência', 
'Medidas protetivas obrigam o agressor a se afastar, proibir contato ou até deixar a residência. Solicitar essas medidas garante segurança imediata e protege sua vida. Elas podem ser pedidas na delegacia ou com auxílio do Ministério Público. Conhecer e utilizar esses recursos é essencial para mulheres em risco. Você tem direito a proteção legal, e a lei existe para reforçar sua segurança. Utilizar medidas protetivas é um ato de coragem e de cuidado com você mesma.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 37, 'Aplicativos e ferramentas digitais', 
'Aplicativos de segurança permitem enviar alertas a contatos de confiança, localizar serviços e registrar ocorrências. Ferramentas digitais ajudam a criar rotinas mais seguras e dar suporte em situações de risco. Utilizar a tecnologia como aliada aumenta sua capacidade de agir rapidamente em emergências. Sempre combine o uso digital com orientação profissional e apoio legal. Conhecer essas opções é uma forma moderna e prática de proteger sua vida e sua autonomia.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 38, 'Denúncia anônima', 
'É possível denunciar violência de forma anônima, protegendo sua identidade. Serviços como disque 180 ou SaferNet aceitam relatos sem identificação da vítima. Denunciar anonimamente ajuda a polícia e instituições a agir, mesmo quando você não se sente pronta para se expor. Contribuir para evitar que outros sofram é um ato de coragem e responsabilidade. A proteção do anonimato garante que você possa agir sem se colocar em risco, fortalecendo a rede de prevenção.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 39, 'Planejamento de saída segura', 
'Sair de um relacionamento abusivo exige planejamento. Identifique locais seguros, transporte confiável, documentos importantes e pessoas de confiança. Preparar um plano de emergência aumenta a segurança e reduz riscos. Esse planejamento não é medo, é estratégia e autocuidado. Cada detalhe pensado é um passo para reconquistar liberdade e autonomia. Você merece viver sem ameaças, e organizar sua saída é investir em proteção e segurança.', 
'text', 3),

(4, 'Conhecendo seus Direitos', 40, 'Educação e prevenção', 
'Educar meninas e meninos sobre respeito, igualdade e direitos humanos é essencial para um futuro sem violência. Ensinar sobre consentimento, limites e empatia previne relacionamentos abusivos. Cada mulher que se informa e compartilha conhecimento contribui para mudar padrões culturais e sociais prejudiciais. Educação é prevenção, e informação é empoderamento. Ao se conscientizar e orientar outros, você fortalece a rede de proteção e ajuda a construir uma sociedade mais justa e segura.', 
'text', 3);

-- ============================================
-- VÍDEOS EDUCATIVOS
-- ============================================

INSERT INTO missions_content (module_number, module_title, mission_number, title, video_url, video_platform, content_type, duration_minutes) VALUES
(1, 'Reconhecendo os Sinais da Violência', 41, 'Lei Maria da Penha: conheça seus direitos e como denunciar', 
'https://www.youtube.com/watch?v=lCcS8bTL3HA', 'youtube', 'video', 10),

(1, 'Reconhecendo os Sinais da Violência', 42, 'A violência contra a mulher vai muito além da agressão física', 
'https://www.youtube.com/watch?v=xKfwHuE7d10', 'youtube', 'video', 5),

(2, 'Reagindo e Buscando Ajuda', 43, 'A HISTÓRIA REAL POR TRÁS DA LEI MARIA DA PENHA', 
'https://www.youtube.com/watch?v=8Lw-vwkn_g0', 'youtube', 'video', 15),

(2, 'Reagindo e Buscando Ajuda', 44, 'Combate à Violência Contra Mulheres e Violência Doméstica', 
'https://www.youtube.com/watch?v=Ew-VruAckjs', 'youtube', 'video', 8),

(3, 'Autoconhecimento e Fortalecimento', 45, 'Violência psicológica contra a mulher é crime', 
'https://www.youtube.com/watch?v=zoBqruxyGS4', 'youtube', 'video', 3),

(3, 'Autoconhecimento e Fortalecimento', 46, 'Tipos de violência contra as mulheres', 
'https://www.youtube.com/watch?v=Ly2wv-uU8gY', 'youtube', 'video', 7),

(4, 'Conhecendo seus Direitos', 47, 'Um alerta sobre a violência psicológica contra a mulher', 
'https://www.youtube.com/watch?v=0UWliMyKCyY', 'youtube', 'video', 4),

(4, 'Conhecendo seus Direitos', 48, 'Curta-metragem "Violência contra a mulher"', 
'https://www.youtube.com/watch?v=JoBkcrAKrRw', 'youtube', 'video', 12),

(4, 'Conhecendo seus Direitos', 49, 'Fale sem medo - violência doméstica', 
'https://www.youtube.com/watch?v=0mVGbFG0KU8', 'youtube', 'video', 6),

(4, 'Conhecendo seus Direitos', 50, 'Curta Documentário sobre a Lei Maria da Penha', 
'https://www.youtube.com/watch?v=tuT__DRuG-U', 'youtube', 'video', 20);

-- ============================================
-- FIM DA MIGRATION
-- ============================================
