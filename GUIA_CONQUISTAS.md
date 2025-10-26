# 🏆 Sistema de Conquistas - APOIA

Sistema completo de gamificação com badges, pontos e conquistas.

---

## 📦 Arquivos Criados

### 1. Migration
- **`supabase/migrations/010_achievements_system.sql`**
  - Tabelas: `achievements`, `user_achievements`
  - Funções: unlock_achievement, update_achievement_progress, get_user_achievements
  - Triggers automáticos para missões, rede e boas-vindas
  - 16 conquistas pré-cadastradas

### 2. Hook
- **`src/hooks/useAchievements.ts`** (~200 linhas)
  - Gerenciamento de estado
  - Realtime subscription
  - Estatísticas calculadas
  - Métodos de filtro e manipulação

### 3. Componente
- **`src/components/AchievementsTab.tsx`** (~280 linhas)
  - Interface visual completa
  - Cards de conquistas
  - Filtros e agrupamento
  - Estatísticas com gradiente

### 4. Integração
- **`src/pages/Index.tsx`** (modificado)
  - Nova aba 🏆 Conquistas
  - Import do componente
  - Ícone Trophy na navegação

---

## 🎯 Conquistas Disponíveis (16 Total)

### 📚 Missões (6 conquistas)
| Código | Nome | Descrição | Pontos | Meta |
|--------|------|-----------|--------|------|
| `welcome` | 🎉 Bem-vinda | Criou sua conta no APOIA | 10 | 1 |
| `first_mission` | 🎯 Primeira Missão | Complete sua primeira missão | 50 | 1 |
| `apprentice` | 📚 Aprendiz | Complete 5 missões | 100 | 5 |
| `scholar` | 🧠 Estudiosa | Complete 10 missões | 200 | 10 |
| `expert` | 👑 Expert | Complete 20 missões | 500 | 20 |
| `master` | ⭐ Mestre | Complete todas as 50 missões | 1000 | 50 |

### 👥 Rede de Apoio (3 conquistas)
| Código | Nome | Descrição | Pontos | Meta |
|--------|------|-----------|--------|------|
| `first_contact` | 🤝 Primeira Conexão | Adicione 1 contato | 50 | 1 |
| `strong_network` | 💪 Rede Forte | Adicione 5 contatos | 150 | 5 |
| `community` | 🌟 Comunidade | Adicione 10 contatos | 300 | 10 |

### 💬 Chat (2 conquistas)
| Código | Nome | Descrição | Pontos | Meta |
|--------|------|-----------|--------|------|
| `first_chat` | 💬 Primeira Conversa | Use chat 1 vez | 50 | 1 |
| `communicator` | 🗣️ Comunicadora | Use chat 5 vezes | 150 | 5 |

### ⏰ Tempo no App (3 conquistas)
| Código | Nome | Descrição | Pontos | Meta |
|--------|------|-----------|--------|------|
| `week_streak` | 🔥 Primeira Semana | 7 dias no APOIA | 100 | 7 |
| `month_strong` | 💎 Um Mês Forte | 30 dias no APOIA | 500 | 30 |
| `warrior` | 👸 Guerreira | 90 dias no APOIA | 1500 | 90 |

### ⭐ Especiais (2 conquistas)
| Código | Nome | Descrição | Pontos | Meta |
|--------|------|-----------|--------|------|
| `explorer` | 📱 Exploradora | Visitou todas as 5 abas | 50 | 5 |
| `first_sos` | 💪 Coragem | Usou botão SOS 1 vez | 100 | 1 |

**Total de Pontos Disponíveis:** 4.610 pontos

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `achievements`
```sql
- id UUID PRIMARY KEY
- code TEXT UNIQUE          -- Ex: 'first_mission'
- title TEXT                -- Ex: 'Primeira Missão'
- description TEXT          -- Ex: 'Complete sua primeira missão'
- category TEXT             -- mission, network, chat, time, special
- icon TEXT                 -- Emoji: 🎯, 🔥, etc
- color TEXT                -- purple, blue, green, etc
- points INT                -- Pontos ganhos
- required_count INT        -- Quantidade necessária
- metadata JSONB
- is_secret BOOLEAN
- display_order INT
- created_at TIMESTAMPTZ
```

### Tabela: `user_achievements`
```sql
- id UUID PRIMARY KEY
- user_id UUID → profiles(id)
- achievement_id UUID → achievements(id)
- current_progress INT      -- Progresso atual
- is_unlocked BOOLEAN       -- Se foi desbloqueada
- unlocked_at TIMESTAMPTZ   -- Quando foi desbloqueada
- created_at TIMESTAMPTZ
- UNIQUE(user_id, achievement_id)
```

