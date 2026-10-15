# PRD — Interface Web de Uso do Ghidra MCP (`project1`)

> Status: ativo. Derivado de `.opencode/project1.md`. Precedência no escopo: `project1` > este PRD > `roadmap-proj.md`.
> Última atualização: 2026-10-15 (criação).

---

## 0. Resumo executivo

O ghidra-mcp é um servidor MCP que expõe **209 ferramentas** de engenharia reversa do Ghidra para clientes de IA. O projeto é poderoso, porém de **adoção difícil**: a documentação está espalhada por README (2 mil+ linhas), `docs/prompts/`, `docs/TESTING.md` e catálogos técnicos (`tests/endpoints.json`). Um novo operador precisa ler dezenas de milhares de caracteres para responder perguntas simples: *"por onde começo?"*, *"qual ferramenta uso para X?"*, *"por que minha decompilação veio errada?"*.

Este projeto constrói uma **interface web de altíssimo nível** (TanStack Start, já é a stack do dev-server) que transforma esse conhecimento disperso em uma experiência navegável e auto-explicativa:

1. **Catálogo de ferramentas** — as 209 ferramentas navegáveis por categoria, com busca, filtros e página de detalhe (parâmetros, escopo GUI/headless, exemplos).
2. **Fluxos de trabalho guiados** — os fluxos do operador (documentação V5, tipagem de dados, propagação entre versões, etc.) como trilhas passo a passo com as ferramentas de cada etapa linkadas ao catálogo.
3. **Conceitos fundamentais** — instâncias, tool groups, `program=`, convenções de nomenclatura, transportes — explicados para quem nunca usou o projeto.
4. **Guia de instalação/uso** — do clone ao primeiro `tools/call`, com as armadilhas conhecidas inline (Ghidra path com barra no Git Bash, variantes de linguagem, debugger opt-in, etc.).

O produto final deve permitir que alguém que **nunca ouviu falar do ghidra-mcp** entenda o que ele faz, instale, conecte seu cliente de IA e encontre a ferramenta certa para cada tarefa — **sem abrir o README**.

---

## 1. Problema

### 1.1 Falhas atuais (estado do remix)

| # | Falha observada | Evidência |
|---|---|---|
| P1 | Documentação fragmentada em 6+ locais com sobreposição e profundidade desigual | `README.md`, `docs/prompts/*.md` (12 arquivos), `docs/TESTING.md`, `tests/endpoints.json` |
| P2 | Não há visão de conjunto das 209 ferramentas; `tests/endpoints.json` é JSON cru para máquinas | catálogo com 18 categorias, sem índice humano |
| P3 | O README assume familiaridade com Ghidra, MCP e o ecossistema; não existe trilha de entrada | `README.md` seções Quick Start/Usage |
| P4 | Fluxos de trabalho (V5, propagação, tipagem) vivem em documentos de prompt longos, sem representação visual do passo a passo | `docs/prompts/FUNCTION_DOC_WORKFLOW_V5.md` etc. |
| P5 | Armadilhas caras (variantes de linguagem, `program=` em multi-versão, Git Bash path) estão enterradas em AGENTS.md/docs de projeto | seções "Key Gotchas" |
| P6 | A Web UI atual do dev-server é um placeholder genérico ("Workspace / Novo Projeto") | `src/routes/index.tsx` |

### 1.2 Para quem

- **Persona principal — Operador iniciante**: analista de RE que instalou o Ghidra e quer usar IA para documentar/analisisar binários. Não conhece o MCP bridge.
- **Persona secundária — Operador experiente**: já usa o projeto e quer um índice rápido de ferramentas e parâmetros sem grepar o catálogo.
- **Persona terciária — Curioso/avaliador**: quer entender em 5 minutos o que o projeto faz antes de instalar qualquer coisa.

### 1.3 Objetivos

