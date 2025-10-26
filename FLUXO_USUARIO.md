# 👤 FLUXO DE USUÁRIO E CASOS DE USO

## 🗺️ Mapa de Navegação

```
┌─────────────────────────────────────────────────────────────┐
│                    CALCULATOR (/)                            │
│  - Calculadora funcional                                    │
│  - Senha secreta: 1904                                      │
│  - Discrição total (parece calculadora comum)              │
└─────────────────────────┬───────────────────────────────────┘
                          │ Senha 1904
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              PROFILE SELECT (/profile-select)                │
│  Escolher perfil:                                           │
│  ┌────────────────────┐  ┌────────────────────┐           │
│  │ Preciso de Apoio  │  │ Sou Apoiadora     │           │
│  │ (user)            │  │ (supporter)       │           │
│  └────────────────────┘  └────────────────────┘           │
└─────────────────────────┬───────────────────────────────────┘
                          │ Seleciona perfil
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     INDEX (/app)                             │
│  ┌─────────┬─────────┬──────────┬──────────┬─────────┐    │
│  │  Home   │ Network │Emergency │Notif.    │ Profile │    │
│  └─────────┴─────────┴──────────┴──────────┴─────────┘    │
│                                                             │
│  [Saída Rápida] ──────────────────────────────→ (/)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 👩 PERSONA 1: Mulher em Situação de Vulnerabilidade

### Perfil: Maria, 32 anos
- Vive em relacionamento abusivo
- Precisa de ajuda mas tem medo
- Celular é monitorado pelo agressor
- Precisa de discrição absoluta

---

### JORNADA COMPLETA

#### 📱 Etapa 1: Descoberta (Fora do App)
**Contexto:** Maria vê divulgação do app em rede social ou recebe indicação

**Mensagem:** "Precisa de ajuda? Baixe uma calculadora comum"

---

#### 🔢 Etapa 2: Acesso Inicial
**Local:** Calculator (`/`)

**Primeira Impressão:**
- Vê uma calculadora comum no celular
- Não há nada suspeito visualmente
- Pode usar como calculadora real se necessário

**Ação:**
1. Abre o "app de calculadora"
2. Faz alguns cálculos normais para testar
3. Lembra da senha: `1904`
4. Digita: `1` → `9` → `0` → `4`
5. Após 300ms → **Redireciona automaticamente**

**Segurança:**
- Se alguém pegar o celular, vê apenas uma calculadora
- Senha não é exibida em lugar nenhum
- Redirecionamento silencioso

---

#### 🛡️ Etapa 3: Seleção de Perfil
**Local:** ProfileSelect (`/profile-select`)

**Tela:**
```
┌──────────────────────────────────────────┐
│     Bem-vinda ao Apoia                   │
│     Selecione seu perfil para continuar  │
│                                          │
│  ┌─────────────────┐ ┌─────────────────┐│
│  │      🛡️         │ │       ❤️        ││
│  │                 │ │                 ││
│  │ Preciso de Apoio│ │  Sou Apoiadora ││
│  │                 │ │                 ││
│  │  [Acessar]      │ │  [Acessar]     ││
│  └─────────────────┘ └─────────────────┘│
│                                          │
│         [Voltar]                         │
└──────────────────────────────────────────┘
```

**Decisão de Maria:**
- Clica em **"Preciso de Apoio"** (Shield)
- Perfil salvo em localStorage como `"user"`
- Redireciona para `/app`

---

#### 🏠 Etapa 4: Home - Primeira Visão
**Local:** Index - Tab Home (`/app?tab=home`)

**Maria vê:**

1. **Hero Section:**
   - "Bem-vinda ao Apoia"
   - "Uma rede de apoio gamificada para fortalecer mulheres"
   - Imagem inspiradora

2. **Stats (Impacto da Comunidade):**
   - 💖 25+ mulheres apoiadas
   - 📈 50+ posts engajados  
   - 🏆 30+ missões completas
   - **Pensamento:** "Não estou sozinha"

3. **Features (3 cards):**
   - 🛡️ **Proteção Imediata** - Botão vermelho urgente
   - 👥 **Rede de Apoio** - Conectar com pessoas
   - ✨ **Fortalecimento** - Missões gamificadas

**Emoção:** Esperança misturada com medo

**Próxima ação:** Explora as outras tabs

---

#### 🚨 Etapa 5: Emergency - Momento Crítico
**Local:** Index - Tab Emergency

**Cenário:** Maria está em situação de risco AGORA

**Tela para User:**
```
┌──────────────────────────────────────────┐
│           🛡️                             │
│     Recursos de Emergência               │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  ☎️  Ligar 180 - Central da Mulher │ │
│  │     (Botão GRANDE vermelho)        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────┐                    │
│  │ 📍 Delegacias   │ Encontre delegacias│
│  │    Próximas     │ especializadas     │
│  └─────────────────┘                    │
│                                          │
│  ┌─────────────────┐                    │
│  │ 💬 Chat Anônimo │ Converse com uma   │
│  │                 │ apoiadora          │
│  └─────────────────┘                    │
│                                          │
│  ┌─────────────────┐                    │
│  │ 📄 Registro de  │ Documente de forma │
│  │    Ocorrências  │ segura             │
│  └─────────────────┘                    │
└──────────────────────────────────────────┘
```

**Ação de Maria:**
1. Clica no botão grande vermelho pulsante
2. **Toast aparece:** "Ligando para 180 - Central de Atendimento à Mulher"
3. (Futuramente: ligação real é realizada)

**Alternativas:**
- **Chat Anônimo:** Conversar sem identificação
- **Delegacias:** Ver mapa de delegacias próximas
- **Registro:** Documentar violência de forma segura

**Recurso Crítico - Saída Rápida:**
- Se o agressor chegar
- Maria clica **"Saída Rápida"** no header
- Volta instantaneamente para a calculadora
- Dados de sessão limpos

---

#### 👥 Etapa 6: Network - Buscar Apoio
**Local:** Index - Tab Network

**Objetivo de Maria:** Encontrar pessoas e organizações que podem ajudar

**Tela:**
```
┌──────────────────────────────────────────┐
│     Minha Rede de Apoio                  │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  ONGs Parceiras                    │ │
│  │  Organizações especializadas       │ │
│  │  prontas para ajudar               │ │
│  │                                    │ │
│  │  [Ver ONGs Disponíveis]            │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Apoiadoras Voluntárias            │ │
│  │  Conecte-se com mulheres           │ │
│  │  dispostas a ajudar                │ │
│  │                                    │ │
│  │  [Explorar Rede]                   │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Funcionalidades Futuras:**
- Lista de ONGs com telefones e endereços
- Perfis de apoiadoras verificadas
- Sistema de match seguro
- Chat criptografado

