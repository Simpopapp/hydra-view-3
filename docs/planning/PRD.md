# PRD — Project 2: Elevação Visual e de UX do Guia Ghidra MCP

**Fonte canónica completa:** `.opencode/prd-project2.md` (444 linhas — direção visual, escopo por fase, critérios de aceite, testes, riscos). Este documento registra o essencial para avaliação do monitor; em divergência, prevalece o arquivo completo.

## Resumo

Melhorar muito o visual geral e individual de cada página/seção e a experiência do usuário do guia Ghidra MCP (`.opencode/project2.md`), elevando sistematicamente a identidade existente (dark, âmbar, Fraunces + Space Grotesk) — sem redesenho de zero e sem tocar conteúdo/rotas/dados do projeto 1.

## Problema (do PRD completo, §1)

Hierarquia visual plana; busca sem feedback; detalhe de ferramenta sem progressão; fluxos sem progresso marcável; páginas longas sem TOC visível; microinterações ausentes; a11y só no básico.

## Princípios (§3)

1 ação primária por tela · conteúdo é o herói · densidade a serviço do escaneamento · movimento com propósito (sempre com reduced-motion) · tudo copiável tem affordance · progresso visível onde há sequência · zero cor hardcoded.

## Fases e critérios de aceite (resumo; detalhe no §5 do PRD completo)

| Fase | Escopo central | Aceite chave |
|---|---|---|
| P2-0 Fundação | tokens (surface-raised/sunken, motion, font-mono), header/footer/code-block/reveal, skip-link, `<main>` | gates verdes; cópia anuncia em aria-live; reduced-motion sem transições |
| P2-1 Home | pipeline "Como funciona", timeline 4 passos, cards clicáveis, split hero | 1 CTA primário acima da dobra; sem overflow em 375px |
| P2-2 Catálogo | busca com `/`, contagem aria-live, `<mark>`, chips com contagem, estado vazio com sugestões | "decompile" → 10 resultados com destaque; URL reflete estado |
| P2-3 Detalhe | breadcrumb, 2 colunas, tabela de params, exemplo copiável, relacionadas | params em `<table>`; breadcrumb volta com filtro |
| P2-4 Fluxos | stepper colapsável, progresso persistido em localStorage, reinício inline | progresso sobrevive a reload; "3 de 8 etapas" correto |
| P2-5 Leitura longa | TOC sticky ativo, setup com verificação por passo, pitfalls com filtro de severidade | TOC marca ativo ao rolar; 8 armadilhas com severidade não-só-cor |
| P2-6 Polish | 404, contraste AA, foco, varredura de cor, e2e completo | monitor emite **concluída** |

## Gates por fase (§9 do PRD completo)

`bunx vitest run` 100% · `bun run lint` 0 erros · `bun run build` OK · Playwright das rotas tocadas sem erro de console (desktop 1280×1800 + mobile 375×812) · status em `docs/planning/stages/stage-p2-NN-status.md` + avaliação do monitor antes de marcar `[x]`.

## Fora de escopo (§8)

Conteúdo/dados/rotas congelados · sem backend/auth (progresso em localStorage) · sem modo claro · pt-BR apenas · sem trocar router/stack.

## Decisões técnicas chave (§12)

IntersectionObserver compartilhado (TOC + reveal) · busca client-side sobre dados estáticos · `details/summary` nativo com Radix onde necessário · JetBrains Mono via link no head do root · progresso booleano por etapa · 8º pitfall (`plate-newline-literal`) **adotado** com `sourceRef` corrigido — resolve pendência do `stage-05-eval.md`.
