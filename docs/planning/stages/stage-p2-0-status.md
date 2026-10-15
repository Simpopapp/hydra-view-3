# Status — P2-0 Fundação (projeto 2: overhaul visual/UX)

Data: 2026-10-15 · Executor: Lovable (builder) · Avaliação: aguardando project-monitor

## Escopo executado

- **Tokens de superfície e movimento** (`src/styles.css`): `--surface-raised`, `--surface-sunken`, `--border-strong` (mapeados em `--color-*` do Tailwind, zero cor hardcoded nos componentes), `--duration-fast/base`, `--ease-out`, `--font-mono` (JetBrains Mono carregada via `<link>` no `__root.tsx`).
- **Reduced-motion global**: `@media (prefers-reduced-motion: reduce)` zera animações/transições em `src/styles.css`.
- **Skip-link** "Pular para o conteúdo" no `SiteHeader` → `<main id="main">` presente nas 8 rotas (verificado por avaliação no browser: `main=True skiplink=True` nas 6 rotas de navegação).
- **SiteHeader**: indicador de rota ativa com sublinhado animado (`aria-current` já existente mantido).
- **SiteFooter**: hierarquia em 2 níveis (navegação de rodapé + colofão).
- **CodeBlock**: fundo sunken, feedback textual "Copiado" + `aria-live="polite"`, janela de 2s, estado volta a "Copiar" (re-copiável), fallback silencioso sem clipboard.
- **CategoryIcon**: prop `size` padronizada (sm 16 / md 20 / lg 24) via tokens de tamanho.
- **Hook `useRevealOnScroll`** (SSR-safe, IntersectionObserver em `useEffect`) + helper `revealClasses` para uso nas fases seguintes.

## Gates

- `bunx vitest run`: **25/25** (5 arquivos) — inclui novo `src/test/code-block.test.tsx` (regra de cópia: payload exato no clipboard, anúncio por 2s, re-copiável; fallback sem clipboard mantém o código no DOM).
- `bun run lint`: **0 erros** (6 warnings shadcn pré-existentes).
- `bun run build`: **OK** (zero erros).
- Playwright (1280×1800, `/tmp/browser/p2-0/`): 6 rotas sem erro de console; `id="main"` e skip-link presentes; botão de cópia exibe "Copiado" após clique; com `reduced_motion=reduce` nenhuma transição >0.01s (link dur=1e-05s).

## Correção durante a fase

- `CategoryIcon` quebrava `/` e `/tools` (`cn is not defined` — import ausente após a adição da prop `size`); detectado pela varredura de console do Playwright e corrigido.

## Pendências conhecidas

- Nenhuma bloqueante. Warnings shadcn (react-refresh) pré-existentes, fora do escopo da fase.
