# 🎨 GUIA COMPLETO DE COMPONENTES UI

## Visão Geral

Este documento detalha todos os componentes UI do projeto, incluindo componentes shadcn/ui e componentes customizados.

---

## 📦 Componentes shadcn/ui (Radix UI)

### Button (button.tsx)

#### Variantes Disponíveis

**1. default**
```typescript
<Button variant="default">Botão Padrão</Button>
```
- Background: Primary (roxo)
- Texto: Primary-foreground (branco)
- Hover: scale-105 + shadow-elevated
- Uso: Ações primárias

**2. hero**
```typescript
<Button variant="hero">Começar</Button>
```
- Background: Gradiente roxo-rosa
- Shadow: Elevada
- Hover: scale-105
- Uso: Call-to-actions importantes

**3. emergency**
```typescript
<Button variant="emergency">Emergência</Button>
```
- Background: Destructive (vermelho)
- Animação: Pulse contínua
- Hover: scale-105
- Uso: Botão de pânico, ligar 180

**4. success**
```typescript
<Button variant="success">Concluído</Button>
```
- Background: Success (verde)
- Shadow: Soft
- Uso: Confirmações positivas

**5. destructive**
```typescript
<Button variant="destructive">Deletar</Button>
```
- Background: Destructive (vermelho)
- Sem animação pulse
- Uso: Ações destrutivas

**6. secondary**
```typescript
<Button variant="secondary">Cancelar</Button>
```
- Background: Secondary (cinza-roxo)
- Hover: Opacidade 80%
- Uso: Ações secundárias

**7. outline**
```typescript
<Button variant="outline">Ver Mais</Button>
```
- Background: Transparente
- Border: Input color
- Hover: Accent background
- Uso: Ações terciárias

**8. ghost**
```typescript
<Button variant="ghost">Menu</Button>
```
- Background: Transparente
- Hover: Accent background suave
- Uso: Botões de navegação

**9. link**
```typescript
<Button variant="link">Saiba mais</Button>
```
- Aparência de link
- Underline em hover
- Uso: Links inline

#### Tamanhos

```typescript
<Button size="sm">Pequeno</Button>      // h-9 px-3
<Button size="default">Padrão</Button>  // h-10 px-4
<Button size="lg">Grande</Button>       // h-11 px-8
<Button size="icon">🔍</Button>         // h-10 w-10 (quadrado)
```

#### Exemplos de Uso no Projeto

**Calculadora:**
```typescript
<Button
  className="h-16 text-lg col-span-2 bg-zinc-700"
  onClick={() => handleNumber("0")}
>
  0
</Button>
```

**Emergência (Index.tsx):**
```typescript
<Button
  variant="emergency"
  size="lg"
  className="w-full h-20 text-xl"
  onClick={handleEmergency}
>
  <Phone className="w-6 h-6 mr-2" />
  Ligar 180 - Central da Mulher
</Button>
```

**Feature Cards:**
```typescript
<Button variant="hero" className="w-full">
  Começar Missão
</Button>
```

---

### Card (card.tsx)

#### Estrutura Completa

```typescript
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo principal */}
  </CardContent>
  <CardFooter>
    {/* Rodapé opcional */}
  </CardFooter>
</Card>
```

#### Componentes

**Card**
- Container principal
- Classes: `bg-card text-card-foreground rounded-lg border shadow-sm`

**CardHeader**
- Espaçamento: `p-6`
- Uso: Títulos e descrições

**CardTitle**
- Texto: `text-2xl font-semibold leading-none tracking-tight`

**CardDescription**
- Texto: `text-sm text-muted-foreground`

**CardContent**
- Espaçamento: `p-6 pt-0`
- Uso: Conteúdo principal

**CardFooter**
- Espaçamento: `p-6 pt-0`
- Layout: `flex items-center`

#### Exemplos de Uso

**Stats Card:**
```typescript
<Card className="bg-gradient-card border-primary/20 shadow-soft">
  <CardContent className="p-6 flex items-center gap-4">
    <div className="p-3 rounded-full bg-primary/10">
      <Heart className="w-6 h-6 text-primary" />
    </div>
    <div>
      <p className="text-2xl font-bold text-primary">+ de 25</p>
      <p className="text-sm text-muted-foreground">mulheres apoiadas</p>
    </div>
  </CardContent>
</Card>
```

