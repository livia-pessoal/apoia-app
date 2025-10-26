# 🛡️ Guia de Implementação - Recursos de Emergência

**Novas Funcionalidades Desenvolvidas**

---

## 📋 O Que Foi Criado

### 1️⃣ **Registro de Ocorrências** 📝

Sistema seguro para documentar incidentes de violência.

**Funcionalidades:**
- ✅ Formulário completo de registro
- ✅ Tipos de violência (física, psicológica, sexual, patrimonial, moral)
- ✅ Níveis de gravidade (baixa, média, alta, crítica)
- ✅ Campos para testemunhas e evidências
- ✅ Registro de contato com polícia
- ✅ Histórico de registros
- ✅ Visualização detalhada
- ✅ Exclusão segura

**Arquivos Criados:**
- `src/components/IncidentReport.tsx`
- `supabase/migrations/005_incident_reports.sql`

---

### 2️⃣ **Mapa de Delegacias** 🗺️

Localizador de delegacias especializadas e serviços de apoio.

**Funcionalidades:**
- ✅ Lista de DEAMs (Delegacias Especializadas)
- ✅ Busca por cidade
- ✅ Geolocalização (calcula distância)
- ✅ Integração com Google Maps
- ✅ Informações detalhadas (endereço, telefone, horário)
- ✅ Botão para ligar diretamente
- ✅ Dados de exemplo pré-carregados (SP)

**Arquivos Criados:**
- `src/components/PoliceMap.tsx`
- Tabela `police_stations` em `005_incident_reports.sql`

---

### 3️⃣ **Chat Anônimo** 💬

Sistema de chat em tempo real entre vítimas e apoiadoras.

**Funcionalidades:**
- ✅ Chat anônimo e seguro
- ✅ Tempo real (Supabase Realtime)
- ✅ Status: aguardando/ativo/encerrado
- ✅ Mensagens do sistema
- ✅ Interface intuitiva
- ✅ Encerramento de conversa
- ✅ Histórico de mensagens

**Arquivos Criados:**
- `src/components/AnonymousChat.tsx`
- `supabase/migrations/006_anonymous_chat.sql`

---

## 🗄️ Estrutura do Banco de Dados

### Novas Tabelas Criadas:

#### `incident_reports`
```sql
- id (UUID)
- user_id (UUID) → profiles
- title (TEXT)
- description (TEXT)
- incident_date (TIMESTAMPTZ)
- incident_location (TEXT)
- incident_type (TEXT) - enum: fisica, psicologica, sexual, patrimonial, moral, outro
- severity (TEXT) - enum: baixa, media, alta, critica
- has_witnesses (BOOLEAN)
- witnesses_details (TEXT)
- has_evidence (BOOLEAN)
- evidence_description (TEXT)
- police_contacted (BOOLEAN)
- police_report_number (TEXT)
- status (TEXT) - enum: registrado, compartilhado, denunciado, resolvido
```

#### `police_stations`
```sql
- id (UUID)
- name (TEXT)
- type (TEXT) - enum: deam, delegacia, cras, casa_abrigo
- address (TEXT)
- city (TEXT)
- state (TEXT)
- phone (TEXT)
- phone_emergency (TEXT)
- opening_hours (TEXT)
- works_24h (BOOLEAN)
- latitude (DECIMAL)
- longitude (DECIMAL)
- services (TEXT[])
```

#### `chat_rooms`
```sql
- id (UUID)
- victim_id (UUID) → profiles
- supporter_id (UUID) → profiles
- status (TEXT) - enum: waiting, active, closed
- victim_display_name (TEXT)
```

#### `chat_messages`
```sql
- id (UUID)
- room_id (UUID) → chat_rooms
- sender_id (UUID) → profiles
- sender_type (TEXT) - enum: victim, supporter
- message (TEXT)
- is_read (BOOLEAN)
- is_system_message (BOOLEAN)
```

---

## 🚀 Como Aplicar as Mudanças

### Passo 1: Executar Migrations no Supabase

No **SQL Editor** do Supabase, execute em ordem:

```sql
-- 1. Criar tabelas de registros e delegacias
\i supabase/migrations/005_incident_reports.sql

-- 2. Criar tabelas de chat
\i supabase/migrations/006_anonymous_chat.sql
```

**Ou copie e cole o conteúdo de cada arquivo manualmente**

---

### Passo 2: Verificar Instalação de Dependências

Certifique-se de que o projeto tem o `date-fns` instalado:

```bash
npm install date-fns
```

---

### Passo 3: Reiniciar o Projeto

```bash
# Parar o servidor (Ctrl+C)
npm run dev
```

---

## 🧪 Como Testar

### Teste 1: Registro de Ocorrências

1. Acesse http://localhost:8080
2. Digite senha: **1904**
3. Faça login como **Vítima/User**
4. Vá para tab **"Recursos de Emergência"** (escudo 🛡️)
5. Clique em **"Registro de Ocorrências"**
6. Clique em **"Novo Registro"**
7. Preencha o formulário:
   - Título: "Teste de Registro"
   - Tipo: "Violência Psicológica"
   - Gravidade: "Média"
   - Data: Hoje
   - Descrição: "Descrição de teste"
