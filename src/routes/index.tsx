import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Compass, Cpu, Layers, Plug, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_COUNTS } from "@/data/tools";
import { getCategoryMeta } from "@/data/categories-meta";
import { WORKFLOWS } from "@/data/workflows";
import { PITFALLS } from "@/data/pitfalls";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Ghidra MCP — Guia de uso das 209 ferramentas de engenharia reversa",
      },
      {
        name: "description",
        content:
          "Catálogo navegável, fluxos de trabalho guiados e guia de instalação do Ghidra MCP: 209 ferramentas de RE do Ghidra para clientes de IA.",
      },
      {
        property: "og:title",
        content: "Ghidra MCP — Guia de uso das 209 ferramentas de engenharia reversa",
      },
      {
        property: "og:description",
        content:
          "Catálogo navegável, fluxos de trabalho guiados e guia de instalação do Ghidra MCP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

const ARCHITECTURE = [
  {
    icon: <Layers className="size-5 text-primary" />,
    title: "Plugin Ghidra",
    description:
      "Uma extensão instalada no Ghidra sobe um servidor HTTP (McpHttpServer) com as 209 ferramentas — na GUI ou no modo headless, sem GUI.",
  },
  {
    icon: <Plug className="size-5 text-primary" />,
    title: "MCP Bridge (Python)",
    description:
      "O bridge descobre instâncias do Ghidra (Unix socket ou TCP), registra as ferramentas dinamicamente a partir do schema e as expõe via MCP (stdio ou HTTP).",
  },
  {
    icon: <Cpu className="size-5 text-primary" />,
    title: "Cliente de IA",
    description:
      "Claude, Cursor ou qualquer cliente MCP chama as ferramentas: decompilar, renomear, tipar, documentar — dirigindo o Ghidra em linguagem natural.",
  },
];

const QUICK_START = [
  {
    step: 1,
    title: "Instalar a extensão no Ghidra",
    detail: "Build com Gradle e deploy direto na instalação do Ghidra 12.1.4 (Java 21).",
  },
  {
    step: 2,
    title: "Iniciar o servidor",
    detail:
      "Menu Tools > GhidraMCP > Start Server — o servidor HTTP fica ativo com o projeto aberto.",
  },
  {
    step: 3,
    title: "Rodar o bridge",
    detail: "uv run bridge-mcp-ghidra em modo stdio (recomendado) ou streamable-http.",
  },
  {
    step: 4,
    title: "Conectar o cliente de IA",
    detail: "Aponte o cliente MCP para o comando do bridge e as 209 ferramentas aparecem.",
  },
];

function HomePage() {
  const topCategories = CATEGORY_COUNTS.slice(0, 8);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>209 ferramentas · 18 categorias · 8 fluxos guiados</span>
          </div>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Engenharia reversa do Ghidra, dirigida por{" "}
            <span className="text-primary">seu assistente de IA</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            O Ghidra MCP expõe as capacidades do Ghidra como ferramentas MCP: decompilar, renomear,
            tipar, documentar e emular — direto do seu cliente de IA. Este guia navega tudo sem
            abrir o README.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/tools">
                Explorar ferramentas <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/setup">
                <Zap className="size-4" /> Começar do zero
              </Link>
            </Button>
          </div>
        </section>

        {/* Arquitetura */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="mb-1 font-serif text-2xl font-semibold">Como funciona</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Três peças: o plugin dentro do Ghidra, o bridge Python no meio e o cliente de IA na
            ponta.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {ARCHITECTURE.map((item) => (
              <Card
                key={item.title}
                className="border-border/60 bg-card/60 transition-colors hover:border-primary/30"
              >
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md border border-border/40 bg-secondary/80">
                      {item.icon}
                    </div>
                    <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick start */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="rounded-xl border border-border/60 bg-card/40 p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium">
              <Compass className="size-4 text-primary" />
              <span>Primeiro uso em 4 passos</span>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_START.map((item) => (
                <li key={item.step}>
                  <Link
                    to="/setup"
                    hash={`passo-${item.step}`}
                    className="group block rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="font-mono text-xs text-primary">0{item.step}</span>
                    <p className="mt-1 text-sm font-medium group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Categorias */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Famílias de ferramentas</h2>
              <p className="text-sm text-muted-foreground">
                As categorias com mais ferramentas — o catálogo completo tem 18.
              </p>
            </div>
            <Link
              to="/tools"
              className="hidden shrink-0 items-center gap-1 text-sm text-primary hover:underline sm:inline-flex"
            >
              Ver todas <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topCategories.map(({ id, count }) => {
              const meta = getCategoryMeta(id);
              if (!meta) return null;
              return (
                <Link
                  key={id}
                  to="/tools"
                  search={{ categoria: id }}
                  className="group rounded-lg border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground">
                      <CategoryIcon icon={meta.icon} className="size-4 text-primary" />
                      <span className="text-sm font-medium">{meta.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {meta.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Fluxos e armadilhas */}
        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-2">
          <Link
            to="/workflows"
            className="group rounded-xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40"
          >
            <BookOpen className="size-5 text-primary" />
            <h3 className="mt-3 font-serif text-lg font-semibold">
              {WORKFLOWS.length} fluxos de trabalho guiados
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Documentação de função V5, tipagem de dados, propagação entre versões e mais — cada
              etapa com as ferramentas certas linkadas.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
              Seguir um fluxo <ArrowRight className="size-3.5" />
            </span>
          </Link>
          <Link
            to="/pitfalls"
            className="group rounded-xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40"
          >
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              !
            </span>
            <h3 className="mt-3 font-serif text-lg font-semibold">
              {PITFALLS.length} armadilhas que custam horas
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Programas read-only após upgrade, pseudocódigo fictício por variante de linguagem,
              gravações no binário errado — sintoma, causa e remédio.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
              Ver armadilhas <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
