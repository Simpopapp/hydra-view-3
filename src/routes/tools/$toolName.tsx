import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/components/code-block";
import { CategoryIcon } from "@/components/category-icon";
import { TOOLS } from "@/data/tools";
import { getCategoryMeta } from "@/data/categories-meta";

export const Route = createFileRoute("/tools/$toolName")({
  head: ({ params }) => {
    const tool = TOOLS.find((t) => t.name === params.toolName);
    const title = tool
      ? `${tool.name} — Ferramenta do Ghidra MCP`
      : "Ferramenta não encontrada — Ghidra MCP";
    const description =
      tool?.description.slice(0, 150) ?? "Ferramenta não encontrada no catálogo do Ghidra MCP.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ToolDetailPage,
});

const EXAMPLE_ARGS: Record<string, string> = {
  program: "<caminho do programa no projeto>",
  function: "0x140010000",
  function_name: "<nome da função>",
  function_address: "0x140010000",
  address: "0x140010000",
  name: "ValidateHeader",
  new_name: "ValidateHeader",
  old_name: "<nome atual>",
  comment: "<texto do comentário>",
  tags: "<tag1,tag2>",
  path: "<caminho>",
  folder: "<pasta do projeto>",
};

function exampleCall(toolName: string, params: string[]): string {
  const args: Record<string, string> = {};
  for (const param of params.slice(0, 4)) {
    args[param] = EXAMPLE_ARGS[param] ?? "<valor>";
  }
  if (Object.keys(args).length === 0) {
    return JSON.stringify({ name: toolName, arguments: {} }, null, 2);
  }
  return JSON.stringify({ name: toolName, arguments: args }, null, 2);
}

function ToolDetailPage() {
  const { toolName } = Route.useParams();
  const tool = TOOLS.find((t) => t.name === toolName);
  if (!tool) {
    throw notFound();
  }

  const meta = getCategoryMeta(tool.category);
  const related = TOOLS.filter((t) => t.category === tool.category && t.name !== tool.name).slice(
    0,
    6,
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Voltar ao catálogo
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {meta ? (
            <Badge
              variant="secondary"
              className="gap-1.5 border-border/60 bg-card/60 text-xs font-normal"
            >
              <CategoryIcon icon={meta.icon} className="size-3 text-primary" />
              <Link
                to="/tools"
                search={{ categoria: tool.category }}
                className="hover:text-primary"
              >
                {meta.label}
              </Link>
            </Badge>
          ) : null}
          {tool.servers.map((server) => (
            <Badge key={server} variant="outline" className="text-xs font-normal">
              {server === "gui" ? "GUI" : "Headless"}
            </Badge>
          ))}
          <Badge variant="outline" className="font-mono text-xs font-normal">
            {tool.method}
          </Badge>
        </div>

        <h1 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
          {tool.name}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </p>

        {tool.servers.length === 1 ? (
          <div className="mt-6 rounded-lg border border-border/50 bg-card/40 p-4 text-xs leading-relaxed text-muted-foreground">
            {tool.servers[0] === "gui"
              ? "Ferramenta exclusiva da GUI: pertence a um serviço que exige a interface do Ghidra (janelas, debugger TraceRmi ou políticas de prompt)."
              : "Ferramenta exclusiva do servidor headless: pertence ao serviço de gestão de projetos sem GUI (automação em lote)."}
          </div>
        ) : null}

        <section className="mt-8" aria-label="Chamada de exemplo">
          <h2 className="text-sm font-semibold">Como chamar (MCP tools/call)</h2>
          <p className="mb-3 mt-1 text-xs text-muted-foreground">
            Exemplo ilustrativo — ajuste os valores ao seu binário. Parâmetros canônicos em tempo
            real: <code className="font-mono">/mcp/schema</code> do servidor ativo.
          </p>
          <CodeBlock code={exampleCall(tool.name, tool.params)} label="tools/call" />
        </section>

        <section className="mt-8" aria-label="Parâmetros conhecidos">
          <h2 className="text-sm font-semibold">Parâmetros conhecidos</h2>
          {tool.params.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Sem parâmetros registrados no catálogo.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {tool.params.map((param) => (
                <li
                  key={param}
                  className="rounded-md border border-border/50 bg-card/50 px-2 py-1 font-mono text-xs text-foreground"
                >
                  {param}
                </li>
              ))}
            </ul>
          )}
        </section>

        {related.length > 0 ? (
          <section className="mt-8" aria-label="Ferramentas relacionadas">
            <h2 className="text-sm font-semibold">
              Relacionadas em {meta?.label ?? tool.category}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((rel) => (
                <li key={rel.name}>
                  <Link
                    to="/tools/$toolName"
                    params={{ toolName: rel.name }}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-card/40 p-3 text-xs transition-colors hover:border-primary/40"
                  >
                    <span className="font-mono">{rel.name}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
