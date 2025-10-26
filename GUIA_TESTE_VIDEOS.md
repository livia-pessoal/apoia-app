# 🧪 Guia de Testes - Vídeos das Missões

**Objetivo:** Validar que os 10 vídeos educativos estão carregando corretamente no sistema.

---

## 📋 Pré-requisitos

Antes de começar os testes:

- [ ] Projeto rodando localmente (`npm run dev`)
- [ ] Banco de dados Supabase configurado
- [ ] Migration `004_update_video_urls.sql` executada
- [ ] Usuária cadastrada no sistema

---

## 🔧 Passo 1: Atualizar Banco de Dados

### No Supabase Dashboard:

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo do arquivo `supabase/migrations/004_update_video_urls.sql`
5. Clique em **Run** (▶️)
6. Verifique se aparece: **"Success. 10 rows affected"**

### Verificar se funcionou:

Execute esta query:

```sql
SELECT mission_number, title, video_url 
FROM missions_content 
WHERE content_type = 'video' 
ORDER BY mission_number;
```

**Resultado esperado:** 10 linhas com URLs do YouTube (não deve ter `VIDEO_ID_`)

---

## 🚀 Passo 2: Iniciar o Projeto

### No terminal:

```bash
cd s-dream-weave-main
npm run dev
```

**Espere até ver:**
```
➜  Local:   http://localhost:8080/
```

---

## 🎯 Passo 3: Acessar a Aplicação

### 3.1 Fazer Login/Cadastro

1. Abra o navegador em `http://localhost:8080`
2. Veja a calculadora
3. Digite a senha secreta: **1904**
4. Clique em **"Preciso de Apoio"** 🛡️
5. Faça cadastro (pode ser anônimo) ou faça login

---

## 🎮 Passo 4: Testar as Missões

### 4.1 Navegar até Missões

1. Na aplicação, clique na tab **"Missões"** 🎮
2. Você deve ver:
   - Estatísticas de progresso (Total, Completas, Restantes, %)
   - 4 módulos temáticos expandidos

---

## ✅ Passo 5: Testes Individuais por Vídeo

Para cada vídeo, siga o checklist:

### 📹 Missão 41 - Lei Maria da Penha

**Local:** Módulo 1 - Reconhecendo os Sinais

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 10 min
- [ ] Ao clicar em "Assistir", abre modal
- [ ] Vídeo carrega no iframe (pode demorar alguns segundos)
- [ ] Player do YouTube aparece
- [ ] Consegue dar play no vídeo
- [ ] Vídeo é sobre "Violência contra mulher: tipos e denúncia"
- [ ] Botão "Marcar como Completo" funciona

---

### 📹 Missão 42 - Violência além da agressão física

**Local:** Módulo 1 - Reconhecendo os Sinais

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 5 min
- [ ] Ao clicar em "Assistir", abre modal
- [ ] Vídeo carrega corretamente
- [ ] Consegue assistir sem erros
- [ ] Botão "Marcar como Completo" funciona

---

### 📹 Missão 43 - História Real da Lei Maria da Penha

**Local:** Módulo 2 - Reagindo e Buscando Ajuda

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 15 min
- [ ] Vídeo carrega corretamente
- [ ] Vídeo é o documentário sobre Maria da Penha
- [ ] Consegue assistir sem erros

---

### 📹 Missão 44 - Combate à Violência Doméstica

**Local:** Módulo 2 - Reagindo e Buscando Ajuda

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 8 min
- [ ] Vídeo carrega corretamente
- [ ] Campanha institucional sobre violência

---

### 📹 Missão 45 - Violência psicológica é crime

**Local:** Módulo 3 - Autoconhecimento e Fortalecimento

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 3 min
- [ ] Vídeo carrega (é um YouTube Short)
- [ ] Vídeo explica que violência psicológica é crime

---

### 📹 Missão 46 - Tipos de violência

**Local:** Módulo 3 - Autoconhecimento e Fortalecimento

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 7 min
- [ ] Vídeo educativo sobre os 5 tipos de violência
- [ ] Consegue assistir sem erros

---

### 📹 Missão 47 - Alerta violência psicológica

**Local:** Módulo 4 - Conhecendo seus Direitos

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 4 min
- [ ] Vídeo sobre inclusão no Código Penal
- [ ] Consegue assistir sem erros

---

### 📹 Missão 48 - Curta-metragem

**Local:** Módulo 4 - Conhecendo seus Direitos

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 12 min
- [ ] Curta-metragem narrativo sobre violência
- [ ] Qualidade de produção audiovisual

---

### 📹 Missão 49 - Fale sem medo

**Local:** Módulo 4 - Conhecendo seus Direitos

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 6 min
- [ ] Campanha "Quebre o silêncio"
- [ ] Consegue assistir sem erros

---

### 📹 Missão 50 - Documentário Lei Maria da Penha

**Local:** Módulo 4 - Conhecendo seus Direitos

- [ ] Card da missão exibe badge "Vídeo"
- [ ] Duração: 20 min
- [ ] Documentário "Retrato do Brasil"
- [ ] Vídeo mais longo carrega corretamente

---

## 🔍 Passo 6: Testes de Funcionalidade

### 6.1 Marcar como Completo

Para 2-3 vídeos diferentes:

