# ROADMAP — Project 2: Elevação Visual e de UX

**Fonte canónica:** `.opencode/roadmap-proj2.md` (espelhada aqui para avaliação do monitor). `[x]` só com Gates verdes + avaliação em `docs/planning/reports/stage-p2-NN-eval.md`.

## P2-0 — Fundação (bloqueia tudo)
- [ ] Tokens novos em `src/styles.css` (surface-raised/sunken, border-strong, motion, font-mono + JetBrains Mono no head do root)
- [ ] Refatorar `site-header` (aria-current, skip-link, blur), `site-footer`, `code-block` (cópia + sunken), `category-icon`; criar `useRevealOnScroll`
- [ ] `<main id="main">` em todas as rotas; módulos `src/lib/` restaurados commitados
- Gates: vitest (23 + novo teste de cópia), lint 0 erros, build OK, Playwright 6 rotas sem erro de console, reduced-motion verificado.

## P2-1 — Home
- [x] Hero com CTA único + secundário; badge de métricas como pill
- [x] "Como funciona" como pipeline numerado com conectora; "4 passos" como timeline
- [x] Grid de famílias com cards 100% clicáveis; split hero final; reveal com stagger
- Gates: seção 9 do PRD (vitest/lint/build) + screenshots desktop/mobile sem overflow horizontal. ✓ (25/25 testes, lint 0 erros, build OK, Playwright 1280×1800 + 375×812 sem overflow e sem erro de console da app; avaliação do monitor: `docs/planning/reports/stage-p2-1-eval.md` — concluída)

## P2-2 — Catálogo `/tools`
- [ ] Busca com `/` para focar, `Escape`, botão limpar, contagem com `aria-live`, destaque `<mark>`
- [ ] Chips de categoria/escopo com contagens; estado na URL preservado
- [ ] Grid compacto (line-clamp, badges-ícone); estado vazio com sugestões
- Gates: testes de contagem/destaque/estado-vazio; deep-link de URL abre estado correto.

## P2-3 — Detalhe `/tools/$toolName`
- [ ] Breadcrumb (volta com filtro), header com badges semânticos
- [ ] Layout 2 colunas; tabela de parâmetros acessível
- [ ] Exemplo copiável; relacionadas como chips da mesma categoria
- Gates: teste da tabela de params; Playwright catálogo → detalhe → relacionadas.

## P2-4 — Fluxos `/workflows` + `/workflows/$slug`
- [ ] Índice com metadados de execução
- [ ] Stepper colapsável; progresso persistido (localStorage), barra "N de M", reinício inline
- [ ] Callouts de armadilha com link para `/pitfalls#slug`
- Gates: teste de persistência + fração; reload do Playwright preserva progresso.

## P2-5 — Leitura longa: concepts, setup, pitfalls
- [ ] `/concepts`: TOC sticky com item ativo; `<details>` no mobile
- [ ] `/setup`: stepper com verificação por passo; comandos copiáveis
- [ ] `/pitfalls`: filtro por severidade; severidade não-só-cor; `sourceRef` do 8º pitfall corrigido
- Gates: teste do filtro; Playwright valida item ativo do TOC.

## P2-6 — Polish transversal e verificação end-to-end
- [ ] 404, contraste AA, foco, varredura de cor hardcoded
- [ ] Playwright e2e completo, zero erros de console
- Gates: todos + avaliação do monitor **concluída**; aí sim avisar "remix finalizado (+P2-6)".

---

Registro de progresso:
- 2026-10-15 — PRD e roadmap criados após restauração dos gates do projeto 1. Fases P2-0…P2-6 pendentes.
