# 📚 Índice de Documentação - APOIA

**Guia completo de todos os documentos do projeto**

---

## 📖 Documentação Atualizada (18/10/2025)

### 🔥 **Documentos Essenciais (Leia Primeiro)**

1. **[README.md](./README.md)** ⭐ PRINCIPAL
   - Visão geral completa do projeto
   - Features implementadas
   - Stack tecnológico
   - Como usar (vítimas e apoiadoras)
   - Instalação e configuração
   - **Status: 90% MVP Completo**

2. **[SETUP_RAPIDO.md](./SETUP_RAPIDO.md)** ⚡ SETUP
   - Guia de 5-7 minutos para rodar local
   - Passo a passo detalhado
   - Configuração Supabase
   - Configuração Gemini AI
   - Troubleshooting comum

3. **[SISTEMA_MISSOES.md](./SISTEMA_MISSOES.md)** 🎮 MISSÕES (NOVO)
   - Sistema completo de missões educativas
   - 50 missões (40 textos + 10 vídeos)
   - 4 módulos temáticos
   - Documentação técnica completa
   - Componentes e hooks

4. **[CHANGELOG_SESSAO.md](./CHANGELOG_SESSAO.md)** 📝 O QUE FOI FEITO
   - Resumo da sessão de desenvolvimento de hoje
   - Todos os objetivos alcançados
   - Arquivos criados/modificados
   - Problemas resolvidos
   - Próximos passos

5. **[RESUMO_EXECUTIVO_ATUAL.md](./RESUMO_EXECUTIVO_ATUAL.md)** 🎯 APRESENTAÇÃO
   - Status atual (90% completo)
   - Demo rápida (5 min)
   - Métricas e performance
   - Potencial de impacto
   - Roteiro para apresentação

---

## 🗄️ Documentação Técnica

### Backend & Database

6. **supabase/migrations/001_simple_schema.sql**
   - Criação das tabelas principais
   - `profiles`, `organizations`, `emergency_calls`
   - Relacionamentos e constraints

7. **supabase/migrations/002_add_supporter_fields.sql**
   - Campos específicos para apoiadoras
   - Campo `auth_user_id` (vínculo com Auth)
   - Trigger de aprovação automática
   - Status de aprovação

8. **supabase/migrations/003_missions_system.sql** 🆕
   - Tabelas de missões educativas
   - `missions_content` e `user_mission_progress`
   - Índices para performance
   - Relacionamentos CASCADE

9. **supabase/migrations/003_missions_data.sql** 🆕
   - 50 missões educativas completas
   - 40 textos sobre violência e direitos
   - 10 vídeos educativos
   - 4 módulos temáticos

### Código Principal

10. **src/lib/supabase.ts**
    - Cliente Supabase
    - Configuração e conexão

11. **src/lib/gemini.ts**
    - Cliente Google Gemini AI
    - Função `analyzeSupporterProfile()`
    - Critérios de aprovação

12. **src/hooks/useAuth.ts**
    - Hook de autenticação
    - Função `createProfile()`
    - Lógica de cadastro

13. **src/hooks/useMissions.ts** 🆕
    - Hook de gerenciamento de missões
    - Fetch de missões e progresso
    - Marcar missão como completa
    - Estatísticas e filtros

14. **src/components/MissionCard.tsx** 🆕
    - Card visual para cada missão
    - Badge de tipo (texto/vídeo)
    - Status de conclusão

15. **src/components/MissionReader.tsx** 🆕
    - Modal para ler/assistir missões
    - Suporte a YouTube embed
    - Botão marcar como completo

16. **src/components/ProgressStats.tsx** 🆕
    - Grid de estatísticas
    - Total, completas, restantes, %
    - Barra de progresso

### Páginas

17. **src/pages/Calculator.tsx**
    - Tela inicial (calculadora disfarce)
    - Senha secreta `1904`