- [ ] Assista alguns segundos
- [ ] Clique em "Marcar como Completo"
- [ ] Modal fecha
- [ ] Card da missão agora mostra badge "✓ Completo" em verde
- [ ] Estatísticas de progresso atualizam
- [ ] Percentual aumenta
- [ ] Ao reabrir a missão, mostra "Revisar" em vez de "Assistir"

### 6.2 Responsividade

Teste em diferentes tamanhos de tela:

#### Desktop (> 1024px)
- [ ] Modal ocupa ~60% da largura
- [ ] Vídeo mantém proporção 16:9
- [ ] Controles do YouTube visíveis

#### Tablet (768px - 1024px)
- [ ] Modal se adapta
- [ ] Vídeo continua proporcional
- [ ] Interface usável

#### Mobile (< 768px)
- [ ] Modal ocupa quase toda a tela
- [ ] Vídeo responsivo
- [ ] Botões acessíveis
- [ ] Consegue assistir confortavelmente

---

## 🧪 Passo 7: Testes de Edge Cases

### 7.1 Conexão Lenta

- [ ] Abre modal de vídeo
- [ ] Enquanto carrega, mostra player do YouTube (pode aparecer carregando)
- [ ] Não quebra a interface
- [ ] Consegue fechar o modal durante carregamento

### 7.2 Vídeo Indisponível

Se algum vídeo estiver indisponível no YouTube:

- [ ] Player do YouTube mostra mensagem de erro
- [ ] Interface não quebra
- [ ] Consegue fechar o modal
- [ ] Pode tentar novamente

### 7.3 Múltiplos Vídeos Seguidos

- [ ] Assiste vídeo 1
- [ ] Fecha modal
- [ ] Abre vídeo 2 imediatamente
- [ ] Não há conflito de players
- [ ] Cada vídeo carrega independentemente

---

## 📊 Passo 8: Validação Final

### Checklist Geral

- [ ] **Todos os 10 vídeos** carregam sem erro
- [ ] **Nenhum placeholder** (VIDEO_ID_X) aparece
- [ ] **Player do YouTube** funciona em todos
- [ ] **Marcar como completo** funciona em todos
- [ ] **Progresso salva** corretamente no banco
- [ ] **Interface responsiva** em todos os tamanhos
- [ ] **Performance** aceitável (vídeos carregam em < 5s)

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Vídeo não carrega

**Sintomas:** Player em branco, mensagem de erro

**Possíveis causas:**
1. URL incorreta no banco
2. Vídeo removido/privado no YouTube
3. Bloqueio de embed pelo dono do vídeo

**Solução:**
```sql
-- Verificar URL do vídeo
SELECT video_url FROM missions_content WHERE mission_number = X;

-- Se necessário, trocar por outro vídeo similar
UPDATE missions_content 
SET video_url = 'https://www.youtube.com/watch?v=NOVO_ID'
WHERE mission_number = X;
```

---

### Problema 2: "Vídeo indisponível"

**Causa:** Vídeo foi deletado ou tem restrição de embed

**Solução:** Buscar vídeo alternativo sobre o mesmo tema

---

### Problema 3: Migration não aplica

**Sintomas:** URLs continuam com VIDEO_ID_

**Solução:**
```sql
-- Verificar se a tabela existe
SELECT * FROM missions_content WHERE content_type = 'video';

-- Se não retornar nada, executar migrations anteriores primeiro
\i supabase/migrations/003_missions_system.sql
\i supabase/migrations/003_missions_data.sql
\i supabase/migrations/004_update_video_urls.sql
```

---

### Problema 4: Modal não abre

**Causa:** Erro no componente React

**Solução:**
1. Verificar console do navegador (F12)
2. Verificar se há erros no terminal
3. Recarregar a página (Ctrl+R)

---

## ✅ Critérios de Sucesso

O teste é considerado **APROVADO** se:

- ✅ **10/10 vídeos** carregam corretamente
- ✅ **Todos os players** funcionam
- ✅ **Marcação como completo** funciona
- ✅ **Progresso é salvo** no banco
- ✅ **Interface responsiva** funciona bem
- ✅ **Nenhum erro crítico** no console

---

## 📝 Relatório de Testes

Preencha após completar os testes:

### Resumo
- **Data do teste:** ___/___/_____
- **Testador:** _________________
- **Navegador:** _________________
- **Versão do projeto:** _________________

### Resultados
- **Vídeos testados:** ___/10
- **Vídeos funcionando:** ___/10
- **Bugs encontrados:** ___
- **Status geral:** [ ] Aprovado [ ] Com ressalvas [ ] Reprovado

### Vídeos com Problema (se houver)

| Missão | Problema | Solução Aplicada |
|--------|----------|------------------|
| __     | __       | __               |

### Observações Adicionais
_________________________________
_________________________________
_________________________________

---

## 🎉 Próximos Passos

Após testes aprovados:

1. [ ] Atualizar documentação com vídeos validados
2. [ ] Marcar issue como resolvida
3. [ ] Fazer commit das mudanças
4. [ ] Testar em ambiente de staging (se houver)
5. [ ] Deploy para produção

---

**Desenvolvido para o projeto APOIA**  
_Última atualização: 19/10/2025_