- **O1**: reduzir o tempo até a primeira ferramenta executada com sucesso (tempo-para-valor) para minutos, não horas.
- **O2**: tornar o catálogo completo (100% das 209 ferramentas) navegável por humanos.
- **O3**: representar visualmente os fluxos de trabalho do operador com rastreabilidade para os docs-fonte.
- **O4**: manter tudo **estático e offline** — nenhum backend, nenhum dado sensível, sem dependência de um Ghidra rodando.

### 1.4 Não objetivos (fora de escopo)

- **N1**: proxy em tempo real para um Ghidra/MCP ativo (a UI é uma enciclopédia de uso, não um cliente MCP). Justificativa: exige Ghidra rodando e introduz superficie de segurança; o planejamento pede "facilitar o entendimento de como usar", não operar.
- **N2**: editar binários, comentários ou projetos via UI.
- **N3**: autenticação/multiusuário.
- **N4**: alterar qualquer parte do servidor Java ou do bridge Python.

---

## 2. Decisões técnicas (o COMO)

### 2.1 Stack e arquitetura

| Decisão | Escolha | Racional |
|---|---|---|
| Framework | TanStack Start (existente), rotas em `src/routes/` | stack do dev-server; proibido trocar de router |
| Dados do catálogo | Módulo TS gerado a partir de `tests/endpoints.json` (`src/data/`), campos podados | catálogo é a fonte de verdade; poda reduz bundle e remove texto de máquina |
| Backend | Nenhum. Dados estáticos importados no client/SSR | O4; elimina RLS/auth/secrets |
| Estilo | Tailwind v4 + tokens OKLCH existentes em `src/styles.css` (tema escuro, primário âmbar `oklch(0.8 0.13 78)`, Space Grotesk + Fraunces) | direção visual já configurada e distinta; não reinventar |
| Componentes | `src/components/ui/` (shadcn/Radix, ~45 primitivos) | reuso; sem novas dependências além de ícones lucide (já presente) |
| Estado | `@tanstack/react-query` para loaders de rota quando couber; caso contrário, dados estáticos diretos | sem servidor, não há cache real a gerenciar |
| Testes | Vitest (`src/test/`): roteamento + testes de dados (integridade do catálogo, contagens por categoria) | gate de qualidade automatizado e barato |

### 2.2 Modelo de dados (derivado do catálogo)

```ts
// src/data/types.ts
export type ServerScope = "gui" | "headless";
export interface McpTool {
  name: string;            // ex.: "rename_function"
  category: string;        // tool-group do bridge (ex.: "function")
  description: string;     // descrição legível do catálogo
  servers: ServerScope[];  // ["gui","headless"] — derivado por audit_server_scope
}
export interface ToolCategory {
  id: string;              // ex.: "function"
  label: string;           // rótulo humano, ex.: "Funções"
  summary: string;         // 1–2 frases: para que serve esta família
  icon: string;            // nome do ícone lucide
  tools: McpTool[];
}
```

Integridade garantida por teste: soma de `tools` = 209; toda categoria do catálogo tem `label`/`summary`; nenhum nome duplicado.

### 2.3 Informação não presente no catálogo (autorada)

Conteúdo de `workflows`, `concepts`, `setup` e `pitfalls` é **autorado** a partir dos documentos do repositório e dos relatórios de estudo (agentes `study-knowledge`/`study-webui`). Cada item referencia a fonte (`docs/prompts/TOOL_USAGE_GUIDE.md#L16`, etc.) para rastreabilidade. Ferramentas citadas em workflows linkam para a página de detalhe no catálogo.

---

## 3. Arquitetura da informação

```text
/                    Home — o que é, para quem, quick start em 4 passos, métricas
/tools               Catálogo — grid/busca/filtro por categoria + escopo
/tools/$toolName     Detalhe da ferramenta — params conhecidos, escopo, categoria, relacionadas
/workflows           Índice dos fluxos de trabalho
/workflows/$slug     Fluxo guiado — etapas, ferramentas por etapa, armadilhas do fluxo
/concepts            Conceitos fundamentais (instâncias, tool groups, program=, convenções, transportes)
/setup               Instalação e primeiro uso (plugin, bridge, cliente IA, debugger opt-in)
/pitfalls            Armadilhas comuns (card por armadilha, severidade, remédio)
```

