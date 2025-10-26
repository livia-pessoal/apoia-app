# 🔔 Guia - Sistema de Notificações

**Sistema completo de notificações em tempo real**

---

## 🎯 O Que Foi Implementado

### ✅ Funcionalidades Completas

**1. Tabela de Notificações (Migration 008)**
- Armazena todas notificações
- Tipos: missão, chat, rede, alerta, conquista, info
- Status: lida/não lida
- Metadata flexível (JSON)
- Ações customizadas

**2. Hook useNotifications**
- Gerenciamento de estado
- Realtime subscriptions (Supabase)
- Contador de não lidas
- CRUD completo
- Auto-atualização

**3. Componente NotificationsTab**
- Interface completa
- Lista de notificações
- Filtros visuais por tipo
- Marcar como lida
- Deletar notificações
- Tempo relativo

**4. Badge no Ícone Bell**
- Contador de não lidas
- Atualiza em tempo real
- Vermelho chamativo
- Máximo 9+

**5. Notificação de Boas-Vindas**
- Trigger automático
- Criada ao criar perfil
- Diferente para vítima/apoiadora

---

## 📁 Arquivos Criados

### Banco de Dados
- ✅ `supabase/migrations/008_notifications.sql` (~160 linhas)
  - Tabela `notifications`
  - 4 índices de performance
  - 3 políticas RLS
  - 3 funções auxiliares
  - Trigger de boas-vindas

### Frontend
- ✅ `src/hooks/useNotifications.ts` (~210 linhas)
- ✅ `src/components/NotificationsTab.tsx` (~220 linhas)
- ✅ `src/pages/Index.tsx` (modificado)
  - Hook integrado
  - Badge com contador
  - Tab funcional

### Documentação
- ✅ `GUIA_NOTIFICACOES.md` (este arquivo)

---

## 🗄️ Estrutura do Banco

### Tabela: notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  
  -- Conteúdo
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Tipo
  type TEXT CHECK (type IN (
    'mission',      -- Nova missão
    'chat',         -- Chat/chamado
    'network',      -- Rede de apoio
    'alert',        -- Alerta importante
    'achievement',  -- Conquista
    'info'          -- Informação geral
  )),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Extras
  metadata JSONB DEFAULT '{}'::jsonb,
  action_url TEXT,
  action_label TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Funções Disponíveis

**1. mark_notification_as_read(notification_id)**
```sql
SELECT mark_notification_as_read('uuid-aqui');
```

**2. mark_all_notifications_as_read(user_id)**
```sql
SELECT mark_all_notifications_as_read('user-uuid-aqui');
```

**3. cleanup_old_notifications()**
```sql
SELECT cleanup_old_notifications();
-- Remove: lidas >30 dias, não lidas >90 dias
```

---

## 💻 Como Usar no Código

### Hook useNotifications

```typescript
import { useNotifications } from "@/hooks/useNotifications";

// No componente
const { 
  notifications,      // Array de notificações
  unreadCount,        // Contador de não lidas
  loading,            // Estado de carregamento
  markAsRead,         // Marcar uma como lida
  markAllAsRead,      // Marcar todas como lidas
  deleteNotification, // Deletar uma notificação
  createNotification  // Criar nova notificação
} = useNotifications(userId);

// Marcar como lida
await markAsRead(notificationId);

// Marcar todas como lidas
await markAllAsRead();

// Deletar
await deleteNotification(notificationId);

// Criar nova
await createNotification(
  "Título",
  "Mensagem",
  "mission", // tipo
  { missionId: "123" }, // metadata
  "/missions", // action_url
  "Ver Missão" // action_label
);
```

### Criar Notificação Direto no Supabase

```typescript
import { supabase } from "@/lib/supabase";

const { error } = await supabase
  .from("notifications")
  .insert({
    user_id: userId,
    title: "Nova Missão Disponível! 🎯",
    message: "A missão 'Lei Maria da Penha' está te esperando.",
    type: "mission",
    metadata: { mission_id: "123", module: "conhecimento" },
    action_url: "/missions",
    action_label: "Ver Missão"
  });
```

---

## 🎨 Visual do Sistema

### Badge no Ícone

```
┌─────────┐
│  🔔(3)  │  ← Badge vermelho com contador
└─────────┘
```

### Interface de Notificações

