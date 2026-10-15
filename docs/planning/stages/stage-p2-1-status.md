# Stage P2-1 — Home

**Data:** 2026-10-15
**Fase:** P2-1 (Home) do roadmap do projeto 2
**Status:** concluída (aguardando avaliação do monitor)

## O que foi entregue

- **Hero**: badge de métricas como pill (font-mono, wrap limpo no mobile), h1 serif com acento âmbar, **um único CTA primário** ("Explorar ferramentas") + secundário outline ("Começar do zero"), glow de fundo com `bg-primary/10`.
- **"Como funciona"**: pipeline numerado (01/02/03 em font-mono, círculos sobre conectora horizontal `bg-border` visível só em `md+`, cards com hover `border-border-strong`).
- **"Primeiro uso"**: timeline vertical (rail `border-l`, dots âmbar, itens 100% linkáveis para `/setup#passo-N`).
- **Famílias de ferramentas**: cards 100% clicáveis com hover lift (`-translate-y-0.5`), contagem em pill mono, affordance "Ver N ferramentas" que aparece no hover.
- **Split hero final**: 2 colunas (copy + CTAs de fluxos/armadilhas | bloco terminal `font-mono` sobre `bg-surface-sunken`).
- **Reveal com stagger**: wrapper `Reveal` sobre `useRevealOnScroll` + delays progressivos (60–180ms no hero, 50–80ms nos grids). Zero cor hardcoded — apenas tokens semânticos.

## Incidente reparado antes da fase

O remix veio sem `src/lib/` (utils, error-capture, error-page, lovable-error-reporting) — a app retornava 500 em todas as rotas e o build falhava. Os 4 módulos foram restaurados conforme o card `tanstack-ssr-error-handling`; preview voltou a 200 antes do início do P2-1.

## Gates (seção 9 do PRD)

- `bunx vitest run`: **25/25 verdes** (5 arquivos).
- `bun run lint`: **0 erros** (6 warnings pré-existentes).
- `bun run build`: **OK** (nitro build concluído).
- Playwright desktop 1280×1800 + mobile 375×812: **sem overflow horizontal** (`scrollWidth == clientWidth` nas duas), **zero erros de console da aplicação** (único registro: 502 do proxy `/oc`, externo a esta fase — OpenCode offline no sandbox).
- Screenshots: `/tmp/browser/p2-1/screenshots/{desktop_top,mobile_top}.png`.

## Evidência de aceite da fase (roadmap)

- 1 CTA primário acima da dobra ✓ (primário + secundário outline).
- Sem overflow em 375px ✓.