8. Clique em **"Salvar Registro"**
9. Verifique se aparece na lista
10. Clique para ver detalhes
11. Teste deletar o registro

**✅ Sucesso:** Registro criado, listado, visualizado e deletado

---

### Teste 2: Mapa de Delegacias

1. Na mesma aba de Recursos de Emergência
2. Clique em **"Delegacias Próximas"**
3. Verifique se aparecem 5 delegacias de São Paulo
4. Digite "São Paulo" na busca
5. Clique em uma delegacia para ver detalhes
6. Clique em **"Ir no Mapa"** (deve abrir Google Maps)
7. Teste o botão **"Ligar"**
8. Permita geolocalização (se solicitado)
9. Verifique se aparece distância

**✅ Sucesso:** Delegacias carregam, busca funciona, mapa abre

---

### Teste 3: Chat Anônimo

1. Clique em **"Chat Anônimo"**
2. Clique em **"Iniciar Chat Anônimo"**
3. Verifique mensagem "Aguardando apoiadora..."
4. Abra outra aba/janela em modo anônimo
5. Acesse o sistema como **Apoiadora** (ou simule)
6. *Nota: Para teste completo, precisa de 2 usuárias simultâneas*

**Para teste básico:**
- Crie sala
- Verifique que fica em "waiting"
- Cancele o chat

**✅ Sucesso:** Sala criada, status correto

---

## 🔍 Verificação no Banco de Dados

### Verificar Registros de Ocorrências

```sql
SELECT * FROM incident_reports;
```

### Verificar Delegacias

```sql
SELECT name, type, city FROM police_stations;
```

### Verificar Salas de Chat

```sql
SELECT * FROM chat_rooms;
```

### Verificar Mensagens

```sql
SELECT * FROM chat_messages;
```

---

## 🐛 Problemas Comuns

### Problema 1: Erro ao abrir modal

**Sintoma:** Modal não abre, erro no console

**Solução:**
```bash
# Verificar se date-fns está instalado
npm install date-fns
npm run dev
```

---

### Problema 2: Delegacias não aparecem

**Sintoma:** Lista vazia

**Solução:**
1. Verificar se migration `005_incident_reports.sql` foi executada
2. Verificar dados com: `SELECT * FROM police_stations;`
3. Se vazio, executar novamente a migration

---

### Problema 3: Chat não cria sala

**Sintoma:** Erro ao criar chat

**Solução:**
1. Verificar se migration `006_anonymous_chat.sql` foi executada
2. Verificar profile_id no localStorage
3. Verificar políticas RLS no Supabase

---

### Problema 4: Geolocalização não funciona

**Sintoma:** Não aparece distância

**Solução:**
- Navegador precisa de permissão para acessar localização
- HTTPS necessário em produção
- Em localhost, funciona sem HTTPS

---

## 📊 Estatísticas das Implementações

### Linhas de Código

- **IncidentReport.tsx:** ~450 linhas
- **PoliceMap.tsx:** ~340 linhas  
- **AnonymousChat.tsx:** ~350 linhas
- **Migrations:** ~250 linhas SQL
- **Total:** ~1.390 linhas

### Componentes Criados

- ✅ 3 componentes React completos
- ✅ 4 tabelas no banco de dados
- ✅ 10+ políticas RLS de segurança
- ✅ Integração com Google Maps
- ✅ Chat em tempo real

---

## 🎯 Próximos Passos

### Melhorias Sugeridas

1. **Registro de Ocorrências:**
   - Upload de fotos/evidências
   - Exportar PDF do registro
   - Compartilhar com apoiadora

2. **Mapa de Delegacias:**
   - Adicionar mais cidades
   - Filtro por tipo de serviço
   - Rotas otimizadas

3. **Chat Anônimo:**
   - Notificações em tempo real
   - Indicador de digitação
   - Histórico de conversas
   - Sistema de fila para apoiadoras

---

## 📝 Checklist de Implementação

- [x] Criar migrations SQL
- [x] Criar componente IncidentReport
- [x] Criar componente PoliceMap
- [x] Criar componente AnonymousChat
- [x] Integrar na página Index.tsx
- [x] Adicionar dados de exemplo (SP)
- [x] Implementar RLS no banco
- [x] Testar funcionalidades básicas
- [ ] Testar chat com 2 usuárias
- [ ] Deploy em produção
- [ ] Adicionar mais cidades
- [ ] Documentar API

---

## 🔐 Segurança

### Medidas Implementadas

✅ **Row Level Security (RLS):** Cada usuária só vê seus próprios dados  
✅ **Anonimato no Chat:** Display name pode ser anônimo  
✅ **Validação de campos:** Tipos enum para evitar dados inválidos  
✅ **Timestamps:** Auditoria de criação/atualização  
✅ **Cascata de exclusão:** Deleta dados relacionados automaticamente  

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique console do navegador (F12)
2. Verifique logs do terminal
3. Verifique políticas RLS no Supabase
4. Teste queries SQL manualmente

---

**Desenvolvido para o projeto APOIA**  
_Última atualização: 19/10/2025_  
_Versão: 1.0.0_
