// Self-contained 500 fallback page. Must not import any app code: if the rest
// of the app fails to load, this page still has to render.
export function renderErrorPage(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Erro inesperado — Ghidra MCP</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; margin: 0; }
      body {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        background: #14161f;
        color: #ece7d4;
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        padding: 1.5rem;
      }
      main { max-width: 30rem; text-align: center; }
      .badge {
        display: inline-block;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #e6b45a;
        border: 1px solid rgba(230, 180, 90, 0.35);
        border-radius: 999px;
        padding: 0.3rem 0.8rem;
        margin-bottom: 1.25rem;
      }
      h1 { font-size: 1.35rem; font-weight: 600; }
      p { margin-top: 0.6rem; font-size: 0.9rem; line-height: 1.6; color: #a9a79b; }
      .actions { margin-top: 1.5rem; display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
      button, a {
        font: inherit;
        font-size: 0.875rem;
        padding: 0.55rem 1.1rem;
        border-radius: 0.6rem;
        cursor: pointer;
        text-decoration: none;
      }
      button { background: #e6b45a; color: #1d1807; border: none; font-weight: 600; }
      a { background: transparent; color: #ece7d4; border: 1px solid rgba(236, 231, 212, 0.2); }
    </style>
  </head>
  <body>
    <main>
      <span class="badge">Erro 500</span>
      <h1>Esta tela não carregou</h1>
      <p>Um erro inesperado aconteceu no servidor. Tente novamente ou volte ao início.</p>
      <div class="actions">
        <button type="button" onclick="location.reload()">Tentar novamente</button>
        <a href="/">Voltar ao início</a>
      </div>
    </main>
  </body>
</html>`;
}
