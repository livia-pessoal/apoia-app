# 🎨 DESIGN SYSTEM - APOIA

## 📋 Sumário
1. [Filosofia do Design](#filosofia)
2. [Paleta de Cores](#cores)
3. [Tipografia](#tipografia)
4. [Espaçamento](#espacamento)
5. [Componentes](#componentes)
6. [Ícones](#icones)
7. [Animações](#animacoes)
8. [Acessibilidade](#acessibilidade)

---

## 💭 Filosofia do Design {#filosofia}

### Princípios Fundamentais

**1. Discrição**
- Design que parece comum/genérico à primeira vista
- Calculadora como ponto de entrada
- Sem elementos que chamem atenção indevida

**2. Acolhimento**
- Cores suaves e calmantes (roxo, rosa)
- Gradientes sutis
- Espaçamento generoso

**3. Urgência Quando Necessário**
- Botões de emergência em vermelho
- Animações pulse para chamar atenção
- Hierarquia visual clara

**4. Confiança**
- Design profissional e moderno
- Consistência em todos os elementos
- Feedback visual imediato

**5. Acessibilidade**
- Contraste adequado (WCAG AA)
- Tamanhos de toque adequados (44px mínimo)
- Suporte a leitores de tela

---

## 🎨 Paleta de Cores {#cores}

### Cores Primárias

#### Background
```css
/* Tema Claro */
--background: 280 40% 98%;        /* #F8F5FA - Roxo muito claro */
--foreground: 280 30% 15%;        /* #2B1C33 - Roxo escuro */

/* Tema Escuro */
--background: 280 30% 10%;        /* #1A1021 - Roxo muito escuro */
--foreground: 280 20% 95%;        /* #F0EEF2 - Roxo claro */
```

**Uso:**
- Background: Fundo geral da aplicação
- Foreground: Texto principal

**Exemplo:**
```typescript
<div className="bg-background text-foreground">
  Conteúdo
</div>
```

---

#### Primary (Roxo)
```css
/* Tema Claro */
--primary: 280 65% 60%;           /* #9D5BD2 - Roxo médio */
--primary-foreground: 0 0% 100%;  /* #FFFFFF - Branco */
--primary-glow: 280 70% 75%;      /* #C69FE6 - Roxo claro brilho */

/* Tema Escuro */
--primary: 280 65% 65%;           /* #A977D9 - Roxo médio claro */
--primary-glow: 280 70% 80%;      /* #D4B3F0 - Roxo claro */
```

**Significado:** Ação principal, foco, empoderamento

**Uso:**
- Botões primários
- Links importantes
- Ícones principais
- Títulos em destaque

**Exemplo:**
```typescript
<Button variant="default" className="bg-primary text-primary-foreground">
  Ação Principal
</Button>

<h1 className="text-primary">Título</h1>
```

---

#### Accent (Rosa-Roxo)
```css
/* Tema Claro */
--accent: 290 70% 65%;            /* #C756D9 - Rosa-roxo */
--accent-foreground: 0 0% 100%;   /* #FFFFFF - Branco */

/* Tema Escuro */
--accent: 290 70% 60%;            /* #B83CCE - Rosa-roxo escuro */
```

**Significado:** Apoio, carinho, conexão

**Uso:**
- Perfil de apoiadora
- Elementos de destaque secundário
- Hover states
- Ícones de "heart"

**Exemplo:**
```typescript
<div className="bg-accent/10">
  <Heart className="text-accent" />
</div>
```

---

### Cores Semânticas

#### Destructive (Vermelho)
```css
/* Tema Claro */
--destructive: 0 84.2% 60.2%;     /* #E84545 - Vermelho médio */
--destructive-foreground: 0 0% 100%; /* #FFFFFF - Branco */

/* Tema Escuro */
--destructive: 0 62.8% 50%;       /* #D02828 - Vermelho escuro */
```

**Significado:** Emergência, perigo, ações destrutivas

**Uso:**
- Botão 180 (emergência)
- Chamados urgentes
- Alertas críticos
- Ações de deletar

**Exemplo:**
```typescript
<Button variant="emergency" className="bg-destructive animate-pulse">
  Ligar 180
</Button>

<span className="text-destructive font-semibold">URGENTE</span>
```

---

#### Success (Verde)
```css
/* Tema Claro */
--success: 150 60% 50%;           /* #33CC7A - Verde médio */
--success-foreground: 0 0% 100%;  /* #FFFFFF - Branco */

/* Tema Escuro */
--success: 150 50% 45%;           /* #29A363 - Verde escuro */
```

**Significado:** Confirmação, sucesso, segurança

**Uso:**
- Botões de confirmação
- Mensagens de sucesso
- Status positivo
- Botão "=" da calculadora

**Exemplo:**
```typescript
<Button variant="success">
  Missão Completa ✓
</Button>

toast.success("Ação realizada com sucesso!");
```

---

#### Warning (Laranja)
```css
/* Tema Claro */
--warning: 35 90% 60%;            /* #F5A842 - Laranja */
--warning-foreground: 0 0% 100%;  /* #FFFFFF - Branco */
```

**Significado:** Atenção, cuidado, moderado

**Uso:**
- Alertas moderados
- Informações importantes
- Status intermediário

---

### Cores Neutras

#### Secondary (Cinza-Roxo)
```css
/* Tema Claro */
--secondary: 270 55% 88%;         /* #E4D9F2 - Cinza-roxo claro */
--secondary-foreground: 280 30% 20%; /* #3D2849 - Roxo escuro */

/* Tema Escuro */
--secondary: 280 25% 20%;         /* #2E1F38 - Cinza-roxo escuro */
--secondary-foreground: 280 20% 95%; /* #F0EEF2 - Roxo claro */
```

**Uso:**
- Botões secundários
- Backgrounds alternativos
- Cards secundários

---

#### Muted (Cinza Suave)
```css
/* Tema Claro */
--muted: 270 40% 95%;             /* #F5F2F8 - Cinza muito claro */
--muted-foreground: 280 20% 50%;  /* #8066A3 - Cinza-roxo médio */

/* Tema Escuro */
--muted: 280 20% 18%;             /* #221829 - Cinza escuro */
--muted-foreground: 280 15% 60%;  /* #9D8BAD - Cinza-roxo claro */
```

**Uso:**
- Textos secundários
- Descrições
- Placeholders
- Backgrounds sutis

---

#### Border e Input
```css
/* Tema Claro */
--border: 280 30% 90%;            /* #E8DFF2 - Roxo muito claro */
--input: 280 30% 92%;             /* #EDDFF5 - Roxo muito claro */
--ring: 280 65% 60%;              /* #9D5BD2 - Roxo (same as primary) */

/* Tema Escuro */
--border: 280 20% 22%;            /* #2B2133 - Roxo escuro */
--input: 280 20% 22%;             /* #2B2133 - Roxo escuro */
--ring: 280 65% 65%;              /* #A977D9 - Roxo médio */
```

**Uso:**
- Bordas de elementos
- Backgrounds de inputs
- Focus ring (acessibilidade)

---

### Gradientes

#### Gradient Primary
```css
--gradient-primary: linear-gradient(135deg, hsl(280 65% 60%), hsl(290 70% 70%));
```
**De:** #9D5BD2 (roxo) → **Para:** #D175E6 (rosa-roxo)

**Uso:**
- Botão hero
- Títulos importantes
- Avatares
- Elementos de destaque

**Exemplo:**
```typescript
<div className="bg-gradient-primary">
  <h1 className="bg-gradient-primary bg-clip-text text-transparent">
    Título com Gradiente
  </h1>
</div>
```

---

#### Gradient Hero
```css
/* Tema Claro */
--gradient-hero: linear-gradient(180deg, hsl(280 40% 98%), hsl(280 50% 95%));

/* Tema Escuro */
--gradient-hero: linear-gradient(180deg, hsl(280 30% 10%), hsl(280 25% 14%));
```

**Uso:**
- Background da HeroSection
- Grandes áreas de fundo
- Seções destacadas

---

#### Gradient Card
```css
/* Tema Claro */
--gradient-card: linear-gradient(135deg, hsl(0 0% 100%), hsl(280 30% 98%));

/* Tema Escuro */
--gradient-card: linear-gradient(135deg, hsl(280 25% 14%), hsl(280 25% 16%));
```

**Uso:**
- Background de cards
- StatsCard
- FeatureCard

**Exemplo:**
```typescript
<Card className="bg-gradient-card">
  Conteúdo
</Card>
```

---

### Sombras

#### Shadow Soft
```css
/* Tema Claro */
--shadow-soft: 0 4px 20px -2px hsl(280 65% 60% / 0.15);

/* Tema Escuro */
--shadow-soft: 0 4px 20px -2px hsl(280 65% 30% / 0.3);
```

**Uso:**
- Cards em estado normal
- Elementos elevados sutilmente

---

#### Shadow Elevated
```css
/* Tema Claro */
--shadow-elevated: 0 10px 40px -5px hsl(280 65% 60% / 0.25);

/* Tema Escuro */
--shadow-elevated: 0 10px 40px -5px hsl(280 65% 30% / 0.5);
```

**Uso:**
- Cards em hover
- Modais
- Dropdowns
- Elementos em foco

**Exemplo:**
```typescript
<Card className="shadow-soft hover:shadow-elevated transition-all">
  Hover para elevar
</Card>
```

---

## 📝 Tipografia {#tipografia}

### Família de Fonte

**Sistema (TailwindCSS default):**
```css
font-family: 
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
```

**Benefícios:**
- Carrega instantaneamente (não precisa baixar)
- Otimizado para cada sistema operacional
- Legível em todas as plataformas

---

### Escala de Tamanhos

```typescript
// TailwindCSS classes
text-xs    // 0.75rem (12px)
text-sm    // 0.875rem (14px)
text-base  // 1rem (16px) - padrão
text-lg    // 1.125rem (18px)
text-xl    // 1.25rem (20px)
text-2xl   // 1.5rem (24px)
text-3xl   // 1.875rem (30px)
text-4xl   // 2.25rem (36px)
text-5xl   // 3rem (48px)
text-6xl   // 3.75rem (60px)
```

### Uso por Contexto

**Títulos:**
```typescript
// H1 - Página principal
<h1 className="text-5xl md:text-6xl font-bold">
  Bem-vinda ao Apoia
</h1>

// H2 - Seção
<h2 className="text-3xl md:text-4xl font-bold">
  Impacto da Comunidade
</h2>

// H3 - Subsection
<h3 className="text-2xl font-bold">
  Proteção Imediata
</h3>

// Card Title
<CardTitle className="text-xl font-semibold">
  ONGs Parceiras
</CardTitle>
```

**Corpo de Texto:**
```typescript
// Parágrafo principal
<p className="text-base md:text-lg">
  Descrição principal
</p>

// Parágrafo secundário
<p className="text-sm text-muted-foreground">
  Informação adicional
</p>

// Caption/Label
<span className="text-xs text-muted-foreground">
  v2.1
</span>
```

**Botões:**
```typescript
// Botão grande
<Button size="lg" className="text-xl">
  Ligar 180
</Button>

// Botão padrão
<Button className="text-sm">
  Acessar
</Button>

// Botão pequeno
<Button size="sm" className="text-xs">
  Voltar
</Button>
```

---

### Peso da Fonte

```typescript
font-light     // 300
font-normal    // 400 (padrão)
font-medium    // 500
font-semibold  // 600
font-bold      // 700
font-extrabold // 800
```

**Uso:**
```typescript
<h1 className="font-bold">Título Principal</h1>
<h2 className="font-semibold">Subtítulo</h2>
<p className="font-normal">Texto normal</p>
<span className="font-light">Texto leve</span>
```

---

## 📏 Espaçamento {#espacamento}

### Escala (4px base)

```typescript
// TailwindCSS spacing scale
0   // 0px
1   // 0.25rem (4px)
2   // 0.5rem (8px)
3   // 0.75rem (12px)
4   // 1rem (16px)
6   // 1.5rem (24px)
8   // 2rem (32px)
12  // 3rem (48px)
16  // 4rem (64px)
20  // 5rem (80px)
24  // 6rem (96px)
```

### Padding

**Containers:**
```typescript
// Mobile
<div className="p-4">         // 16px all sides
<div className="px-6 py-8">  // 24px horizontal, 32px vertical

// Desktop
<div className="p-6 md:p-12"> // 24px mobile, 48px desktop
```

**Cards:**
```typescript
<Card className="p-4">        // Pequeno
<Card className="p-6">        // Padrão
<Card className="p-8">        // Grande
```

---

### Margin

**Seções:**
```typescript
<section className="py-12">   // Vertical spacing
<section className="mb-8">    // Bottom margin
```

**Elementos:**
```typescript
<h1 className="mb-6">Título</h1>
<p className="mb-3">Parágrafo</p>
```

---

### Gap (Grid/Flex)

```typescript
// Grid
<div className="grid gap-4">      // 16px
<div className="grid gap-6">      // 24px
<div className="grid gap-8">      // 32px

// Flex
<div className="flex gap-2">      // 8px
<div className="flex gap-4">      // 16px
```

---

## 🧩 Componentes {#componentes}

### Anatomia de um Card

```typescript
<Card className="
  bg-gradient-card           // Gradient background
  border-primary/20          // Border roxo transparente
  shadow-soft                // Sombra suave
  hover:shadow-elevated      // Sombra elevada em hover
  transition-all             // Transição suave
  duration-300               // 300ms
  hover:-translate-y-1       // Move 4px para cima em hover
">
  <CardHeader className="p-6">
    {/* Ícone circular */}
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    
    <CardTitle className="text-xl font-semibold">
      Título
    </CardTitle>
    
    <CardDescription className="text-base text-muted-foreground">
      Descrição
    </CardDescription>
  </CardHeader>
  
  <CardContent className="p-6 pt-0">
    {/* Conteúdo */}
  </CardContent>
  
  <CardFooter className="p-6 pt-0">
    {/* Ações */}
  </CardFooter>
</Card>
```

---

### Anatomia de um Button

```typescript
<Button
  variant="default"          // Variante (default, hero, emergency, etc)
  size="default"             // Tamanho (sm, default, lg, icon)
  className="                
    shadow-soft              // Sombra
    hover:shadow-elevated    // Hover sombra
    hover:scale-105          // Hover escala
    transition-all           // Transição
    duration-300             // Duração
  "
>
  <Icon className="w-4 h-4 mr-2" />
  Texto do Botão
</Button>
```

---

### Ícone com Background Circular

**Pattern usado em todo o projeto:**

```typescript
// Tamanho Pequeno
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-4 h-4 text-primary" />
</div>

// Tamanho Médio (Padrão)
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-6 h-6 text-primary" />
</div>

// Tamanho Grande
<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-8 h-8 text-primary" />
</div>

// Tamanho Extra Grande
<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-10 h-10 text-primary" />
</div>
```

**Variações de Cor:**
```typescript
bg-primary/10 text-primary      // Roxo
bg-accent/10 text-accent        // Rosa
bg-destructive/10 text-destructive  // Vermelho
bg-success/10 text-success      // Verde
```

---

### Badge

```typescript
// Urgente
<span className="
  px-3 py-1                     // Padding
  bg-destructive/10             // Background vermelho transparente
  text-destructive              // Texto vermelho
  text-xs                       // Tamanho pequeno
  font-semibold                 // Peso semi-bold
  rounded-full                  // Bordas arredondadas
">
  URGENTE
</span>

// Success
<span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">
  CONCLUÍDO
</span>
```

---

## 🎯 Ícones {#icones}

### Biblioteca: Lucide React

**Ícones Principais Usados:**

```typescript
import {
  // Navegação
  Home,           // Tab home
  Users,          // Tab network
  Shield,         // Tab emergency, proteção
  Bell,           // Tab notifications
  User,           // Tab profile, avatar
  
  // Ações
  Phone,          // Ligar, contato
  MapPin,         // Localização, delegacias
  MessageCircle,  // Chat, mensagens
  FileText,       // Documentos, registro
  
  // Emoções/Status
  Heart,          // Apoio, carinho, apoiadora
  TrendingUp,     // Crescimento, stats
  Award,          // Conquistas, badges
  Sparkles,       // Gamificação, missões
  
  // UI
  ChevronRight,   // Navegação
  X,              // Fechar
  Menu,           // Menu hambúrguer
  Search,         // Busca
  
} from "lucide-react";
```

### Tamanhos Padronizados

```typescript
// Extra Pequeno
<Icon className="w-3 h-3" />   // 12px

// Pequeno
<Icon className="w-4 h-4" />   // 16px

// Médio (Padrão)
<Icon className="w-5 h-5" />   // 20px

// Grande
<Icon className="w-6 h-6" />   // 24px

// Extra Grande
<Icon className="w-8 h-8" />   // 32px

// Hero
<Icon className="w-12 h-12" />  // 48px
<Icon className="w-16 h-16" />  // 64px
```

### Uso Contextual

**Tabs:**
```typescript
<TabsTrigger value="home">
  <Home className="w-5 h-5" />
</TabsTrigger>
```

**Botões:**
```typescript
<Button>
  <Phone className="w-4 h-4 mr-2" />
  Ligar 180
</Button>
```

**Hero:**
```typescript
<Shield className="w-16 h-16 mx-auto text-primary" />
```

---

## ✨ Animações {#animacoes}

### Transições Padrão

```typescript
// Padrão TailwindCSS
transition-all duration-300

// Custom (index.css)
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects

**Cards:**
```typescript
className="
  shadow-soft
  hover:shadow-elevated
  hover:-translate-y-1
  transition-all
  duration-300
"
```

**Buttons:**
```typescript
className="
  hover:scale-105
  transition-all
  duration-300
"
```

**Icons:**
```typescript
// No container pai:
className="group"

// No ícone:
<Icon className="
  group-hover:scale-110
  transition-transform
  duration-300
" />
```

---

### Animações Especiais

**Pulse (Emergência):**
```typescript
<Button variant="emergency" className="animate-pulse">
  Emergência
</Button>
```

**Fade In:**
```typescript
<div className="animate-fade-in">
  Conteúdo
</div>
```

**Slide In (Hero):**
```typescript
<h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700">
  Título
</h1>
```

---

### Keyframes Customizadas

**Accordion (tailwind.config.ts):**
```typescript
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
}
```

---

## ♿ Acessibilidade {#acessibilidade}

### Contraste de Cores

**WCAG AA Compliance:**
- Texto normal: mínimo 4.5:1
- Texto grande (18px+): mínimo 3:1
- Componentes UI: mínimo 3:1

**Verificado:**
- ✅ Primary em background: 4.8:1
- ✅ Foreground em background: 12.5:1
- ✅ Destructive em background: 4.6:1

---

### Tamanhos de Toque

**Mínimo 44x44px (Apple HIG, Android Material):**

```typescript
// Botões
<Button className="h-10" />      // 40px (próximo)
<Button size="lg" className="h-11" /> // 44px ✅

// Botão de emergência
<Button className="h-20" />      // 80px ✅✅✅

// Tabs
<TabsTrigger className="h-14" /> // 56px ✅

// Links
<a className="p-3" />            // 48px ✅
```

---

### Focus States

```typescript
// Todos os elementos interativos têm:
className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
"
```

**Exemplo visual:**
```
┌─────────────────────────────┐
│  Botão em Foco             │  ← Ring roxo 2px
└─────────────────────────────┘    com offset 2px
```

---

### Aria Labels

```typescript
// Botões com apenas ícone
<Button aria-label="Menu">
  <Menu className="w-5 h-5" />
</Button>

// Links
<a href="/app" aria-label="Ir para aplicação">
  <Icon />
</a>

// Inputs
<Input 
  aria-label="Digite seu nome"
  aria-required="true"
  aria-invalid={hasError}
/>
```

---

### Leitores de Tela

```typescript
// Ocultar visualmente mas manter para leitores
<span className="sr-only">
  Texto apenas para leitores de tela
</span>

// Exemplo:
<Button>
  <span className="sr-only">Fechar</span>
  <X className="w-4 h-4" />
</Button>
```

---

## 📱 Responsividade

### Grid Layouts

```typescript
// 1 coluna mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(...)}
</div>

// Stats e Features usam este padrão
```

### Tipografia Responsiva

```typescript
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  Título Responsivo
</h1>

<p className="text-base md:text-lg">
  Texto responsivo
</p>
```

### Espaçamento Responsivo

```typescript
<section className="py-8 md:py-12 lg:py-16">
  <div className="px-4 md:px-6 lg:px-8">
    Conteúdo
  </div>
</section>
```

---

## 🎨 Modo Escuro

### Ativação

```typescript
// Usar next-themes
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class">
  <App />
</ThemeProvider>
```

### Toggle

```typescript
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();

<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
  Toggle Tema
</Button>
```

### Classes Condicionais

```typescript
// TailwindCSS dark: prefix
<div className="
  bg-white 
  dark:bg-zinc-900
  text-zinc-900
  dark:text-white
">
  Conteúdo
</div>
```

**Todas as cores já têm variante dark definida em `index.css`**

---

## 📖 Glossário de Classes Customizadas

```css
/* Backgrounds */
.bg-gradient-primary   /* Gradiente roxo-rosa */
.bg-gradient-hero      /* Gradiente de fundo */
.bg-gradient-card      /* Gradiente de card */
.bg-gradient-subtle    /* Gradiente sutil (usado em páginas) */

/* Shadows */
.shadow-soft          /* Sombra suave */
.shadow-elevated      /* Sombra elevada */

/* Animações */
.animate-fade-in      /* Fade in */
.animate-in           /* Base para animações in */

/* Transições */
.transition-smooth    /* Transição cubic-bezier custom */
```

---

## 🎯 Checklist de Implementação

Ao criar um novo componente, verificar:

- [ ] Usa cores do design system (HSL variables)
- [ ] Tem hover states apropriados
- [ ] Tem focus states (acessibilidade)
- [ ] Tamanhos de toque adequados (44px+)
- [ ] Transições suaves (300ms)
- [ ] Responsivo (mobile-first)
- [ ] Suporta dark mode
- [ ] Aria labels quando necessário
- [ ] Contraste adequado (WCAG AA)
- [ ] Usa ícones consistentes (Lucide)

---

**Design System Versão:** 1.0  
**Última Atualização:** Outubro 2025  
**Mantido por:** Equipe Apoia
