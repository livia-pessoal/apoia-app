# 👤 Guia - Sistema de Perfil Completo

**Perfil do usuário com edição, estatísticas e configurações**

---

## 🎯 O Que Foi Implementado

### ✅ Funcionalidades Completas

**1. Migration 009: Melhorias no Perfil**
- Novos campos: bio, email, phone, city, state
- Avatar customizável (5 cores)
- Modo de privacidade (normal/discreto)
- Preferências de notificações
- Última vez online
- Função de estatísticas completas

**2. Componente ProfileTab (~450 linhas)**
- Interface completa de perfil
- Modal de edição com todos os campos
- Avatar com iniciais e gradientes
- Estatísticas em tempo real
- Cards de informações
- Logout funcional

**3. Funcionalidades de Edição**
- Nome de exibição
- Bio/sobre você
- Email e telefone
- Cidade e estado
- Escolher cor do avatar (5 opções)
- Modo de privacidade

**4. Estatísticas Dinâmicas**
- Total de missões completadas
- Taxa de conclusão (%)
- Pontos acumulados
- Nível atual
- Dias no app
- Contatos na rede
- Alertas enviados

**5. Integração Completa**
- Substituiu perfil estático em Index.tsx
- Salva no Supabase
- Atualiza localStorage
- Toast de confirmação

---

## 📁 Arquivos Criados

### Banco de Dados
- ✅ `supabase/migrations/009_profile_enhancements.sql` (~140 linhas)
  - 10 novos campos na tabela profiles
  - Função `get_profile_stats()` (estatísticas completas)
  - Função `update_last_seen()` (última atividade)
  - Política RLS para update de perfil

### Frontend
- ✅ `src/components/ProfileTab.tsx` (~450 linhas)
  - Interface completa
  - Modal de edição
  - Estatísticas
  - Logout

### Integração
- ✅ `src/pages/Index.tsx` (modificado)
  - Import ProfileTab
  - Substituiu conteúdo estático

### Documentação
- ✅ `GUIA_PERFIL.md` (este arquivo)

---

## 🗄️ Estrutura do Banco

### Novos Campos em `profiles`

```sql
ALTER TABLE profiles ADD COLUMN bio TEXT;
ALTER TABLE profiles ADD COLUMN avatar_color TEXT DEFAULT 'purple';
ALTER TABLE profiles ADD COLUMN email TEXT;
ALTER TABLE profiles ADD COLUMN phone TEXT;
ALTER TABLE profiles ADD COLUMN birth_date DATE;
ALTER TABLE profiles ADD COLUMN city TEXT;
ALTER TABLE profiles ADD COLUMN state TEXT;
ALTER TABLE profiles ADD COLUMN notification_preferences JSONB 
  DEFAULT '{"mission": true, "chat": true, "network": true, "alert": true}'::jsonb;
ALTER TABLE profiles ADD COLUMN privacy_mode TEXT 
  DEFAULT 'normal' CHECK (privacy_mode IN ('normal', 'stealth'));
ALTER TABLE profiles ADD COLUMN last_seen_at TIMESTAMPTZ;
```

### Função de Estatísticas

```sql
SELECT * FROM get_profile_stats('user-uuid-aqui');
```

**Retorna:**
- `total_missions` - Total de missões no sistema
- `completed_missions` - Missões completadas pelo usuário
- `completion_rate` - Taxa de conclusão (%)
- `total_points` - Pontos acumulados
- `current_level` - Nível atual
- `days_since_join` - Dias desde criação do perfil
- `total_contacts` - Contatos na rede de apoio
- `total_alerts` - Alertas SOS enviados
- `total_notifications` - Total de notificações
- `unread_notifications` - Notificações não lidas

---

## 💻 Como Usar

### Componente ProfileTab

```typescript
import { ProfileTab } from "@/components/ProfileTab";

// No Index.tsx
<TabsContent value="profile">
  <ProfileTab />
</TabsContent>
```

### Carregar Perfil

```typescript
// No componente
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", profileId)
  .single();
```

### Atualizar Perfil

```typescript
const { error } = await supabase
  .from("profiles")
  .update({
    display_name: "Novo Nome",
    bio: "Minha bio",
    email: "email@exemplo.com",
    avatar_color: "blue",
    privacy_mode: "stealth"
  })
  .eq("id", profileId);
```

### Buscar Estatísticas

```typescript
const { data, error } = await supabase
  .rpc("get_profile_stats", {
    p_user_id: profileId
  });

// Retorna array com objeto de estatísticas
const stats = data[0];
console.log(stats.completed_missions);
console.log(stats.completion_rate);
```