---

#### 🔔 Etapa 7: Notifications
**Local:** Index - Tab Notifications

**Estado Atual:** Placeholder
```
┌──────────────────────────────────────────┐
│     Notificações                         │
│                                          │
│     Suas notificações aparecerão aqui    │
└──────────────────────────────────────────┘
```

**Futuro:**
- Respostas de apoiadoras
- Atualizações de ONGs
- Lembretes de check-in
- Alertas importantes

---

#### 👤 Etapa 8: Profile - Configuração
**Local:** Index - Tab Profile

**Tela:**
```
┌──────────────────────────────────────────┐
│            👤                            │
│        Meu Perfil                        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  [Editar Perfil]                   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  [Configurações de Segurança]      │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  [Contatos de Emergência]          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  [Sair] (vermelho)                 │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Ações de Maria:**
- Configura contatos de emergência
- Define senha adicional
- Cadastra pessoas de confiança
- Logout seguro quando necessário

---

## 🤝 PERSONA 2: Mulher Apoiadora

### Perfil: Ana, 28 anos
- Psicóloga voluntária
- Quer ajudar mulheres em situação de violência
- Disponível para oferecer suporte
- Comprometida com a causa

---

### JORNADA DA APOIADORA

#### 🔢 Etapa 1: Acesso
**Local:** Calculator → ProfileSelect

**Ana:**
1. Baixa o app
2. Digita senha `1904`
3. Chega em ProfileSelect
4. Escolhe **"Sou Apoiadora"** (Heart)
5. Perfil salvo como `"supporter"`

---

#### 🏠 Etapa 2: Home - Visão Geral
**Local:** Index - Tab Home

**Mesmo conteúdo que user:**
- Hero Section
- Stats Section (vê o impacto coletivo)
- Features Section

**Header diferente:** "Apoio Ativo" (vs "Meu Espaço")

---

#### 👥 Etapa 3: Network - Rede Ativa
**Local:** Index - Tab Network

**Título:** "Rede Ativa"

**Conteúdo:**
- Ver lista de usuárias que precisam de apoio (anônimas)
- ONGs parceiras para referenciar
- Outras apoiadoras para colaborar

---

#### 🚨 Etapa 4: Emergency - CHAMADOS ATIVOS
**Local:** Index - Tab Emergency

**Interface completamente diferente:**

```
┌──────────────────────────────────────────┐
│            ❤️                            │
│       Chamados Ativos                    │
│  Mulheres que precisam de ajuda agora    │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │🔴 Solicitação de Apoio   [URGENTE]│ │
│  │   Há 5 minutos                     │ │
│  │                                    │ │
│  │   Mulher em situação de risco      │ │
│  │   solicita contato imediato        │ │
│  │                                    │ │
│  │   [☎️ Contatar]  [📍 Ver Local]   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Mais notificações em tempo real        │
│  aparecerão aqui                         │
└──────────────────────────────────────────┘
```

**Ação de Ana:**
1. Vê chamado urgente
2. Clica em **"Contatar"**
3. Inicia conversa segura com a usuária
4. Ou clica em **"Ver Local"** para ver proximidade

**Card de Chamado:**
- Borda vermelha à esquerda (urgente)
- Badge "URGENTE" vermelho
- Timestamp para priorização
- Informações mínimas (segurança)
- Ações rápidas

---

#### 🔔 Etapa 5: Notifications - Alertas
**Local:** Index - Tab Notifications

**Notificações de Ana:**
- Novo chamado de emergência
- Mensagem de usuária
- Feedback sobre ajuda prestada
- Atualizações do sistema

---

#### 👤 Etapa 6: Profile - Perfil de Apoiadora
**Local:** Index - Tab Profile

**Título:** "Perfil de Apoiadora"

**Opções específicas:**
- Disponibilidade (online/offline)
- Áreas de especialização
- Estatísticas de apoio prestado
- Certificações/verificações

---

## 🔄 FLUXOS CRÍTICOS

### 1. Emergência Imediata

```
User em risco → Tab Emergency → Botão "Ligar 180"
                                      ↓
                               Toast: "Ligando..."
                                      ↓
                          (Futuro: Ligação real)
                                      ↓
                        Opções adicionais aparecem