- Navegação global no topo (dark, sticky), com destaque da rota ativa.
- Cada rota tem `head()` próprio com title/description/og específicos (proibido "Lovable App").
- Links internos: sempre TanStack `<Link>`; toda rota referenciada existe na mesma leva de edições.

---

## 4. Especificação por página

### 4.1 Home (`/`)

- **Hero**: nome do projeto, proposta de valor em 1 frase ("209 ferramentas de engenharia reversa do Ghidra, prontas para seu assistente de IA"), CTA "Explorar ferramentas" e "Começar do zero" (`/setup`).
- **Faixa de métricas**: 209 ferramentas · 18 categorias · 8 fluxos guiados · GUI + headless.
- **O que é**: 3 cards (Plugin Ghidra / MCP Bridge / Cliente IA) com o diagrama de arquitetura simplificado `AI ↔ Bridge ↔ McpHttpServer`.
- **Quick start em 4 passos**: instalar extensão → iniciar servidor no Ghidra → rodar o bridge → conectar o cliente IA. Cada passo linka para `/setup#passo-N`.
- **Destaque de categorias**: grid das categorias principais com contagem, link para `/tools?categoria=X`.
- **Footer**: aviso de projeto open-source, link para o repositório e para os docs canônicos.

### 4.2 Catálogo (`/tools`)

- Barra de busca (nome/descrição, case-insensitive) + filtros: categoria (chips), escopo (GUI/headless/ambos).
- Grid de cards por categoria: header com ícone + contagem; linhas de ferramentas clicáveis.
- URL sincronizada (`?q=`, `?categoria=`, `?escopo=`) para compartilhar visões.
- Estado vazio amigável quando a busca não encontra nada.
- Rota `loader` não necessária (dados estáticos importados); busca/filtro em `useState` + `useMemo`.

### 4.3 Detalhe da ferramenta (`/tools/$toolName`)

- Nome, badge de categoria (link), badges de escopo (`gui`/`headless`), descrição completa.
- **Params conhecidos**: extraídos quando o catálogo os traz; senão, nota apontando `/mcp/schema` como fonte canônica em runtime.
- **Como é chamada**: bloco de código com exemplo MCP `tools/call` (JSON), usando o nome da ferramenta.
- **Ferramentas relacionadas**: mesma categoria (até 6 links).
- **Nota de escopo**: quando headless-only ou GUI-only, explicar o porquê (serviço responsável).

### 4.4 Fluxos de trabalho (`/workflows`, `/workflows/$slug`)

8 fluxos autorados (fonte: relatório `study-knowledge` + docs/prompts):

1. **Documentação de função (V5)** — analisar → auditar → renomear → pontuar (`analyze_function_complete`, `analyze_function_completeness`…).
2. **Aplicação de tipos** — `apply_data_type` → `rename_symbol` (húngaro) → `set_comment`.
3. **Investigação de structs** — descoberta de campos + `analyze_struct_field_usage`.
4. **Análise de fluxo de dados** — `analyze_dataflow` forward/backward (P-code).
5. **Propagação entre versões** — hash SHA-256 pareia funções entre versões do binário e transfere documentação.
6. **Descoberta de código órfão** — funções não detectadas em lacunas.
7. **Emulação de P-code** — execução isolada para resolver hashes de API.
8. **Depuração dinâmica** — TraceRmi, anexo a processos, tradução de endereços (nota: exige opt-in `GHIDRA_DEBUGGER_URL`).

Cada fluxo: objetivo, pré-requisitos, etapas numeradas (ferramenta + o que fazer + link), armadilhas específicas, link para o doc-fonte.

### 4.5 Conceitos (`/concepts`)

Seções com âncoras: instâncias (UDS/TCP, descoberta), tool groups (lazy-load, por que existe), `program=` (multi-versão, resolução de nomes via `ProjectProgramProvider.match`), convenções de nomenclatura (PascalCase, húngaro, `g_`), transportes (stdio recomendado, streamable-http, sse deprecated), variantes de linguagem (stamp `language_id`/`variant`).

