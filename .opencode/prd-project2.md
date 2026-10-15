# PRD — Project 2: Elevação Visual e de UX do Guia Ghidra MCP

**Data:** 2026-10-15 · **Fonte:** `.opencode/project2.md` · **Estado:** aprovado para execução fase a fase (protocolo dos 3 arquivos, `.opencode/Plan.md`)

> Planejamento de origem (project2.md): "melhore muito o visual geral e individual de cada pagina e sessão bem como a experiencia do usuário de maneira geral, faça isso de forma bem planejada. quero algo de altissimo nivel em todos os aspectos, não subestime as espectativas desse projeto (use spawn_agent's para obter ajuda na construção simultanea de partes significativas...)".
>
> Este PRD transforma essa intenção em decisões técnicas, escopo por fase e critérios de aceite. O roadmap correspondente é `.opencode/roadmap-proj2.md`; versões canónicas para o monitor vivem em `docs/planning/PRD.md` e `docs/planning/ROADMAP.md`.

---

## 1. Contexto e problema

O guia (projeto 1) entregou **conteúdo** completo e correto: 209 ferramentas em 18 categorias, 8 fluxos de trabalho, 8 armadilhas, 9 rotas com `head()` próprio, tema dark coerente (Fraunces + Space Grotesk, âmbar sobre azul-noite em OKLCH). O que falta é **nível de acabamento**: a interface funciona, mas seções competem por atenção da mesma forma, a busca é funcional e sem feedback, a página de detalhe de ferramenta é uma lista plana, e a experiência de leitura longa (concepts, setup) não tem orientação de progresso.

Problemas concretos observados no código e nos screenshots de 2026-10-15:

1. **Hierarquia visual plana.** Cards de categorias na Home, cards de ferramentas em `/tools` e cards de passos em `/setup` usam o mesmo container `rounded-2xl border bg-card` com densidades diferentes — nada distingue "chamada à ação" de "informação secundária".
2. **Busca sem estado visível.** Em `/tools`, digitar "decompile" funciona (10 resultados), mas não há contagem de resultados, destaque do trecho casado, nem esvaziamento com "estado vazio" útil (sugestões, atalho de limpeza).
3. **Detalhe de ferramenta sem progressão.** `/tools/$toolName` empilha badges, exemplo `tools/call` e relacionadas no mesmo ritmo; não há âncora de leitura nem evidência do que é copiável.
4. **Fluxos não mostram progresso.** `/workflows/$slug` renderiza N etapas; um leitor executando o fluxo não marca onde parou.
5. **Páginas longas sem navegação interna.** `/concepts` e `/setup` têm âncoras no texto, mas nenhum índice fixo/visível ao rolar.
6. **Microinterações ausentes.** Sem transições de entrada, hover states genéricos, nenhum `prefers-reduced-motion` respeitado (não há motion para respeitar).
7. **Acessibilidade só no básico.** `:focus-visible` global existe; landmarks, `aria-current` na navegação ativa e skip-link não.

Direção: manter a identidade já estabelecida (dark, âmbar, serifada Fraunces para títulos) e elevar **sistematicamente** — não redesenhar de zero. O projeto 1 escolheu essa linguagem e ela confere com o produto (terminal + engenharia reversa); trocá-la seria desperdiçar trabalho aprovado.

## 2. Público e jobs

Mesmo público do PRD do projeto 1, com os jobs que a elevação visual serve:

- **Operador novo** ("como começo?") — precisa de um caminho visualmente óbvio: Home → Setup. A Home deve ler como uma sequência, não como um mosaico.
- **Operador executando** ("estou no passo 4 do fluxo X") — precisa de progresso persistente e marcável no fluxo e no setup.
- **Operador consultando** ("qual é o parâmetro de `rename_symbol`?") — precisa de busca rápida com feedback e detalhe escaneável em blocos de 2–3 segundos.
- **Contribuidor/AI client** (o guia também orienta agentes) — precisa de exemplos copiáveis com affordance inequívoca.

## 3. Princípios de design (ligam decisão de UI)

