# 🎮 Sistema de Missões Educativas - APOIA

**Documentação completa do sistema de gamificação e fortalecimento**

---

## 🎯 Visão Geral

O Sistema de Missões é a funcionalidade educativa e gamificada do APOIA, projetada para **fortalecer mulheres** através de conteúdo informativo sobre violência doméstica, direitos, autoconhecimento e recursos de proteção.

### Objetivo Principal
Educar e empoderar mulheres em situação de vulnerabilidade através de:
- 📖 **Textos educativos** sobre reconhecimento de sinais de violência
- 🎥 **Vídeos informativos** sobre direitos e proteção
- 🏆 **Gamificação** para motivar o aprendizado contínuo
- 📊 **Acompanhamento de progresso** personalizado

---

## 📚 Estrutura do Conteúdo

### 4 Módulos Temáticos

#### Módulo 1: Reconhecendo os Sinais da Violência
**Missões 1-10 (textos) + 41-42 (vídeos)**

**Temas abordados:**
1. O que é violência psicológica?
2. Quando o ciúme vira controle
3. O ciclo da violência
4. Gaslighting: quando fazem você duvidar de si mesma
5. Violência verbal também é agressão
6. Controle financeiro é violência patrimonial
7. O isolamento como forma de controle
8. Quando o medo toma conta
9. A manipulação emocional no relacionamento
10. Amor não dói

**Vídeos complementares:**
- Lei Maria da Penha: conheça seus direitos
- A violência vai além da agressão física

---

#### Módulo 2: Reagindo e Buscando Ajuda
**Missões 11-20 (textos) + 43-44 (vídeos)**

**Temas abordados:**
11. Você não está sozinha
12. Ligue 180: um canal seguro
13. Como registrar um boletim de ocorrência
14. Medidas protetivas de urgência
15. Construindo uma rede de apoio
16. Atendimento psicológico gratuito
17. Atendimento policial especializado
18. Aplicativos de segurança
19. Denúncia anônima
20. Planejando uma saída segura

**Vídeos complementares:**
- A história real por trás da Lei Maria da Penha
- Combate à violência contra mulheres

---

#### Módulo 3: Autoconhecimento e Fortalecimento
**Missões 21-30 (textos) + 45-46 (vídeos)**

**Temas abordados:**
21. Você merece respeito e amor saudável
22. Aprendendo a dizer "não"
23. A força da autoestima
24. Violência patrimonial: identificando o abuso
25. Isolamento é um alerta
26. Reconhecendo o medo excessivo
27. Manipulação emocional
28. Violência verbal
29. Amor não dói
30. Valorize sua autonomia

**Vídeos complementares:**
- Violência psicológica contra a mulher é crime
- Tipos de violência contra as mulheres

---

#### Módulo 4: Conhecendo seus Direitos
**Missões 31-40 (textos) + 47-50 (vídeos)**

**Temas abordados:**
31. A Lei Maria da Penha
32. Violência sexual e consentimento
33. Violência institucional
34. Atendimento psicológico gratuito
35. Delegacias da Mulher
36. Medidas protetivas de urgência
37. Aplicativos e ferramentas digitais
38. Denúncia anônima
39. Planejamento de saída segura
40. Educação e prevenção

**Vídeos complementares:**
- Alerta sobre violência psicológica
- Curta-metragem "Violência contra a mulher"
- Fale sem medo - violência doméstica
- Documentário sobre a Lei Maria da Penha

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `missions_content`

Armazena todo o conteúdo educativo (textos e vídeos).

```sql
CREATE TABLE missions_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number INTEGER NOT NULL,          -- 1, 2, 3, 4
  module_title TEXT NOT NULL,              -- Título do módulo
  mission_number INTEGER NOT NULL,         -- 1-50
  title TEXT NOT NULL,                     -- Título da missão
  content TEXT,                            -- Texto completo (para textos)
  video_url TEXT,                          -- URL do vídeo
  video_platform TEXT,                     -- 'youtube', 'instagram'
  content_type TEXT NOT NULL,              -- 'text' ou 'video'
  duration_minutes INTEGER,                -- Duração estimada
  created_at TIMESTAMP DEFAULT now()
);
```

