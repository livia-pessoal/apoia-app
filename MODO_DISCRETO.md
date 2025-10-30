# 🔒 Modo Discreto - Documentação Completa

## 📋 O que é?

O **Modo Discreto** é uma funcionalidade crítica de segurança que permite às usuárias do Apoia disfarçar o aplicativo instantaneamente em situações de risco.

---

## 🎯 Funcionalidades

### 1. **Interface Disfarçada** 🎭
Quando ativado, o app se transforma em um aplicativo de receitas culinárias:
- ✅ Título da aba muda para "Minhas Receitas - Receitas Culinárias"
- ✅ Interface mostra receitas de bolo, lasanha, saladas, etc.
- ✅ Busca funcional de receitas
- ✅ Visual completamente diferente (laranja/amarelo)

### 2. **Ativação Rápida** ⚡

**Via Configurações:**
1. Ir em Perfil (aba com ícone de usuário)
2. Ativar toggle "Modo Discreto"
3. Interface muda instantaneamente

**Via Shake (Agitar o Celular):**
1. Agite o celular com força
2. Modo discreto ativa/desativa automaticamente
3. Toast confirma a mudança

### 3. **Desativação** 🔓

**Opção 1 - Shake:**
- Agite o celular novamente

**Opção 2 - Duplo clique:**
- No app disfarçado, clique 2x no texto "v1.2" (canto superior direito)

**Opção 3 - Configurações:**
- Volte pelo shake
- Vá em Perfil
- Desative o toggle

### 4. **Saída Rápida** 🚪
Botão "Saída Rápida" (disponível sempre):
- Limpa todos os dados do localStorage
- Redireciona para Google buscando "receitas culinárias"
- Impossível voltar ao app sem fazer login novamente

---

## 🔧 Detalhes Técnicos

### Arquivos Criados/Modificados

**Novos:**
- `src/hooks/useShakeDetection.ts` - Detecta agitação do celular
- `src/components/StealthMode.tsx` - Interface disfarçada
- `MODO_DISCRETO.md` - Esta documentação

**Modificados:**
- `src/pages/Index.tsx` - Lógica principal do modo discreto
- `src/components/ProfileTab.tsx` - Toggle e evento customizado

### Estados e Eventos

```typescript
// Estado local
const [stealthMode, setStealthMode] = useState(false);

// Evento customizado
window.dispatchEvent(new CustomEvent("stealthModeChanged", { 
  detail: { enabled: true/false } 
}));

// Listener
window.addEventListener("stealthModeChanged", handleChange);
```

### Banco de Dados

Campo utilizado na tabela `profiles`:
```sql
privacy_mode VARCHAR -- valores: "normal" ou "stealth"
```

---

## 🎨 Design da Interface Disfarçada

### Tema
- **Cores:** Laranja/Amarelo (tema de culinária)
- **Ícone:** ChefHat (chapéu de chef)
- **Título:** "Minhas Receitas"

### Receitas Mockadas
1. Bolo de Chocolate (45 min - Fácil)
2. Arroz de Forno (1h 15min - Médio)
3. Salada Caesar (20 min - Fácil)
4. Lasanha à Bolonhesa (1h 30min - Médio)
5. Brigadeiro Gourmet (30 min - Fácil)

---

## 🧪 Como Testar

### Desktop (sem shake)
1. Ative via Perfil > Modo Discreto
2. Verifique mudança de interface
3. Duplo-clique em "v1.2" para voltar

### Mobile (com shake)
1. Ative via Perfil > Modo Discreto
2. Agite o celular para testar alternância
3. Teste saída rápida

### iOS 13+ (Permissão)
No iOS 13+, será solicitada permissão para usar o acelerômetro:
```
"[App] quer acessar movimento e orientação"
```
Usuária deve permitir para shake funcionar.

---

## 🔐 Privacidade & Segurança

### O que é Protegido
- ✅ Título da aba do navegador
- ✅ Interface visual completa
- ✅ Histórico de navegação (via Saída Rápida)
- ✅ Dados em localStorage (via Saída Rápida)

### O que NÃO é Protegido
- ❌ Histórico do navegador (URLs anteriores)
- ❌ Cookies de sessão (exceto se usar Saída Rápida)
- ❌ Screenshots/gravações de tela

---

## 💡 Dicas de Uso

1. **Pratique antes:** Teste o shake em ambiente seguro
2. **Saída Rápida:** Use em emergências extremas
3. **Favicon:** Considerado mudar para ícone neutro (futuro)
4. **Combinação:** Use com modo privado do navegador

---

## 🚀 Melhorias Futuras (Opcionais)

- [ ] Mudar favicon para ícone de receita
- [ ] Adicionar mais temas (lista de compras, clima, etc.)
- [ ] Histórico falso de navegação
- [ ] PIN para voltar ao modo normal
- [ ] Modo "pânico" com código secreto

---

## 📞 Uso em Situações Reais

### Cenário 1: Pessoa se aproximando
1. Agite o celular rapidamente
2. App vira receitas instantaneamente
3. Continue rolando como se estivesse vendo receitas

### Cenário 2: Emergência extrema
1. Clique em "Saída Rápida"
2. App redireciona para Google
3. Nenhum rastro do Apoia no histórico recente

### Cenário 3: Privacidade preventiva
1. Ative antes de sair de casa
2. App já fica disfarçado
3. Desative quando estiver segura

---

**Desenvolvido com ❤️ pensando na segurança das usuárias**