1. **Uma ação primária por tela.** Cada rota tem exatamente um elemento de maior ênfase visual (cor, tamanho, posição). Todo o resto escala para baixo.
2. **Conteúdo é o herói; chrome é silencioso.** Bordas 1px em baixa opacidade, sombras mínimas, cor usada só para significado (âmbar = ação/destaque; success/info/destructive = estados).
3. **Densidade a serviço do escaneamento.** Catálogos e listas compactam; leituras longas expandem (medida de linha 60–75ch).
4. **Movimento com propósito.** Animações só para entrada de conteúdo, mudança de estado e confirmação de cópia — nunca decorativas; todas sob `prefers-reduced-motion: reduce` desligam para opacidade instantânea.
5. **Tudo copiável tem affordance.** Código executável ganha botão de cópia com feedback ("Copiado ✓" por 2s, anunciado em `aria-live`).
6. **Progresso visível onde existe sequência.** Fluxos e setup mostram posição (passo N de M) e estado salvo localmente.
7. **Zero cor hardcoded.** Continua: toda cor via tokens semânticos de `src/styles.css`; componentes nunca usam `bg-[#…]`/`text-white`.

## 4. Sistema de design — decisões

### 4.1 Cor (tokens OKLCH existentes, refinados)

Manter a paleta de `src/styles.css` como base. Adicionar/aprimorar:

| Token | Valor base | Uso novo |
|---|---|---|
| `--primary` | âmbar `oklch(0.8 0.13 78)` | só ação primária e destaque ativo; nunca fundo de card inteiro |
| `--surface-raised` (novo) | card +4% lightness | cards interativos (hover levanta surface, não borda) |
| `--surface-sunken` (novo) | background −2% lightness | blocos de código, exemplos `tools/call` |
| `--border-strong` (novo) | border a 20% | separador de seções dentro de página longa |
| `--success/--warning/--info` | manter | severidade de armadilha, critério de verificação de setup |

Gradientes: permitidos apenas como wash de fundo em hero (radial âmbar a ≤8% de opacidade) e barra de progresso. Nada de gradient banners.

### 4.2 Tipografia

- **Fraunces** (serif, já carregada): títulos de página e de seção; usar eixo óptico (opsz) — títulos ≥ `text-4xl` com `font-weight: 550–600`, subtítulos `500`.
- **Space Grotesk**: corpo, UI, dados. Corpo de leitura longa em `text-base/[1.7]` com `max-w-[68ch]`.
- **Mono** (adicionar `--font-mono: "JetBrains Mono", ui-monospace…` + preload no `head` do root): nomes de ferramenta, parâmetros, código. Nomes de ferramenta SEMPRE em mono com cor `--primary` em 90% — este é o padrão mais forte de reconhecimento no guia.
- Escala fixa: `text-sm` (UI densa), `text-base` (corpo), `text-lg` (lead), `text-2xl/3xl/4xl/5xl` (títulos). Proibido tamanhos intermediários arbitrários.

### 4.3 Espaço, raio, elevação

- Ritmo vertical em múltiplos de 4px; seções separadas por `py-16` (desktop) / `py-10` (mobile).
- `--radius` mantém `0.75rem`; cards densos (tabela, lista) usam `radius-sm`.
- Elevação por camada em vez de sombra: background → sunken → card → raised → popover. Hover interativo troca card→raised (transição 150ms `ease-out`), nunca anima `box-shadow` grande.

### 4.4 Motion

- Tokens: `--duration-fast: 150ms`, `--duration-base: 250ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`.
- Entrada de seção ao rolar: fade + 8px translate, uma vez, via `IntersectionObserver` compartilhado (`useRevealOnScroll`), com `stagger` de 40ms entre cards irmãos.
- Toda animação envolta em media query `prefers-reduced-motion: reduce` → `animation: none; transition-duration: 0s; opacity: 1; transform: none`.

### 4.5 Ícones

Manter `lucide-react` (já instalado). Ícone nunca carrega significado sozinho: sempre com rótulo ou `aria-label`. Tamanhos: 16 (inline), 20 (card header), 24 (hero/empty).

## 5. Escopo por fase

Fases em ordem de dependência. Cada fase termina com gates (seção 9) e avaliação do monitor.

### Fase P2-1 — Fundação: tokens, layout shell e componentes base

Escopo:

