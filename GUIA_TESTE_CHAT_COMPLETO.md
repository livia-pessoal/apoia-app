# 💬 Guia de Teste - Chat Anônimo Completo

**Sistema de chat em tempo real entre vítimas e apoiadoras**

---

## 🎯 O Que Foi Implementado

### ✅ Componentes Criados

1. **SupporterDashboard.tsx** (~280 linhas)
   - Dashboard exclusivo para apoiadoras
   - Lista de chamados aguardando
   - Lista de conversas ativas
   - Estatísticas em tempo real
   - Botão "Aceitar Chamado"
   - Integração com AnonymousChat

2. **AnonymousChat.tsx** (Atualizado)
   - Prop `roomId` opcional
   - Função `loadSpecificRoom()`
   - Suporta vítimas E apoiadoras
   - Chat bidirecional funcional

3. **Index.tsx** (Integração)
   - Import SupporterDashboard
   - Substituiu view estática de apoiadoras
   - Dashboard dinâmico com dados reais

---

## 🔄 Fluxo Completo do Chat

### 1️⃣ Vítima Solicita Apoio

```
Vítima → Tab "Emergency" → Click "Chat Anônimo" 
→ Click "Iniciar Chat Anônimo"
→ Sistema cria chat_room (status: waiting)
→ Mensagem automática enviada
→ Tela mostra "Aguardando apoiadora..."
```

### 2️⃣ Apoiadora Recebe Notificação

```
Apoiadora → Tab "Emergency" 
→ Vê "SupporterDashboard"
→ Card aparece em "Chamados Aguardando"
→ Mostra tempo ("há X minutos")
→ Badge "URGENTE"
```

### 3️⃣ Apoiadora Aceita Chamado

```
Apoiadora → Click "Aceitar Chamado"
→ Sistema atualiza: supporter_id + status: active
→ Mensagem de sistema enviada
→ Chat abre automaticamente
```

### 4️⃣ Chat Ativo

```
Ambas → Veem mensagens em tempo real
→ Podem enviar/receber mensagens
→ Realtime subscription ativa
→ Status "Online" visível
```

### 5️⃣ Encerramento

```
Qualquer uma → Click "Encerrar Conversa"
→ Status muda para "closed"
→ Chat fecha
→ Apoiadora pode aceitar novo chamado
```

---

## 🧪 Como Testar (Passo a Passo)

### Pré-requisitos

✅ Migrations 005 e 006 executadas  
✅ Projeto rodando (`npm run dev`)  
✅ 2 navegadores diferentes OU 1 normal + 1 anônimo  

---

### Teste 1: Criar Usuária (Vítima)

1. **Navegador 1 (Chrome normal)**
2. Acesse `http://localhost:8080`
3. Digite senha: **1904**
4. Click **"Preciso de Apoio"** (User)
5. Cadastro rápido:
   - Display Name: `Maria`
   - Click "Entrar Anonimamente"
6. ✅ **Logada como Vítima**

---

### Teste 2: Criar Apoiadora

1. **Navegador 2 (Firefox ou Chrome Anônimo)**
2. Acesse `http://localhost:8080`
3. Digite senha: **1904**
4. Click **"Quero Apoiar"** (Supporter)
5. Cadastro completo:
   - Nome: `Ana Apoiadora`
   - Email: `ana@teste.com`
   - Senha: `senha123`
   - Motivação: `Quero ajudar mulheres em situação de vulnerabilidade`
   - Click "Cadastrar"
6. Aguarde análise da IA (~3 segundos)
7. ✅ **Logada como Apoiadora**

---

### Teste 3: Vítima Inicia Chat

**No Navegador 1 (Vítima):**

1. Vá para tab **"Recursos de Emergência"** (🛡️)
2. Click no card **"Chat Anônimo"**
3. Modal abre
4. Click **"Iniciar Chat Anônimo"**
5. ✅ Aparece: **"Aguardando apoiadora..."**
6. Veja o card de "aguardando" com ícone de usuário

---

### Teste 4: Apoiadora Vê Chamado

**No Navegador 2 (Apoiadora):**

1. Vá para tab **"Recursos de Emergência"** (🛡️)
2. ✅ Veja **"SupporterDashboard"**
3. ✅ Veja estatísticas:
   - "1" em Aguardando (laranja)
   - "0" em Ativos (verde)
