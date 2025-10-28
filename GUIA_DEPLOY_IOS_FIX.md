# 🚀 Guia de Deploy - Correções iOS

## 📋 Resumo das Mudanças

Correções aplicadas para resolver:
- ✅ Travamento no cadastro de apoiadora (iOS/iPhone)
- ✅ Travamento no login de apoiadora (iOS/iPhone)
- ✅ Texto cortado na interface (Safari iOS)

---

## 🔧 O que foi alterado

### 1. CSS Global (`src/index.css`)

Ajustes para Safari iOS:
- `-webkit-text-size-adjust: 100%`
- `-webkit-font-smoothing: antialiased`
- `text-rendering: optimizeLegibility`
- `line-height` personalizado para headings, botões e labels

**Efeito:** Texto não será mais cortado no iPhone.

### 2. Função Serverless Gemini (`netlify/functions/ai-approval.ts`)

Migrou a análise de IA do cliente para o servidor:
- Chave da API Gemini agora fica segura no backend
- Elimina problemas de CORS/ITP do Safari iOS
- Timeout de 8s com fallback para REVIEW

**Efeito:** Cadastro não trava mais no iPhone.

### 3. Timeouts Defensivos

**Register.tsx:**
- Timeout de 15s na chamada à função serverless
- Timeout de 15s no `supabase.auth.signUp`
- Fallback para REVIEW em todos os erros

**SupporterLogin.tsx:**
- Timeout de 15s no `signInWithPassword`
- Timeout de 10s na consulta de perfil
- Mensagens de erro claras para iOS

**Efeito:** Login/cadastro não ficam "carregando infinito" no iPhone.

### 4. Configuração Netlify (`netlify.toml`)

Adicionada configuração de Functions:
```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

### 5. Dependência (`package.json`)

Adicionado:
```json
"@netlify/functions": "^2.8.2"
```

---

## 🚀 Passo a Passo para Deploy

### 1. Instalar Nova Dependência

```bash
npm install
```

Isso instala o `@netlify/functions` necessário para a função serverless.

### 2. Configurar Variável de Ambiente no Netlify

**IMPORTANTE:** A chave do Gemini agora fica no backend!

1. Acesse o dashboard do Netlify
2. Vá em **Site settings** > **Environment variables**
3. Adicione:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Sua chave da API Gemini
   - Scopes: Deixe "Production" e "Deploy Previews" marcados

**Remova** a variável `VITE_GEMINI_API_KEY` se existir (não é mais usada).

### 3. Fazer Deploy

```bash
git add .
git commit -m "fix(ios): adicionar timeouts, CSS fixes e função serverless Gemini"
git push origin main
```

O Netlify fará deploy automático em ~2-3 minutos.

### 4. Verificar se Function foi Deployed

No dashboard do Netlify:
1. Vá em **Functions** no menu lateral
2. Você deve ver: `ai-approval`
3. Status: Verde (✓)

---

## 🧪 Testes no iPhone

Peça para sua colega testar:

### Cadastro de Apoiadora

1. Acessar https://seu-app.netlify.app
2. Digite `1904` na calculadora
3. Escolher "Sou Apoiadora"
4. Preencher formulário completo
5. Clicar "Enviar Cadastro"

**Esperado:**
- Aparece "🤖 Analisando..." por 1-3 segundos
- Se aprovada: "✅ Cadastro aprovado! Você já pode fazer login. 💜"
- Se timeout: "⏳ Cadastro em análise. Retorno em até 24h."
- **NÃO deve travar!**

### Login de Apoiadora

1. Acessar https://seu-app.netlify.app
2. Digite `1904` na calculadora
3. Escolher "Sou Apoiadora"
4. Clicar em "Faça seu cadastro!" e depois voltar
5. Inserir email e senha válidos
6. Clicar "Entrar"

**Esperado:**
- Login bem-sucedido: "Bem-vinda de volta, Nome! 💜"
- Se timeout: "Conexão lenta no iPhone. Tente novamente."
- **NÃO deve travar!**

### Interface (Texto Cortado)

1. Navegar por todas as telas
2. Verificar títulos, botões, labels

**Esperado:**
- Todo texto visível sem cortes
- Espaçamento adequado

---

## 🔍 Monitoramento

### Logs da Função Serverless

No Netlify:
1. **Functions** > `ai-approval`
2. Ver logs em tempo real
3. Procurar por:
   - `🤖 Resposta Gemini:` (sucesso)
   - `⏱️ Timeout na análise IA` (timeout)
   - Erros HTTP (500, etc.)

### Console do iPhone (Safari DevTools)

Conecte o iPhone via USB ao Mac:
1. Safari > Develop > [Nome do iPhone] > [Aba]
2. Console vai mostrar:
   - `📊 Análise IA:` (resposta da função)
   - `⏱️ Timeout...` (se demorar)
   - `✅ Login Auth OK` (sucesso)

---

## ⚠️ Problemas Comuns

### Erro: "Função não encontrada" (404)

**Causa:** Deploy não compilou a função

**Solução:**
1. Verificar logs de build no Netlify
2. Confirmar que existe `netlify/functions/ai-approval.ts`
3. Força rebuild: Site settings > Build & deploy > Trigger deploy > Clear cache and deploy

### Erro: "GEMINI_API_KEY não configurada"

**Causa:** Variável não está no Netlify

**Solução:**
1. Adicionar `GEMINI_API_KEY` nas variáveis de ambiente
2. **NÃO usar** `VITE_` no nome
3. Fazer redeploy

### Ainda trava no iPhone

**Verificar:**
1. Versão do Safari está atualizada?
2. Modo privado está desabilitado?
3. Bloqueadores de conteúdo estão desabilitados?

**Debug:**
1. Conectar iPhone via USB
2. Safari DevTools > Console
3. Verificar se a chamada para `/.netlify/functions/ai-approval` aparece
4. Ver se há erros de rede

### Texto ainda cortado

**Verificar:**
1. Deploy foi concluído? (check CSS em `src/index.css`)
2. Cache do navegador: fazer hard refresh (Cmd+Shift+R)
3. Testar em modo anônimo

---

## 📚 Documentação Adicional

- [netlify/functions/README.md](./netlify/functions/README.md) - Guia completo das functions
- [STACK_TECNOLOGICO.md](./STACK_TECNOLOGICO.md) - Stack do projeto
- [GUIA_DEPLOY.md](./GUIA_DEPLOY.md) - Deploy geral

---

## 🎯 Checklist Final

Antes de considerar resolvido:

- [ ] Deploy concluído no Netlify
- [ ] Variável `GEMINI_API_KEY` configurada
- [ ] Função `ai-approval` aparece em Functions
- [ ] Cadastro de apoiadora funciona no iPhone (não trava)
- [ ] Login de apoiadora funciona no iPhone (não trava)
- [ ] Texto não está cortado na interface (iPhone Safari)
- [ ] Perfil de vítima continua funcionando normalmente
- [ ] Desktop/Android continuam funcionando normalmente

---

## 💡 Próximas Melhorias (Opcional)

Se quiser otimizar ainda mais:

1. **Edge Functions:** Migrar para Netlify Edge Functions (mais rápido)
2. **Caching:** Cachear respostas do Gemini por 5min (redis)
3. **Retry:** Implementar retry automático com backoff
4. **Analytics:** Adicionar telemetria (Posthog, Mixpanel)
5. **A/B Test:** Testar diferentes prompts para a IA

---

**Dúvidas?** Consulte os logs do Netlify ou abra uma issue.