- Novos tokens em `src/styles.css` (`--surface-raised/sunken`, `--border-strong`, motion tokens, `--font-mono` + link JetBrains Mono no `head` de `__root.tsx`).
- `src/components/` — refatorar os compartilhados com a nova fundação:
  - `site-header.tsx`: `aria-current="page"` no link ativo, indicador sublinhado animado, header com `backdrop-blur` ao rolar; skip-link para `#main`.
  - `site-footer.tsx`: hierarquia de 2 níveis (navegação + colofão), sem mudança de conteúdo.
  - `code-block.tsx`: fundo `--surface-sunken`, botão de cópia com estado "Copiado ✓" (2s, `aria-live="polite"`), contador de linhas opcional.
  - `category-icon.tsx`: padronizado em 3 tamanhos via prop `size`.
  - Novo `src/components/ui/reveal.tsx` (ou hook `useRevealOnScroll`): wrapper de entrada animada com stagger e reduced-motion.
- `main` landmark em todas as rotas (`<main id="main">`).

Critérios de aceite:

- Todos os componentes da fundação renderizam nas 6 rotas sem regressão visual grave (screenshot Playwright comparado manualmente).
- Botão de cópia em `code-block` copia o conteúdo e anuncia em `aria-live` (teste unitário do comportamento de estado).
- `prefers-reduced-motion` simulado (`page.emulateMedia({ reducedMotion: 'reduce' })`) renderiza sem transições (assert via CSS computado).
- Gates da seção 9 verdes.

### Fase P2-2 — Home

Escopo:

- Hero: título Fraunces maior com hierarquia de duas linhas (já existe), badge de métricas vira "pill" com separadores visuais; CTA primário único ("Explorar ferramentas") + secundário outline ("Começar do zero").
- Seção "Como funciona": os 3 cards ganham numeração sequencial (01/02/03) e linha conectora vertical fina em desktop — leitura como pipeline, não mosaico.
- "Primeiro uso em 4 passos": steps viram timeline horizontal com barra de progresso decorativa e cada passo com número em âmbar; mobile empilha verticalmente.
- "Famílias de ferramentas": grid 4×2 com contagem em badge; card com hover → `--surface-raised` + ícone ganha cor âmbar; card inteiro clicável (não só o "Ver todas").
- Duas faixas finais (fluxos/armadilhas) viram "split hero" com ícone maior e CTA explícito cada.
- Entrada por scroll nas seções (reveal + stagger).

Critérios de aceite:

- Exatamente 1 CTA primário visível acima da dobra.
- Todos os cards da Home são clicáveis como um todo (`<Link>` envolvendo o card) com `:focus-visible` visível.
- Playwright: seções presentes na ordem esperada; screenshot desktop + mobile (375px) sem overflow horizontal.

### Fase P2-3 — Catálogo `/tools` e busca

Escopo:

- Barra de busca maior com ícone, atalho de teclado visível (`/` foca a busca — handler global na rota), e botão de limpar (×) quando há texto.
- Resultado com contagem: "N ferramentas" ao filtrar; termo casado destacado (`<mark>` estilizado com `--primary/20%`) no nome e na descrição.
- Filtros (categoria/escopo) como chips horizontais com estado ativo em âmbar e contagem por categoria; estado na URL mantido (comportamento atual preservado).
- Grid de ferramentas: card compacto com nome mono, snippet de descrição em 2 linhas (`line-clamp-2`), badges de escopo reduzidos a ícones com `title`.
- Estado vazio real: ilustração de ícone, "Nada para 'termo'", 3 sugestões de busca populares (derivadas de categorias de maior contagem) e botão "Limpar filtros".
- A11y: busca com `role="search"`, contagem anunciada via `aria-live="polite"`.

Critérios de aceite:

- Digitar "decompile" mostra contagem correta (10) e destaque do trecho; limpar restaura a visão completa.
- Tecla `/` foca a busca quando nenhum campo está em foco; `Escape` limpa.
- Estado vazio renderiza para termo sem resultado (ex.: "zzz") com sugestões funcionais.
- URL reflete busca/filtros e deep-link abre o estado correto (teste de roteamento existente estendido).

### Fase P2-4 — Detalhe da ferramenta `/tools/$toolName`

Escopo:

- Cabeçalho: nome em mono grande, categoria como link de volta (breadcrumb `Catálogo / categoria / ferramenta`), badges de escopo e método HTTP com cores semânticas.
- Layout 2 colunas em desktop: coluna principal (descrição, exemplo `tools/call`, parâmetros como tabela), coluna lateral (meta: escopo, categoria, relacionadas, "abrir no catálogo"). Mobile empilha.
- Tabela de parâmetros gerada de `params[]`: nome mono, tipo `string` implícito, e nota de que defaults existem quando aplicável (sem inventar tipos — o catálogo não os tem).
- Exemplo `tools/call` em `code-block` com botão de cópia (Fase P2-1).
- Relacionadas: até 4 chips clicáveis da mesma categoria.
- `<title>` e `head()` preservados (comportamento do projeto 1).

Critérios de aceite:

- Breadcrumb navegável volta para `/tools` com filtros de categoria aplicados.
- Parâmetros renderizam como tabela acessível (`<table>` com `caption`), não lista de vírgulas.
- Copiar o exemplo copia o JSON exato do `tools/call`.
- Playwright navega catálogo → detalhe → relacionadas → detalhe sem erro.

### Fase P2-5 — Fluxos `/workflows` + `/workflows/$slug`, e progresso persistente

Escopo:

- Índice: cards por fluxo com contagem de etapas, tempo estimado relativo (etapas × complexidade, rótulo "curto/médio/longo" — sem inventar minutos) e pré-requisitos como badges.
- Detalhe: cabeçalho com objetivo, pré-requisitos e stepper vertical numerado; cada etapa é um `fieldset` visual colapsável (aberto por padrão) com as ferramentas linkadas em chips mono.
- **Progresso persistente:** checkbox "Concluída" por etapa, salvo em `localStorage` por slug (chave `workflow-progress-<slug>`), barra de progresso no topo ("3 de 8 etapas") e estado "fluxo concluído" com celebridade mínima (check no header). Botão "Reiniciar progresso" com confirmação inline (não `window.confirm`).
- Armadilhas do fluxo (`pitfalls[]`) em callouts `--warning` com link para `/pitfalls#slug`.
- Fonte citada (`sourceRef`) em `<details>` discreto no fim.

Critérios de aceite:

- Marcar etapas, recarregar a página e o progresso persiste (teste unitário do hook de persistência + Playwright de recarga).
- Barra de progresso reflete a fração correta; ao completar, header exibe estado concluído.
- Toda ferramenta citada existe no catálogo (teste existente `workflows.test.ts` continua passando).

### Fase P2-6 — Concepts, Setup, Pitfalls (leitura longa)

Escopo:

- `/concepts`: TOC lateral sticky (desktop) com as âncoras existentes, item ativo via `IntersectionObserver`; mobile vira `<details>` no topo. Cada conceito ganha heading `id` estável, ícone e exemplo quando houver.
- `/setup`: passos viram stepper numerado com o critério de verificação em callout `--success` ("como saber que deu certo"), comandos em `code-block` copiável; o aviso Git Bash e o debugger opt-in mantêm callout `--warning`.
- `/pitfalls`: filtro por severidade (chips); cada armadilha em card com header colorido por severidade (crítica = `--destructive` à esquerda em barra 3px, média = `--warning`), sintoma/causa/remédio em estrutura de definição (`<dl>`).
- Doc do 8º pitfall (`plate-newline-literal`, apontado pelo monitor como escopo não rastreado): este PRD o adota oficialmente — permanece, com `sourceRef` apontando para a documentação de plate comments (`docs/PLATE_COMMENT_BEST_PRACTICES.md`).

Critérios de aceite:

- TOC em `/concepts` marca o item ativo ao rolar (Playwright: rolar até a 3ª seção e o item ativo muda).
- Comandos do `/setup` copiáveis com feedback.
- Filtro de severidade em `/pitfalls` reduz a lista e o contador.
- 8 armadilhas renderizam, cada uma com severidade visualmente distinguível sem depender só de cor (ícone + rótulo).

### Fase P2-7 — Polish transversal, 404 e verificação end-to-end

Escopo:

- 404 (`NotFoundComponent`): ilustração de terminal com prompt, link de volta, e busca sugerida.
- Favicon/OG coerentes (sem nova imagem obrigatória; `og:image` só se houver asset absoluto — regra da stack).
- Varredura final de contraste AA (tokens auditados; âmbar sobre dark confere ≥4.5:1 para texto e ≥3:1 para elementos gráficos).
- Revisão de foco: ordem de tabuação lógica em header, catálogo, fluxos; nenhum elemento interativo sem `:focus-visible`.
- Lighthouse-like manual: sem layout shift no load de fontes (`display=swap` já presente), imagens n/a.
- Playwright end-to-end completo: home → busca → detalhe → fluxo com progresso → concepts (TOC) → setup (cópia) → pitfalls (filtro) → 404, zero erros de console.

Critérios de aceite: todos os gates da seção 9 + os acima, e avaliação do monitor **concluída** para a fase.

## 6. Página por página — resumo de referência rápida

| Rota | Fase | Mudança central | CTA primário |
|---|---|---|---|
| `/` | P2-2 | Pipeline visual, timeline de passos | Explorar ferramentas |
| `/tools` | P2-3 | Busca com feedback, chips, estado vazio | (busca é o CTA) |
| `/tools/$toolName` | P2-4 | 2 colunas, tabela de params, breadcrumb | Copiar exemplo |
| `/workflows` | P2-5 | Cards com metadados de execução | Seguir um fluxo |
| `/workflows/$slug` | P2-5 | Stepper + progresso persistente | Marcar etapa |
| `/concepts` | P2-6 | TOC sticky com item ativo | (leitura) |
| `/setup` | P2-6 | Stepper com verificação por passo | Copiar comando |
| `/pitfalls` | P2-6 | Filtro por severidade, cards de severidade | (consulta) |
| 404 | P2-7 | Terminal ilustrado + volta | Voltar ao início |
### 6.1 Wireframes de referência

Estruturas-alvo em texto (não são pixel-perfect; definem blocos, ordem e ênfase):

**Home (`/`)** — pipeline em vez de mosaico:

```text
┌──────────────────────────────────────────────────────────────┐
│ header: logo · nav · [status do agente]                      │
├──────────────────────────────────────────────────────────────┤
│              (pill: 209 ferramentas · 18 categorias)         │
│         Engenharia reversa do Ghidra,                        │  ← Fraunces 5xl
│         dirigida por SEU ASSISTENTE DE IA (âmbar)            │
│              lead em 2 linhas, max-w-[60ch]                  │
│         [ Explorar ferramentas → ]  [ Começar do zero ]      │  ← 1 primário
├──────────────────────────────────────────────────────────────┤
│ Como funciona                                                │
│  01 ●─ Plugin Ghidra ── 02 ●─ MCP Bridge ── 03 ●─ Cliente IA │  ← conectora
│  (cards iguais, número âmbar, ícone 20px)                    │
├──────────────────────────────────────────────────────────────┤
│ Primeiro uso em 4 passos                                     │
│  [01]───[02]───[03]───[04]   barra de progresso decorativa   │
├──────────────────────────────────────────────────────────────┤
│ Famílias de ferramentas                        Ver todas →   │
│  [card][card][card][card]  × 2 linhas   hover: raised+âmbar  │
├──────────────────────────────────────────────────────────────┤
│ [ 8 fluxos guiados …→ ]      [ 8 armadilhas …→ ]   split 2col│
├──────────────────────────────────────────────────────────────┤
│ footer: nav · colofão                                        │
└──────────────────────────────────────────────────────────────┘
```

**Catálogo (`/tools`)** — busca é o herói:

```text
┌──────────────────────────────────────────────┐
│ header                                       │
│ [🔍 Buscar ferramenta…        ⌘/] [×]        │  ← input xl, sunken
│ chips: [Todas 209][Função 23][Tipos 32]…     │  ← ativo = âmbar
│ escopo: [Ambos][GUI][Headless]               │
│ 10 ferramentas para "decompile"   (aria-live)│
│ ┌─────────┐┌─────────┐┌─────────┐            │
│ │decompil.││ força_  ││ …  grid │            │  nome mono, desc
│ │ mono    ││ decompil││  3 col  │            │  2 linhas clamp
│ └─────────┘└─────────┘└─────────┘            │
│ estado vazio: ícone + sugestões + [Limpar]   │
└──────────────────────────────────────────────┘
```

**Detalhe (`/tools/$toolName`)** — 2 colunas:

```text
┌───────────────────────────────┬──────────────┐
│ ← Catálogo / Funções /        │  META        │
│   rename_function (mono 3xl)  │  escopo: GUI │
│ [GUI][HEADLESS][GET]          │  categoria → │
│ descrição (lead)              │  ──────────  │
│ ── Parâmetros (table) ──      │  Relacionadas│
│ ── Exemplo tools/call ──      │  [chip][chip]│
│ ┌ sunken ────────────────┐    │  [chip][chip]│
│ │ { "name": "…" }  [⧉]   │    │              │
│ └────────────────────────┘    │              │
└───────────────────────────────┴──────────────┘
```

**Fluxo (`/workflows/$slug`)** — stepper com progresso:

```text
┌──────────────────────────────────────────────┐
│ ← Fluxos · Documentação de função V5         │
│ objetivo (lead) · pré-req badges             │
│ ▓▓▓▓▓░░░░░ 3 de 8 etapas   [Reiniciar]       │
│ (✓) 1. Preparar o terreno        [etapa ↓]   │  colapsável
│ (✓) 2. Documentar núcleo         [etapa ↓]   │
│ ( ) 3. Tipar globals  ◀ em curso             │  borda âmbar
│     ferramentas: [audit_global][set_global]  │  chips mono
│ ( ) 4. …                                     │
│ callout ⚠ armadilha do fluxo → /pitfalls#…   │
└──────────────────────────────────────────────┘
```



| Componente | Tipo | Fase |
|---|---|---|
| `ui/reveal.tsx` / `useRevealOnScroll` | novo | P2-1 |
| `code-block.tsx` (cópia + sunken) | alterado | P2-1 |
| `site-header.tsx` (aria-current, blur) | alterado | P2-1 |
| `site-footer.tsx` (hierarquia) | alterado | P2-1 |
| `tool-search.tsx` (busca isolada da rota) | novo | P2-3 |
| `filter-chips.tsx` (chips de categoria/escopo) | novo | P2-3 |
| `empty-state.tsx` | novo | P2-3 |
| `param-table.tsx` | novo | P2-4 |
| `breadcrumb.tsx` | novo | P2-4 |
| `workflow-stepper.tsx` + `useWorkflowProgress` | novo | P2-5 |
| `toc.tsx` (TOC sticky) | novo | P2-6 |
| `severity-card.tsx` (armadilhas) | novo | P2-6 |
| `not-found` (rota root) | alterado | P2-7 |

Novos componentes recebem teste quando carregam regra que o usuário pediria (progresso persistido, destaque de busca, contagem de filtro). Nada de snapshot test de estilo.

## 8. Fora de escopo

- Mudar dados (`src/data/*`), rotas novas ou mudar slugs — o conteúdo do projeto 1 é congelado.
- Backend/auth/persistência remota — `localStorage` cobre progresso; nada de Lovable Cloud aqui (não há backend no app).
- Modo claro — dark é a identidade; tokens continuam nomeados mas sem segundo tema.
- Internacionalização — pt-BR apenas.
- Substituir TanStack Router/Start, instalar CSS frameworks novos (Tailwind v4 + shadcn existentes bastam).
- Reconstituir `stage-01-04-eval.md` (perda documentada pelo monitor; não se recria por inferência).

## 9. Gates por fase (obrigatórios, seção 19 do AGENTS do workspace)

Toda fase termina com:

1. `bunx vitest run` — 100% verde (suíte atual de 23 testes + novos testes de regra).
2. `bun run lint` — 0 erros (warnings do shadcn pré-existentes tolerados).
3. `bun run build` — OK, sem typecheck errors.
4. Playwright das rotas tocadas na fase — zero erros de console; screenshots desktop (1280×1800) e mobile (375×812) salvos em `/tmp/browser/<fase>/`.
5. Status da fase em `docs/planning/stages/stage-p2-NN-status.md` e avaliação do monitor (`stage-p2-NN-eval.md`) antes de marcar `[x]` no roadmap.

## 10. Métricas de sucesso (subjetivas mas verificáveis)

- Um novo operador entende o que o app faz em ≤10s na Home (sem ler parágrafo).
- Busca → detalhe de ferramenta em ≤3 interações a partir de qualquer rota.
- Um fluxo pode ser executado e retomado outro dia (progresso persiste).
- Nenhum texto com contraste abaixo de AA; nenhuma animação sem reduced-motion.
- Zero cor hardcoded em componentes (varredura `rg "bg-\[#|text-\[#" src/` vazia).

