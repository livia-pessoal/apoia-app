# 🔧 GUIA TÉCNICO DE IMPLEMENTAÇÃO

## 📚 Índice
1. [Arquitetura do Projeto](#arquitetura)
2. [Configuração do Ambiente](#ambiente)
3. [Estrutura de Código](#estrutura)
4. [Gerenciamento de Estado](#estado)
5. [Roteamento](#roteamento)
6. [Estilização](#estilizacao)
7. [Boas Práticas](#boas-praticas)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura do Projeto {#arquitetura}

### Stack Tecnológica

```
┌─────────────────────────────────────────┐
│         Frontend (React 18)              │
├─────────────────────────────────────────┤
│  • TypeScript 5.8.3                     │
│  • React Router DOM 6.30.1              │
│  • TanStack Query 5.83.0                │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│         UI Layer                         │
├─────────────────────────────────────────┤
│  • shadcn/ui (Radix UI)                 │
│  • Lucide Icons                         │
│  • React Hook Form + Zod                │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│         Styling                          │
├─────────────────────────────────────────┤
│  • TailwindCSS 3.4.17                   │
│  • CSS Variables (HSL)                  │
│  • Custom Gradients & Shadows           │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│         Build Tool                       │
├─────────────────────────────────────────┤
│  • Vite 5.4.19                          │
│  • SWC (Fast Refresh)                   │
│  • PostCSS + Autoprefixer               │
└─────────────────────────────────────────┘
```

### Padrão de Arquitetura

**MVC Adaptado:**
- **Model:** Estado local (useState) + localStorage
- **View:** Componentes React (.tsx)
- **Controller:** Hooks + Event Handlers

**Componentização:**
```
src/
├── pages/           # Container Components (rotas)
├── components/      # Presentational Components
│   ├── sections/    # Seções compostas
│   └── ui/          # Componentes primitivos
├── hooks/           # Custom Hooks (lógica reutilizável)
└── lib/             # Utilitários puros
```

---

## ⚙️ Configuração do Ambiente {#ambiente}

### Pré-requisitos

```bash
Node.js: >= 18.0.0
npm: >= 9.0.0
# ou
bun: >= 1.0.0
```

### Instalação

```bash
# 1. Clone o repositório
git clone <repo-url>
cd s-dream-weave-main

# 2. Instale dependências
npm install
# ou
bun install

# 3. Inicie dev server
npm run dev
# Acessa em http://localhost:8080

# 4. Build de produção
npm run build

# 5. Preview da build
npm run preview
```

### Variáveis de Ambiente

**Criar `.env.local`:**
```env
# API Endpoints (futuro)
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_CHAT=false
VITE_ENABLE_GEOLOCATION=false

# Integrações
VITE_MAPS_API_KEY=your_key_here
```

**Acessar no código:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📁 Estrutura de Código {#estrutura}

### Anatomia de uma Página

**Exemplo: Calculator.tsx**

```typescript
// 1. Imports
import { useState } from "react";           // React hooks
import { useNavigate } from "react-router-dom"; // Roteamento
import { Button } from "@/components/ui/button"; // UI components

// 2. Componente Principal
const Calculator = () => {
  // 3. Hooks (sempre no topo)
  const navigate = useNavigate();
  
  // 4. Estado local
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState("");
  const [operation, setOperation] = useState("");

  // 5. Funções auxiliares
  const handleNumber = (num: string) => {
    // Lógica
  };

  const calculate = () => {
    // Lógica
  };

  // 6. Return JSX
  return (
    <div className="min-h-screen">
      {/* UI */}
    </div>
  );
};

// 7. Export
export default Calculator;
```

### Anatomia de um Componente

**Exemplo: FeatureCard.tsx**

```typescript
// 1. Imports de tipos
import { LucideIcon } from "lucide-react";

// 2. Imports de componentes
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

// 3. Interface de Props
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "hero" | "emergency";
  onButtonClick?: () => void;
}

// 4. Componente (com destructuring)
export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonVariant = "default",
  onButtonClick,
}: FeatureCardProps) => {
  return (
    <Card>
      <CardHeader>
        <Icon className="w-6 h-6" />
        <h3>{title}</h3>
        <p>{description}</p>
      </CardHeader>
      <CardContent>
        <Button variant={buttonVariant} onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
```

### Padrões de Nomenclatura

**Arquivos:**
- Componentes: `PascalCase.tsx` (ex: `FeatureCard.tsx`)
- Hooks: `kebab-case.tsx` (ex: `use-mobile.tsx`)
- Utilitários: `kebab-case.ts` (ex: `utils.ts`)
- Páginas: `PascalCase.tsx` (ex: `Calculator.tsx`)

**Variáveis:**
- Componentes: `PascalCase` (ex: `FeatureCard`)
- Funções: `camelCase` (ex: `handleNumber`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `MOBILE_BREAKPOINT`)
- Props Interface: `ComponentNameProps`

**Classes CSS:**
- TailwindCSS: `kebab-case` (ex: `bg-primary`)
- Custom: `kebab-case` (ex: `shadow-soft`)

---

## 💾 Gerenciamento de Estado {#estado}

### Estado Local (useState)

**Quando usar:**
- Estado específico de um componente
- Não precisa ser compartilhado
- Valores simples

**Exemplo:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
```

### localStorage

**Chaves usadas no projeto:**
```typescript
// Perfil do usuário
localStorage.setItem("userProfile", "user" | "supporter");
localStorage.getItem("userProfile");
localStorage.removeItem("userProfile");
```

**Helper (criar em utils.ts):**
```typescript
// lib/storage.ts
export const storage = {
  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  }
};

// Uso:
import { storage } from "@/lib/storage";
storage.set("userProfile", "user");
const profile = storage.get<string>("userProfile");
```

### Context API (Futuro)

**Para estado global:**
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  login: (profile: "user" | "supporter") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (profile: "user" | "supporter") => {
    storage.set("userProfile", profile);
    setUser({ profile });
  };

  const logout = () => {
    storage.remove("userProfile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

### TanStack Query

**Configuração:**
```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

<QueryClientProvider client={queryClient}>
  {/* App */}
</QueryClientProvider>
```

**Uso (futuro - fetch de API):**
```typescript
// hooks/useEmergencyContacts.ts
import { useQuery } from "@tanstack/react-query";

interface Contact {
  id: string;
  name: string;
  phone: string;
  type: "ong" | "police" | "support";
}

export const useEmergencyContacts = () => {
  return useQuery({
    queryKey: ["emergencyContacts"],
    queryFn: async (): Promise<Contact[]> => {
      const response = await fetch("/api/contacts");
      return response.json();
    },
  });
};

// Uso no componente:
const { data: contacts, isLoading, error } = useEmergencyContacts();
```

---

## 🛤️ Roteamento {#roteamento}

### Estrutura Atual

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Calculator />} />
    <Route path="/profile-select" element={<ProfileSelect />} />
    <Route path="/app" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Navegação Programática

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navegar para rota
navigate("/app");

// Navegar com replace (não adiciona ao histórico)
navigate("/", { replace: true });

// Voltar
navigate(-1);
```

### Proteção de Rotas

**Criar componente ProtectedRoute:**
```typescript
// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { storage } from "@/lib/storage";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const profile = storage.get<string>("userProfile");
  
  if (!profile) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Uso em App.tsx:
<Route 
  path="/app" 
  element={
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  } 
/>
```

### Parâmetros de Rota (Futuro)

```typescript
// Definir rota com parâmetro
<Route path="/chat/:userId" element={<Chat />} />

// Acessar parâmetro
import { useParams } from "react-router-dom";

const { userId } = useParams<{ userId: string }>();
```

### Query Parameters (Futuro)

```typescript
import { useSearchParams } from "react-router-dom";

const [searchParams, setSearchParams] = useSearchParams();

// Ler
const tab = searchParams.get("tab"); // ?tab=emergency

// Definir
setSearchParams({ tab: "emergency" });
```

---

## 🎨 Estilização {#estilizacao}

### Sistema de Cores

**Definição (index.css):**
```css
:root {
  --background: 280 40% 98%;
  --primary: 280 65% 60%;
  --accent: 290 70% 65%;
  /* ... */
}
```

**Uso (TailwindCSS):**
```typescript
<div className="bg-background text-foreground">
  <h1 className="text-primary">Título</h1>
  <span className="text-accent">Destaque</span>
</div>
```

### Função cn() - Class Names

**Implementação:**
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Uso:**
```typescript
import { cn } from "@/lib/utils";

// Classes condicionais
<Button 
  className={cn(
    "base-class",
    isActive && "active-class",
    isDisabled && "disabled-class",
    className // Props do componente
  )}
>
  Botão
</Button>

// Com objetos
<div 
  className={cn({
    "bg-primary": isPrimary,
    "bg-secondary": !isPrimary,
    "text-lg": isLarge,
  })}
/>
```

### Responsividade

**Mobile First:**
```typescript
// Base: mobile (< 640px)
// sm: tablet pequeno (>= 640px)
// md: tablet (>= 768px)
// lg: desktop (>= 1024px)
// xl: desktop grande (>= 1280px)

<div className="
  w-full           /* mobile */
  sm:w-1/2         /* >= 640px */
  md:w-1/3         /* >= 768px */
  lg:w-1/4         /* >= 1024px */
">
  Conteúdo
</div>
```

**Hook personalizado:**
```typescript
// hooks/use-mobile.tsx
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

// Uso:
const isMobile = useIsMobile();

return (
  <>
    {isMobile ? <MobileMenu /> : <DesktopMenu />}
  </>
);
```

### Animações

**TailwindCSS:**
```typescript
// Transições
<div className="transition-all duration-300 hover:scale-105">
  Hover me
</div>

// Animações customizadas (tailwind.config.ts)
animation: {
  "fade-in": "fadeIn 0.3s ease-in",
}

// Uso:
<div className="animate-fade-in">
  Fade in
</div>
```

**Framer Motion (Futuro):**
```bash
npm install framer-motion
```

```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Animado
</motion.div>
```

---

## ✅ Boas Práticas {#boas-praticas}

### TypeScript

**1. Sempre tipar props:**
```typescript
// ❌ Ruim
const Button = ({ onClick, children }) => { ... }

// ✅ Bom
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => { ... }
```

**2. Usar tipos genéricos:**
```typescript
// ❌ Ruim
const [data, setData] = useState(null);

// ✅ Bom
const [data, setData] = useState<User | null>(null);
```

**3. Evitar any:**
```typescript
// ❌ Ruim
const handleClick = (event: any) => { ... }

// ✅ Bom
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { ... }
```

### React

**1. Extrair lógica para hooks:**
```typescript
// ❌ Ruim - lógica no componente
const Component = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch("/api/data").then(r => r.json()).then(setData);
  }, []);
  
  return <div>{data.map(...)}</div>;
};

// ✅ Bom - hook customizado
const useData = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch("/api/data").then(r => r.json()).then(setData);
  }, []);
  
  return data;
};

const Component = () => {
  const data = useData();
  return <div>{data.map(...)}</div>;
};
```

**2. Memoização quando necessário:**
```typescript
import { useMemo, useCallback } from "react";

// useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// useCallback para funções passadas como props
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

**3. Componentes puros:**
```typescript
// ❌ Ruim - side effects no corpo
const Component = () => {
  console.log("Renderizado!");
  return <div>...</div>;
};

// ✅ Bom - side effects em useEffect
const Component = () => {
  useEffect(() => {
    console.log("Montado!");
  }, []);
  
  return <div>...</div>;
};
```

### Performance

**1. Lazy loading de rotas:**
```typescript
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/app" element={<Index />} />
  </Routes>
</Suspense>
```

**2. Code splitting:**
```typescript
// Importação dinâmica
const loadHeavyComponent = async () => {
  const module = await import("./HeavyComponent");
  return module.HeavyComponent;
};
```

**3. Otimização de imagens:**
```typescript
// Usar loading="lazy"
<img src="image.jpg" loading="lazy" alt="..." />

// Formatos modernos
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

---

## 🐛 Troubleshooting {#troubleshooting}

### Problemas Comuns

**1. Build falha:**
```bash
# Limpar cache
rm -rf node_modules
rm package-lock.json
npm install

# ou
bun install
```

**2. Hot reload não funciona:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Para WSL/Docker
    },
  },
});
```

**3. Import absoluto não funciona:**
```typescript
// Verificar tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// E vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

**4. localStorage não persiste:**
```typescript
// Verificar se está em modo privado/incógnito
// Usar try-catch:
try {
  localStorage.setItem("key", "value");
} catch (e) {
  console.error("localStorage indisponível", e);
  // Fallback para memória
}
```

### Debug

**React DevTools:**
```bash
# Instalar extensão do navegador
# Chrome: React Developer Tools
# Firefox: React DevTools
```

**Console logging:**
```typescript
// Development only
if (import.meta.env.DEV) {
  console.log("Debug:", data);
}
```

**Error Boundaries:**
```typescript
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}

// Uso:
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🚀 Deploy

### Build de Produção

```bash
# 1. Build
npm run build
# ou
bun run build

# Output em /dist

# 2. Preview local
npm run preview

# 3. Deploy
# Copiar conteúdo de /dist para servidor
```

### Variáveis de Ambiente em Produção

```bash
# .env.production
VITE_API_URL=https://api.apoia.com
VITE_WS_URL=wss://api.apoia.com
```

### Plataformas de Deploy

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Configuração:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

**Documento vivo - atualizar conforme projeto evolui**
