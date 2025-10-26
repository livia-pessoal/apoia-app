# 🛠️ STACK TECNOLÓGICO - APOIA

**Guia Completo de Todas as Tecnologias Usadas**

---

## 📊 Visão Geral

| Camada | Tecnologias Principais |
|--------|------------------------|
| **Frontend** | React 18.3, TypeScript 5.8, Vite 5.4 |
| **UI Framework** | TailwindCSS 3.4, shadcn/ui, Radix UI |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **IA** | Google Gemini 2.5 Flash |
| **Mapas** | React Leaflet + OpenStreetMap |
| **Estado** | TanStack Query, React Hooks |
| **Roteamento** | React Router DOM 6.30 |

---

## 🎨 Frontend

### Core Libraries

#### **React 18.3.1**
- **Função:** Biblioteca UI principal
- **Por quê:** 
  - Componentização
  - Hooks poderosos
  - Performance otimizada
  - Ecossistema maduro
- **Uso no Projeto:**
  - 70+ componentes
  - 5 hooks customizados
  - Composição e reutilização

**Instalação:**
```bash
npm install react@18.3.1 react-dom@18.3.1
```

---

#### **TypeScript 5.8.3**
- **Função:** Tipagem estática
- **Por quê:**
  - Menos bugs
  - Autocompletion
  - Refatoração segura
  - Documentação viva
- **Uso no Projeto:**
  - Interfaces para dados
  - Tipos para props
  - Tipos para hooks
  - Type-safe API calls

**Instalação:**
```bash
npm install -D typescript@5.8.3 @types/react @types/react-dom
```

**Configuração:** `tsconfig.json`

---

#### **Vite 5.4.19**
- **Função:** Build tool e dev server
- **Por quê:**
  - HMR ultra-rápido
  - Build otimizado
  - Dev experience excelente
  - Suporte TypeScript nativo
- **Uso no Projeto:**
  - Dev server em http://localhost:8080
  - Build de produção otimizado
  - Environment variables (.env)

**Instalação:**
```bash
npm install -D vite@5.4.19 @vitejs/plugin-react
```

**Configuração:** `vite.config.ts`

---

### UI Framework

#### **TailwindCSS 3.4.17**
- **Função:** Utility-first CSS framework
- **Por quê:**
  - Desenvolvimento rápido
  - Consistência visual
  - Sem CSS custom
  - Purge automático (menor bundle)
- **Uso no Projeto:**
  - 100% do styling
  - Design system baseado em classes
  - Responsividade simples
  - Dark mode preparado

**Instalação:**
```bash
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init -p
```

**Configuração:** `tailwind.config.ts`

**Design System:** `src/index.css`
- Cores HSL customizadas
- Variáveis CSS
- Gradientes
- Sombras

---

#### **shadcn/ui**
- **Função:** Componentes React acessíveis
- **Por quê:**
  - Baseado em Radix UI
  - Totalmente customizável
  - Acessível (WCAG AA)
  - Copy-paste (não NPM)
- **Componentes Usados:**
  - Button, Card, Dialog, Tabs
  - Badge, Progress, Separator
  - Input, Textarea, Select
  - Toast (Sonner), Avatar
  - 50+ componentes UI

**Instalação:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog tabs ...
```

**Configuração:** `components.json`

---

#### **Radix UI**
- **Função:** Primitivos UI acessíveis
- **Por quê:**
  - WAI-ARIA completo
  - Keyboard navigation
  - Focus management
  - Unstyled (customizável)
- **Pacotes:**
  - @radix-ui/react-dialog
  - @radix-ui/react-tabs
  - @radix-ui/react-progress
  - @radix-ui/react-avatar
  - @radix-ui/react-separator
  - @radix-ui/react-label
  - @radix-ui/react-select

**Instalação:** (via shadcn/ui)

---

#### **Lucide React**
- **Função:** Ícones
- **Por quê:**
  - 1.000+ ícones
  - Consistente
  - Tree-shakeable
  - TypeScript support
- **Ícones Mais Usados:**
  - Trophy, Award, Star (conquistas)
  - Bell, AlertCircle, Info (notificações)
  - Users, Heart, Shield (rede)
  - Map, MapPin, Navigation (mapa)
  - MessageCircle, Send, Phone (chat)
  - Home, Settings, LogOut (navegação)

**Instalação:**
```bash
npm install lucide-react
```

**Uso:**
```typescript
import { Trophy, Bell, Users } from 'lucide-react';