**Feature Card:**
```typescript
<Card className="hover:shadow-elevated transition-all hover:-translate-y-1">
  <CardHeader>
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
      <Shield className="w-6 h-6 text-primary" />
    </div>
    <CardTitle>Proteção Imediata</CardTitle>
    <CardDescription>Acesso rápido a funcionalidades de emergência</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="emergency" className="w-full">
      Configurar Proteção
    </Button>
  </CardContent>
</Card>
```

**Emergency Card (Supporter):**
```typescript
<Card className="p-6 border-l-4 border-l-destructive">
  <div className="space-y-4">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-lg">Solicitação de Apoio</h3>
        <p className="text-sm text-muted-foreground">Há 5 minutos</p>
      </div>
      <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full">
        URGENTE
      </span>
    </div>
    <p className="text-sm">Mulher em situação de risco solicita contato imediato</p>
    <div className="flex gap-2">
      <Button variant="emergency" className="flex-1">
        <Phone className="w-4 h-4 mr-2" />
        Contatar
      </Button>
    </div>
  </div>
</Card>
```

---

### Tabs (tabs.tsx)

#### Componentes

**Tabs**
- Container principal
- Props: `defaultValue`, `value`, `onValueChange`

**TabsList**
- Container dos triggers
- Background: `bg-muted`
- Layout: flex horizontal

**TabsTrigger**
- Botão individual
- Props: `value`
- Estado ativo: `data-[state=active]:bg-background`

**TabsContent**
- Conteúdo da tab
- Props: `value`
- Animações: fade-in

#### Exemplo Completo (Index.tsx)

```typescript
<Tabs defaultValue="home" className="w-full">
  {/* Header Sticky */}
  <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg">
    <TabsList className="w-full h-14 justify-around">
      <TabsTrigger value="home" className="flex-1 data-[state=active]:bg-primary/10">
        <Home className="w-5 h-5" />
      </TabsTrigger>
      <TabsTrigger value="network" className="flex-1">
        <Users className="w-5 h-5" />
      </TabsTrigger>
      <TabsTrigger value="emergency" className="flex-1">
        <Shield className="w-5 h-5" />
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex-1">
        <Bell className="w-5 h-5" />
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex-1">
        <User className="w-5 h-5" />
      </TabsTrigger>
    </TabsList>
  </div>

  {/* Conteúdo das Tabs */}
  <TabsContent value="home" className="animate-fade-in">
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
  </TabsContent>

  <TabsContent value="network">
    {/* Conteúdo de network */}
  </TabsContent>

  {/* ... outras tabs */}
</Tabs>
```

---

### Toast/Sonner (sonner.tsx)

#### Tipos de Toast

**Success**
```typescript
toast.success("Missão iniciada!");
```
- Ícone: Checkmark verde
- Background: Success color

**Error**
```typescript
toast.error("Ligando para 180 - Central de Atendimento à Mulher");
```
- Ícone: X vermelho
- Background: Destructive color

**Info**
```typescript
toast.info("Funcionalidade em desenvolvimento");
```
- Ícone: Info azul
- Background: Primary color

**Warning**
```typescript
toast.warning("Atenção necessária");
```
- Ícone: Warning laranja
- Background: Warning color

#### Configuração

```typescript
// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";

<Sonner />
```

#### Opções Avançadas

```typescript
toast.success("Título", {
  description: "Descrição adicional",
  duration: 5000,
  action: {
    label: "Desfazer",
    onClick: () => console.log("Undo")
  }
});
```

---

## 🎨 Componentes Customizados

### FeatureCard.tsx

#### Interface
```typescript
interface FeatureCardProps {
  icon: LucideIcon;              // Ícone do Lucide
  title: string;                 // Título do card
  description: string;           // Descrição
  buttonText: string;            // Texto do botão
  buttonVariant?: "default" | "hero" | "emergency" | "success";
  onButtonClick?: () => void;    // Callback
}
```

#### Estrutura
```typescript
<Card className="bg-gradient-card border-primary/20 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
  <CardHeader>
    {/* Ícone circular */}
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <CardTitle className="text-xl">{title}</CardTitle>
    <CardDescription className="text-base">{description}</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant={buttonVariant} className="w-full" onClick={onButtonClick}>
      {buttonText}
    </Button>
  </CardContent>
</Card>
```