**Campos principais:**
- `module_number`: 1 a 4 (4 módulos temáticos)
- `mission_number`: 1 a 50 (50 missões no total)
- `content_type`: `text` (40 textos) ou `video` (10 vídeos)
- `duration_minutes`: Tempo estimado (3-20 minutos)

---

### Tabela: `user_mission_progress`

Rastreia o progresso individual de cada usuária.

```sql
CREATE TABLE user_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, mission_id)              -- Uma missão por usuária
);
```

**Relacionamentos:**
- `user_id` → `profiles.id` (CASCADE)
- `mission_id` → `missions_content.id` (CASCADE)

**Constraint UNIQUE:** Garante que uma usuária só pode completar cada missão uma vez.

---

## 🎨 Componentes Frontend

### 1. **useMissions** (Hook)
**Arquivo:** `src/hooks/useMissions.ts`

**Funcionalidades:**
```typescript
const {
  missions,              // Lista de todas as missões
  progress,              // Progresso da usuária
  loading,               // Estado de carregamento
  error,                 // Erros
  completeMission,       // Marcar missão como completa
  getMissionsByModule,   // Filtrar missões por módulo
  getStats,              // Estatísticas de progresso
  getNextMission         // Próxima missão não completada
} = useMissions();
```

**Métodos principais:**

#### `completeMission(missionId)`
Marca uma missão como completa no banco de dados.
```typescript
await completeMission('uuid-da-missao');
```

#### `getMissionsByModule(moduleNumber)`
Retorna todas as missões de um módulo específico.
```typescript
const module1 = getMissionsByModule(1); // Módulo 1
```

#### `getStats()`
Retorna estatísticas de progresso.
```typescript
const stats = getStats();
// { total: 50, completed: 5, remaining: 45, percentage: 10 }
```

---

### 2. **MissionCard** (Componente)
**Arquivo:** `src/components/MissionCard.tsx`

Card visual para exibir cada missão.

**Props:**
```typescript
interface MissionCardProps {
  mission: Mission;
  onStart: (mission: Mission) => void;
}
```

**Características:**
- Badge indicando tipo (Texto/Vídeo)
- Ícone diferenciado (BookOpen/Video)
- Tempo de duração
- Status de conclusão (✓ Completo)
- Botão: "Ler" / "Assistir" / "Revisar"

**Visual:**
- Verde claro se completa (`border-success bg-success/5`)
- Hover com sombra elevada
- Responsivo e acessível

---

### 3. **MissionReader** (Componente)
**Arquivo:** `src/components/MissionReader.tsx`

Dialog modal para ler/assistir o conteúdo da missão.

**Props:**
```typescript
interface MissionReaderProps {
  mission: Mission | null;
  open: boolean;
  onClose: () => void;
  onComplete: (missionId: string) => void;
}
```

**Características:**

#### Para Textos:
- Exibe conteúdo em formato `prose` (tipografia otimizada)
- Scroll area para textos longos
- Botão "Marcar como Completo"

#### Para Vídeos:
- **YouTube:** Embed responsivo (iframe)
- **Outros:** Botão para abrir em nova aba
- Aspect ratio 16:9

**Footer:**
- Botão "Fechar"
- Botão "Marcar como Completo" (se não completada)

---

### 4. **ProgressStats** (Componente)
**Arquivo:** `src/components/ProgressStats.tsx`

Grid com 4 cards de estatísticas.

**Props:**
```typescript
interface ProgressStatsProps {
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
}
```

**Cards exibidos:**
1. **Total** - Total de missões (🎯)
2. **Completas** - Missões concluídas (✓) - Verde
3. **Restantes** - Missões faltantes (📖)
4. **Progresso** - Percentual + barra (🏆) - Roxo

**Layout:**
- Mobile: 2 colunas
- Desktop: 4 colunas
- Ícones: Target, CheckCircle2, BookOpen, Trophy

---

## 🔄 Fluxo de Uso

### 1. Usuária Acessa Missões
```typescript
// Na página Index.tsx (Tab "Missões")
const { missions, getMissionsByModule, getStats } = useMissions();
const stats = getStats();
```

### 2. Seleciona um Módulo
```typescript
const module1Missions = getMissionsByModule(1);
// Retorna missões 1-10 do Módulo 1
```