<Trophy className="w-6 h-6 text-purple-600" />
```

---

### Estado e Dados

#### **TanStack Query (React Query)**
- **Função:** Gerenciamento de estado assíncrono
- **Por quê:**
  - Cache automático
  - Refetch inteligente
  - Loading/error states
  - Optimistic updates
- **Uso no Projeto:**
  - Fetch de organizações
  - Queries com cache
  - Invalidação automática

**Instalação:**
```bash
npm install @tanstack/react-query
```

---

#### **React Hooks**
- **Função:** Gerenciamento de estado local
- **Hooks Nativos Usados:**
  - useState (estado local)
  - useEffect (side effects)
  - useNavigate (roteamento)
  - useCallback (memorização)
  - useMemo (computed values)
- **Hooks Customizados (5):**
  1. useAuth.ts (autenticação)
  2. useOrganizations.ts (ONGs)
  3. useMissions.ts (missões)
  4. useAchievements.ts (conquistas)
  5. useNotifications.ts (notificações)

---

#### **LocalStorage**
- **Função:** Persistência local
- **Uso no Projeto:**
  - `profile_id` - ID do usuário logado
  - `display_name` - Nome exibido
  - `user_type` - 'user' ou 'supporter'
- **Limpeza:** Ao fazer logout

---

### Roteamento

#### **React Router DOM 6.30.1**
- **Função:** Roteamento client-side
- **Por quê:**
  - SPA navigation
  - Protected routes
  - URL parameters
  - History management
- **Rotas do Projeto:**
  - `/` - Calculator (home)
  - `/profile-select` - Escolha user/supporter
  - `/register` - Cadastro
  - `/supporter-login` - Login apoiadora
  - `/app` - App principal (autenticado)

**Instalação:**
```bash
npm install react-router-dom@6.30.1
```

---

## 🗄️ Backend

### **Supabase**
- **Função:** Backend as a Service (BaaS)
- **Por quê:**
  - PostgreSQL gerenciado
  - Auth built-in
  - Realtime subscriptions
  - Row Level Security
  - API REST automática
  - Gratuito até 500MB

**Serviços Usados:**

#### 1. **PostgreSQL Database**
- 15 tabelas criadas
- 10 migrations
- Relacionamentos CASCADE
- Índices de performance
- Constraints e validações

**Tabelas Principais:**
- profiles, organizations, emergency_calls
- missions_content, user_mission_progress
- achievements, user_achievements
- notifications
- trusted_contacts, emergency_alerts
- incident_reports, police_stations
- chat_rooms, chat_messages

#### 2. **Authentication**
- Email + Senha para apoiadoras
- Session management
- JWT tokens
- Secure por padrão

**Configuração:**
- Disable email confirmation (dev)
- Custom SMTP (produção)

#### 3. **Realtime**
- WebSocket subscriptions
- Used in:
  - Notificações (badge atualiza)
  - Chat anônimo (mensagens)
  - Conquistas (progresso)

**Exemplo:**
```typescript
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, handleNewNotification)
  .subscribe();