## 11. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Redesign inflar e quebrar testes de roteamento/dados existentes | Fases tocam rotas em blocos; suíte roda a cada fase; dados congelados |
| TOC/stepper em SSR hidratar divergente | Todo estado de scroll/ativo via `useEffect`/`IntersectionObserver`, nunca no render inicial |
| `localStorage` em SSR | Leituras só em `useEffect` (regra da stack); hook `useWorkflowProgress` centraliza |
| Motion em excesso | Tokens de duração limitados; revisão por fase no screenshot; reduced-motion obrigatório |
| JetBrains Mono pesando o load | `display=swap` e preload só do peso 400/500; fallback `ui-monospace` |
| Perda de `src/lib/` repetir-se em wipe futuro | Módulos restaurados agora commitados junto com a Fase P2-1 (o builder comita a fundação antes de avançar) |

## 12. Decisões técnicas registradas

1. **Sem backend novo.** Persistência de progresso em `localStorage`; justificativa: dado efêmero do leitor, sem conta no app.
2. **IntersectionObserver compartilhado** para TOC e reveal, num único hook, para não multiplicar observers por seção.
3. **Busca continua client-side sobre `src/data/tools.ts`** (estático, 209 itens — carrega em <1ms de filtro).
4. **Steppers colapsáveis com `details/summary` nativos** onde semântica permitir, Radix (`Collapsible`) onde precisar de controle fino — menos JS próprio.
5. **JetBrains Mono via Google Fonts** no `head` do root (mesma origem das fontes atuais, regra da stack veta `@import` remoto em CSS).
6. **Progresso por etapa é booleano**, não timestamp — simplicidade; "quando" não serve a nenhum job listado.
7. **O 8º pitfall é adotado** (não removido), com `sourceRef` corrigido para `docs/PLATE_COMMENT_BEST_PRACTICES.md` — resolve a pendência apontada pelo monitor em `stage-05-eval.md`.

## 13. Responsividade e breakpoints