### 4.6 Setup (`/setup`)

Passos numerados com blocos de código copiáveis: pré-requisitos (Java 21, Ghidra 12.1.4), build/deploy (`./gradlew buildExtension -PGHIDRA_INSTALL_DIR=...`, com o aviso Git Bash forward-slash), iniciar servidor (menu Tools > GhidraMCP), bridge (`uv run bridge-mcp-ghidra` stdio / `--transport streamable-http`), config do cliente (exemplo JSON MCP com `ghidra-mcp-ghidra`), debugger opt-in. Cada passo com critério de verificação ("como saber que deu certo").

### 4.7 Armadilhas (`/pitfalls`)

Card por armadilha com severidade (crítica/média), sintoma, causa, remédio. Conteúdo mínimo (fonte: "Key Gotchas" e relatório de estudo):

1. Upgrade do Ghidra deixa todos os programas read-only (SLEIGH 4.6→4.7) → `tools/upgrade_project_language.py`.
2. Pseudocódigo "ficional" por variante de linguagem errada → conferir stamp `variant`.
3. `switch_program` muda o programa global → passar `program=` por chamada.
4. Git Bash corrompe `-PGHIDRA_INSTALL_DIR` com backslash → usar `/`.
5. Debugger proxies não aparecem → opt-in por env.
6. Nomes ambíguos em multi-versão (`D2Common.dll`) → caminho completo ou substring única.
7. `deploy --test` sob backend Gradle é recusado por design → rodar com backend Maven.

---

## 5. Design (direção visual)

- **Direção**: "manual técnico de laboratório" — dark já configurado (fundo `oklch(0.165 0.014 265)`), primário âmbar, títulos em Fraunces (serif de display), corpo em Space Grotesk, mono para código/identificadores. Densidade média-alta no catálogo; respiro nas páginas narrativas.
- Regras duras: nenhum valor de cor hardcoded em componentes (só tokens semânticos); nenhum gradiente roxo/indigo genérico; `bg-background`/`text-foreground` etc.
- Acessibilidade: contraste AA, foco visível, navegação por teclado nos filtros; `aria-label` em controles icônicos.

## 6. Qualidade e verificação

- `bunx vitest run` verde: teste de roteamento existente + novos testes de dados (209 ferramentas, 18 categorias, unicidade de nomes, workflows referenciam ferramentas existentes).
- Lint (`bun run lint`) e build (`bun run build`) verdes.
- Verificação central via Playwright: navegar home → catálogo → busca → detalhe → workflow → setup; screenshots por etapa.
- Toda página com `head()` único e completo (title/description/og/twitter).

## 7. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Conteúdo autorado divergir dos docs | Cada item de workflow/conceito/armadilha carrega referência de fonte; testes validam que ferramentas citadas existem no catálogo |
| Catálogo mudar (novos endpoints) | Gerador `src/data/` re-executável a partir de `tests/endpoints.json`; teste de contagem falha se divergir |
| Bundle grande pelo JSON | Poda de campos na geração (name/category/description/servers apenas) |
| SSR/hidratação | Sem browser APIs no render; busca/filtro após hidratação natural |

## 8. Fases (resumo — detalhe no roadmap)

- **Fase 0** — Protocolo e base de dados (PRD/roadmap + gerador do catálogo). *(concluída quando os 3 arquivos existem e `src/data/` passa nos testes)*
- **Fase 1** — Shell e Home.
- **Fase 2** — Catálogo + detalhe da ferramenta.
- **Fase 3** — Workflows guiados.
- **Fase 4** — Conceitos + Setup + Armadilhas.
- **Fase 5** — Polimento, testes, verificação end-to-end e handoff ao monitor.

## 9. Critérios de aceite (produto pronto)

