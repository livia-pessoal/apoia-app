# ⚡ GUIA RÁPIDO DE REFERÊNCIA

Comandos e snippets úteis para desenvolvimento diário no projeto Apoia.

---

## 🚀 Comandos Essenciais

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar dev server (localhost:8080)
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

### Git
```bash
# Clone
git clone <repo-url>

# Branch nova feature
git checkout -b feature/nome-da-feature

# Commit
git add .
git commit -m "feat: descrição da feature"

# Push
git push origin feature/nome-da-feature
```

---

## 🎨 Cores Rápidas

```typescript
// Principais
className="bg-primary text-primary-foreground"
className="bg-accent text-accent-foreground"
className="bg-destructive text-destructive-foreground"
className="bg-success text-success-foreground"

// Transparências
className="bg-primary/10"     // 10%
className="bg-primary/20"     // 20%
className="bg-destructive/10" // Vermelho suave

// Texto
className="text-primary"
className="text-muted-foreground"
className="text-destructive"
```

---

## 🧩 Snippets de Componentes

### Novo Componente Básico
```typescript
// components/MeuComponente.tsx
import { FC } from "react";

interface MeuComponenteProps {
  title: string;
  onAction?: () => void;
}

export const MeuComponente: FC<MeuComponenteProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {onAction && (
        <button onClick={onAction}>Ação</button>
      )}
    </div>
  );
};
```

### Card Padrão
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icon } from "lucide-react";

<Card className="bg-gradient-card shadow-soft hover:shadow-elevated transition-all">
  <CardHeader>
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>
```

### Botão com Ícone
```typescript
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

<Button variant="emergency" size="lg">
  <Phone className="w-4 h-4 mr-2" />
  Ligar 180
</Button>
```

### Toast
```typescript
import { toast } from "sonner";

// Success
toast.success("Ação realizada com sucesso!");

// Error
toast.error("Erro ao realizar ação");

// Info
toast.info("Informação importante");

// Com ação
toast.success("Salvo!", {
  action: {
    label: "Desfazer",
    onClick: () => console.log("Undo")
  }
});
```

---

## 🎯 Hooks Úteis

### useState com TypeScript
```typescript
const [isOpen, setIsOpen] = useState<boolean>(false);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);
```

### useNavigate
```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Ir para rota
navigate("/app");

// Voltar
navigate(-1);

// Replace (não adiciona ao histórico)
navigate("/", { replace: true });
```

### useEffect
```typescript
// Executar uma vez (mount)
useEffect(() => {
  console.log("Montado!");
}, []);

// Executar quando dependência muda
useEffect(() => {
  console.log("Count mudou:", count);
}, [count]);

// Cleanup
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

### localStorage Helper
```typescript
// Salvar
localStorage.setItem("userProfile", "user");

// Recuperar
const profile = localStorage.getItem("userProfile");

// Remover
localStorage.removeItem("userProfile");

// Limpar tudo
localStorage.clear();

// Com JSON
localStorage.setItem("data", JSON.stringify({ id: 1 }));
const data = JSON.parse(localStorage.getItem("data") || "{}");
```

---

## 📐 Layouts Comuns

### Container Centralizado
```typescript
<div className="min-h-screen flex items-center justify-center p-6">
  <div className="w-full max-w-4xl">
    {/* Conteúdo */}
  </div>
</div>
```

### Grid Responsivo
```typescript
// 1 col mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Flex Center
```typescript
<div className="flex items-center justify-center gap-4">
  {/* Itens centralizados */}
</div>

<div className="flex items-center justify-between">
  <span>Esquerda</span>
  <span>Direita</span>
</div>
```

### Seção Padrão
```typescript
<section className="py-12 px-6 max-w-6xl mx-auto">
  <h2 className="text-3xl font-bold mb-8">Título</h2>
  {/* Conteúdo */}
</section>
```

---

## 🎨 Classes Úteis

### Hover Effects
```typescript
className="hover:scale-105 transition-all duration-300"
className="hover:shadow-elevated transition-all"
className="hover:-translate-y-1 transition-all"
className="hover:bg-primary/10"
```

### Responsivo
```typescript
// Texto
className="text-4xl md:text-5xl lg:text-6xl"

// Padding
className="p-4 md:p-6 lg:p-8"

// Grid
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Visibilidade
className="hidden md:block"        // Esconde em mobile
className="block md:hidden"        // Mostra só em mobile
```

### Truncate Text
```typescript
className="truncate"                          // Uma linha
className="line-clamp-2"                      // 2 linhas
className="overflow-hidden text-ellipsis"    // Manual
```

---

## 🔍 Debug

### Console Logging
```typescript
// Development only
if (import.meta.env.DEV) {
  console.log("Debug:", data);
}

// Com estilo
console.log("%c Importante!", "color: red; font-size: 20px");
```

### React DevTools
```bash
# Chrome/Firefox Extension
# Instalar: React Developer Tools
```

### Inspecionar State
```typescript
useEffect(() => {
  console.log("State atual:", { user, isOpen, data });
}, [user, isOpen, data]);
```

---

## 🧪 Testes (Futuro)

### Jest - Unit Test
```typescript
// MeuComponente.test.tsx
import { render, screen } from "@testing-library/react";
import { MeuComponente } from "./MeuComponente";