Tailwind v4, breakpoints padrão (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Comportamento esperado por largura:

| Largura | Header | Home | `/tools` | Detalhe | Fluxo | Concepts/Setup |
|---|---|---|---|---|---|---|
| `< 640` | logo + menu hamburger (drawer Radix) | pilha única, timeline vertical | busca full-width, chips com scroll horizontal (`overflow-x-auto`, sem barra visível) | pilha única | stepper vertical | TOC em `<details>` no topo |
| `640–1023` | nav completa quando couber (a partir de `md`) | grid 2 col nos cards de família | grid 2 col de ferramentas | pilha com meta após descrição | stepper vertical, largura de leitura | TOC no topo, âncoras |
| `≥ 1024` | nav completa + status do agente | grid 4 col, conectora nos 3 cards | grid 3 col + filtros em coluna? **Não** — filtros permanecem acima do grid (menos custo que sidebar) | 2 colunas (principal 2fr / lateral 1fr) | stepper + callouts laterais | TOC lateral sticky (`top-24`) |

Regras duras:

- Nenhuma rota com overflow horizontal em 375px (verificado por Playwright em cada fase).
- Texto de leitura longa nunca excede `max-w-[68ch]`, mesmo em telas largas (conteúdo centraliza com `mx-auto`).
- Tap targets ≥ 44×44px no mobile (chips e badges incluem padding de toque, não só o glyph).

## 14. Teclado e atalhos

| Tecla | Contexto | Ação |
|---|---|---|
| `Tab` / `Shift+Tab` | global | ordem lógica; skip-link "Pular para o conteúdo" é o primeiro foco |
| `/` | fora de inputs | foca a busca em `/tools` (e só lá) |
| `Escape` | busca com texto | limpa a busca; segunda vez devolve foco ao grid |
| `Enter` / `Space` | cards clicáveis | ativa o link do card (uso de `<Link>` real, não div + onClick) |
| `c` | `code-block` focado | copia (atalho secundário; botão continua o caminho principal) |

Nenhum atalho captura tecla com modifier do browser (só teclas "nuas" quando o foco está no body). O handler global vive num hook (`useHotkey`) com cleanup em `useEffect`.

## 15. Microcopy (voz e tom)

Voz existente do projeto 1: técnico-objetivo, pt-BR, sem emoji, segunda pessoa do singular. Regras para o texto novo:

- **Botões no infinitivo**: "Explorar ferramentas", "Copiar exemplo", "Reiniciar progresso" — nunca "Clique aqui".
- **Estados vazios ensinam**: "Nada para 'zzz'. Tente: decompile, rename, xref" — sempre com caminho de saída.
- **Confirmação inline**: "Reiniciar progresso? Isso desmarca as N etapas concluídas. [Reiniciar] [Cancelar]" — nunca `confirm()`.
- **Feedback de cópia**: "Copiado" com check; erro de clipboard: "Não foi possível copiar — selecione o texto manualmente" (o `code-block` mantém seleção possível).
- **Progresso**: "3 de 8 etapas" — número antes do total, sem porcentagem (fração é mais concreta).
- Nomes de ferramenta no texto correm em mono; verbos de API nunca traduzidos (`tools/call`, não "chamada de ferramenta" como rótulo de código).

## 16. Estratégia de testes por fase

A suíte existente (`src/test/`) tem 23 testes em 4 arquivos e continua como piso. Novos testes seguem a regra da casa: **um teste por regra que o usuário pediria, com valor concreto; nada de testar estilo, markup ou snapshot**.

| Fase | Teste novo | Assert concreto |
|---|---|---|
| P2-1 | `code-block` copia | após clique, clipboard contém o payload exato e o rótulo muda para "Copiado" por 2s |
| P2-3 | destaque e contagem de busca | "decompile" → contagem 10; `<mark>` envolve o trecho casado |
| P2-3 | estado vazio | "zzz" → sugestões renderizam e "Limpar filtros" restaura 209 |
| P2-4 | tabela de parâmetros | `rename_function` renderiza `<table>` com uma linha por param de `params[]` |
| P2-5 | persistência de progresso | hook marca etapa 3 de `documentacao-funcao-v5`, recarrega estado do store, etapa 3 segue marcada |
| P2-5 | fração do progresso | 3 de 8 etapas → label "3 de 8 etapas" e barra a 37,5% |
| P2-6 | filtro de severidade | filtro "critica" reduz a lista para as 4? (contagem real de `PITFALLS`) — assert sobre o dado, não sobre número inventado |
| P2-7 | varredura de cor hardcoded | `rg` por utilitários arbitrários de cor em `src/` retorna vazio (teste de CI lendo os fontes) |

Playwright por fase cobre navegação e zero erros de console; asserções de UI ficam nos testes vitest.

## 17. Paralelização com subagentes (spawn_agent)

O planejamento de origem pede construção simultânea por agentes secundários, com o agente principal juntando as peças. Divisão proposta — só peças independentes e de contrato claro:

| Trabalho | Paralelizável? | Contrato de saída |
|---|---|---|
| Fase P2-1 (fundação) | **Não** — tudo depende dos tokens e componentes base | — |
| P2-3 (catálogo) e P2-6 (leitura longa) | Sim, após P2-1 | cada subagente entrega rotas completas passando nos gates locais |
| Componentes P2-4 (param-table, breadcrumb) e P2-5 (stepper + hook) | Sim, após P2-1 | componentes isolados com testes vitest próprios; rotação final integra |
| Verificação Playwright e screenshots | Não — roda na integração de cada fase | logs e PNGs em `/tmp/browser/<fase>/` |

Regras do trabalho paralelo: subagente nunca edita `src/styles.css` (tokens são da fundação); nunca toca `src/data/*` ou `routeTree.gen.ts`; entrega com lint/build verdes no escopo dele. O agente principal integra, roda os gates completos e registra o status da fase — responsabilidade de integração nunca delegada.

## 18. Referências

- `.opencode/project2.md` — intenção original.
- `.opencode/prd-project1.md` — PRD do projeto 1 (conteúdo, §4.4, §4.7 e decisões de dados aqui herdadas).
- `docs/planning/reports/stage-05-eval.md` — avaliação do monitor que bloqueou gates e apontou `src/lib/`.
- `docs/planning/stages/stage-05-status.md` — restauração dos módulos e gates re-executados (2026-10-15).
- Stack: TanStack Start v1, Tailwind v4 (tokens em `src/styles.css`), shadcn/Radix, `lucide-react`.