1. Home explica o projeto e leva a qualquer área em ≤2 cliques.
2. As 209 ferramentas são navegáveis; busca encontra por nome e descrição; filtros funcionam e ficam na URL.
3. Detalhe da ferramenta mostra escopo, categoria, descrição e exemplo de chamada.
4. Os 8 fluxos existem com etapas e ferramentas linkadas ao catálogo.
5. Setup cobre do clone ao primeiro `tools/call`, com critérios de verificação por passo.
6. Armadilhas cobrem as 7 do PRD §4.7.
7. Testes, lint e build verdes; navegação Playwright sem erros de console.
8. Nenhum backend, nenhum secret, nenhum dado sensível na UI.

## 10. Especificações de detalhe

### 10.1 Especificação da geração de dados (`src/data/`)

O catálogo `tests/endpoints.json` é JSON de máquina: verboso, com campos internos. A UI consome uma versão podada e tipada:

```text
python/… OU tools/gen? — NÃO. A geração é um script Node/bun pontual:
  bun scripts/generate-tool-data.ts
Entrada:  tests/endpoints.json (fonte de verdade, nunca editada)
Saída:    src/data/tools.ts (array McpTool[] + ToolCategory[] derivado)
Podas:    manter name, category, description, servers.
          descartar: params internos longos, metadados de auditoria, campos nulos.
Ordem:    categorias por contagem desc; ferramentas alfabéticas dentro da categoria.
```

- O script é **idempotente**: rodar duas vezes produz bytes idênticos (diff limpo em PR).
- Se `tests/endpoints.json` mudar (novos endpoints), re-rodar o script e os testes de contagem apontam a divergência antes do merge.
- A capa de descrição é a do catálogo (hand-authored no Java); a UI não reescreve descrições de ferramenta.
- Rótulos/ícones/summaries de categoria vivem em `src/data/categories-meta.ts` (autorado): o gerador cruza categoria do catálogo com esse metadado e **falha** se uma categoria nova não tiver meta — impede categoria "crua" aparecer na UI.

### 10.2 Estado de URL do catálogo (`/tools`)

| Parâmetro | Valores | Comportamento |
|---|---|---|
| `q` | texto livre | busca case-insensitive por `name` + `description`; debounce não necessário (dados locais) |
| `categoria` | id da categoria | filtra o grid para a categoria |
| `escopo` | `gui` \| `headless` | mantém ferramentas que servem naquele escopo |

- Sincronização via `Route.useSearch()` + `navigate({ search })` do TanStack Router (validação de search params na definição da rota).
- Deep link: abrir `/tools?categoria=function&q=rename` já chega filtrado — cobre o caso "operador experiente salva o link da categoria que usa".
- Limpar filtros = botão visível quando ≥1 filtro ativo (nunca esconder o estado).

### 10.3 Exemplo de chamada (`tools/call`)

Toda página de detalhe renderiza:

```json
{
  "name": "rename_function",
  "arguments": {
    "function": "0x140010000",
    "new_name": "ValidateHeader"
  }
}
```

- Argumentos de exemplo são **ilustrativos** e marcados como tal (`// ajuste ao seu binário`); nunca copiados de dados reais de operador.
- O formato segue MCP `tools/call` (o contrato que o bridge expõe), não a rota HTTP crua — a UI documenta o uso por cliente de IA.

### 10.4 Wireframe ASCII — Catálogo

```text
┌────────────────────────────────────────────────────────────┐
│ GHIDRA-MCP   [Início] [Ferramentas] [Fluxos] [Conceitos]   │
│              [Instalação] [Armadilhas]                     │
├────────────────────────────────────────────────────────────┤
│ 209 ferramentas · 18 categorias          [ q: busca____ ]  │
│ Filtros: [chip function 23] [chip datatype 32] …           │
│          Escopo: ( ) todos ( ) GUI ( ) headless   [limpar] │
├────────────────────────────────────────────────────────────┤
│ ┌ function (23) ─────────────────────────────────────────┐ │
│ │ analyze_function_complete   analyze_for_documentation  │ │
│ │ decompile_function          rename_function            │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌ datatype (32) ─────────────────────────────────────────┐ │
│ │ …                                                       │ │
└────────────────────────────────────────────────────────────┘
```

### 10.5 Wireframe ASCII — Detalhe do fluxo

