import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/components/code-block";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Instalação — Ghidra MCP" },
      {
        name: "description",
        content:
          "Guia de instalação do Ghidra MCP: extensão no Ghidra 12.1.4, servidor, bridge Python e conexão do cliente de IA, com verificação em cada passo.",
      },
      { property: "og:title", content: "Instalação — Ghidra MCP" },
      {
        property: "og:description",
        content:
          "Extensão no Ghidra, servidor, bridge Python e conexão do cliente de IA — com verificação em cada passo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SetupPage,
});

const STEPS = [
  {
    id: "passo-1",
    title: "Instalar a extensão no Ghidra",
    steps: [
      "Pré-requisitos: Java 21 LTS e Ghidra 12.1.4. Acesse a extensão instalando via File > Install Extensions.",
      "Build local com Gradle (não precisa de Maven): ./gradlew buildExtension",
      "Deploy automático (instala, patcheia o FrontEndTool.xml e reinicia o Ghidra): python -m tools.setup deploy",
    ],
    code: "./gradlew buildExtension -PGHIDRA_INSTALL_DIR=F:/ghidra_12.1.4_PUBLIC",
    check:
      "No Ghidra, o menu Tools > GhidraMCP existe (com Start / Stop / Restart Server). Se o menu não aparecer, confira a instalação em File > Install Extensions.",
    note: "No Git Bash use barras normais no caminho do Ghidra (F:/...); no PowerShell, barras invertidas.",
  },
  {
    id: "passo-2",
    title: "Iniciar o servidor no Ghidra",
    steps: [
      "Abra o Ghidra e o projeto com o binário alvo.",
      "Menu Tools > GhidraMCP > Start Server.",
      "Opcional: instale o modo headless (automação sem GUI) via perfis Maven -P headless / -P docker.",
    ],
    code: "python -m tools.setup deploy --ghidra-path F:/ghidra_12.1.4_PUBLIC --test release",
    check:
      'curl http://127.0.0.1:8089/check_connection responde {"status": "ok", "server_kind": "gui"} (ou "headless").',
    note: "Atenção: --test release só existe no backend Maven. Com TOOLS_SETUP_BACKEND=gradle o deploy recusa o tier — build com Gradle e rode a suíte de deploy com o backend padrão (variável não definida).",
  },
  {
    id: "passo-3",
    title: "Rodar o bridge MCP",
    steps: [
      "O bridge é o processo que fala MCP com seu cliente de IA e HTTP com o Ghidra.",
      "Modo stdio (recomendado para clientes de IA): uv run bridge-mcp-ghidra",
      "Modo HTTP (Inspector, clientes web): --transport streamable-http",
    ],
    code: "uv run bridge-mcp-ghidra",
    check:
      "No arranque, o bridge lista as instâncias descobertas. Zero instâncias = servidor do passo 2 não está ativo ou porta/socket bloqueada (veja docs/connection-triage-guide.md).",
  },
  {
    id: "passo-4",
    title: "Conectar o cliente de IA",
    steps: [
      "Adicione o comando do bridge ao cliente MCP (Claude Desktop, Cursor, etc.) como servidor stdio.",
      "As ferramentas chegam divididas em grupos — 3 básicos vêm sempre; carregue os demais sob demanda.",
      "Regenere a listagem no cliente se você mexer em GHIDRA_DEBUGGER_URL depois (opt-in do debugger).",
    ],
    code: `{
  "mcpServers": {
    "ghidra": {
      "command": "uv",
      "args": ["run", "bridge-mcp-ghidra"]
    }
  }
}`,
    check:
      "No seu cliente, list_tools retorna ~209 ferramentas (menos as de grupo não carregadas). Pergunte 'quantas ferramentas você tem do Ghidra?' para confirmar.",
  },
];

function SetupPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Instalação</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Do zero ao primeiro call de ferramenta: extensão, servidor, bridge e cliente de IA. Cada
          passo tem um critério de verificação — não siga sem confirmar o anterior.
        </p>

        <ol className="mt-8 space-y-6">
          {STEPS.map((step, index) => (
            <li key={step.id} id={step.id} className="scroll-mt-28">
              <div className="rounded-xl border border-border/60 bg-card/40 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <h2 className="font-serif text-lg font-semibold">{step.title}</h2>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {step.steps.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">
                        ›
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <CodeBlock code={step.code} />
                </div>
                <div className="mt-4 flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Verificação: </strong>
                    {step.check}
                  </p>
                </div>
                {step.note ? (
                  <div className="mt-3 flex gap-2 rounded-lg border border-border/50 bg-background/60 p-3">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">{step.note}</p>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-8 rounded-xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-serif text-lg font-semibold">Opcional: depuração dinâmica</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            As 22 ferramentas de debugger são opt-in. Para habilitá-las, defina{" "}
            <code className="font-mono text-xs">GHIDRA_DEBUGGER_URL=http://127.0.0.1:8099</code> (ou{" "}
            <code className="font-mono text-xs">GHIDRA_DEBUGGER_TOOLS=1</code>) antes de subir o
            bridge. URLs não-loopback são recusadas pelo proxy — para um servidor remoto, faça
            forward da porta.
          </p>
          <div className="mt-4">
            <CodeBlock
              code={"export GHIDRA_DEBUGGER_URL=http://127.0.0.1:8099\nuv run bridge-mcp-ghidra"}
            />
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground">
          Deu errado em algum ponto? A página de{" "}
          <Link to="/pitfalls" className="text-primary hover:underline">
            armadilhas
          </Link>{" "}
          cobre as falhas mais comuns.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