### 3. Clica em uma Missão
```typescript
<MissionCard 
  mission={mission} 
  onStart={(m) => {
    setSelectedMission(m);
    setMissionReaderOpen(true);
  }} 
/>
```

### 4. Lê/Assiste o Conteúdo
```typescript
<MissionReader
  mission={selectedMission}
  open={missionReaderOpen}
  onClose={() => setMissionReaderOpen(false)}
  onComplete={completeMission}
/>
```

### 5. Marca como Completo
```typescript
const handleComplete = async (missionId) => {
  await completeMission(missionId);
  // Atualiza progresso automaticamente
  toast.success("Missão completada! 🎉");
};
```

---

## 📊 Estatísticas e Gamificação

### Cálculo de Progresso
```typescript
const stats = {
  total: 50,              // Total de missões
  completed: 12,          // Missões completadas
  remaining: 38,          // Missões restantes
  percentage: 24          // 24% de progresso
};
```

### Badges e Conquistas
- ✅ **Completo** - Missão finalizada
- 📖 **Texto** - Conteúdo de leitura
- 🎥 **Vídeo** - Conteúdo audiovisual
- ⏱️ **Duração** - Tempo estimado

### Níveis Futuros (Planejado)
- 🥉 **Iniciante** - 0-25% completo
- 🥈 **Aprendiz** - 26-50% completo
- 🥇 **Conhecedora** - 51-75% completo
- 💎 **Especialista** - 76-100% completo

---

## 🎯 Integração com a Aplicação

### Local na Interface
**Tab "Missões"** na aplicação principal (`Index.tsx`)

### Estrutura Visual
```
┌─────────────────────────────────────┐
│  📊 ProgressStats                   │
│  (Total, Completas, Restantes, %)   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📚 Módulo 1: Reconhecendo Sinais   │
├─────────────────────────────────────┤
│  [MissionCard 1] [MissionCard 2]    │
│  [MissionCard 3] [MissionCard 4]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🆘 Módulo 2: Reagindo e Buscando   │
├─────────────────────────────────────┤
│  [MissionCard 11] [MissionCard 12]  │
│  [MissionCard 13] [MissionCard 14]  │
└─────────────────────────────────────┘

... (Módulos 3 e 4)
```

---

## 📝 Conteúdo das Missões

### Exemplo de Texto (Missão 1)
**Título:** O que é violência psicológica?

**Conteúdo:**
```
A violência psicológica é uma das mais silenciosas e perigosas. 
Ela acontece quando alguém tenta controlar seus sentimentos, 
diminuir sua autoestima ou te fazer duvidar da própria sanidade. 

Frases como "ninguém vai te querer além de mim" ou "você está 
louca, isso é coisa da sua cabeça" são sinais claros dessa 
manipulação...
```

**Duração:** 3 minutos  
**Tipo:** Texto

---

### Exemplo de Vídeo (Missão 41)
**Título:** Lei Maria da Penha: conheça seus direitos e como denunciar

**Plataforma:** YouTube  
**URL:** `https://www.youtube.com/watch?v=VIDEO_ID_1`  
**Duração:** 10 minutos  
**Tipo:** Vídeo

---

## 🔐 Segurança e Privacidade

### Dados Armazenados
- ✅ ID da usuária (vinculado ao perfil)
- ✅ ID da missão completada
- ✅ Data/hora de conclusão
- ❌ **NÃO** armazena respostas ou anotações pessoais

### Row Level Security (RLS)
```sql
-- Cada usuária só vê seu próprio progresso
CREATE POLICY "Users can view their own progress"
  ON user_mission_progress FOR SELECT
  USING (user_id = auth.uid());

-- Cada usuária só pode atualizar seu próprio progresso
CREATE POLICY "Users can update their own progress"
  ON user_mission_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

---

## 🚀 Configuração (Setup)

### 1. Executar Migrations
No SQL Editor do Supabase:

```sql
-- 1. Criar tabelas
\i supabase/migrations/003_missions_system.sql

-- 2. Inserir conteúdo
\i supabase/migrations/003_missions_data.sql
```

### 2. Verificar Tabelas
```sql
-- Ver todas as missões
SELECT * FROM missions_content ORDER BY mission_number;