```

#### 4. **Row Level Security (RLS)**
- Segurança a nível de linha
- Policies por tabela
- 30+ policies criadas
- Exemplos:
  - Usuário vê apenas suas notificações
  - Usuário vê apenas suas conquistas
  - Qualquer um vê organizations

#### 5. **Storage** (preparado)
- Upload de fotos
- Avatares
- Evidências de ocorrências
- Não implementado ainda

**Instalação:**
```bash
npm install @supabase/supabase-js
```

**Configuração:** `src/lib/supabase.ts`

**Variáveis de Ambiente:**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

### **SQL e Migrations**

#### **Migrations (10 arquivos)**
1. `001_simple_schema.sql` - Tabelas base
2. `002_add_supporter_fields.sql` - Campos apoiadoras
3. `003_missions_system.sql` - Sistema missões
4. `003_missions_data.sql` - 50 missões
5. `005_incident_reports.sql` - Ocorrências + delegacias
6. `006_anonymous_chat.sql` - Chat
7. `007_support_network.sql` - Rede apoio + SOS
8. `008_notifications.sql` - Notificações
9. `009_profile_enhancements.sql` - Perfil + stats
10. `010_achievements_SAFE.sql` - Conquistas

#### **Funções SQL (8)**
1. `unlock_achievement(user_id, code)`
2. `update_achievement_progress(user_id, code, increment)`
3. `get_user_achievements(user_id)`
4. `get_profile_stats(user_id)`
5. `update_last_seen()`
6. `mark_notification_as_read(notification_id)`
7. `mark_all_notifications_as_read(user_id)`
8. `cleanup_old_notifications()`

#### **Triggers (6)**
1. `auto_approve_users_trigger` - Aprova usuárias
2. `create_welcome_notification_trigger` - Notif. boas-vindas
3. `give_welcome_achievement_trigger` - Conquista boas-vindas
4. `track_mission_achievement_trigger` - Progresso missões
5. `track_network_achievement_trigger` - Progresso rede
6. `update_last_seen_trigger` - Última atividade

---

## 🤖 Inteligência Artificial

### **Google Gemini 2.5 Flash**
- **Função:** Análise de perfis de apoiadoras
- **Por quê:**
  - API gratuita (60 req/min)
  - Resposta rápida (2-3s)
  - Bom em análise de texto
  - Configurável

**Modelo:** `gemini-2.5-flash`

**Plano Gratuito:**
- 60 requests/minuto
- 1.500 requests/dia
- Suficiente para MVP

**Uso no Projeto:**
- Analisar motivação de apoiadoras
- Detectar spam/bots
- Aprovar/rejeitar/revisar

**Critérios:**
- Motivação genuína
- Texto coerente
- Email válido
- Telefone válido
- Causas sociais alinhadas

**Taxa de Precisão:** ~85-90%

**Instalação:**
```bash
npm install @google/genai
```

**Configuração:** `src/lib/gemini.ts`

**Variável de Ambiente:**
```env
VITE_GEMINI_API_KEY=AIzaSy...
```

**API Key:** [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🗺️ Mapas e Geolocalização

### **React Leaflet**
- **Função:** Componentes React para Leaflet
- **Por quê:**
  - Integração fácil com React
  - TypeScript support
  - Hooks customizados
  - Performático

**Instalação:**
```bash
npm install react-leaflet leaflet
npm install -D @types/leaflet
```

**Componentes Usados:**
- MapContainer
- TileLayer
- Marker
- Popup
- Circle
- useMap

---

### **Leaflet.js**
- **Função:** Biblioteca de mapas open source
- **Por quê:**
  - Gratuito e open source
  - Leve (~39KB)
  - Personalizável
  - Mobile-friendly

**Tiles:** OpenStreetMap (gratuito)

**URL:**
```
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

**CSS:** Incluído em `index.css`

---

### **Geolocation API HTML5**
- **Função:** Pegar localização do usuário
- **Por quê:**
  - Nativo do navegador
  - Sem dependências
  - Funciona em mobile
  - Permissão explícita

**Uso:**
```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Usar coordenadas
  },
  (error) => console.error(error)
);
```

---

### **Haversine Formula**
- **Função:** Calcular distância entre coordenadas
- **Por quê:**
  - Precisão adequada
  - Cálculo simples
  - Não precisa API externa

**Implementação:**
```typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

---

## 📚 Utilitários

### **date-fns**
- **Função:** Manipulação de datas
- **Por quê:**
  - Tree-shakeable
  - Imutável
  - TypeScript support
  - Localização (ptBR)

**Instalação:**
```bash
npm install date-fns
```

**Uso:**
```typescript
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

formatDistanceToNow(date, { 
  addSuffix: true,
  locale: ptBR 
});
// "há 3 horas"
```

---

### **clsx + tailwind-merge**
- **Função:** Combinar classes Tailwind
- **Por quê:**
  - Condicional simples
  - Resolve conflitos
  - Type-safe

**Instalação:**
```bash
npm install clsx tailwind-merge
```

**Utility:** `src/lib/utils.ts`
```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

---

### **Sonner**
- **Função:** Toast notifications
- **Por quê:**
  - Simples e bonito
  - Acessível
  - Stacking automático
  - Customizável

**Instalação:**
```bash
npm install sonner
```

**Uso:**
```typescript
import { toast } from 'sonner';

toast.success('Conquista desbloqueada!');
toast.error('Erro ao salvar');
toast.info('Nova notificação');
```

---

## 📦 Dependências Completas

### **package.json**

```json
{
  "dependencies": {
    "@google/genai": "^0.21.0",
    "@radix-ui/react-*": "^1.0.0",
    "@supabase/supabase-js": "^2.39.3",
    "@tanstack/react-query": "^5.17.15",
    "clsx": "^2.1.0",
    "date-fns": "^3.3.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.309.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-leaflet": "^4.2.1",
    "react-router-dom": "^6.30.1",
    "sonner": "^1.3.1",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8",
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vite": "^5.4.19"
  }
}
```

---

## 🏗️ Arquitetura

### **Estrutura de Pastas**

