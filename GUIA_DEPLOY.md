# 🚀 GUIA COMPLETO: Deploy Gratuito do APOIA

## 📋 **VISÃO GERAL**

Este guia mostra como colocar o app APOIA **no ar gratuitamente** para qualquer pessoa acessar!

**Tempo estimado:** 15-20 minutos  
**Custo:** R$ 0,00 (100% gratuito)  
**Plataforma:** Netlify (grátis para sempre)

---

## 🎯 **ETAPA 1: PREPARAR O PROJETO** ⭐ VOCÊ ESTÁ AQUI

### **1.1. Verificar se tem conta no GitHub**

Você precisa de uma conta no GitHub (grátis):
- ✅ Já tem conta? Ótimo!
- ❌ Não tem? Crie em: https://github.com/signup

---

### **1.2. Criar arquivo .env (LOCAL)**

Este arquivo guarda suas credenciais do Supabase **no seu computador** (não vai para a internet):

**a) Criar o arquivo:**
1. Na raiz do projeto, crie um arquivo chamado `.env`
2. Copie o conteúdo de `.env.example`

**b) Preencher as credenciais:**

```env
# .env (seu arquivo local)
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**c) Onde encontrar essas informações?**

1. Abra o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** (engrenagem) → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

**⚠️ IMPORTANTE:**
- Este arquivo `.env` NÃO vai para o GitHub (já está no `.gitignore`)
- Mantenha essas credenciais seguras!

---

### **1.3. Testar Build Local**

Antes de fazer deploy, vamos garantir que o build funciona:

```bash
# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Criar build de produção
npm run build

# 3. Testar o build localmente
npm run preview
```

**Resultado esperado:**
```
✓ built in XXXms
  ➜  Local:   http://localhost:4173/
```

Abra o link e teste o app. Se funcionar, está pronto para deploy! ✅

---

## 🎯 **ETAPA 2: SUBIR CÓDIGO PARA O GITHUB**

### **2.1. Inicializar Git (se ainda não fez)**

```bash
# Verificar se já tem git inicializado
git status

# Se NÃO tiver, inicializar:
git init
```

---

### **2.2. Fazer commit do código**

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Deploy: APOIA v1.0"
```

**⚠️ Verificação de Segurança:**
- O arquivo `.env` NÃO deve aparecer na lista
- Se aparecer, PARE e verifique o `.gitignore`

---

### **2.3. Criar repositório no GitHub**

**a) No site do GitHub:**

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `apoia-app` (ou outro nome)
   - **Description:** "App de apoio a mulheres em situação de violência"
   - **Visibility:** **Private** (recomendado) ou Public
3. **NÃO** marque nenhuma opção (README, .gitignore, etc)
4. Click **Create repository**

**b) No terminal (comandos que o GitHub vai mostrar):**

```bash
# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/apoia-app.git

# Enviar código
git branch -M main
git push -u origin main
```

**Resultado:** Seu código está no GitHub! ✅

---

## 🎯 **ETAPA 3: DEPLOY NO NETLIFY** 

### **3.1. Criar conta no Netlify**

1. Acesse: https://app.netlify.com/signup
2. Click em **"Sign up with GitHub"** (mais fácil)
3. Autorize o Netlify a acessar seus repositórios

**Custo:** R$ 0,00 (plano gratuito para sempre)

---

### **3.2. Importar projeto do GitHub**

**a) No Netlify Dashboard:**

1. Click em **"Add new site"** → **"Import an existing project"**
2. Escolha **GitHub**
3. Autorize o Netlify (se pedir)
4. Encontre e click no repositório `apoia-app`

**b) Configurar build:**

Preencha assim:

```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

**⚠️ NÃO** click em "Deploy site" ainda!

---

### **3.3. Adicionar variáveis de ambiente**

**ANTES de fazer deploy, configurar as credenciais do Supabase:**

1. Clique em **"Show advanced"** (ou vá em "Site settings" depois)
2. Click em **"New variable"**
3. Adicione **2 variáveis**:

```
Nome: VITE_SUPABASE_URL
Valor: https://SEU_PROJETO.supabase.co

Nome: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ COPIE EXATAMENTE do seu arquivo .env local!**

---

### **3.4. Fazer o Deploy!**

Agora sim, click em **"Deploy site"**!

**Aguarde:** ~2-3 minutos

**Status:**
```
Building... ⏳
Deploying... ⏳
Published! ✅
```

---