---

## ⚡ Funções do Banco

### 1. `unlock_achievement(user_id, code)`
**Desbloqueia uma conquista**

```sql
SELECT unlock_achievement(
  'uuid-do-usuario',
  'first_mission'
);
```

**O que faz:**
- Verifica se conquista existe
- Verifica se já está desbloqueada
- Marca como desbloqueada
- Adiciona pontos ao perfil (100 pts = 1 nível)
- Cria notificação automática
- Retorna true/false

### 2. `update_achievement_progress(user_id, code, increment)`
**Atualiza progresso de uma conquista**

```sql
SELECT update_achievement_progress(
  'uuid-do-usuario',
  'apprentice',
  1  -- incremento
);
```

**O que faz:**
- Incrementa progresso
- Se atingir meta, desbloqueia automaticamente
- Chama unlock_achievement internamente

### 3. `get_user_achievements(user_id)`
**Retorna todas as conquistas do usuário**

```sql
SELECT * FROM get_user_achievements('uuid-do-usuario');
```

**Retorna:**
- Lista de conquistas (desbloqueadas + bloqueadas)
- Progresso de cada uma
- Porcentagem de conclusão
- Data de desbloqueio (se desbloqueada)

---

## 🔥 Triggers Automáticos

### 1. Boas-Vindas
**Trigger:** `give_welcome_achievement_trigger`  
**Tabela:** `profiles`  
**Evento:** AFTER INSERT

Quando um usuário cria conta, desbloqueia conquista "Bem-vinda" automaticamente.

### 2. Missões
**Trigger:** `track_mission_achievement_trigger`  
**Tabela:** `user_mission_progress`  
**Evento:** AFTER UPDATE

Quando uma missão é completada, atualiza progresso de todas as conquistas de missões:
- first_mission
- apprentice
- scholar
- expert
- master

### 3. Rede de Apoio
**Trigger:** `track_network_achievement_trigger`  
**Tabela:** `trusted_contacts`  
**Evento:** AFTER INSERT

Quando um contato é adicionado, atualiza progresso de:
- first_contact
- strong_network
- community

---

## 🎨 Interface do Componente

### Header com Estatísticas
```
╔════════════════════════════════════════╗
║  🏆 SUAS CONQUISTAS                    ║
║  ┌──────────────────────────────────┐  ║
║  │ [5]  [16]  [350]  [31%]          │  ║
║  │ Desc  Total  Pts   Completo      │  ║
║  └──────────────────────────────────┘  ║
║  Progresso: [███████░░░░░░░] 31%      ║
╚════════════════════════════════════════╝
```

### Filtros
- **Todas:** Mostra todas as conquistas
- **Desbloqueadas:** Apenas conquistadas
- **Bloqueadas:** Apenas pendentes

### Agrupamento por Categoria
Cada categoria tem:
- Ícone e nome
- Badge com contador (ex: 3/6)
- Grid de cards de conquistas

### Cards de Conquista

**Desbloqueada:**
```
┌─────────────────────────────┐
│ 🎯  Primeira Missão    +50  │
│ Complete sua primeira...    │
│ Desbloqueada em 19/10/2025  │
└─────────────────────────────┘
```

**Bloqueada (em progresso):**
```
┌─────────────────────────────┐
│ 🔒  Aprendiz                │
│ Complete 5 missões          │
│ 3/5                    60%  │
│ [████████░░░░░]             │
└─────────────────────────────┘
```

---

## 🎮 Sistema de Gamificação

### Pontos → Níveis
- **100 pontos = 1 nível**
- Exemplo: 350 pontos = Nível 3
- Campo `level` atualizado automaticamente em `profiles`

### Notificações Automáticas
Ao desbloquear conquista, cria notificação:
```
Título: 🏆 Conquista Desbloqueada!
Mensagem: Você ganhou: Primeira Missão (+50 pts)
Tipo: achievement
Metadata: { achievement_code, points, icon }
```

### Realtime Updates
O hook usa Supabase Realtime para sincronizar:
- Desbloqueio de conquistas
- Atualização de progresso
- Notificações instantâneas

---

## 📊 Hook useAchievements

### Uso Básico
```typescript
import { useAchievements } from '@/hooks/useAchievements';

const userId = localStorage.getItem('profile_id');
const {
  achievements,      // Lista completa
  stats,            // Estatísticas
  loading,          // Carregando
  error,            // Erros
  loadAchievements, // Recarregar
} = useAchievements(userId);
```