#### Uso
```typescript
<FeatureCard
  icon={Shield}
  title="Proteção Imediata"
  description="Acesso rápido a funcionalidades de emergência e botão de pânico"
  buttonText="Configurar Proteção"
  buttonVariant="emergency"
  onButtonClick={() => toast.info("Funcionalidade em desenvolvimento")}
/>
```

---

### StatsCard.tsx

#### Interface
```typescript
interface StatsCardProps {
  icon: LucideIcon;    // Ícone
  value: string;       // Valor (ex: "+ de 25")
  label: string;       // Descrição
}
```

#### Estrutura
```typescript
<Card className="bg-gradient-card border-primary/20 shadow-soft hover:shadow-elevated transition-all duration-300">
  <CardContent className="p-6 flex items-center gap-4">
    <div className="p-3 rounded-full bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </CardContent>
</Card>
```

#### Uso
```typescript
<StatsCard
  icon={Heart}
  value="+ de 25"
  label="mulheres em situação de violência apoiadas"
/>
```

---

## 📐 Padrões de Design

### Ícones com Background Circular

Padrão usado em todo o projeto:

```typescript
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-6 h-6 text-primary" />
</div>
```

Variações:
- `w-12 h-12` + `w-6 h-6` - Tamanho padrão
- `w-16 h-16` + `w-8 h-8` - Grande
- `w-20 h-20` + `w-10 h-10` - Extra grande
- `bg-primary/10` - Roxo transparente
- `bg-accent/10` - Rosa transparente
- `bg-destructive/10` - Vermelho transparente

### Hover Effects

**Cards:**
```typescript
className="hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
```

**Buttons:**
```typescript
className="hover:scale-105 transition-all duration-300"
```

**Icons:**
```typescript
className="group-hover:scale-110 transition-transform"
```

### Badges

**Urgente:**
```typescript
<span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full">
  URGENTE
</span>
```

### Gradientes

**Background:**
```typescript
className="bg-gradient-primary"    // Roxo-rosa
className="bg-gradient-hero"       // Fundo suave
className="bg-gradient-card"       // Card sutil
```

**Texto:**
```typescript
className="bg-gradient-primary bg-clip-text text-transparent"
```

---

## 🎯 Acessibilidade

### Focus States
Todos os botões têm:
```typescript
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-ring 
focus-visible:ring-offset-2
```

### Disabled States
```typescript
disabled:pointer-events-none 
disabled:opacity-50
```

### Aria Labels
Usar quando apropriado:
```typescript
<Button aria-label="Ligar para emergência">
  <Phone className="w-4 h-4" />
</Button>
```

---

## 📱 Responsividade

### Breakpoints TailwindCSS
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1400px

### Exemplo de Grid Responsivo
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 coluna mobile, 2 tablet, 3 desktop */}
</div>
```

---

## 🎨 Classes Utilitárias Customizadas

### Sombras
- `shadow-soft` - Sombra suave com primary
- `shadow-elevated` - Sombra elevada com primary

### Gradientes
- `bg-gradient-primary` - Gradiente roxo-rosa
- `bg-gradient-hero` - Gradiente de fundo
- `bg-gradient-card` - Gradiente de card

### Animações
- `animate-fade-in` - Fade in suave
- `animate-accordion-down` - Accordion abrir
- `animate-accordion-up` - Accordion fechar

---

## 💡 Dicas de Uso

### Composição de Componentes
```typescript
// Usar asChild para composição
<Button asChild>
  <Link to="/app">Acessar App</Link>
</Button>
```

### Função cn() para Classes Condicionais
```typescript
import { cn } from "@/lib/utils";

<Button className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
  Botão
</Button>
```

### Ícones Lucide React
```typescript
import { Home, Shield, Heart } from "lucide-react";

<Home className="w-5 h-5" />
<Shield className="w-6 h-6 text-primary" />
<Heart className="w-4 h-4 mr-2" />
```

Tamanhos padrão:
- `w-4 h-4` - 16px (pequeno)
- `w-5 h-5` - 20px (médio)
- `w-6 h-6` - 24px (grande)
- `w-8 h-8` - 32px (extra grande)

---

**Total de Componentes UI:** 50+ (shadcn/ui + customizados)  
**Sistema:** Baseado em Radix UI primitives  
**Estilo:** TailwindCSS com design system coeso