4. ✅ Veja card do chamado:
   - "Anônima"
   - "há X segundos"
   - Badge "URGENTE"
   - Botão "Aceitar Chamado"

---

### Teste 5: Apoiadora Aceita

**No Navegador 2 (Apoiadora):**

1. Click **"Aceitar Chamado"**
2. ✅ Toast: "Chamado aceito! Iniciando conversa..."
3. ✅ Chat abre automaticamente
4. ✅ Veja mensagens:
   - Mensagem da vítima
   - Mensagem de sistema: "Olá! Sou uma apoiadora..."

---

### Teste 6: Chat em Tempo Real

**No Navegador 1 (Vítima):**

1. O status muda de "Aguardando" para **"Conversa ativa"**
2. ✅ Badge "Online" aparece
3. ✅ Veja mensagem da apoiadora
4. Digite: `Obrigada por aceitar!`
5. Click Enviar (ou Enter)

**No Navegador 2 (Apoiadora):**

1. ✅ Mensagem aparece **INSTANTANEAMENTE**
2. Digite: `De nada! Estou aqui para te ajudar. Como posso ajudar?`
3. Click Enviar

**No Navegador 1 (Vítima):**

1. ✅ Mensagem aparece **INSTANTANEAMENTE**

---

### Teste 7: Múltiplas Mensagens

Troque mensagens entre ambas:

```
Vítima: "Estou passando por uma situação difícil"
Apoiadora: "Sinto muito. Pode me contar?"
Vítima: "Meu marido tem sido agressivo verbalmente"
Apoiadora: "Você está segura agora?"
```

✅ **Todas aparecem em tempo real**  
✅ **Scroll automático para última mensagem**  
✅ **Horário exibido em cada mensagem**  

---

### Teste 8: Fechar e Reabrir

**No Navegador 1 (Vítima):**

1. Click "X" para fechar modal do chat
2. Vá para outra tab (ex: Home)
3. Volte para tab "Emergency"
4. Click "Chat Anônimo" novamente
5. ✅ Chat reabre com **histórico completo**
6. ✅ Status continua "active"

**No Navegador 2 (Apoiadora):**

1. Feche o chat (X)
2. ✅ Chamado move para "Conversas Ativas"
3. Click "Continuar"
4. ✅ Chat reabre com **histórico completo**

---

### Teste 9: Encerrar Conversa

**Em qualquer navegador:**

1. No chat aberto, click **"Encerrar Conversa"**
2. ✅ Toast: "Chat encerrado"
3. ✅ Modal fecha
4. ✅ Chat some das listas

---

### Teste 10: Múltiplos Chamados

**Criar 2ª Vítima:**

1. Abra **Navegador 3** (ou aba anônima)
2. Cadastre como User: `Julia`
3. Inicie Chat Anônimo

**No Dashboard da Apoiadora:**

1. ✅ Veja **2 chamados aguardando**
2. Estatística mostra "2"
3. Dois cards aparecem
4. Pode aceitar qualquer um
5. Ao aceitar, move para "Conversas Ativas"

---

## 🔍 Checklist de Validação

### Funcionalidades Básicas

- [ ] Vítima consegue iniciar chat
- [ ] Status "waiting" aparece corretamente
- [ ] Apoiadora vê chamados no dashboard
- [ ] Apoiadora consegue aceitar chamado
- [ ] Chat abre automaticamente após aceitar
- [ ] Mensagens enviadas aparecem
- [ ] Mensagens recebidas aparecem em tempo real
- [ ] Scroll automático funciona
- [ ] Horários aparecem corretamente

### Dashboard de Apoiadoras

- [ ] Estatísticas mostram números corretos
- [ ] Chamados aguardando aparecem
- [ ] Tempo relativo ("há X minutos") atualiza
- [ ] Card tem botão "Aceitar"
- [ ] Após aceitar, move para "Ativos"
- [ ] Conversas ativas aparecem
- [ ] Click em "Continuar" abre chat correto

### Chat em Tempo Real

- [ ] Mensagens aparecem instantaneamente
- [ ] Ambos os lados funcionam (bidirecional)
- [ ] Mensagens de sistema aparecem
- [ ] Input limpa após enviar
- [ ] Badge "Online" aparece quando ativo
- [ ] Pode fechar e reabrir sem perder mensagens
- [ ] Histórico persiste no banco