```text
┌────────────────────────────────────────────────────────────┐
│ ← Fluxos    Documentação de função (V5)                    │
│ Objetivo: … · Pré-requisitos: … · Fonte: docs/prompts/…    │
├────────────────────────────────────────────────────────────┤
│ ① Analisar a função                                        │
│    → analyze_function_complete  [abrir no catálogo]        │
│    o que fazer: …                                          │
│ ② Auditar tipos dos globais                                │
│    → audit_global               [abrir no catálogo]        │
│    o que fazer: …   ⚠ armadilha do fluxo: …                │
│ ③ Renomear (PascalCase / húngaro) …                        │
├────────────────────────────────────────────────────────────┤
│ Armadilhas deste fluxo · Doc canônico (link)               │
└────────────────────────────────────────────────────────────┘
```

---

## 11. Glossário (terminologia fixa da UI, pt-BR)

| Termo na UI | Significado | Não dizer |
|---|---|---|
| Ferramenta | Um endpoint MCP (`@McpTool`) | função, comando, API |
| Categoria | Tool-group do bridge (`category`) | grupo, módulo |
| Programa | Binário aberto no Ghidra (`program=`) | arquivo, binário (quando referir-se à seleção) |
| Instância | Um processo Ghidra com servidor MCP ativo (UDS/TCP) | servidor (ambíguo com McpHttpServer) |
| Escopo | Em quais servidores a ferramenta existe: GUI, headless | modo, tipo |
| Fluxo de trabalho | Trilha guiada do operador | tutorial, receita |
| Bridge | O pacote Python `bridge-mcp-ghidra` | proxy, wrapper |
| Cliente de IA | O consumidor MCP (Claude, Cursor, etc.) | usuário final |

Migração PT/EN: nomes de ferramentas e parâmetros permanecem em inglês (são identificadores); todo texto explicativo em pt-BR.

---

## 12. Conteúdo mínimo por fluxo (contrato de dados)

Cada `Workflow` em `src/data/workflows.ts`:

```ts
export interface WorkflowStep {
  title: string;              // "Auditar tipos dos globais"
  detail: string;             // 2-4 frases do que fazer
  tools: string[];            // nomes que DEVEM existir em McpTool[] (testado)
  pitfall?: string;           // armadilha específica da etapa
}
export interface Workflow {
  slug: string;               // "function-documentation-v5"
  title: string;
  goal: string;               // 1 frase
  prerequisites: string[];    // ex.: ["Ghidra com servidor ativo", "binário analisado"]
  steps: WorkflowStep[];
  pitfalls: string[];         // armadilhas do fluxo inteiro
  sourceRef: string;          // "docs/prompts/FUNCTION_DOC_WORKFLOW_V5.md"
}
```

Teste contratual: para cada workflow, cada `tools[]` ∈ catálogo. Isso impede drift entre narrativa e catálogo — a classe de bug mais provável deste projeto.

---

## 13. Conteúdo mínimo por armadilha (`/pitfalls`)

```ts
export interface Pitfall {
  slug: string;
  title: string;
  severity: "critica" | "media";
  symptom: string;    // o que o operador vê
  cause: string;      // por que acontece
  remedy: string;     // o que fazer (com comando quando houver)
  sourceRef: string;  // doc/fonte
  relatedTools?: string[]; // validado contra o catálogo quando presente
}
```

Exemplo completo (nível de detalhe exigido):

```ts
{
  slug: "git-bash-ghidra-path",
  title: "Git Bash corrompe o caminho do Ghidra no build",
  severity: "media",
  symptom: "~100 erros 'package ghidra.program.model.address does not exist' que parecem checkout quebrado.",
  cause: "Backslash no -PGHIDRA_INSTALL_DIR é reinterpretado pelo shell antes do Gradle.",
  remedy: "No Git Bash use -PGHIDRA_INSTALL_DIR=F:/ghidra_12.1.4_PUBLIC (barra normal). PowerShell aceita backslash.",
  sourceRef: "README.md — Build & Deploy / Key Gotchas",
}
```

---