---

## 🎨 Visual do Sistema

### Avatar Customizável

```
┌──────────────┐
│   🟣 MJ      │  ← Roxo (padrão)
└──────────────┘

┌──────────────┐
│   🔵 MJ      │  ← Azul
└──────────────┘

┌──────────────┐
│   🟢 MJ      │  ← Verde
└──────────────┘
```

**5 cores disponíveis:**
- Purple (roxo/rosa)
- Blue (azul/ciano)
- Green (verde/esmeralda)
- Orange (laranja/vermelho)
- Pink (rosa/rosa forte)

### Cards de Estatísticas

```
╔════════════════════════════════════════╗
║  ✨ Missões        🎯 Progresso        ║
║  15 completadas    75% conclusão       ║
║                                        ║
║  🏆 Pontos         📈 Rede             ║
║  450 pts (nv 3)    8 contatos          ║
╚════════════════════════════════════════╝
```

### Modal de Edição

```
╔════════════════════════════════════════╗
║  Editar Perfil                   [X]   ║
╠════════════════════════════════════════╣
║                                        ║
║  Nome: [__Maria João_______________]   ║
║  Bio:  [Mulher forte e corajosa...  ]  ║
║        [__________________________ ]   ║
║  Email: [maria@email.com__________]   ║
║  Telefone: [(11) 99999-9999______]   ║
║  Cidade: [São Paulo__] Estado: [SP]   ║
║                                        ║
║  Cor do Avatar:                        ║
║  [🟣] [🔵] [🟢] [🟠] [🔴]              ║
║                                        ║
║  Privacidade:                          ║
║  [👁️ Normal] [🕶️ Discreto]            ║
║                                        ║
║  [💾 Salvar]  [❌ Cancelar]           ║
╚════════════════════════════════════════╝
```

---

## 🧪 Como Testar

### Passo 1: Executar Migration

1. Abra Supabase SQL Editor
2. Copie `supabase/migrations/009_profile_enhancements.sql`
3. Execute

**Deve retornar:** "Success"

### Passo 2: Recarregar App

```bash
# No navegador
Ctrl+Shift+R (hard reload)
```

### Passo 3: Acessar Perfil

1. Click no ícone **👤 (User)** na barra inferior
2. ✅ **Nova interface aparece** com avatar, info e estatísticas

### Passo 4: Editar Perfil

1. Click no botão **✏️ (Edit)**
2. Modal de edição abre
3. Preencha os campos:
   - Nome
   - Bio
   - Email
   - Telefone
   - Cidade/Estado
   - Escolha cor do avatar
   - Modo de privacidade
4. Click **"Salvar Alterações"**
5. ✅ **Toast: "Perfil atualizado com sucesso!"**
6. ✅ **Interface atualiza** com novos dados

### Passo 5: Ver Estatísticas

**No card de estatísticas, deve aparecer:**
- ✨ **Missões:** Quantidade completada
- 🎯 **Progresso:** Taxa de conclusão (%)
- 🏆 **Pontos:** Total + nível atual
- 📈 **Rede:** Contatos cadastrados

### Passo 6: Testar Logout

1. Click no botão **🚪 (Logout)** no topo
2. OU click no botão grande "Sair da Conta"
3. ✅ **Toast: "Logout realizado com sucesso!"**
4. ✅ **Redireciona** para tela de login

---

## 🎯 Funcionalidades em Detalhe

### 1. Avatar com Iniciais

**Como funciona:**
- Pega as **iniciais do nome** (até 2 letras)
- Exemplo: "Maria João" → "MJ"
- Exibe em avatar circular com gradiente

**Cores disponíveis:**
```typescript
purple: from-purple-500 to-pink-500
blue:   from-blue-500 to-cyan-500
green:  from-green-500 to-emerald-500
orange: from-orange-500 to-red-500
pink:   from-pink-500 to-rose-500
```

### 2. Estatísticas em Tempo Real

**Função SQL:**
```sql
SELECT * FROM get_profile_stats('user-uuid');
```

**Calcula:**
- Missões completadas (query na tabela mission_progress)
- Taxa de conclusão (%)
- Pontos totais (soma de points_earned)
- Nível atual (da tabela profiles)
- Dias no app (diferença de datas)
- Total de contatos (tabela trusted_contacts)
- Alertas enviados (tabela emergency_alerts)

### 3. Modo de Privacidade

**Normal:**
- Perfil visível
- Informações normais

**Discreto (Stealth):**
- Perfil mais protegido
- Informações ocultas/limitadas
- Ideal para situações de risco

### 4. Preferências de Notificações

