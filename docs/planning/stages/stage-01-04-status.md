# Stage 01–04 — Shell, Catálogo, Fluxos, Páginas de referência

Data: 2026-10-15. Fases 1–4 do roadmap executadas e verificadas em sequência.

## Entregas

- **Fase 1 (Shell e Home)**: `src/components/site-header.tsx` (header sticky, 6 rotas, estado ativo, linha compacta mobile), `src/components/site-footer.tsx`, `src/components/code-block.tsx`, `src/components/category-icon.tsx`; Home (`src/routes/index.tsx`) com hero, métricas 209/18/8, arquitetura em 3 cards, quick start linkado a `/setup#passo-N`, grid das 8 maiores categorias e destaques fluxos/armadilhas. `head()` único em `/`.
- **Fase 2 (Catálogo)**: `src/routes/tools/index.tsx` com `validateSearch` (q/categoria/escopo na URL), busca, 18 chips de categoria, filtro de escopo GUI/Headless, grid por categoria e estado vazio; `src/routes/tools/$toolName.tsx` com badges, exemplo `tools/call` gerado dos parâmetros, nota de escopo exclusivo e relacionadas; `notFound()` para ferramenta inexistente.
- **Fase 3 (Fluxos)**: `src/data/workflows.ts` (8 fluxos autorados, ferramentas linkadas ao catálogo, fontes citadas), `/workflows` e `/workflows/$slug` (pré-requisitos, etapas numeradas, callouts de armadilha, próximo fluxo).
- **Fase 4 (Referência)**: `src/data/pitfalls.ts` (8 armadilhas — 7 do PRD + Git Bash), `/concepts` (5 conceitos com âncoras), `/setup` (4 passos copiáveis com critério de verificação + seção de debugger opt-in), `/pitfalls` (ordenado por severidade).

## Verificação (Gates)

- `bunx vitest run` — 18/18 (tool-data 8, workflows 5, pitfalls 4, routing 1)
- `bun run lint` — 0 erros (6 warnings preexistentes em shadcn ui)
- build — "build OK" (typecheck limpo, incluindo correção do erro preexistente em `src/lib/lovable-error-reporting.ts`)
- Playwright end-to-end: home → /tools (busca "decompile" → 10 resultados, URL ?q=decompile) → detalhe (/tools/analysis_status) → fluxo completo → concepts → setup → pitfalls. Screenshots em /tmp/browser/fase1/.

## Decisões

- Filtros do catálogo usam estado na URL via `validateSearch` (compartilhável/refresh-safe).
- Armadilhas viraram 8 (PRD pedia 7): adicionamos "Git Bash corrompe o caminho do Ghidra", gotcha de build alto impacto.
- Pitfalls de etapa de workflow são texto livre; `pitfalls.ts` carrega `relatedTools` validado por teste contra o catálogo.