test("renderiza título", () => {
  render(<MeuComponente title="Teste" />);
  expect(screen.getByText("Teste")).toBeInTheDocument();
});
```

### Playwright - E2E Test
```typescript
// tests/calculator.spec.ts
import { test, expect } from "@playwright/test";

test("senha secreta redireciona", async ({ page }) => {
  await page.goto("/");
  await page.click('text="1"');
  await page.click('text="9"');
  await page.click('text="0"');
  await page.click('text="4"');
  
  await expect(page).toHaveURL("/profile-select");
});
```

---

## 🔐 localStorage Keys

```typescript
// Chaves usadas no projeto
const KEYS = {
  USER_PROFILE: "userProfile",        // "user" | "supporter"
  // Futuro:
  USER_TOKEN: "authToken",
  USER_DATA: "userData",
  EMERGENCY_CONTACTS: "emergencyContacts",
};

// Uso
localStorage.setItem(KEYS.USER_PROFILE, "user");
```

---

## 🎯 Ícones Comuns

```typescript
import {
  // Navegação
  Home, Users, Shield, Bell, User,
  
  // Ações
  Phone, MapPin, MessageCircle, FileText,
  Heart, TrendingUp, Award, Sparkles,
  
  // UI
  X, Menu, Search, ChevronRight, ChevronDown,
  
  // Estados
  Check, AlertCircle, Info, AlertTriangle,
} from "lucide-react";
```

---

## 📱 Breakpoints

```typescript
// TailwindCSS
sm: 640px    // Tablet pequeno
md: 768px    // Tablet
lg: 1024px   // Desktop
xl: 1280px   // Desktop grande
2xl: 1400px  // Desktop extra grande

// Uso
className="w-full md:w-1/2 lg:w-1/3"
```

---

## 🎨 Gradientes

```typescript
// Background
className="bg-gradient-primary"  // Roxo-rosa
className="bg-gradient-hero"     // Fundo suave
className="bg-gradient-card"     // Card sutil

// Texto
className="bg-gradient-primary bg-clip-text text-transparent"
```

---

## ⚡ Performance

### Lazy Loading
```typescript
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));

<Suspense fallback={<div>Carregando...</div>}>
  <Index />
</Suspense>
```

### Memoização
```typescript
import { useMemo, useCallback } from "react";

// useMemo - valores
const valorCaro = useMemo(() => {
  return calcularAlgo(a, b);
}, [a, b]);

// useCallback - funções
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

### Otimizar Imagens
```typescript
<img 
  src="image.jpg" 
  alt="Descrição"
  loading="lazy"       // Lazy load
  decoding="async"     // Async decode
/>
```

---

## 🔧 Troubleshooting Rápido

### Build falha
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot reload não funciona
```bash
# Ctrl+C para parar
npm run dev
```

### TypeScript erro
```bash
# Reiniciar TypeScript server no VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Import não encontrado
```typescript
// Verificar alias em tsconfig.json e vite.config.ts
// Usar @ para src:
import { Button } from "@/components/ui/button";
```

---

## 📚 Links Úteis

### Documentação
- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Vite](https://vitejs.dev/guide/)

### Ferramentas
- [Can I Use](https://caniuse.com) - Compatibilidade
- [Tailwind Play](https://play.tailwindcss.com) - Playground
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

## 🎓 Comandos Git Úteis

```bash
# Status
git status

# Ver mudanças
git diff

# Desfazer mudanças
git checkout -- arquivo.tsx

# Stash (salvar temporário)
git stash
git stash pop

# Ver branches
git branch -a

# Deletar branch local
git branch -d nome-branch

# Pull com rebase
git pull --rebase origin main

# Commit amend
git commit --amend
```

---

## 🔥 Snippets VS Code

Adicionar em `.vscode/snippets.json`:

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import { FC } from 'react';",
      "",
      "interface ${1:Component}Props {",
      "  ${2:prop}: ${3:string};",
      "}",
      "",
      "export const ${1:Component}: FC<${1:Component}Props> = ({ ${2:prop} }) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "};"
    ]
  },
  "useState Hook": {
    "prefix": "ust",
    "body": [
      "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:type}>(${3:initialValue});"
    ]
  }
}
```

---

## 🎯 Checklist Antes de Commitar

- [ ] Código compilando sem erros
- [ ] Lint passou (npm run lint)
- [ ] Código formatado
- [ ] Imports organizados
- [ ] Console.logs removidos
- [ ] Comentários úteis adicionados
- [ ] TypeScript sem errors
- [ ] Testado em mobile e desktop
- [ ] Commit message claro

---

## 💡 Dicas Rápidas

1. **Use `cn()` para classes condicionais**
2. **Prefira `const` sobre `let`**
3. **Sempre tipar props e state**
4. **Extraia lógica para hooks customizados**
5. **Use memo/callback para performance**
6. **Mobile-first sempre**
7. **Acessibilidade primeiro (aria-labels)**
8. **Gradientes para destaques**
9. **Hover effects em interativos**
10. **Documentar código complexo**

---

**Última Atualização:** Outubro 2025  
**Versão:** 1.0
