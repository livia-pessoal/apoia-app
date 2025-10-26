# 🔐 Sistema de PIN Discreto - Calculadora

## 💡 Conceito

A calculadora funciona como **disfarce completo**. Nenhum botão ou elemento suspeito. O acesso acontece apenas digitando números.

---

## 🎯 Como Funciona

### **1️⃣ Primeiro Acesso (Novo Usuário)**

```
Calculadora → Digite: 1904 → Cadastro → PIN Gerado
```

1. Usuária abre o app (calculadora)
2. Digita: `1904`
3. Sistema reconhece e redireciona para cadastro
4. Após cadastro, modal exibe PIN de 6 dígitos
5. Exemplo: `473829`

**Avisos no Modal:**
- ⚠️ Anote este PIN em local seguro
- ⚠️ Use ele para acessar novamente
- ⚠️ Se perder, não pode recuperar

---

### **2️⃣ Próximos Acessos (Com PIN)**

```
Calculadora → Digite: 473829 (seu PIN) → Login Automático → App
```

1. Usuária abre o app (calculadora)
2. Digita seu PIN de 6 dígitos: `473829`
3. Sistema valida automaticamente
4. Se PIN válido:
   - Display mostra `......` (feedback discreto)
   - Redireciona para /app em 300ms
   - Histórico recuperado ✅
5. Se PIN inválido:
   - Nada acontece
   - Continua como calculadora normal
   - **TOTALMENTE DISCRETO!** ✨

---

## 🔒 Segurança

### **Validação Silenciosa**

```javascript
// PIN inválido = sem feedback
// Mantém disfarce de calculadora
if (newDisplay.length === 6 && /^\d{6}$/.test(newDisplay)) {
  // Tenta validar PIN
  if (válido) {
    // Entra no app
  }
  // Se inválido, não faz NADA (discreto!)
}
```

### **Vantagens:**

✅ **Zero botões suspeitos**
✅ **Ninguém descobre que é um app especial**
✅ **PIN recupera histórico completo**
✅ **Funciona em qualquer dispositivo**
✅ **Erro silencioso (não levanta suspeita)**

---

## 📱 Fluxos Completos

### **Cenário 1: Primeira Vez**

```
[Calculadora Normal]
      ↓ digita 1904
[Escolher Perfil: Apoiada / Apoiadora]
      ↓ escolhe Apoiada
[Cadastro: nome opcional]
      ↓ confirma
[🎉 MODAL: Seu PIN é 473829]
      ↓ anota PIN
[App Completo]
```

### **Cenário 2: Retornando (Com PIN)**

```
[Calculadora Normal]
      ↓ digita 473829
[......] (validando)
      ↓ 300ms
[App Completo] (histórico recuperado)
```

### **Cenário 3: PIN Errado (Disfarce Mantido)**

```
[Calculadora Normal]
      ↓ digita 111111 (PIN inválido)
[Calculadora Normal] (sem mudança)
      ↓ pessoa vê cálculo: 111111
[Nada suspeito acontece] ✅
```

---

## 🎨 Visual do Modal de PIN

```
┌─────────────────────────────────────┐
│         🔑                          │
│    Seu PIN de Acesso                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      SEU PIN É:             │   │
│  │                             │   │
│  │       4 7 3 8 2 9          │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ 📋 Copiar PIN ]                 │
│                                     │
│  ⚠️ IMPORTANTE:                     │
│  • Anote em local seguro           │
│  • Use para acessar novamente      │
│  • Não compartilhe                 │
│  • Se perder, não recupera         │
│                                     │
│  [✅ Anotei meu PIN, Continuar]    │
└─────────────────────────────────────┘
```

---

## 🧪 Testando

### **Teste 1: Primeiro Acesso**

1. Abrir calculadora
2. Digitar: `1904`
3. Fazer cadastro
4. Ver modal com PIN
5. Anotar PIN (ex: `473829`)
6. Entrar no app

### **Teste 2: Login com PIN**

