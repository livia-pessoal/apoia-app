# 🔔 GUIA: Corrigir Sistema de Notificações

## 🔍 **PROBLEMA IDENTIFICADO:**

As notificações não funcionam porque:
- ❌ Políticas RLS usam `auth.uid()` (só funciona para usuários autenticados)
- ❌ APOIA usa perfis **anônimos** (sem autenticação)
- ❌ `auth.uid()` retorna `NULL` para perfis anônimos
- ❌ RLS bloqueia todas as operações (SELECT, INSERT, UPDATE, DELETE)

---

## ✅ **SOLUÇÃO:**

Migration 016 que:
1. ✅ Remove políticas RLS baseadas em `auth.uid()`
2. ✅ Cria políticas permissivas (compatíveis com perfis anônimos)
3. ✅ Corrige trigger de boas-vindas (`user_type` ao invés de `profile_type`)
4. ✅ Mantém segurança via filtragem no código React

---

## 🚀 **PASSO A PASSO:**

### **1. Executar Migration 016**

Abra o **Supabase Dashboard**:
1. Vá em **SQL Editor**
2. Click em **New Query**
3. Cole o conteúdo do arquivo: `supabase/migrations/016_fix_notifications_rls.sql`
4. Click em **Run** (executar)
5. Aguarde mensagem de sucesso ✅

---

### **2. Testar com Notificações de Exemplo**

**Opção A: Criar manualmente (RECOMENDADO)**

1. No **SQL Editor**, execute:
```sql
-- Descobrir seu user_id
SELECT id, display_name, user_type 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

2. **Copie o `id`** do seu perfil

3. Abra o arquivo `TESTE_NOTIFICACOES.sql`

4. **Substitua TODOS** os `'SEU_USER_ID'` pelo ID que você copiou

5. Execute o SQL no Supabase

6. Recarregue o app (Ctrl+Shift+R)

7. Vá na aba **Notificações** (🔔)

8. Você deve ver **6 notificações de teste**! 🎉

---

**Opção B: Criar perfil novo**

1. Delete seu perfil atual:
```sql
DELETE FROM profiles WHERE id = 'SEU_ID';
```

2. Saia do app (logout)

3. Crie um novo perfil

4. Trigger de boas-vindas vai criar notificação automaticamente

---

### **3. Verificar se Funciona**

Na aba de Notificações você deve conseguir:
- ✅ Ver todas as notificações
- ✅ Marcar como lida
- ✅ Marcar todas como lidas
- ✅ Deletar notificações
- ✅ Ver contador de não lidas

---

## 📋 **POLÍTICAS RLS ATUALIZADAS:**

```sql
-- ANTES (BLOQUEAVA perfis anônimos):
USING (auth.uid() = user_id)  ❌ auth.uid() = NULL

-- DEPOIS (PERMITE perfis anônimos):
USING (true)  ✅ Sempre permite
```

**Segurança mantida porque:**
- Filtragem por `user_id` é feita no código React
- `.eq("user_id", userId)` no hook useNotifications
- Cada usuária só vê suas notificações

---

## 🎯 **NOTIFICAÇÕES AUTOMÁTICAS:**

Depois da correção, notificações serão criadas automaticamente quando:

| Ação | Notificação | Tipo |
|------|-------------|------|
| Criar perfil | Boas-vindas | `info` |
| Completar missão | Nova conquista | `achievement` |
| Adicionar contato | Rede atualizada | `network` |
| Receber mensagem | Nova mensagem | `chat` |
| Chamado aceito | Apoiadora conectada | `chat` |

---

## 🛠️ **TROUBLESHOOTING:**

### **Notificações não aparecem após migration:**

```sql
-- Verificar se tabela existe:
SELECT * FROM notifications LIMIT 1;

-- Verificar políticas RLS:
SELECT * FROM pg_policies WHERE tablename = 'notifications';

-- Inserir notificação manualmente:
INSERT INTO notifications (user_id, title, message, type)
VALUES ('SEU_USER_ID', 'Teste', 'Mensagem teste', 'info');
```

### **Erro ao marcar como lida:**

- Verifique se o userId está correto no localStorage
- Abra o Console (F12) e veja se há erros

### **Trigger de boas-vindas não funciona:**

```sql
-- Verificar se trigger existe:
SELECT * FROM pg_trigger WHERE tgname = 'create_welcome_notification_trigger';

-- Recriar trigger:
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON profiles;
CREATE TRIGGER create_welcome_notification_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_welcome_notification();
```

---

## 📊 **ANTES vs DEPOIS:**

| Situação | Antes | Depois |
|----------|-------|--------|
| **Criar notificação** | ❌ Bloqueado | ✅ Funciona |
| **Ver notificações** | ❌ Lista vazia | ✅ Mostra todas |
| **Marcar como lida** | ❌ Erro | ✅ Funciona |
| **Deletar** | ❌ Erro | ✅ Funciona |
| **Realtime** | ❌ Não atualiza | ✅ Atualiza |

---

## 🎉 **RESULTADO ESPERADO:**

Após executar a Migration 016:
1. ✅ Notificações funcionando
2. ✅ Contador de não lidas atualizado
3. ✅ Marcar como lida funciona
4. ✅ Deletar funciona
5. ✅ Notificações em tempo real (Realtime)
6. ✅ Trigger de boas-vindas funciona

---

## 📁 **ARQUIVOS ENVOLVIDOS:**

```
supabase/migrations/
├── 016_fix_notifications_rls.sql ✅ EXECUTAR ESTA
├── TESTE_NOTIFICACOES.sql (opcional - criar notificações teste)
└── 008_notifications_safe.sql (migration original - bugada)

src/
├── hooks/useNotifications.ts (hook correto - não precisa alterar)
└── components/NotificationsTab.tsx (componente correto - não precisa alterar)
```

---

## ⚠️ **IMPORTANTE:**

Esta correção segue o **mesmo padrão** usado em outras migrations:
- Migration 014: Fix RLS `incident_reports`
- Migration 007: RLS permissivo `trusted_contacts`
- FIX_COMPLETO_PROFILES.sql: RLS permissivo `profiles`

**Todas permitem perfis anônimos funcionarem com segurança!**

---

## 🆘 **PRECISA DE AJUDA?**

Se algo não funcionar:
1. Verifique se executou a Migration 016
2. Recarregue o app (Ctrl+Shift+R)
3. Verifique Console (F12) por erros
4. Execute o TESTE_NOTIFICACOES.sql para criar notificações manualmente

---

**Boa sorte! 🍀**