18. **src/pages/ProfileSelect.tsx**
    - Seleção User/Supporter
    - Roteamento inteligente

19. **src/pages/Register.tsx**
    - Formulário duplo (simples/completo)
    - Integração com IA
    - Criação de conta Supabase Auth

20. **src/pages/SupporterLogin.tsx**
    - Login de apoiadoras
    - Verificação de status
    - Link para cadastro

21. **src/pages/Index.tsx**
    - App principal (5 tabs)
    - Botões de emergência
    - Dashboard
    - 🆕 Tab de Missões integrada

---

## 📚 Documentação Legada (Ainda Relevante)

### Documentos Antigos (Podem Estar Desatualizados)

15. **README_DOCS.md**
    - Índice antigo de documentação
    - Links para docs extensivos
    - Mantido para referência

16. **DOCUMENTACAO_PROJETO.md**
    - Visão técnica geral antiga
    - ~25.000 palavras
    - Alguns trechos desatualizados

17. **COMPONENTES_UI.md**
    - Guia de componentes shadcn/ui
    - Ainda relevante para UI

18. **FLUXO_USUARIO.md**
    - Jornadas antigas de usuário
    - **Fluxos desatualizados** (não considera IA/Login)

19. **GUIA_TECNICO.md**
    - Manual técnico antigo
    - Referência para estrutura

20. **DESIGN_SYSTEM.md**
    - Sistema de design
    - Cores, tipografia
    - Ainda relevante

21. **RESUMO_EXECUTIVO.md**
    - Resumo antigo
    - **Use RESUMO_EXECUTIVO_ATUAL.md** em vez deste

22. **QUICK_REFERENCE.md**
    - Referência rápida antiga
    - Parcialmente desatualizado

---

## 🎯 Qual Documento Ler Para...

### Rodar o Projeto Agora
→ **[SETUP_RAPIDO.md](./SETUP_RAPIDO.md)**

### Entender O Que Foi Feito Hoje
→ **[CHANGELOG_SESSAO.md](./CHANGELOG_SESSAO.md)**

### Apresentar para Alguém
→ **[RESUMO_EXECUTIVO_ATUAL.md](./RESUMO_EXECUTIVO_ATUAL.md)**

### Visão Geral Completa
→ **[README.md](./README.md)**

### 🆕 Entender Sistema de Missões
→ **[SISTEMA_MISSOES.md](./SISTEMA_MISSOES.md)**  
→ **src/hooks/useMissions.ts**  
→ **supabase/migrations/003_missions_system.sql**

### Entender Banco de Dados
→ **supabase/migrations/001_simple_schema.sql**  
→ **supabase/migrations/002_add_supporter_fields.sql**  
→ **supabase/migrations/003_missions_system.sql** 🆕

### Ver Como IA Funciona
→ **src/lib/gemini.ts**  
→ **[CHANGELOG_SESSAO.md](./CHANGELOG_SESSAO.md)** (seção "Integração com IA")

### Entender Sistema de Login
→ **src/pages/SupporterLogin.tsx**  
→ **src/hooks/useAuth.ts**  
→ **[README.md](./README.md)** (seção "Como Usar")

### Componentes UI
→ **[COMPONENTES_UI.md](./COMPONENTES_UI.md)**  
→ **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**

---

## 📊 Mapa de Documentação

