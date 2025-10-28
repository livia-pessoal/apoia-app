# Netlify Functions - APOIA

## 📁 Estrutura

```
netlify/
└── functions/
    ├── ai-approval.ts    # Análise de cadastro de apoiadoras com Gemini AI
    └── README.md         # Este arquivo
```

---

## 🚀 Como funciona

### Função: `ai-approval.ts`

**Endpoint:** `/.netlify/functions/ai-approval`

**Método:** POST

**Payload:**
```json
{
  "displayName": "Maria Silva",
  "email": "maria@example.com",
  "phone": "(11) 98765-4321",
  "motivation": "Sou psicóloga e quero ajudar...",
  "causes": "Saúde mental, violência doméstica..."
}
```

**Resposta:**
```json
{
  "decision": "APPROVE" | "REVIEW" | "REJECT",
  "reason": "Motivo da decisão"
}
```

**Por que usar função serverless?**
- ✅ Evita expor a chave da API Gemini no cliente
- ✅ Resolve problemas de CORS/ITP no Safari iOS
- ✅ Permite timeout robusto (15s configurado no cliente)
- ✅ Fallback automático para REVIEW em caso de erro

---

## ⚙️ Configuração no Netlify

### 1. Variável de Ambiente

No painel do Netlify:

1. Vá em **Site settings** > **Environment variables**
2. Adicione a variável:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Sua chave da API Gemini (obtenha em https://aistudio.google.com/apikey)
3. Salve

**Importante:** Não use o prefixo `VITE_` aqui, pois esta chave é usada no backend (função serverless).

### 2. Deploy

O deploy é automático:

```bash
git add .
git commit -m "feat: adicionar função serverless para análise IA"
git push origin main
```

O Netlify detecta automaticamente a pasta `netlify/functions/` e faz o build.

---

## 🧪 Testar localmente

### 1. Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Criar arquivo `.env` local

```bash
# .env (na raiz do projeto)
GEMINI_API_KEY=sua-chave-aqui
```

### 3. Rodar dev com functions

```bash
netlify dev
```

Acesse: `http://localhost:8888/.netlify/functions/ai-approval`

### 4. Testar com curl

```bash
curl -X POST http://localhost:8888/.netlify/functions/ai-approval \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Maria Silva",
    "email": "maria@example.com",
    "phone": "(11) 98765-4321",
    "motivation": "Sou psicóloga e quero ajudar mulheres vítimas de violência.",
    "causes": "Saúde mental feminina, combate à violência doméstica"
  }'
```

---

## 🔍 Logs e Monitoramento

### No Netlify

1. Vá em **Functions** no menu lateral
2. Clique em `ai-approval`
3. Veja logs em tempo real

### Localmente

Logs aparecem no terminal onde rodou `netlify dev`:

```
🤖 Resposta Gemini: DECISÃO: APPROVE...
```

---

## 🛠️ Troubleshooting

### Erro: "GEMINI_API_KEY não configurada"

**Causa:** Variável de ambiente não está no Netlify

**Solução:**
1. Adicione `GEMINI_API_KEY` nas variáveis de ambiente do Netlify
2. Faça um novo deploy (ou force rebuild)

### Erro: "Cannot find module '@netlify/functions'"

**Causa:** Dependência não instalada

**Solução:**
```bash
npm install --save-dev @netlify/functions
```

### Erro: "Timeout" no cliente

**Causa:** Função está demorando mais de 15s (limite do cliente)

**Solução:** A função já tem timeout interno de 8s na IA e retorna REVIEW como fallback. Se persistir, aumente o timeout do cliente em `Register.tsx` (linha 76).

### Erro: 500 no endpoint

**Causa:** Erro na função (veja logs no Netlify)

**Soluções comuns:**
- Verificar se `GEMINI_API_KEY` está válida
- Verificar logs detalhados no Netlify Dashboard
- Testar localmente com `netlify dev`

---

## 📝 Adicionar novas funções

1. Criar arquivo `.ts` nesta pasta
2. Exportar handler:

```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello' })
  };
};
```

3. Deploy automático

Endpoint: `/.netlify/functions/nome-do-arquivo`

---

## 📚 Documentação

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [TypeScript no Netlify](https://docs.netlify.com/functions/create/?fn-language=ts)