```
╔════════════════════════════════════════╗
║  🔔 Notificações                       ║
║  Você tem 3 notificações não lidas    ║
║                                        ║
║  [Marcar todas como lidas]            ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ ✨ Nova Missão Disponível!       │ ║
║  │ Missão "Lei Maria da Penha"      │ ║
║  │ há 5 minutos      [✓] [🗑️]      │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ 💬 Chamado Aceito                │ ║
║  │ Uma apoiadora aceitou seu chamado│ ║
║  │ há 10 minutos     [✓] [🗑️]      │ ║
║  └──────────────────────────────────┘ ║
╚════════════════════════════════════════╝
```

---

## 🧪 Como Testar

### Passo 1: Executar Migration

1. Abra Supabase SQL Editor
2. Copie `supabase/migrations/008_notifications.sql`
3. Execute

**Deve retornar:** "Success"

### Passo 2: Recarregar App

```bash
# Recarregue o navegador
F5 ou Ctrl+R
```

### Passo 3: Ver Notificação de Boas-Vindas

1. Faça login como vítima ou apoiadora
2. Click no ícone **🔔 (Bell)**
3. ✅ Deve aparecer notificação de boas-vindas
4. ✅ Badge vermelho com (1) no ícone

### Passo 4: Interagir com Notificação

**Marcar como lida:**
1. Click no ícone ✓ (check)
2. ✅ Notificação fica opaca
3. ✅ Badge atualiza contador

**Deletar:**
1. Click no ícone 🗑️ (lixeira)
2. ✅ Notificação desaparece
3. ✅ Toast: "Notificação removida"

**Marcar todas como lidas:**
1. Click "Marcar todas como lidas"
2. ✅ Todas ficam opacas
3. ✅ Badge desaparece
4. ✅ Toast: "Todas marcadas como lidas"

### Passo 5: Criar Notificação de Teste

**No Supabase SQL Editor:**

```sql
-- Pegue seu user_id
SELECT id FROM profiles WHERE id = auth.uid();

-- Crie notificação de teste
INSERT INTO notifications (user_id, title, message, type)
VALUES (
  'seu-user-id-aqui',
  'Teste de Notificação! 🎉',
  'Esta é uma notificação de teste para validar o sistema.',
  'info'
);
```

**No App:**
1. ✅ Notificação aparece INSTANTANEAMENTE
2. ✅ Badge atualiza
3. ✅ Toast aparece (se tipo for alert/chat)

---

## 🎯 Tipos de Notificações

### 1. Mission (Missão)
- **Ícone:** ✨ (Sparkles) roxo
- **Uso:** Nova missão disponível
- **Exemplo:** "Nova missão: Lei Maria da Penha"

### 2. Chat (Mensagem)
- **Ícone:** 💬 (MessageCircle) azul
- **Uso:** Chamado aceito, nova mensagem
- **Exemplo:** "Uma apoiadora aceitou seu chamado"

### 3. Network (Rede)
- **Ícone:** 👥 (Users) verde
- **Uso:** Contato respondeu SOS
- **Exemplo:** "Maria respondeu seu alerta SOS"

### 4. Alert (Alerta)
- **Ícone:** ⚠️ (AlertTriangle) vermelho
- **Uso:** Alertas importantes do sistema
- **Exemplo:** "Atenção: Atualize suas informações"

### 5. Achievement (Conquista)
- **Ícone:** 🏆 (Award) amarelo
- **Uso:** Conquista desbloqueada
- **Exemplo:** "Parabéns! Você completou 10 missões"

### 6. Info (Informação)
- **Ícone:** ℹ️ (Info) cinza
- **Uso:** Informações gerais
- **Exemplo:** "Bem-vinda ao APOIA!"

---

## 🔔 Realtime: Como Funciona

### Subscription Automática

O hook `useNotifications` cria uma subscription Supabase:

```typescript
supabase
  .channel("notifications")
  .on("INSERT", ...) // Nova notificação
  .on("UPDATE", ...) // Notificação atualizada
  .subscribe();
```

### Atualizações Instantâneas

**Quando nova notificação é criada:**
1. ✅ Aparece na lista IMEDIATAMENTE
2. ✅ Contador incrementa
3. ✅ Toast aparece (se importante)

**Quando notificação é marcada como lida:**
1. ✅ Visual atualiza
2. ✅ Contador decrementa
3. ✅ Sincroniza entre tabs abertas

---

## 🚀 Integrações Futuras

### Chat Anônimo

**Quando apoiadora aceita chamado:**