```
APOIA/
│
├── 🔥 ESSENCIAIS (Leia primeiro)
│   ├── README.md ⭐
│   ├── SETUP_RAPIDO.md ⚡
│   ├── SISTEMA_MISSOES.md 🎮 (NOVO)
│   ├── CHANGELOG_SESSAO.md 📝
│   └── RESUMO_EXECUTIVO_ATUAL.md 🎯
│
├── 🗄️ TÉCNICOS (Backend/IA)
│   ├── supabase/migrations/
│   │   ├── 001_simple_schema.sql
│   │   ├── 002_add_supporter_fields.sql
│   │   ├── 003_missions_system.sql 🆕
│   │   └── 003_missions_data.sql 🆕
│   ├── src/lib/gemini.ts
│   └── src/lib/supabase.ts
│
├── 💻 CÓDIGO (Páginas/Hooks/Componentes)
│   ├── src/pages/
│   ├── src/hooks/
│   │   └── useMissions.ts 🆕
│   └── src/components/
│       ├── MissionCard.tsx 🆕
│       ├── MissionReader.tsx 🆕
│       └── ProgressStats.tsx 🆕
│
└── 📚 LEGADOS (Referência)
    ├── README_DOCS.md
    ├── DOCUMENTACAO_PROJETO.md
    ├── COMPONENTES_UI.md
    ├── FLUXO_USUARIO.md
    ├── GUIA_TECNICO.md
    ├── DESIGN_SYSTEM.md
    └── QUICK_REFERENCE.md
```

---

## ⚠️ Documentos Desatualizados (Não Usar)

Estes docs foram superados pelas mudanças de hoje:

- ❌ **FLUXO_USUARIO.md** - Fluxos não incluem IA/Login
- ❌ **RESUMO_EXECUTIVO.md** - Use RESUMO_EXECUTIVO_ATUAL.md
- ⚠️ **DOCUMENTACAO_PROJETO.md** - Parcialmente desatualizado

---

## ✅ Checklist para Novo Desenvolvedor

- [ ] Leia **README.md**
- [ ] Siga **SETUP_RAPIDO.md**
- [ ] Leia **CHANGELOG_SESSAO.md** (entender última sessão)
- [ ] Explore **src/lib/gemini.ts** (ver IA)
- [ ] Veja **supabase/migrations/** (entender banco)
- [ ] Teste todos os fluxos do **README.md**

---

## 📅 Histórico de Atualizações

### 19/10/2025 - Sistema de Missões Implementado
- ✅ SISTEMA_MISSOES.md criado (documentação completa)
- ✅ 50 missões educativas implementadas (40 textos + 10 vídeos)
- ✅ 4 módulos temáticos criados
- ✅ Componentes UI de missões (MissionCard, MissionReader, ProgressStats)
- ✅ Hook useMissions.ts implementado
- ✅ Migrations SQL 003 criadas
- ✅ README.md atualizado
- ✅ INDICE_DOCUMENTACAO.md atualizado

### 18/10/2025 - Grande Atualização
- ✅ README.md completamente reescrito
- ✅ SETUP_RAPIDO.md criado
- ✅ CHANGELOG_SESSAO.md criado
- ✅ RESUMO_EXECUTIVO_ATUAL.md criado
- ✅ INDICE_DOCUMENTACAO.md criado (este arquivo)

### Anterior
- Documentos legados (25.000+ palavras)
- Múltiplos guias técnicos
- Ainda úteis como referência

---

## 🎯 Prioridade de Leitura

### Prioridade ALTA (Leia Agora)
1. README.md
2. SETUP_RAPIDO.md
3. SISTEMA_MISSOES.md 🆕
4. CHANGELOG_SESSAO.md

### Prioridade MÉDIA (Útil)
5. RESUMO_EXECUTIVO_ATUAL.md
6. src/lib/gemini.ts
7. supabase/migrations/

### Prioridade BAIXA (Referência)
7. Documentos legados
8. Componentes UI
9. Design system

---

## 💡 Dicas

- **Sempre comece pelo README.md atualizado**
- **Docs legados são referência, não verdade absoluta**
- **CHANGELOG_SESSAO.md tem tudo que mudou hoje**
- **Em dúvida? Leia o código (bem comentado)**

---

**Última Atualização:** 18/10/2025  
**Status:** ✅ Documentação 100% Atualizada  
**Próxima Revisão:** Após próxima sessão de desenvolvimento

---

_Desenvolvido com ❤️ para facilitar onboarding_