-- Ver progresso de uma usuária
SELECT * FROM user_mission_progress WHERE user_id = 'UUID';
```

### 3. Popular Dados Iniciais
As migrations já inserem:
- ✅ 40 textos educativos
- ✅ 10 vídeos (URLs placeholder)
- ✅ 4 módulos temáticos

---

## 📈 Métricas e Analytics

### Queries Úteis

#### Taxa de Conclusão Geral
```sql
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_completions,
  ROUND(AVG(CASE WHEN completed THEN 1 ELSE 0 END) * 100, 2) as completion_rate
FROM user_mission_progress;
```

#### Missões Mais Populares
```sql
SELECT 
  mc.title,
  COUNT(ump.id) as completions
FROM missions_content mc
LEFT JOIN user_mission_progress ump ON mc.id = ump.mission_id
WHERE ump.completed = true
GROUP BY mc.id, mc.title
ORDER BY completions DESC
LIMIT 10;
```

#### Progresso por Módulo
```sql
SELECT 
  module_number,
  module_title,
  COUNT(DISTINCT mission_id) as missions_completed
FROM missions_content mc
JOIN user_mission_progress ump ON mc.id = ump.mission_id
WHERE ump.user_id = 'UUID' AND ump.completed = true
GROUP BY module_number, module_title;
```

---

## 🎨 Personalização Futura

### Recursos Planejados
- [ ] **Badges e Conquistas** - Recompensas visuais
- [ ] **Streak (Sequência)** - Dias consecutivos
- [ ] **Recomendações IA** - Sugerir próxima missão
- [ ] **Compartilhamento** - Compartilhar progresso (opcional)
- [ ] **Certificado Digital** - Ao completar 100%
- [ ] **Modo Offline** - Baixar missões para ler offline
- [ ] **Áudio Narrado** - Opção de ouvir textos
- [ ] **Quiz/Questionário** - Testar conhecimento

---

## 🐛 Troubleshooting

### Problema: Missões não aparecem
**Solução:**
```sql
-- Verificar se migrations foram executadas
SELECT COUNT(*) FROM missions_content;
-- Deve retornar 50
```

### Problema: Progresso não salva
**Solução:**
1. Verificar se `profile_id` está no localStorage
2. Verificar conexão com Supabase
3. Checar console do navegador (F12)

### Problema: Vídeos não carregam
**Solução:**
- URLs de vídeo são placeholders
- Substituir por URLs reais do YouTube
- Formato: `https://www.youtube.com/watch?v=VIDEO_ID`

---

## 📚 Referências

### Conteúdo Educativo Baseado Em
- Lei Maria da Penha (Lei nº 11.340/2006)
- Central de Atendimento à Mulher (180)
- Instituto Maria da Penha
- ONU Mulheres
- Ministério da Mulher, Família e Direitos Humanos

### Tecnologias Utilizadas
- **Supabase** - Banco de dados e backend
- **React** - Interface
- **TypeScript** - Tipagem
- **shadcn/ui** - Componentes UI

---

## ✅ Checklist de Implementação

- [x] Criar tabelas no banco de dados
- [x] Inserir 40 textos educativos
- [x] Inserir 10 vídeos (URLs placeholder)
- [x] Hook `useMissions` funcional
- [x] Componente `MissionCard` criado
- [x] Componente `MissionReader` criado
- [x] Componente `ProgressStats` criado
- [x] Integração com página principal
- [x] Sistema de progresso funcionando
- [ ] Substituir URLs de vídeos reais
- [ ] Testes com usuárias reais
- [ ] Sistema de badges/conquistas
- [ ] Certificado de conclusão

---

## 🎉 Impacto Esperado

### Educação e Empoderamento
- **50 missões** educativas completas
- **4 módulos** temáticos organizados
- **Textos + vídeos** para diferentes estilos de aprendizado
- **Gamificação** para motivar conclusão

### Métricas de Sucesso
- **Meta:** 70% das usuárias completam pelo menos 10 missões
- **Meta:** 30% completam todos os 4 módulos
- **Meta:** Redução de 50% no tempo até buscar ajuda

---

**Desenvolvido com ❤️ para educar e fortalecer mulheres**

_Última atualização: 19 de Outubro de 2025_