```typescript
// No SupporterDashboard ao aceitar
await supabase.from("notifications").insert({
  user_id: victimUserId,
  title: "Chamado Aceito! 💜",
  message: "Uma apoiadora aceitou seu chamado e está pronta para conversar.",
  type: "chat",
  metadata: { room_id: roomId },
  action_url: `/chat/${roomId}`,
  action_label: "Abrir Chat"
});
```

### Sistema de Missões

**Quando nova missão é desbloqueada:**

```typescript
await supabase.from("notifications").insert({
  user_id: userId,
  title: "Nova Missão Desbloqueada! ✨",
  message: `A missão "${missionTitle}" está disponível.`,
  type: "mission",
  metadata: { mission_id: missionId },
  action_url: `/missions/${missionId}`,
  action_label: "Começar Missão"
});
```

### Rede de Apoio

**Quando contato responde SOS:**

```typescript
await supabase.from("notifications").insert({
  user_id: userId,
  title: "Contato Respondeu! 🤝",
  message: `${contactName} recebeu seu alerta e está a caminho.`,
  type: "network",
  metadata: { contact_id: contactId, alert_id: alertId }
});
```

---

## 📊 Estatísticas e Limpeza

### Limpeza Automática

**Executar periodicamente (cron job):**

```sql
SELECT cleanup_old_notifications();
```

**Remove:**
- Notificações lidas com >30 dias
- Notificações não lidas com >90 dias

### Estatísticas de Uso

```sql
-- Total de notificações por usuário
SELECT 
  u.display_name,
  COUNT(*) as total_notificacoes,
  COUNT(*) FILTER (WHERE is_read = false) as nao_lidas
FROM notifications n
JOIN profiles u ON n.user_id = u.id
GROUP BY u.id, u.display_name;

-- Notificações por tipo
SELECT 
  type,
  COUNT(*) as quantidade
FROM notifications
GROUP BY type
ORDER BY quantidade DESC;
```

---

## 🐛 Troubleshooting

### Badge não aparece

**Causa:** Hook não está retornando unreadCount

**Solução:**
```typescript
// Verifique se profileId está definido
console.log("Profile ID:", profileId);
console.log("Unread Count:", unreadCount);
```

### Notificações não atualizam em tempo real

**Causa:** Subscription não está funcionando

**Solução:**
1. Verifique Realtime habilitado no Supabase
2. Confirme RLS permite leitura
3. Verifique console para erros

### Trigger de boas-vindas não funciona

**Causa:** Trigger não foi criado

**Solução:**
```sql
-- Execute novamente
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON profiles;
CREATE TRIGGER create_welcome_notification_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_welcome_notification();
```

---

## ✅ Checklist de Validação

### Banco de Dados
- [ ] Migration 008 executada com sucesso
- [ ] Tabela `notifications` criada
- [ ] 4 índices criados
- [ ] 3 políticas RLS ativas
- [ ] Trigger de boas-vindas funcionando

### Frontend
- [ ] Hook useNotifications importado
- [ ] Badge aparece no ícone Bell
- [ ] Contador atualiza em tempo real
- [ ] NotificationsTab renderiza
- [ ] Lista de notificações aparece

### Funcionalidades
- [ ] Criar notificação funciona
- [ ] Marcar como lida funciona
- [ ] Marcar todas como lidas funciona
- [ ] Deletar notificação funciona
- [ ] Realtime subscription funciona
- [ ] Notificação de boas-vindas aparece

---

## 🎉 Resumo Final

### O Que Temos Agora ✅

- ✅ Sistema completo de notificações
- ✅ Badge com contador no Bell
- ✅ Interface linda e funcional
- ✅ Realtime em tempo real
- ✅ 6 tipos de notificações
- ✅ Funções auxiliares no banco
- ✅ Limpeza automática
- ✅ Notificação de boas-vindas
- ✅ RLS seguro

### Próximos Passos 🚀

1. **Testar sistema:**
   - Executar migration
   - Ver notificação de boas-vindas
   - Criar notificações de teste

2. **Integrar com outras features:**
   - Chat → notificar quando aceitar chamado
   - Missões → notificar novas missões
   - Rede → notificar resposta SOS

3. **Melhorias futuras:**
   - Push notifications (web)
   - Email notifications
   - Configurações de preferências
   - Filtros por tipo

---

**Desenvolvido para o projeto APOIA**  
_Última atualização: 19/10/2025_  
_Versão: 1.0.0 - Sistema de Notificações_