### Estados Retornados
```typescript
interface Achievement {
  achievement_code: string;
  achievement_title: string;
  achievement_description: string;
  category: 'mission' | 'network' | 'chat' | 'time' | 'special';
  icon: string;
  color: string;
  points: number;
  required_count: number;
  current_progress: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
  progress_percentage: number;
}

interface AchievementStats {
  total_achievements: number;
  unlocked_count: number;
  total_points: number;
  completion_percentage: number;
}
```

### Métodos Disponíveis
```typescript
// Filtros
getAchievementsByCategory('mission')
getUnlockedAchievements()
getLockedAchievements()
getInProgressAchievements()

// Ações
unlockAchievement('first_mission')
updateProgress('apprentice', 1)
```

---

## 🚀 Como Executar

### 1. Executar Migration
```sql
-- No Supabase SQL Editor
-- Copiar e executar: 010_achievements_system.sql
```

### 2. Recarregar App
```bash
# No navegador
Ctrl+Shift+R
```

### 3. Usar Interface
1. Login no app
2. Click aba 🏆 Conquistas
3. Ver conquistas desbloqueadas/bloqueadas
4. Completar missões/adicionar contatos para desbloquear

---

## 🧪 Como Testar

### Testar no SQL Editor

**1. Ver conquistas cadastradas:**
```sql
SELECT code, title, points 
FROM achievements 
ORDER BY display_order;
```

**2. Ver conquistas de um usuário:**
```sql
SELECT * 
FROM get_user_achievements('uuid-do-usuario');
```

**3. Desbloquear conquista manualmente:**
```sql
SELECT unlock_achievement('uuid-do-usuario', 'first_mission');
```

**4. Ver notificação criada:**
```sql
SELECT * 
FROM notifications 
WHERE user_id = 'uuid-do-usuario' 
  AND type = 'achievement'
ORDER BY created_at DESC 
LIMIT 1;
```

**5. Simular completar missão:**
```sql
-- Inserir progresso de missão
INSERT INTO user_mission_progress (user_id, mission_id, completed)
VALUES ('uuid-do-usuario', 'uuid-da-missao', true);

-- Trigger vai desbloquear "Primeira Missão" automaticamente
```

**6. Simular adicionar contato:**
```sql
-- Inserir contato
INSERT INTO trusted_contacts (user_id, name, relationship)
VALUES ('uuid-do-usuario', 'Maria', 'Amiga');

-- Trigger vai desbloquear "Primeira Conexão" automaticamente
```

---

## 🔧 Troubleshooting

### Conquistas não aparecem
**Causa:** Migration não rodou ou deu erro  
**Solução:**
```sql
SELECT COUNT(*) FROM achievements;
-- Deve retornar 16
```

### Progresso não atualiza
**Causa:** Triggers não criados  
**Solução:**
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table IN ('profiles', 'user_mission_progress', 'trusted_contacts');
-- Deve retornar 3 triggers
```

### Hook retorna erro
**Causa:** Função RPC não existe  
**Solução:**
```sql
SELECT proname 
FROM pg_proc 
WHERE proname LIKE '%achievement%';
-- Deve retornar 3 funções
```

---

## 🎯 Próximas Melhorias

### Conquistas Futuras
- [ ] Completar todos os módulos de missões
- [ ] Usar chat X dias seguidos
- [ ] Convidar amigas para o app
- [ ] Completar perfil 100%
- [ ] Enviar X alertas SOS
- [ ] Avaliar X apoiadoras

### Recursos Adicionais
- [ ] Ranking de usuárias (leaderboard)
- [ ] Conquistas secretas (surpresa)
- [ ] Badges colecionáveis
- [ ] Compartilhar conquista nas redes
- [ ] Conquistas com tempo limitado (eventos)
- [ ] Sistema de níveis com benefícios

### Melhorias de UX
- [ ] Animação de desbloqueio
- [ ] Sons de conquista
- [ ] Confete ao desbloquear
- [ ] Preview de conquista antes de ganhar
- [ ] Dicas de como desbloquear

---

## 📝 Resumo

**Sistema completo de conquistas implementado!**

✅ **Migration 010:** 2 tabelas, 3 funções, 3 triggers, 16 conquistas  
✅ **Hook useAchievements:** Gerenciamento de estado + Realtime  
✅ **Componente AchievementsTab:** Interface visual completa  
✅ **Integração Index.tsx:** Nova aba 🏆 na navegação  

**Total:** ~800 linhas de código, sistema completo de gamificação!

---

**Criado em:** 19/10/2025  
**Versão:** 1.0  
**Projeto:** APOIA - Apoio a Mulheres em Situação de Violência
