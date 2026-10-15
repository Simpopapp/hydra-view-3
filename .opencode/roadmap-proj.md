# Roadmap — Interface Web de Uso do Ghidra MCP

Fontes: `project1` (planejamento) e `prd-project1.md` (PRD). Execute em ordem; `[x]` só com Gates verdes.

## Fase 0 — Protocolo e base de dados
- [x] Relatar status dos 3 arquivos ao project-monitor e aguardar confirmação (`docs/planning/reports/protocol-3-files-receipt.md`)
- [x] Criar PRD e roadmap a partir do planejamento
- [x] Gerar `src/data/` (tools/categories a partir de `tests/endpoints.json`, podado) + `src/data/types.ts`
- [x] Testes de integridade dos dados (209 ferramentas, 18 categorias, nomes únicos) em `src/test/`
- Gates: vitest verde nos testes de dados (8/8 ✓); build sem erros.

## Fase 1 — Shell e Home
- [x] Layout global (header sticky com navegação para /tools /workflows /concepts /setup /pitfalls, footer)
- [x] Home: hero, métricas, arquitetura em 3 cards, quick start em 4 passos, destaque de categorias
- [x] `head()` completo e único em `/` e `__root`
- Gates: build OK; vitest de roteamento verde; screenshot Playwright da Home sem erros de console. ✓ (18/18 testes; screenshots 1_home.png; único warning de hydration é artefato do driver de teclado do Playwright sobre `caret-color`)

## Fase 2 — Catálogo e detalhe da ferramenta
- [x] `/tools`: busca + filtros (categoria, escopo) com estado na URL, grid por categoria, estado vazio
- [x] `/tools/$toolName`: detalhe com badges de escopo, exemplo `tools/call`, relacionadas, nota de escopo
- [x] `head()` único em ambas as rotas
- Gates: build OK; vitest verde; Playwright: busca "decompile" acha resultados (10) e detalhe abre (/tools/analysis_status). ✓

## Fase 3 — Fluxos de trabalho
- [x] Dados autorados dos 8 fluxos (PRD §4.4) com fontes citadas
- [x] `/workflows` (índice) e `/workflows/$slug` (etapas, ferramentas linkadas, armadilhas do fluxo)
- [x] Teste: toda ferramenta citada em workflow existe no catálogo
- Gates: build OK; vitest verde; Playwright navega 1 fluxo completo (/workflows/documentacao-funcao-v5). ✓

## Fase 4 — Conceitos, Setup e Armadilhas
- [x] `/concepts` com âncoras (instâncias, tool groups, `program=`, convenções, transportes, variantes)
- [x] `/setup` com passos copiáveis e critério de verificação por passo (inclui aviso Git Bash e debugger opt-in)
- [x] `/pitfalls` com as 7 armadilhas do PRD §4.7 (severidade, sintoma, causa, remédio)
- Gates: build OK; vitest verde; `head()` completo nas 3 rotas. ✓

## Fase 5 — Polimento e verificação end-to-end
- [x] Revisão visual consistente (tokens semânticos, zero cor hardcoded; contraste AA)
- [x] Suite completa: `bunx vitest run`, `bun run lint`, `bun run build`
- [x] Playwright end-to-end: home → catálogo → busca → detalhe → workflow → setup → pitfalls
- [x] Status de fase em `docs/planning/stages/` e avaliação do project-monitor
- Gates: todos os comandos verdes; navegação sem erros de console; monitor emite avaliação. ✓ (avaliação `docs/planning/reports/stage-01-04-eval.md`: concluída)

---

Registro de progresso:
- 2026-10-15 — Protocolo dos 3 arquivos concluído (relato ao monitor + PRD + roadmap). Fases 0–5 pendentes.
- 2026-10-15 — Fases 1–4 executadas e verificadas (vitest 18/18, lint 0 erros, build OK, Playwright end-to-end). Fase 5 parcial: aguarda avaliação do monitor (docs/planning/stages/stage-01-04-status.md).
