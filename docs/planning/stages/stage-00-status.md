# Stage 00 — Protocolo e base de dados

Data: 2026-10-15

## Escopo da fase

Protocolo dos 3 arquivos concluído e camada de dados do catálogo pronta.

## Entregas

- `.opencode/prd-project1.md` (506 linhas) e `.opencode/roadmap-proj.md` (46 linhas) criados a partir de `.opencode/project1.md`.
- `scripts/generate-tool-data.ts` — gerador idempotente: `tests/endpoints.json` → `src/data/tools.ts` (podado: name/method/category/params/servers/description).
- `src/data/types.ts` — McpTool, ToolCategoryCount, ToolCategoryMeta, Workflow, Pitfall.
- `src/data/categories-meta.ts` — 18 categorias com rótulo/ícone/summary em pt-BR.
- `src/test/tool-data.test.ts` — 8 testes de integridade.

## Evidência

- `bunx vitest run src/test/tool-data.test.ts` → 8/8 verdes.
- Saída do gerador: "OK: 209 ferramentas em 18 categorias -> src/data/tools.ts".
- Contagens por categoria confirmadas (program 33, datatype 32, function 23, analysis 20 …).

## Veredito pedido ao monitor

Avaliar Fase 0 do roadmap como completed / partial / blocked.