## 14. Acessibilidade e teclado

- Foco visível em todos os interativos (anel `ring` do tema, nunca removido).
- Busca com `role="searchbox"` + label; contagem de resultados anunciada (`aria-live="polite"`).
- Chips de filtro são botões reais com `aria-pressed`.
- Ordem de tabulação natural; nenhum `tabIndex` positivo.
- Imagens/diagramas decorativos: `aria-hidden`; diagramas com conteúdo: descrição textual adjacente.
- Contraste AA medido nos pares texto/fundo do tema (âmbar sobre fundo escuro em texto grande/bold; corpo em `foreground`/`muted-foreground`).

## 15. Performance

- Sem imagens raster no caminho crítico (ícones lucide inline); diagrama de arquitetura em markup/CSS.
- `src/data/tools.ts` podado: meta de ≤ 150 KB minificado (teste de tamanho não obrigatório, mas revisão manual na fase 5).
- Sem fontes além das duas já carregadas (`Fraunces`, `Space Grotesk` via Google Fonts com `display=swap`).
- Nenhum `useEffect` de fetch (dados estáticos) — regra das diretivas do projeto.

## 16. Matriz de testes (`src/test/`)

| Teste | Arquivo | Asserção concreta |
|---|---|---|
| Dados — contagem | `tool-data.test.ts` | soma das ferramentas = 209; 18 categorias; nenhum nome duplicado |
| Dados — meta de categoria | `tool-data.test.ts` | toda categoria tem label, summary e icon não vazios |
| Dados — workflows | `workflows.test.ts` | 8 workflows; todo `tools[]` existe no catálogo; todo `sourceRef` não vazio |
| Dados — armadilhas | `pitfalls.test.ts` | ≥ 7 itens; severidade ∈ {critica, media}; `relatedTools` existem no catálogo |
| Roteamento | `app-routing.test.tsx` (existente) | rotas registradas resolvem |
| Rotas novas | `routes.test.tsx` | `/tools`, `/tools/$toolName`, `/workflows`, `/workflows/$slug`, `/concepts`, `/setup`, `/pitfalls` existem na route tree gerada |

Regra das diretivas: um teste por regra, asserções com valores concretos do PRD (209, 18, 8, 7), nada de snapshot/copy/estilo.

## 17. Critérios de aceite por fase (detalhe do roadmap)

- **Fase 0** — `src/data/tools.ts` gerado; testes de dados verdes; PRD/roadmap publicados; monitor notificado do marco.
- **Fase 1** — Home renderiza com navegação funcional para as 5 áreas; `head()` da Home e do root distintos e completos; screenshot Playwright limpo.
- **Fase 2** — Deep link filtrado funciona; busca "decompile" retorna ≥ 3 resultados; detalhe de `rename_function` mostra exemplo válido; estado vazio de busca inexistente mostra CTA para limpar filtros.
- **Fase 3** — 8 fluxos navegáveis; todo link de ferramenta dentro de workflow abre a página certa; teste contratual verde.
- **Fase 4** — 7 armadilhas com remédio acionável; setup com critério de verificação por passo; âncoras de conceitos funcionam por deep link.
- **Fase 5** — Suite completa verde; navegação Playwright end-to-end sem erro de console; handoff ao monitor com status de stage.

## 18. Manutenção pós-entrega

- Novo endpoint no servidor Java → re-rodar `bun scripts/generate-tool-data.ts` + `bunx vitest run` → PR com a diff do catálogo.
- Novo fluxo de trabalho do operador → adicionar `Workflow` + teste contratual atualiza a contagem esperada (8 → N) **no teste junto com o dado**.
- A UI nunca duplica conteúdo canônico sem `sourceRef`; docs continuam sendo a fonte de verdade e a UI, a camada de navegação.

## 19. Decisões registradas (ADR resumido)

