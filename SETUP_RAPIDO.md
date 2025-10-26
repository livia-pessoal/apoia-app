# ⚡ Setup Rápido - Apoia

**Guia de 5 minutos para rodar o projeto localmente**

---

## 📋 Checklist Antes de Começar

- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Conta no Supabase (gratuita)
- [ ] API Key do Google Gemini (gratuita)

---

## 🚀 Passo a Passo

### 1️⃣ Clonar e Instalar (2 min)

```bash
# Clone o repositório
git clone <URL_DO_REPO>
cd s-dream-weave-main

# Instale as dependências
npm install
```

---

### 2️⃣ Configurar Supabase (3 min)

#### A. Criar Projeto
1. Acesse: https://supabase.com
2. Clique "New Project"
3. Preencha:
   - Nome: `apoia-dev`
   - Database Password: (anote!)
   - Region: South America
4. Aguarde ~2 minutos (criação do projeto)

#### B. Pegar Credenciais
1. Sidebar → **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public key**

#### C. Executar Migrations
1. Sidebar → **SQL Editor**
2. "New Query"
3. Cole o conteúdo de `supabase/migrations/001_simple_schema.sql`
4. Clique **"Run"**
5. Repita com `002_add_supporter_fields.sql`

#### D. Configurar Auth
1. **Settings** → **Authentication**
2. **Email Auth** → Desabilite "Enable email confirmations"
3. Save

---

### 3️⃣ Configurar Gemini AI (1 min)

1. Acesse: https://aistudio.google.com/app/apikey
2. Clique **"Create API Key"**
3. Copie a key (começa com `AIzaSy...`)

---

### 4️⃣ Criar Arquivo `.env` (1 min)

Na raiz do projeto, crie `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSy...
```

**Cole suas credenciais reais!**

---

### 5️⃣ Rodar o Projeto (30s)

```bash
npm run dev
```

Abra: http://localhost:8080

---

## ✅ Testar Se Está Funcionando

### Teste 1: Calculadora
1. Deve aparecer uma calculadora
2. Digite: `1904`
3. Deve mostrar "Preciso de Apoio" e "Sou Apoiadora"

### Teste 2: Cadastro de Vítima
1. `1904` → "Preciso de Apoio"
2. Digite um nome ou pule
3. Deve entrar no app ✅

### Teste 3: Cadastro de Apoiadora + IA
1. Abra console (F12)
2. `localStorage.clear()` + Enter
3. `1904` → "Sou Apoiadora"
4. Clique "Faça seu cadastro"
5. Preencha:
```
Nome: Dra. Ana Silva
Email: ana@gmail.com
Senha: senha123
Telefone: (11) 99999-9999
Motivação: Sou psicóloga com 10 anos de experiência 
em atendimento a vítimas de violência. Quero oferecer 
apoio gratuito.
Causas: Combate à violência doméstica, saúde mental
```
6. Clique "Enviar"
7. Console deve mostrar: `🤖 Resposta Gemini: DECISÃO: APPROVE`
8. Toast: "✅ Cadastro aprovado!"

### Teste 4: Login de Apoiadora
1. `localStorage.clear()`
2. `1904` → "Sou Apoiadora"
3. Login:
   - Email: `ana@gmail.com`
   - Senha: `senha123`
4. Deve entrar no app ✅

### Teste 5: Botão de Emergência
1. Como vítima, clique no botão "180"
2. Toast: "Chamado registrado!"
3. Supabase → Table Editor → `emergency_calls`
4. Deve ter 1 registro novo ✅

---

## 🐛 Problemas Comuns

### Erro: "VITE_GEMINI_API_KEY não encontrada"
**Solução:**
1. Verifique se `.env` está na RAIZ do projeto
2. Key deve começar com `VITE_`
3. Reinicie o servidor: `Ctrl+C` → `npm run dev`

### Erro: "Email ou senha incorretos" (Login)
**Solução:**
1. Verifique se cadastrou primeiro
2. Confira email/senha digitados
3. Supabase → Authentication → Users (veja se existe)

### Erro: "IA não configurada"
**Solução:**
1. Gemini key está no `.env`?
2. Key está correta (começa com `AIzaSy...`)?
3. Reinicie servidor

### Tabelas não existem
**Solução:**
1. Executou as migrations?
2. Supabase → Table Editor → deve ter `profiles`, `organizations`, `emergency_calls`
3. Re-execute os SQLs se necessário

---

## 📊 Verificar Banco de Dados

### Supabase → Table Editor

Deve ter 3 tabelas:

1. **profiles**
   - Colunas: id, user_type, display_name, email, phone, motivation, causes, status, auth_user_id, created_at

2. **organizations**
   - Deve ter 4-5 ONGs cadastradas
   - Veja em: https://localhost:8080 → Tab "Organizações"

3. **emergency_calls**
   - Vazia inicialmente
   - Popula ao clicar nos botões 180/190

---

## 🎯 Próximos Passos Após Setup

1. ✅ Testar todos os fluxos
2. ✅ Cadastrar algumas apoiadoras de teste
3. ✅ Ver dados no Supabase
4. ✅ Explorar o código:
   - `src/pages/` - Páginas principais
   - `src/lib/gemini.ts` - IA
   - `src/lib/supabase.ts` - Cliente DB

---

## 📚 Documentação Completa

- **README.md** - Visão geral completa
- **CHANGELOG_SESSAO.md** - O que foi feito
- Código bem comentado

---

## 💡 Dicas

- Console (F12) sempre aberto para debug
- `localStorage.clear()` entre testes
- Supabase Table Editor para ver dados
- Gemini tem limite gratuito: 1500 req/dia

---

## 🆘 Precisa de Ajuda?

1. Leia o erro no console (F12)
2. Verifique `.env` está correto
3. Migrations executadas?
4. Servidor reiniciado?
5. Confira CHANGELOG_SESSAO.md

---

**Tempo total: ~7 minutos** ⚡

Bom desenvolvimento! 🚀
