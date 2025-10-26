# 🎮 Setup do Sistema de Missões Educativas

## 📋 Passo a Passo

### 1️⃣ Executar Migrations no Supabase

#### A. Abra o Supabase Dashboard
- Acesse: https://supabase.com
- Vá no seu projeto
- Sidebar → **SQL Editor**

#### B. Execute a Migration 003 (Estrutura)
1. Click "New Query"
2. Cole o conteúdo de `supabase/migrations/003_missions_system.sql`
3. Click **"Run"**
4. Aguarde confirmação ✅

#### C. Execute a Migration de Dados
1. Click "New Query"  
2. Cole o conteúdo de `supabase/migrations/003_missions_data.sql`
3. Click **"Run"**
4. Aguarde confirmação ✅

---

### 2️⃣ Verificar Tabelas Criadas

#### Table Editor → Verificar:
- ✅ `missions_content` - Deve ter 50 registros (40 textos + 10 vídeos)
- ✅ `user_mission_progress` - Vazia inicialmente

---

### 3️⃣ Instalar Componentes UI Faltantes

Se você ainda não tem esses componentes do shadcn/ui, instale:

```bash
npx shadcn@latest add scroll-area
npx shadcn@latest add accordion
npx shadcn@latest add progress
npx shadcn@latest add dialog
npx shadcn@latest add badge
```

---

### 4️⃣ Teste o Sistema

#### A. Abra o navegador
```
http://localhost:8080
```

#### B. Entre como vítima (user)
1. Calculadora → `1904`
2. "Preciso de Apoio"
3. Nome ou pule
4. Entra no app

#### C. Tab "Home" (Fortalecimento)
1. Você deve ver:
   - 📊 4 cards de estatísticas (Total, Completas, Restantes, Progresso)
   - 🎯 4 Módulos em accordion:
     - Módulo 1: Reconhecendo os Sinais (textos 1-10 + vídeos)
     - Módulo 2: Reagindo e Buscando Ajuda (textos 11-20 + vídeos)
     - Módulo 3: Autoconhecimento (textos 21-30 + vídeos)
     - Módulo 4: Conhecendo Direitos (textos 31-40 + vídeos)

#### D. Abra um módulo
1. Click em qualquer módulo (ex: Módulo 1)
2. Deve expandir mostrando cards de missões

#### E. Inicie uma missão
1. Click em qualquer card de missão
2. Modal abre com:
   - Título da missão
   - Badge (Texto ou Vídeo)
   - Duração estimada
   - Conteúdo completo
   - Botão "Marcar como Completo"

#### F. Complete uma missão
1. Leia/assista o conteúdo
2. Click "Marcar como Completo"
3. Toast: "✅ Missão concluída!"
4. Card fica com badge verde "Completo"
5. Estatísticas atualizam automaticamente

---

## 🎯 O Que Deve Funcionar

### ✅ Visualização
- [x] 4 Módulos organizados em accordion
- [x] Cards de missão com badges (Texto/Vídeo)
- [x] Duração estimada em cada card
- [x] Contador de missões completas por módulo

### ✅ Interação
- [x] Click em missão abre modal
- [x] Leitura de textos completos
- [x] Player de vídeo YouTube embed
- [x] Marcar como completo
- [x] Progresso salvo no banco

### ✅ Progresso
- [x] Estatísticas atualizadas em tempo real
- [x] Progresso persistente (salvo no Supabase)
- [x] Cada usuária tem seu próprio progresso
- [x] Pode revisar missões já completas

---

## 📊 Estrutura dos Dados

### 50 Missões Total:
- **40 Textos Educativos** (3 min cada)
  - Módulo 1: 10 textos
  - Módulo 2: 10 textos
  - Módulo 3: 10 textos
  - Módulo 4: 10 textos

- **10 Vídeos Educativos** (3-20 min cada)
  - Distribuídos entre os 4 módulos
  - YouTube e Instagram links

---

## 🐛 Troubleshooting

### Erro: "Table doesn't exist"
- Execute as migrations no Supabase SQL Editor
- Verifique se executou na ordem correta

### Erro: "Component not found"
- Instale os componentes shadcn/ui faltantes
- Execute: `npx shadcn@latest add [component]`

### Missões não carregam
1. Console do navegador (F12)
2. Veja se há erros de fetch
3. Verifique se as tabelas foram criadas
4. Confira se profile_id está no localStorage

### Progresso não salva
1. Verifique se `profile_id` existe no localStorage
2. Veja o console para erros de Supabase
3. Confirme se a tabela `user_mission_progress` foi criada

---

## 🎉 Pronto!

Seu sistema de missões educativas está configurado!

Agora as usuárias podem:
- ✅ Aprender sobre violência doméstica
- ✅ Conhecer seus direitos
- ✅ Fortalecer sua autonomia
- ✅ Assistir vídeos educativos
- ✅ Acompanhar seu progresso

---

**Próximo Passo:** Adicione URLs reais dos vídeos editando a migration 003_missions_data.sql