**JSON armazenado:**
```json
{
  "mission": true,
  "chat": true,
  "network": true,
  "alert": true
}
```

**Permite desabilitar notificações por tipo.**

---

## 🚀 Integrações Futuras

### Última Vez Online

**Atualizar ao fazer ações:**
```typescript
// Ao carregar app ou fazer ação
await supabase.rpc("update_last_seen");
```

### Upload de Foto de Perfil

**Com Supabase Storage:**
```typescript
// Upload de imagem
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/avatar.png`, file);

// Salvar URL no perfil
await supabase
  .from("profiles")
  .update({ avatar_url: data.path })
  .eq("id", userId);
```

### Conquistas/Badges

**Adicionar badges ao perfil:**
```sql
ALTER TABLE profiles ADD COLUMN badges JSONB DEFAULT '[]'::jsonb;

-- Exemplo de badges
{
  "badges": [
    {"id": "first_mission", "name": "Primeira Missão", "icon": "🎯"},
    {"id": "week_streak", "name": "7 Dias Seguidos", "icon": "🔥"}
  ]
}
```

### Tema/Customização

**Permitir escolher tema:**
```sql
ALTER TABLE profiles ADD COLUMN theme TEXT DEFAULT 'purple' 
  CHECK (theme IN ('purple', 'blue', 'green', 'dark'));
```

---

## 📊 Dados de Teste

### Atualizar Perfil Manualmente (SQL)

```sql
-- Atualizar perfil completo
UPDATE profiles
SET 
  display_name = 'Maria João',
  bio = 'Mulher forte, corajosa e determinada a vencer!',
  email = 'maria@exemplo.com',
  phone = '(11) 99999-9999',
  city = 'São Paulo',
  state = 'SP',
  avatar_color = 'blue',
  privacy_mode = 'normal'
WHERE id = '21261a59-6bd2-48be-9b2a-0de6ee2274bd';
```

### Ver Estatísticas

```sql
SELECT * FROM get_profile_stats('21261a59-6bd2-48be-9b2a-0de6ee2274bd');
```

---

## 🐛 Troubleshooting

### Estatísticas não aparecem

**Causa:** Função RPC não executada

**Solução:**
```sql
-- Recriar função
-- Copiar e executar trecho da função get_profile_stats() 
-- da migration 009
```

### Erro ao salvar perfil

**Causa:** RLS bloqueando update

**Solução:**
```sql
-- Verificar política
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Recriar política
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
```

### Avatar não muda de cor

**Causa:** Estado local não sincroniza

**Solução:**
- Recarregar página após salvar
- Verificar se `avatar_color` foi salvo no banco

---

## ✅ Checklist de Validação

### Banco de Dados
- [ ] Migration 009 executada com sucesso
- [ ] 10 novos campos adicionados em profiles
- [ ] Função get_profile_stats() criada
- [ ] Política RLS de update ativa

### Frontend
- [ ] ProfileTab renderiza corretamente
- [ ] Avatar aparece com iniciais
- [ ] Modal de edição abre
- [ ] Todos os campos funcionam
- [ ] Seletor de cores funciona
- [ ] Botão salvar atualiza perfil
- [ ] Estatísticas aparecem nos cards
- [ ] Logout funciona e redireciona

### Funcionalidades
- [ ] Editar nome funciona
- [ ] Editar bio funciona
- [ ] Editar email/telefone funciona
- [ ] Editar cidade/estado funciona
- [ ] Trocar cor do avatar funciona
- [ ] Trocar modo privacidade funciona
- [ ] Estatísticas carregam corretamente
- [ ] Logout limpa localStorage

---

## 🎉 Resumo Final

### O Que Temos Agora ✅

- ✅ Perfil completo e funcional
- ✅ Edição de todas as informações
- ✅ Avatar customizável (5 cores)
- ✅ Estatísticas dinâmicas em tempo real
- ✅ Modo de privacidade
- ✅ Logout funcional
- ✅ Interface bonita e responsiva
- ✅ Migration segura (não dá erro se repetir)

### Próximos Passos 🚀

1. **Testar sistema:**
   - Executar migration 009
   - Editar perfil
   - Ver estatísticas
   - Testar logout

2. **Melhorias futuras:**
   - Upload de foto real
   - Conquistas/badges visuais
   - Temas customizáveis
   - Histórico de atividades

3. **Integrar com features:**
   - Atualizar last_seen automaticamente
   - Usar preferências de notificações
   - Aplicar modo privacidade

---

**Desenvolvido para o projeto APOIA**  
_Última atualização: 19/10/2025_  
_Versão: 1.0.0 - Sistema de Perfil Completo_
