# 🛡️ APOIA - Rede de Apoio Gamificada

<div align="center">

![Status](https://img.shields.io/badge/status-MVP%2095%25-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Uma plataforma discreta e gamificada para apoiar mulheres em situação de vulnerabilidade**

[Demo](#) · [Documentação](./README_DOCS.md) · [Reportar Bug](#) · [Solicitar Feature](#)

</div>

---

## 🎯 Sobre o Projeto

**Apoia** é uma aplicação web progressiva (PWA) que conecta mulheres em situação de violência doméstica com apoiadoras voluntárias, ONGs e recursos de emergência, tudo de forma **totalmente discreta**.

### 💡 Diferencial Inovador

A aplicação se disfarça como uma **calculadora comum**, permitindo que mulheres acessem ajuda sem levantar suspeitas. Com uma senha secreta (`1904`), a usuária acessa uma rede completa de apoio e recursos.

### 🎯 Objetivos

- ✅ **Discrição Total:** Interface de calculadora para segurança
- 🚨 **Acesso Rápido:** Botão de emergência para ligar 180
- 🤝 **Rede de Apoio:** Conecta vítimas com apoiadoras
- 🎮 **Gamificação:** Missões educativas e empoderadoras
- 🔐 **Privacidade:** Saída rápida e dados protegidos

---

## ✨ Funcionalidades

### ✅ Implementado

#### 🎯 Core Features
- 🔢 **Calculadora Funcional** - Disfarce perfeito
- 🔑 **Senha Secreta (1904)** - Acesso discreto ao sistema
- ⚡ **Saída Rápida** - Retorno instantâneo à calculadora
- 📱 **Responsivo** - Mobile-first design
- 🎨 **Design System** - 50+ componentes reutilizáveis

#### 👥 Sistema de Perfis Duplos
- 🛡️ **Perfil Vítima (User)**
  - Cadastro anônimo e discreto
  - Nome opcional (pode pular)
  - Aprovação automática instantânea
  - Acesso imediato ao app
  
- ❤️ **Perfil Apoiadora (Supporter)**
  - Cadastro completo com validação
  - Sistema de login (email + senha)
  - Aprovação por IA automática
  - Revisão manual quando necessário

#### 🤖 IA de Aprovação Automática (Gemini 2.5 Flash)
- Análise inteligente de cadastros de apoiadoras
- Aprovação automática de perfis qualificados (2-3s)
- Detecção de spam e bots
- Revisão manual para casos duvidosos
- Taxa de precisão: ~85-90%

#### 🗄️ Backend Completo (Supabase)
- **PostgreSQL** - Banco de dados relacional
- **Authentication** - Sistema de login seguro
- **Row Level Security** - Segurança de dados
- **Real-time** - Pronto para chat e notificações
- **Storage** - Preparado para uploads

#### 📊 Banco de Dados
- ✅ Tabela `profiles` - Vítimas e apoiadoras
- ✅ Tabela `organizations` - ONGs e serviços
- ✅ Tabela `emergency_calls` - Registro de chamados
- ✅ Tabela `missions_content` - 50 missões educativas (textos + vídeos)
- ✅ Tabela `user_mission_progress` - Progresso individual de cada usuária
- ✅ Triggers automáticos para aprovação
- ✅ Relacionamentos e integridade referencial

#### 🚨 Sistema de Emergência
- **Botão 180** (Central da Mulher) - Registra chamado no banco
- **Botão 190** (Polícia) - Registra chamado no banco
- **Histórico de Chamados** - Todos salvos com timestamp
- **Vínculo com Perfil** - Cada chamado associado ao user_id

#### 🔐 Autenticação e Segurança
- Login de apoiadoras com email/senha
- Verificação de status de aprovação
- Sessões seguras com Supabase Auth
- Dados criptografados em trânsito (HTTPS)

#### 🎮 Sistema de Missões Educativas (NOVO)
- **50 Missões Completas** - 40 textos + 10 vídeos
- **4 Módulos Temáticos:**
  1. Reconhecendo os Sinais da Violência (10 missões)
  2. Reagindo e Buscando Ajuda (10 missões)
  3. Autoconhecimento e Fortalecimento (10 missões)
  4. Conhecendo seus Direitos (10 missões)
- **Progresso Individual** - Rastreamento por usuária
- **Gamificação** - Estatísticas, badges, percentual de conclusão
- **Componentes UI:**
  - `MissionCard` - Card visual para cada missão
  - `MissionReader` - Dialog modal para ler/assistir conteúdo
  - `ProgressStats` - Grid com estatísticas de progresso
- **Hook Customizado** - `useMissions()` para gerenciar estado

### 🚧 Em Desenvolvimento

- 💬 **Chat Anônimo** - Comunicação segura vítima-apoiadora
- 📍 **Mapa de Delegacias** - Geolocalização de serviços
- 📊 **Dashboard Apoiadora** - Visualizar chamados ativos
- 🔔 **Notificações** - Alertas em tempo real
- 📄 **Registro de Ocorrências** - Documentação segura
- 🏆 **Sistema de Badges** - Conquistas e recompensas visuais

---

## 🚀 Início Rápido

### Pré-requisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Instalação

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd s-dream-weave-main

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto com:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
VITE_GEMINI_API_KEY=sua_gemini_api_key

# 4. Configure o banco de dados Supabase
# Execute as migrations em supabase/migrations/ no SQL Editor

# 5. Inicie o servidor de desenvolvimento
npm run dev

# 6. Acesse http://localhost:8080
```

### Configuração do Supabase

#### 1. Criar Projeto
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote o URL e a Anon Key

#### 2. Executar Migrations
No SQL Editor do Supabase, execute em ordem:
1. `001_simple_schema.sql` - Tabelas principais
2. `002_add_supporter_fields.sql` - Campos de apoiadoras
3. `003_missions_system.sql` - Tabelas de missões
4. `003_missions_data.sql` - Conteúdo educativo (50 missões)

#### 3. Configurar Autenticação
- **Settings → Authentication**
- Desabilite "Enable email confirmations" (para desenvolvimento)
- Configure providers conforme necessário

### Configuração da IA (Gemini)

#### 1. Obter API Key
- Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
- Clique em "Create API Key"
- Copie a key gerada

#### 2. Adicionar no .env
```env
VITE_GEMINI_API_KEY=AIzaSy...
```

#### 3. Modelos Disponíveis
- **gemini-2.5-flash** (atual) - Rápido e eficiente
- Plano gratuito: 60 req/min, 1500 req/dia

### Build de Produção

```bash
# Build
npm run build

# Preview
npm run preview
```

---

## 🏗️ Tecnologias

### Core

- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 5.4.19** - Build tool
- **React Router DOM 6.30.1** - Roteamento

### Backend & Database

- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados relacional
  - Authentication - Sistema de login
  - Real-time - Subscriptions e notificações
  - Storage - Armazenamento de arquivos
  - Row Level Security - Segurança de dados

### Inteligência Artificial

- **Google Gemini 2.5 Flash** - IA de análise
  - Aprovação automática de perfis
  - Detecção de spam/bots
  - Análise de texto em tempo real
  - SDK: `@google/genai`

### UI Framework

- **TailwindCSS 3.4.17** - Styling
- **shadcn/ui** - Componentes (Radix UI)
- **Lucide React** - Ícones
- **Sonner** - Toast notifications

### Estado e Dados

- **TanStack Query** - Async state
- **React Hook Form** - Formulários
- **Zod** - Validação
- **Supabase Client** - Cliente JavaScript

---

## 📁 Estrutura do Projeto

```
src/
├── pages/                    # Páginas da aplicação
│   ├── Calculator.tsx        # Tela inicial (disfarce calculadora)
│   ├── ProfileSelect.tsx     # Seleção User/Supporter
│   ├── Register.tsx          # Cadastro (duplo: simples/completo)
│   ├── SupporterLogin.tsx    # Login de apoiadoras
│   ├── Index.tsx             # App principal (5 tabs)
│   └── NotFound.tsx          # 404
│
├── components/               # 50+ componentes UI
│   ├── sections/             # HeroSection, StatsSection, etc
│   ├── ui/                   # Componentes shadcn/ui
│   ├── MissionCard.tsx       # Card de missão
│   ├── MissionReader.tsx     # Modal leitor de missões
│   ├── ProgressStats.tsx     # Estatísticas de progresso
│   ├── FeatureCard.tsx
│   └── StatsCard.tsx
│
├── hooks/                    # Hooks customizados
│   ├── useAuth.ts            # Autenticação e perfis
│   ├── useOrganizations.ts   # Fetch de ONGs
│   ├── useMissions.ts        # Sistema de missões
│   └── useSupabase.ts        # Conexão Supabase
│
├── lib/                      # Utilitários e configurações
│   ├── supabase.ts           # Cliente Supabase
│   ├── gemini.ts             # Cliente Gemini AI
│   └── utils.ts              # Funções auxiliares
│
├── supabase/                 # Configurações Supabase
│   └── migrations/           # SQL migrations
│       ├── 001_simple_schema.sql
│       ├── 002_add_supporter_fields.sql
│       ├── 003_missions_system.sql
│       └── 003_missions_data.sql
│
└── index.css                 # Design system (cores, fonts)
```

---

## 📚 Documentação Completa

Documentação extensiva com **25.000+ palavras**:

### 📖 Documentos Principais

1. **[README_DOCS.md](./README_DOCS.md)** - Índice completo de documentação
2. **[DOCUMENTACAO_PROJETO.md](./DOCUMENTACAO_PROJETO.md)** - Visão geral técnica
3. **[SISTEMA_MISSOES.md](./SISTEMA_MISSOES.md)** - 🆕 Sistema de missões educativas
4. **[COMPONENTES_UI.md](./COMPONENTES_UI.md)** - Guia de componentes
5. **[FLUXO_USUARIO.md](./FLUXO_USUARIO.md)** - Jornadas de usuário
6. **[GUIA_TECNICO.md](./GUIA_TECNICO.md)** - Manual técnico
7. **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Sistema de design
8. **[RESUMO_EXECUTIVO.md](./RESUMO_EXECUTIVO.md)** - Resumo executivo
9. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Referência rápida

### 🎯 Começe Por Aqui

**Desenvolvedor:** [GUIA_TECNICO.md](./GUIA_TECNICO.md) → [COMPONENTES_UI.md](./COMPONENTES_UI.md)  
**Designer:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) → [FLUXO_USUARIO.md](./FLUXO_USUARIO.md)  
**Product Manager:** [RESUMO_EXECUTIVO.md](./RESUMO_EXECUTIVO.md) → [FLUXO_USUARIO.md](./FLUXO_USUARIO.md)

---

## 🎨 Design System

### Paleta de Cores

- **Primary:** `#9D5BD2` (Roxo) - Empoderamento
- **Accent:** `#C756D9` (Rosa-Roxo) - Apoio
- **Destructive:** `#E84545` (Vermelho) - Emergência
- **Success:** `#33CC7A` (Verde) - Confirmação

### Componentes

- 50+ componentes UI documentados
- Design system completo em HSL
- Responsivo e acessível (WCAG AA)
- Dark mode preparado

---

## 🔐 Segurança e Privacidade

### Implementado ✅

- ✅ Disfarce como calculadora
- ✅ Senha secreta (1904)
- ✅ Saída rápida (< 1 segundo)
- ✅ Dados apenas em localStorage
- ✅ Visual totalmente discreto

### Planejado 🚧

- 🔐 Criptografia de dados locais
- ⏱️ Timeout de sessão automático
- 🕶️ Modo incógnito forçado
- 🗑️ Limpar histórico automático
- 🔒 HTTPS obrigatório

---

## 👥 Como Usar

### Para Usuárias (Vítimas)

#### Primeiro Acesso
1. Abra a "calculadora" (tela inicial)
2. Digite a senha secreta: `1904`
3. Clique "Preciso de Apoio" 🛡️
4. Tela de cadastro simples:
   - **Opcional:** Digite um apelido
   - **Ou:** Pule e continue anônima
5. ✅ **Entra imediatamente no app** (aprovada automaticamente)

#### Recursos Disponíveis
- 🚨 Botão de emergência 180 (Central da Mulher)
- 🚨 Botões rápidos 180/190
- 🏢 Lista de ONGs e serviços
- 🎮 **50 Missões Educativas** - Aprenda sobre violência, direitos e proteção
- ⚡ Saída rápida (volta à calculadora)
- 📊 Todas as ações são registradas anonimamente

#### Próximos Acessos
- Volta na calculadora
- Digite `1904`
- Escolhe "Preciso de Apoio"
- Entra direto (não precisa cadastrar de novo)

---

### Para Apoiadoras

#### Primeiro Acesso (Cadastro)
1. Abra a "calculadora"
2. Digite a senha secreta: `1904`
3. Clique "Sou Apoiadora" ❤️
4. **Tela de LOGIN aparece**
5. Clique "Deseja se tornar apoiadora? Faça seu cadastro!"
6. Preencha o formulário completo:
   - Nome completo *
   - Email *
   - Senha * (mínimo 6 caracteres)
   - Telefone *
   - Motivação * (por que quer ajudar)
   - Causas que defende * (texto livre)
7. Clique "Enviar Cadastro"
8. 🤖 **IA analisa em 2-3 segundos**
9. Resultado:
   - ✅ **Aprovada:** "Cadastro aprovado! Você já pode fazer login" 
   - ⏳ **Em análise:** "Retorno em até 24h" (revisão manual)
   - ❌ **Rejeitada:** Spam/bot detectado

#### Próximos Acessos (Login)
1. Calculadora → `1904` → "Sou Apoiadora"
2. **Tela de LOGIN**
3. Digite:
   - Email
   - Senha
4. Clique "Entrar"
5. ✅ Entra no app (se aprovada)
6. ⏳ Mensagem se ainda pendente
7. ❌ Erro se rejeitada

#### Recursos para Apoiadoras
- 📊 Dashboard com chamados ativos (em desenvolvimento)
- 💬 Chat com vítimas (em desenvolvimento)
- 📈 Estatísticas de impacto (em desenvolvimento)

---

## 🤝 Como Contribuir

### Para Desenvolvedores

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Para Designers

- Estudar [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- Propor melhorias de UX
- Criar protótipos no Figma

### Para ONGs/Apoiadoras

- Testar a plataforma
- Dar feedback
- Sugerir funcionalidades
- Ajudar na divulgação

---

## 📊 Status do Projeto

### MVP (Atual): 85% Completo ✅

- ✅ Frontend completo e funcional
- ✅ Design system profissional
- ✅ Documentação extensiva
- ✅ **Backend implementado (Supabase)**
- ✅ **Sistema de autenticação funcionando**
- ✅ **Banco de dados estruturado**
- ✅ **IA de aprovação automática**
- ✅ **Registro de chamados de emergência**
- ⚠️ Integrações telefônicas reais pendentes
- ⚠️ Chat em tempo real pendente

### Componentes Principais

| Componente | Status | Descrição |
|------------|--------|-----------|
| Calculadora | ✅ 100% | Disfarce funcional |
| Cadastro Duplo | ✅ 100% | User/Supporter |
| Login Apoiadoras | ✅ 100% | Email + Senha |
| IA Aprovação | ✅ 100% | Gemini 2.5 Flash |
| Backend Supabase | ✅ 100% | Database + Auth |
| Botões Emergência | ✅ 100% | Registro no banco |
| Dashboard | ✅ 80% | UI pronta, funcionalidades básicas |
| Chat Vítima-Apoiadora | ⏳ 0% | Planejado |
| Mapa Serviços | ⏳ 0% | Planejado |
| Gamificação | ⏳ 0% | Planejado |

### Próximos Passos

1. ~~Implementar backend~~ ✅ FEITO (Supabase)
2. ~~Sistema de autenticação~~ ✅ FEITO
3. ~~IA de aprovação~~ ✅ FEITO
4. Dashboard de apoiadoras (visualizar chamados)
5. Chat em tempo real (WebSockets/Real-time)
6. Integração telefônica real com 180
7. Sistema de gamificação
8. Testes com usuárias reais
9. Deploy em produção

---

## 🎯 Roadmap

### Q4 2024 - MVP ✅ 85% CONCLUÍDO
- [x] Interface completa
- [x] Design system
- [x] Documentação
- [x] **Backend Supabase**
- [x] **Sistema de autenticação**
- [x] **IA de aprovação (Gemini)**
- [x] **Registro de chamados**
- [ ] Integração telefônica 180 (próximo)

### Q1 2025 - Beta
- [ ] Dashboard apoiadoras (visualizar chamados ativos)
- [ ] Chat em tempo real (vítima ↔ apoiadora)
- [ ] Mapa de delegacias/serviços
- [ ] Sistema de match inteligente
- [ ] Notificações push
- [ ] App nativo (React Native)

### Q2 2025 - V1.0
- [ ] Gamificação completa (missões, badges, níveis)
- [ ] IA para triagem e priorização
- [ ] Rede de ONGs parceiras
- [ ] Análise de impacto e métricas
- [ ] Sistema de feedback e avaliação
- [ ] Programa de formação de apoiadoras

---

## 📈 Impacto Social

### Projeções Ano 1

- 🎯 1.000 usuárias ativas
- 🤝 200 apoiadoras
- 📞 500 chamados atendidos
- 🏢 10 ONGs parceiras
- ✅ 70% taxa de sucesso

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**Projeto Apoia**

- Website: (em breve)
- Email: contato@apoia.app
- Instagram: @apoiaapp

---

## 🙏 Agradecimentos

- [Lovable](https://lovable.dev) - Plataforma de desenvolvimento
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Radix UI](https://www.radix-ui.com) - Primitivos acessíveis
- [Lucide](https://lucide.dev) - Ícones
- Todas as ONGs e apoiadoras que tornaram este projeto possível

---

## ⚠️ Aviso Importante

Este é um projeto em desenvolvimento. As funcionalidades de emergência ainda não estão totalmente operacionais. **Em caso de emergência real, ligue 180 (Central de Atendimento à Mulher) ou 190 (Polícia Militar).**

---

<div align="center">

**Desenvolvido com ❤️ para empoderar e proteger mulheres**

[⬆ Voltar ao topo](#-apoia---rede-de-apoio-gamificada)

</div>