### Encerramento

- [ ] Botão "Encerrar Conversa" funciona
- [ ] Status muda para "closed"
- [ ] Chat some das listas
- [ ] Ambas podem encerrar

### Múltiplos Chamados

- [ ] Apoiadora vê múltiplos chamados
- [ ] Pode ter múltiplas conversas ativas
- [ ] Cada chat mantém contexto separado
- [ ] Estatísticas atualizam corretamente

---

## 📊 Verificação no Banco

### Ver salas criadas

```sql
SELECT 
  id,
  victim_display_name,
  status,
  supporter_id,
  created_at
FROM chat_rooms
ORDER BY created_at DESC;
```

### Ver mensagens

```sql
SELECT 
  room_id,
  sender_type,
  message,
  created_at
FROM chat_messages
ORDER BY created_at DESC;
```

### Estatísticas

```sql
-- Salas por status
SELECT status, COUNT(*) 
FROM chat_rooms 
GROUP BY status;

-- Total de mensagens
SELECT COUNT(*) FROM chat_messages;
```

---

## 🐛 Problemas Comuns

### Problema 1: Dashboard não aparece

**Sintoma:** Apoiadora não vê chamados

**Causas:**
- Migration 006 não executada
- RLS bloqueando queries
- Perfil não é "supporter"

**Solução:**
```sql
-- Verificar perfil
SELECT id, user_type FROM profiles 
WHERE display_name = 'Ana Apoiadora';

-- Deve retornar user_type = 'supporter'
```

---

### Problema 2: Chamado não aparece

**Sintoma:** Vítima cria chat mas apoiadora não vê

**Solução:**
1. Recarregar página da apoiadora (F5)
2. Verificar no banco:
```sql
SELECT * FROM chat_rooms WHERE status = 'waiting';
```
3. Se aparecer no banco mas não na UI, problema é RLS ou subscription

---

### Problema 3: Não consegue aceitar

**Sintoma:** Erro ao clicar "Aceitar Chamado"

**Causas:**
- Outra apoiadora já aceitou
- Problema de RLS

**Solução:**
- Verificar status da sala no banco
- Se já está "active", foi aceita
- Recarregar lista de chamados

---

### Problema 4: Mensagens não aparecem

**Sintoma:** Envia mas a outra não recebe

**Causas:**
- Subscription não funcionando
- Erro de RLS

**Solução:**
1. Abrir console (F12) nos dois navegadores
2. Procurar erros
3. Verificar no banco:
```sql
SELECT * FROM chat_messages 
WHERE room_id = 'COLE_ID_AQUI'
ORDER BY created_at;
```
4. Se mensagem está no banco mas não aparece = problema de Realtime

---

### Problema 5: Realtime não funciona

**Sintoma:** Precisa recarregar para ver mensagens

**Solução:**
1. Verificar se Supabase Realtime está ativo no projeto
2. No Supabase Dashboard → Settings → API
3. Verificar se "Realtime" está enabled
4. Ativar Realtime para tabela:
```sql
-- Ativar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
```

---

## ✅ Critérios de Sucesso

O teste está **APROVADO** se:

- ✅ Vítima consegue criar chat
- ✅ Apoiadora vê no dashboard
- ✅ Apoiadora aceita com sucesso
- ✅ Chat abre para ambas
- ✅ Mensagens aparecem em tempo real
- ✅ Histórico persiste
- ✅ Encerramento funciona
- ✅ Múltiplos chamados funcionam

---

## 🎉 Próximos Passos

Após aprovar os testes:

### Melhorias Sugeridas

1. **Notificações Push**
   - Notificar apoiadora quando chega novo chamado
   - Som de alerta

2. **Indicador de Digitação**
   - Mostrar "...está digitando"

3. **Histórico de Conversas**
   - Tab "Histórico" para ver chats encerrados

4. **Sistema de Fila**
   - Se todas apoiadoras estão ocupadas
   - Fila automática de espera

5. **Rating/Feedback**
   - Vítima avaliar apoio recebido
   - Apoiadora relatar experiência

---

**Desenvolvido para o projeto APOIA**  
_Última atualização: 19/10/2025_  
_Versão: 2.0.0 - Chat Completo_