1. Limpar localStorage (simular fechar app)
2. Reabrir calculadora
3. Digitar PIN: `473829`
4. Ver `......` no display
5. Entrar no app automaticamente
6. Histórico preservado ✅

### **Teste 3: PIN Inválido (Disfarce)**

1. Abrir calculadora
2. Digitar: `111111` (PIN inexistente)
3. Calculadora continua normal
4. Nada suspeito acontece ✅

### **Teste 4: Múltiplos Dispositivos**

1. Criar conta no PC (PIN: `473829`)
2. Abrir calculadora no celular
3. Digitar: `473829`
4. Histórico sincronizado ✅

---

## 💾 Banco de Dados

### **Tabela: anonymous_pins**

```sql
id              | UUID (PK)
profile_id      | UUID (FK → profiles)
pin_code        | TEXT (6 dígitos, UNIQUE)
created_at      | TIMESTAMP
last_used_at    | TIMESTAMP
is_active       | BOOLEAN
```

### **Função: login_with_pin(pin_input)**

```sql
-- Valida PIN e retorna dados do perfil
SELECT * FROM login_with_pin('473829');

Retorna:
- profile_id
- user_type
- display_name
- success (boolean)
- message
```

---

## 🚨 Segurança vs Usabilidade

### **Trade-offs Aceitos:**

❌ **PIN perdido = conta perdida**
- Segurança > Conveniência
- Sem email, sem recuperação
- Avisos claros no cadastro

✅ **Disfarce perfeito**
- Vale a pena
- Protege em situações de risco
- Ninguém descobre o app

---

## 📊 Comparação

### **ANTES (Botão "Acessar com PIN"):**

```
[Calculadora v2.1]
[Acessar com PIN] ← SUSPEITO! 🚨
```

❌ Quebra disfarce
❌ Levanta suspeitas
❌ Não parece calculadora normal

### **DEPOIS (PIN Direto):**

```
[Calculadora v2.1]
```

✅ Zero botões extras
✅ Parece calculadora comum
✅ Totalmente discreto
✅ Funcionalidade escondida

---

## 🎉 Resultado Final

**Calculadora = Disfarce Perfeito**

- Digita `1904` → Primeiro acesso
- Digita `PIN` → Login direto
- Digita qualquer outra coisa → Calcula normal
- **Ninguém desconfia!** 🎭

---

## 📝 Notas Técnicas

### **Validação Assíncrona**

```typescript
const handleNumber = async (num: string) => {
  const newDisplay = display === "0" ? num : display + num;
  setDisplay(newDisplay);
  
  // 1904 = Primeiro acesso
  if (newDisplay === "1904") {
    navigate("/profile-select");
    return;
  }
  
  // 6 dígitos = Tentar PIN
  if (newDisplay.length === 6 && /^\d{6}$/.test(newDisplay)) {
    const { data } = await supabase.rpc('login_with_pin', {
      pin_input: newDisplay
    });
    
    if (data[0].success) {
      // Login OK
      setDisplay('......');
      navigate('/app');
    }
    // Inválido = não faz nada (discreto!)
  }
};
```

### **Erros Silenciosos**

```typescript
try {
  // Validar PIN
} catch (err) {
  // Erro silencioso - não mostra toast
  // Mantém disfarce
  console.error('Erro:', err);
}
```

---

## ✅ Checklist de Implementação

- [x] Migration 011 com tabela anonymous_pins
- [x] Função generate_unique_pin()
- [x] Função login_with_pin(pin_input)
- [x] Trigger auto-criar PIN ao cadastrar
- [x] Calculator.tsx aceita PIN de 6 dígitos
- [x] Register.tsx mostra modal com PIN
- [x] Removido botão "Acessar com PIN"
- [x] Removida rota /recover-access
- [x] RecoverAccess.tsx (mantido para referência)
- [x] Erro silencioso em PIN inválido

---

**Status:** ✅ IMPLEMENTADO E TESTADO

**Disfarce:** 🎭 PERFEITO
