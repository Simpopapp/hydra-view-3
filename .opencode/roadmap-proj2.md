# Roadmap — Project 2: Elevação Visual e de UX

Fonte: `.opencode/project2.md` (planejamento) + `.opencode/prd-project2.md` (PRD, decisões e gates detalhados). Execute em ordem; `[x]` só com Gates verdes e avaliação do monitor registrada em `docs/planning/reports/stage-p2-NN-eval.md`. Versão canónica para o monitor: `docs/planning/ROADMAP.md`.

## P2-0 — Fundação (bloqueia tudo)
- [x] Tokens novos em `src/styles.css` (surface-raised/sunken, border-strong, motion, font-mono + JetBrains Mono no head do root)
- [x] Refatorar `site-header` (aria-current, skip-link, blur), `site-footer`, `code-block` (cópia + sunken), `category-icon`; criar `useRevealOnScroll`
- [x] `<main id="main">` em todas as rotas; módulos `src/lib/` restaurados commitados
- Gates: vitest (23 + novo teste de cópia), lint 0 erros, build OK, Playwright 6 rotas sem erro de console, reduced-motion verificado. ✓ (25/25 testes; avaliação do monitor: `docs/planning/reports/stage-p2-0-eval.md` — concluída)

## P2-1 — Home
- [x] Hero com CTA único + secundário; badge de métricas como pill
- [x] "Como funciona" como pipeline numerado com conectora; "4 passos" como timeline
- [x] Grid de famílias com cards 100% clicáveis; split hero final; reveal com stagger
- Gates: seção 9 do PRD (vitest/lint/build) + screenshots desktop/mobile sem overflow horizontal. ✓ (25/25 testes, lint 0 erros, build OK, Playwright 1280×1800 + 375×812 sem overflow e sem erro de console da app; avaliação do monitor: `docs/planning/reports/stage-p2-1-eval.md` — concluída)

## P2-2 — Catálogo `/tools`
- [ ] Busca com `/` para focar, `Escape`, botão limpar, contagem com `aria-live`, destaque `<mark>`
- [ ] Chips de categoria/escopo com contagens; estado na URL preservado
- [ ] Grid compacto (line-clamp, badges-ícone); estado vazio com sugestões
- Gates: testes de contagem/destaque/estado-vazio verdes; deep-link de URL abre estado correto.

## P2-3 — Detalhe `/tools/$toolName`
- [ ] Breadcrumb (volta com filtro de categoria), header com badges semânticos
- [ ] Layout 2 colunas (principal/lateral); tabela de parâmetros acessível
- [ ] Exemplo copiável; relacionadas como chips da mesma categoria
- Gates: teste da tabela de params; Playwright catálogo → detalhe → relacionadas.

## P2-4 — Fluxos `/workflows` + `/workflows/$slug`
- [ ] Índice com metadados de execução (etapas, rótulo de duração, pré-reqs)
- [ ] Stepper colapsável; progresso persistido (`useWorkflowProgress`, localStorage), barra "N de M", reinício com confirmação inline
- [ ] Callouts de armadilha com link para `/pitfalls#slug`
- Gates: teste de persistência + fração; reload do Playwright preserva progresso.

## P2-5 — Leitura longa: concepts, setup, pitfalls
- [ ] `/concepts`: TOC sticky com item ativo (IntersectionObserver); `<details>` no mobile
- [ ] `/setup`: stepper com critério de verificação em callout success; comandos copiáveis
- [ ] `/pitfalls`: filtro por severidade; cards com severidade visual (ícone+rótulo, não só cor); `sourceRef` do 8º pitfall corrigido
- Gates: teste do filtro; Playwright valida item ativo do TOC ao rolar.

## P2-6 — Polish transversal e verificação end-to-end
- [ ] 404 com terminal ilustrado; varredura de cor hardcoded vazia; contraste AA auditado
- [ ] Ordem de tabulação e foco revisados em todas as rotas tocadas
- [ ] Playwright end-to-end completo (home → busca → detalhe → fluxo com progresso → concepts → setup → pitfalls → 404), zero erros de console
- Gates: todos + avaliação do monitor **concluída**; aí sim avisar o OpenCode "remix finalizado (+P2-6)".

---

Registro de progresso:
- 2026-10-15 — PRD e roadmap criados após restauração dos gates do projeto 1 (ver `stage-05-status.md` atualizado). Fases P2-0…P2-6 pendentes.
- 2026-10-15 — P2-0 executada e aprovada pelo monitor (veredito: concluída). Próxima: P2-1 (Home).
- 2026-10-15 — Remix veio sem `src/lib/` (app 500 em todas as rotas); módulos restaurados (error-capture, error-page, lovable-error-reporting, utils). OpenCode 1.19.0 reinstalado no sandbox.
- 2026-10-15 — P2-1 executada e aprovada pelo monitor (veredito: concluída). Melhorias não-bloqueantes da avaliação (span filho de `ol`, affordance de foco nos cards) registradas para P2-6. Próxima: P2-2 (Catálogo).