```
src/
├── pages/          # Páginas (rotas)
│   ├── Calculator.tsx
│   ├── ProfileSelect.tsx
│   ├── Register.tsx
│   ├── SupporterLogin.tsx
│   └── Index.tsx
│
├── components/     # Componentes reutilizáveis
│   ├── ui/         # shadcn/ui components
│   ├── sections/   # Seções da landing
│   ├── MissionCard.tsx
│   ├── AchievementsTabDiscreto.tsx
│   ├── NotificationsTab.tsx
│   ├── SupportNetwork.tsx
│   ├── IncidentReport.tsx
│   ├── InteractiveMapSimple.tsx
│   ├── AnonymousChat.tsx
│   └── ProfileTab.tsx
│
├── hooks/          # Hooks customizados
│   ├── useAuth.ts
│   ├── useMissions.ts
│   ├── useAchievements.ts
│   └── useNotifications.ts
│
├── lib/            # Utilitários e configs
│   ├── supabase.ts
│   ├── gemini.ts
│   └── utils.ts
│
└── index.css       # Design system global
```

---

### **Padrões de Código**

#### **Component Pattern**
```typescript
interface ComponentProps {
  prop: string;
}

export default function Component({ prop }: ComponentProps) {
  // Estado
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return <div></div>;
}
```

#### **Hook Pattern**
```typescript
export function useCustomHook() {
  // Estado
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch
  useEffect(() => {
    fetchData();
  }, []);
  
  // Métodos
  const refresh = async () => {};
  
  // Return
  return {
    data,
    loading,
    error,
    refresh
  };
}
```

---

## 🔒 Segurança

### **Variáveis de Ambiente**
- Nunca commitadas no Git
- `.env.example` com placeholders
- Validação no código

### **Supabase RLS**
- Segurança a nível de banco
- Policies por operação (SELECT, INSERT, UPDATE, DELETE)
- Baseado em `auth.uid()`

### **Client-side**
- Validação de formulários
- Sanitização de inputs
- Escape de SQL (via Supabase)

### **HTTPS**
- Obrigatório em produção
- Supabase já é HTTPS
- Certificado SSL gratuito (Netlify/Vercel)

---

## 📊 Performance

### **Otimizações Implementadas**

#### **Bundle Size**
- Tree-shaking (Vite)
- Code splitting (React.lazy)
- Purge CSS (TailwindCSS)
- Compression (gzip)

#### **Carregamento**
- Lazy loading de componentes
- Imagens otimizadas
- Cache HTTP
- Service Worker (PWA futuro)

#### **Banco de Dados**
- Índices em colunas filtradas
- Queries otimizadas
- Cache com React Query
- Realtime apenas quando necessário

#### **React**
- Memo components
- useCallback para funções
- useMemo para valores computados
- Keys em listas

---

## 🚀 Deploy

### **Ambiente de Desenvolvimento**
```bash
npm run dev
# http://localhost:8080
```

### **Build de Produção**
```bash
npm run build
# Gera pasta dist/
```

### **Preview de Produção**
```bash
npm run preview
# Testa build local
```

### **Hosting Recomendado**
- **Netlify** - Gratuito, CI/CD, HTTPS
- **Vercel** - Gratuito, otimizado para React
- **GitHub Pages** - Gratuito, simples

### **Variáveis de Ambiente (Produção)**
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_GEMINI_API_KEY

---

## 📚 Aprendizado e Recursos

### **Documentação Oficial**
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Supabase](https://supabase.com/docs)
- [Google Gemini](https://ai.google.dev/docs)
- [React Leaflet](https://react-leaflet.js.org)
- [shadcn/ui](https://ui.shadcn.com)

### **Tutoriais Úteis**
- Supabase Auth: [Tutorial](https://supabase.com/docs/guides/auth)
- React Leaflet: [Quick Start](https://react-leaflet.js.org/docs/start-installation)
- TailwindCSS: [Setup Guide](https://tailwindcss.com/docs/installation)

---

## 🎯 Conclusão

### **Stack Ideal Para:**
- ✅ MVPs rápidos
- ✅ Apps com banco de dados
- ✅ Realtime features
- ✅ Autenticação segura
- ✅ Mapas interativos
- ✅ UI moderna e acessível

### **Custo Total (Mensal):**
- Supabase: R$ 0 (até 500MB)
- Gemini API: R$ 0 (plano gratuito)
- Netlify: R$ 0 (plano free)
- **TOTAL: R$ 0 para MVP**

### **Escalabilidade:**
- Supabase: Até 1M requests/mês grátis
- Gemini: 60 req/min grátis
- Hosting: Ilimitado (Netlify)
- Banco: Fácil migrar para pago (~$25/mês)

---

**Última Atualização:** 20/10/2025  
**Versão:** 1.0  
**Status:** Documentação Completa

---

_Stack escolhido pensando em MVP rápido, custo zero e facilidade de manutenção_ 💜