| # | Decisão | Alternativa rejeitada | Por quê |
|---|---|---|---|
| D1 | UI estática sem backend | Cliente MCP ao vivo na UI | O4 + escopo do planejamento é "entender como usar"; tempo real exige Ghidra rodando e amplia superfície de segurança |
| D2 | Catálogo gerado a partir de `tests/endpoints.json` | Duplicar lista manual | fonte única de verdade; drift detectável por teste |
| D3 | Manter direção visual existente (dark + âmbar + Fraunces) | Novo design system | já configurado, distinto, e trocar cores por gosto não é requisito |
| D4 | Conteúdo autorado com `sourceRef` | Copiar docs verbatim | docs são longos demais para UI; `sourceRef` mantém rastreabilidade |
| D5 | URLs em inglês, conteúdo pt-BR | Tudo pt-BR | identificadores do projeto são em inglês; consistência com o ecossistema |

---

## 20. Estados de interface (comportamento por condição)

| Condição | Comportamento exigido |
|---|---|
| Busca sem resultado | Card vazio com "nada encontrado para 'X'" + botão "limpar busca" (nunca tela branca) |
| Filtro categoria sem ferramentas no escopo escolhido | Mensagem explicando a interseção vazia + CTA "mostrar todos" |
| Deep link de ferramenta inexistente (`/tools/foo`) | `notFoundComponent` do root (404 com CTA para catálogo) — nunca erro 500 |
| Deep link de fluxo inexistente (`/workflows/foo`) | idem 404 |
| Link de ferramenta ainda sem params conhecidos | Nota informativa apontando `/mcp/schema` como fonte em runtime (nunca campo vazio silencioso) |
| Categoria sem meta autorada | A geração falha (§10.1) — a UI nunca renderiza categoria "crua" |

## 21. Métricas de sucesso (pós-lançamento, sem telemetria)

Sem analytics no app (O4), o sucesso é medido por inspeção:

- **M1**: um operador novo percorre Home → Setup → primeira chamada sem abrir o README (teste de percurso manual registrado na fase 5).
- **M2**: catálogo responde "existe ferramenta para X?" em ≤ 3 cliques a partir de qualquer página.
- **M3**: diffs futuros do catálogo exigem apenas re-gerar dados (tempo estimado < 5 min, §18).

## 22. Perguntas abertas

Nenhuma bloqueante. Decisões de detalhe (ex.: rótulo exato de uma categoria) podem ser tomadas durante a implementação e registradas no §19 se estruturais.

## 23. Estrutura de arquivos nova (mapa de implementação)

```text
src/
├── data/
│   ├── types.ts               # McpTool, ToolCategory, Workflow, Pitfall (§2.2, §12, §13)
│   ├── tools.ts               # GERADO a partir de tests/endpoints.json (não editar à mão)
│   ├── categories-meta.ts     # rótulo/ícone/summary por categoria (autorado)
│   ├── workflows.ts           # 8 fluxos com etapas e sourceRef (autorado)
│   └── pitfalls.ts            # 7+ armadilhas (autorado)
├── components/
│   ├── site-header.tsx        # navegação global sticky
│   ├── site-footer.tsx
│   ├── tool-search-filters.tsx# busca + chips de categoria + escopo
│   ├── tool-category-grid.tsx # grid por categoria
│   ├── workflow-steps.tsx     # etapas numeradas com links de ferramenta
│   └── code-block.tsx         # bloco de código copiável
├── routes/
│   ├── index.tsx              # Home (substitui o placeholder)
│   ├── tools/index.tsx        # catálogo
│   ├── tools/$toolName.tsx    # detalhe
│   ├── workflows/index.tsx
│   ├── workflows/$slug.tsx
│   ├── concepts.tsx
│   ├── setup.tsx
│   └── pitfalls.tsx
scripts/
└── generate-tool-data.ts      # gerador idempotente (§10.1)
```

Regras estruturais (registradas também no `AGENTS.md` quando aplicável):

- `src/data/tools.ts` é artefato gerado — header comentado avisando, e nunca editado à mão.
- Todo componente novo usa apenas tokens semânticos do tema; nenhum utilitário de cor hardcoded.
- Rotas novas entram na mesma leva de edições que os primeiros `<Link>` que as referenciam (regra das diretivas do TanStack Start).