```

### 2. Saída Rápida (Panic Exit)

```
User em qualquer tela → Botão "Saída Rápida" (header)
                                      ↓
                          localStorage.removeItem()
                                      ↓
                          navigate("/") - Calculadora
                                      ↓
                         Tela volta ao normal
                         (Parece que nunca saiu)
```

**Tempo de saída:** < 1 segundo

### 3. Match User-Supporter (Futuro)

```
User precisa de ajuda → Tab Network → "Buscar Apoiadora"
                                      ↓
                         Sistema busca supporter disponível
                                      ↓
                         Match baseado em:
                         - Proximidade
                         - Especialização
                         - Disponibilidade
                                      ↓
                    Supporter recebe notificação
                                      ↓
                         Chat anônimo iniciado
```

### 4. Registro de Ocorrência (Futuro)

```
User → Tab Emergency → "Registro de Ocorrências"
                                      ↓
                    Formulário seguro e criptografado
                                      ↓
                         Campos:
                         - Data/hora
                         - Descrição
                         - Evidências (fotos/áudio)
                         - Testemunhas
                                      ↓
                         Salvo localmente criptografado
                                      ↓
                    Pode exportar quando seguro
```

---

## 🔐 CASOS DE USO DE SEGURANÇA

### Caso 1: Agressor Pega o Celular

**Situação:** Maria está usando o app, agressor pega celular

**Solução:**
1. Maria vê agressor se aproximando
2. Clica "Saída Rápida" (1 segundo)
3. Tela volta para calculadora
4. Agressor vê apenas calculadora comum

**Resultado:** ✅ Segurança mantida

---

### Caso 2: Alguém Pergunta "O que é esse app?"

**Situação:** Amiga/familiar vê o ícone

**Resposta de Maria:** "É uma calculadora"

**Demonstração:**
1. Abre o app
2. Faz cálculos normais
3. Mostra que funciona como calculadora

**Resultado:** ✅ Discrição mantida

---

### Caso 3: Emergência com Agressor Presente

**Situação:** Maria precisa de ajuda AGORA mas agressor está perto

**Opções:**

**A) Botão de Emergência Rápido:**
- Tab Emergency sempre acessível
- Um toque no botão grande
- Discagem automática do 180

**B) Código de Emergência na Calculadora:**
- Pode digitar código especial
- Ex: `911` aciona emergência silenciosa
- Não sai da tela da calculadora

**C) Shake to Alert (Futuro):**
- Sacudir celular 3x
- Envia alerta para rede

---

### Caso 4: Histórico de Navegação

**Problema:** Agressor pode verificar histórico do navegador

**Solução Atual:**
- App como PWA instalado
- Não aparece em histórico convencional

**Solução Futura:**
- Modo incógnito forçado
- Limpar histórico automaticamente
- Abrir em janela privada

---

## 📊 MÉTRICAS DE SUCESSO

### Para Usuárias (User)
- Tempo até encontrar ajuda
- Número de recursos acessados
- Sensação de segurança (pesquisa)
- Taxa de uso continuado

### Para Apoiadoras (Supporter)
- Tempo de resposta a chamados
- Número de usuárias ajudadas
- Satisfação das usuárias
- Taxa de resolução

### Para o Sistema
- Tempo médio de resposta
- Chamados atendidos vs não atendidos
- Retenção de usuárias
- Impacto social mensurável

---

## 🎯 PRÓXIMOS PASSOS

### Curto Prazo
- [ ] Implementar backend real
- [ ] Integração com 180
- [ ] Sistema de autenticação seguro
- [ ] Chat em tempo real

### Médio Prazo
- [ ] Mapa de delegacias
- [ ] Registro criptografado
- [ ] Sistema de match
- [ ] Gamificação completa

### Longo Prazo
- [ ] IA para triagem de chamados
- [ ] Integração com ONGs
- [ ] App nativo (iOS/Android)
- [ ] Expansão internacional

---

**Princípios Fundamentais:**
1. **Segurança em Primeiro Lugar** - Sempre
2. **Discrição Total** - Parece calculadora comum
3. **Acesso Rápido** - Emergência em < 3 toques
4. **Privacidade** - Dados criptografados
5. **Suporte Real** - Pessoas reais ajudando
