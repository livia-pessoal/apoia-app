# ✅ ETAPA 1: PREPARAÇÃO PARA DEPLOY

## 🎯 **VOCÊ ESTÁ AQUI - PRIMEIRA ETAPA**

Esta é a **primeira de 6 etapas** para colocar seu app no ar!

---

## 📋 **TAREFAS DESTA ETAPA**

### **✅ 1. Criar arquivo .env**

**Por quê?** Guardar credenciais do Supabase localmente

**Como fazer:**

1. Na **raiz do projeto**, crie um arquivo chamado `.env`
2. Copie este modelo:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Onde encontrar essas credenciais?**
   - Abra: https://supabase.com/dashboard
   - Selecione seu projeto
   - **Settings** → **API**
   - Copie:
     - **Project URL** → `VITE_SUPABASE_URL`
     - **anon public** → `VITE_SUPABASE_ANON_KEY`

4. **Cole as credenciais** no arquivo `.env`

**⚠️ IMPORTANTE:** Este arquivo NÃO vai para o GitHub (já está protegido)

---

### **✅ 2. Testar Build Local**

**Por quê?** Garantir que o app compila sem erros

**Como fazer:**

```bash
# 1. Abrir terminal na pasta do projeto
cd c:\Users\livia\Downloads\s-dream-weave-main\s-dream-weave-main

# 2. Instalar dependências (se ainda não fez)
npm install

# 3. Criar build de produção
npm run build

# 4. Testar o build
npm run preview
```

**Resultado esperado:**
```
✓ built in XXXms
  ➜  Local:   http://localhost:4173/
```

**Testar:**
1. Abra http://localhost:4173/
2. Veja se a calculadora aparece
3. Digite `1904` e Enter
4. Veja se o app carrega
5. Teste login/logout

**Se funcionar:** ✅ Pronto para próxima etapa!  
**Se der erro:** Veja mensagem de erro e corrija

---

### **✅ 3. Verificar Arquivos Importantes**

Confirme que estes arquivos existem:

- [ ] `.gitignore` (já existe ✅)
- [ ] `.env.example` (já existe ✅)
- [ ] `.env` (você criou agora ✅)
- [ ] `netlify.toml` (acabei de criar ✅)
- [ ] `package.json` (já existe ✅)

---

## 🎯 **CHECKLIST DE CONCLUSÃO**

Marque quando completar:

- [ ] Arquivo `.env` criado com credenciais corretas
- [ ] Build local funcionou (`npm run build`)
- [ ] Preview local funcionou (`npm run preview`)
- [ ] App testado e funcionando
- [ ] Todos os 5 arquivos importantes existem

**Tudo marcado?** ✅ Vá para **ETAPA 2**!

---

## 🆘 **PROBLEMAS COMUNS**

### **Erro: "VITE_SUPABASE_URL is not defined"**

- Certifique-se que o arquivo `.env` existe na raiz
- Verifique se as variáveis começam com `VITE_`
- Reinicie o terminal e rode `npm run build` novamente

### **Build falhou com erro de TypeScript**

```bash
# Tentar build sem verificação de tipos
npm run build -- --mode production
```

### **Preview não abre**

- Verifique se a porta 4173 está livre
- Tente outra porta: `npm run preview -- --port 5000`

---

## ⏭️ **PRÓXIMA ETAPA**

Após completar esta etapa:

👉 **ETAPA 2: Subir código para GitHub**

Veja o guia completo em: `GUIA_DEPLOY.md`

---

## 💡 **DICA**

Mantenha o terminal aberto com `npm run preview` rodando enquanto testa!

---

**Tempo estimado desta etapa:** 5-10 minutos  
**Próxima etapa:** 5 minutos  
**Total até o ar:** ~20 minutos