## 🎯 **ETAPA 4: CONFIGURAR DOMÍNIO**

### **4.1. URL automática (Netlify)**

Seu app já está no ar!

```
https://random-name-123.netlify.app
```

**Teste:** Abra o link e veja se funciona!

---

### **4.2. Customizar URL (Grátis)**

No Netlify:
1. Vá em **"Site settings"** → **"Domain management"**
2. Click em **"Options"** → **"Edit site name"**
3. Mude para algo como: `apoia-mulheres`

**Nova URL:**
```
https://apoia-mulheres.netlify.app
```

---

### **4.3. Domínio Próprio (Opcional - Pago)**

Se quiser algo como `apoia.com.br`:
- Compre domínio (~R$40/ano): Registro.br, GoDaddy, etc
- Configure DNS no Netlify (guia lá dentro)

---

## 🎯 **ETAPA 5: CONFIGURAR PWA (OPCIONAL)**

Para o app funcionar como PWA (instalável):

### **5.1. Configurar HTTPS (Automático)**

Netlify já fornece HTTPS grátis! ✅

---

### **5.2. Testar PWA**

No celular:
1. Abra o link do app
2. Menu → **"Adicionar à tela inicial"**
3. App vira ícone no celular!

---

## 🎯 **ETAPA 6: ATUALIZAÇÕES FUTURAS**

Quando fizer mudanças no código:

```bash
# 1. Fazer alterações nos arquivos
# 2. Commit
git add .
git commit -m "Correção de bugs"

# 3. Enviar para GitHub
git push

# 4. Netlify faz deploy automático! ✨
```

**Deploy automático:** ~2-3 minutos

---

## ✅ **CHECKLIST FINAL**

Antes de compartilhar o link:

- [ ] App funciona no navegador?
- [ ] Consegue fazer login?
- [ ] Calculadora funciona (disfarce)?
- [ ] Botões 180/190 funcionam?
- [ ] Missões carregam?
- [ ] Notificações funcionam?
- [ ] Chat funciona?
- [ ] Mapa carrega?
- [ ] Rede de apoio funciona?

---

## 📊 **RESUMO DE CUSTOS**

| Serviço | Custo | Limite Gratuito |
|---------|-------|-----------------|
| **Netlify** | R$ 0 | 100GB banda/mês |
| **Supabase** | R$ 0 | 500MB BD + 50k usuários |
| **GitHub** | R$ 0 | Repositórios ilimitados |
| **TOTAL** | **R$ 0/mês** | ✅ |

**Domínio próprio (opcional):** ~R$40/ano

---

## 🆘 **PROBLEMAS COMUNS**

### **Build falhou**

```bash
# Testar build localmente
npm run build

# Ver erros no terminal
```

### **App carrega mas não funciona**

- Verificar variáveis de ambiente no Netlify
- Checar se credenciais Supabase estão corretas

### **Erro 404 ao recarregar página**

Criar arquivo `netlify.toml` na raiz:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🎉 **PRÓXIMOS PASSOS**

Após deploy:
1. ✅ Compartilhe o link com testadoras
2. ✅ Colete feedback
3. ✅ Faça melhorias
4. ✅ Push → Deploy automático!

---

## 📱 **COMPARTILHAR O APP**

**Link direto:**
```
https://apoia-mulheres.netlify.app
```

**QR Code:**
Use: https://qr-code-generator.com
Cole o link e gere QR Code para compartilhar!

---

## 🔒 **SEGURANÇA**

✅ **Boas práticas:**
- Credenciais em variáveis de ambiente
- `.env` não vai para GitHub
- HTTPS automático (Netlify)
- Anon key é pública (ok para frontend)

⚠️ **NÃO fazer:**
- Hardcode de credenciais no código
- Commit de arquivo `.env`
- Compartilhar Service Role Key

---

## 🎓 **PARA APRESENTAÇÃO (TCC/Projeto)**

**Informações úteis:**

```
Frontend: React + TypeScript + Vite
Backend: Supabase (PostgreSQL + Realtime)
Deploy: Netlify (CI/CD)
Custo: R$ 0,00/mês
Usuários simultâneos: Até 50k (plano gratuito)
```

**Diagrama de arquitetura:**
```
[Usuária] 
   ↓
[Netlify - Frontend PWA]
   ↓
[Supabase - Backend + BD]
```

---

**Boa sorte com o deploy! 🚀**

Se tiver dúvidas, consulte:
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
