# 🐛 Debug - Notificações Não Aparecem

## Checklist Completo

### 1. Verificar Banco de Dados ✅

```sql
-- Notificações existem?
SELECT COUNT(*) as total FROM notifications;

-- Notificações do seu usuário?
SELECT * FROM notifications WHERE user_id = auth.uid();

-- Seu user_id
SELECT id, display_name, profile_type FROM profiles WHERE id = auth.uid();
```

**Resultados:**
- Total de notificações: `______`
- Suas notificações: `______`
- Seu user_id: `______`

---

### 2. Verificar localStorage

**No console do navegador (F12):**

```javascript
// Verificar dados do localStorage
console.log("Profile ID:", localStorage.getItem("profile_id"));
console.log("User Profile:", localStorage.getItem("userProfile"));
console.log("Display Name:", localStorage.getItem("display_name"));
```

**Resultados:**
- Profile ID: `______`
- User Profile: `______`
- Display Name: `______`

---

### 3. Verificar Erros no Console

**Pressione F12 → Console**

**Erros vermelhos?**
- [ ] Sim - Anotar erro: `______________________________`
- [ ] Não

**Warnings amarelos sobre notificações?**
- [ ] Sim - Anotar: `______________________________`
- [ ] Não

---

### 4. Verificar Hook useNotifications

**No console (F12), adicionar log temporário:**

Adicione isso temporariamente no `useNotifications.ts` linha ~25:

```typescript
useEffect(() => {
  console.log("🔔 useNotifications - userId:", userId);
  if (!userId) {
    console.log("❌ Sem userId, não vai carregar notificações");
    setLoading(false);
    return;
  }
  console.log("✅ Carregando notificações...");
  loadNotifications();
  subscribeToNotifications();
}, [userId]);
```

**O que aparece no console?**
- [ ] 🔔 useNotifications - userId: `______`
- [ ] ❌ Sem userId
- [ ] ✅ Carregando notificações

---

### 5. Verificar Componente NotificationsTab

**No console (F12), verificar:**

```javascript
// Ver props do componente
// (se NotificationsTab estiver renderizado)
```

**Badge no Bell aparece?**
- [ ] Sim, mas vazio
- [ ] Sim, com número `______`
- [ ] Não aparece

---

### 6. Testar Criação Manual

**No Supabase SQL Editor:**

```sql
-- Deletar notificações antigas (CUIDADO!)
DELETE FROM notifications WHERE user_id = auth.uid();

-- Criar notificação nova
INSERT INTO notifications (user_id, title, message, type)
VALUES (
  auth.uid(),
  'TESTE MANUAL 🚀',
  'Se você vê isso, funciona!',
  'alert'
);

-- Confirmar
SELECT * FROM notifications WHERE user_id = auth.uid();
```

**Depois:**
1. Voltar no app
2. **Ctrl+Shift+R** (hard reload)
3. Click Bell 🔔

**Resultado:**
- [ ] Apareceu!
- [ ] Não apareceu

---

### 7. Verificar RLS (Row Level Security)

**No Supabase SQL Editor:**

```sql
-- Ver políticas ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'notifications';
```

**Deve retornar 3 políticas:**
1. Usuários podem ver suas notificações (SELECT)
2. Usuários podem atualizar suas notificações (UPDATE)
3. Sistema pode criar notificações (INSERT)

**Todas aparecem?**
- [ ] Sim, 3 políticas
- [ ] Não, menos políticas
- [ ] Erro

---

### 8. Verificar Realtime

**No console (F12):**

```javascript
// Ver subscriptions ativas do Supabase
// (Supabase deve mostrar algo como "channels: 1")
```

**Subscription aparece?**
- [ ] Sim
- [ ] Não

---

## 🔧 Soluções Rápidas

### Solução 1: Recriar Notificação de Boas-Vindas

```sql
-- Deletar notificação de boas-vindas antiga
DELETE FROM notifications 
WHERE user_id = auth.uid() 
  AND metadata->>'is_welcome' = 'true';

-- Criar nova
INSERT INTO notifications (user_id, title, message, type, metadata)
VALUES (
  auth.uid(),
  'Bem-vinda ao APOIA! 💜',
  'Sistema de notificações está funcionando!',
  'info',
  '{"is_welcome": true}'::jsonb
);
```

### Solução 2: Forçar Reload do Hook

**Adicionar no Index.tsx:**

```typescript
// Após const { unreadCount } = useNotifications(profileId);
useEffect(() => {
  console.log("📊 Unread Count:", unreadCount);
}, [unreadCount]);
```

### Solução 3: Verificar Import

**No Index.tsx, confirmar:**

```typescript
import { useNotifications } from "@/hooks/useNotifications";

// ...

const profileId = localStorage.getItem("profile_id");
const { unreadCount } = useNotifications(profileId);
```

---

## 📋 Checklist Final

Marque o que JÁ testou:

- [ ] Migration executada com sucesso
- [ ] Tabela notifications existe
- [ ] Notificações existem no banco
- [ ] Profile ID existe no localStorage
- [ ] App foi recarregado (Ctrl+Shift+R)
- [ ] Console não tem erros
- [ ] Hook useNotifications importado
- [ ] Badge do Bell aparece no código
- [ ] RLS tem 3 políticas ativas
- [ ] Criou notificação manual de teste

---

## ❓ Perguntas para Debug

**Me responda:**

1. **Quantas notificações existem no banco?**
   - `SELECT COUNT(*) FROM notifications;`

2. **Seu profile_id no localStorage é o mesmo do banco?**
   - localStorage: `______`
   - Banco: `______`

3. **Console tem algum erro vermelho?**
   - Sim: `______`
   - Não

4. **Badge aparece no ícone Bell?**
   - Sim, mas sem número
   - Sim, com número
   - Não aparece

5. **Quando click no Bell, o que aparece?**
   - Lista vazia
   - Erro
   - Loading infinito
   - Nada acontece

---

## 🚀 Próximo Passo

Com suas respostas, vou identificar o problema exato! 💜
