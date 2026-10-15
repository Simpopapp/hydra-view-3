import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Terminal, TriangleAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategoryIcon } from "@/components/category-icon";
import { useRevealOnScroll, revealClasses } from "@/hooks/use-reveal-on-scroll";
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
    title: "Plugin Ghidra",
    description:
      "Uma extensão instalada no Ghidra sobe um servidor HTTP (McpHttpServer) com as 209 ferramentas — na GUI ou no modo headless, sem GUI.",
  },
  {
    title: "MCP Bridge (Python)",
    description:
      "O bridge descobre instâncias do Ghidra (Unix socket ou TCP), registra as ferramentas dinamicamente a partir do schema e as expõe via MCP (stdio ou HTTP).",
  },
  {
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

/** Entrada de conteúdo ao rolar com atraso opcional (stagger). */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={revealClasses(revealed, className)}
    >
      {children}
    </div>
  );
}

function HomePage() {
  const topCategories = CATEGORY_COUNTS.slice(0, 8);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-4xl rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-raised px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>209 ferramentas</span>
                <span aria-hidden="true" className="text-border-strong">
                  ·
                </span>
                <span>18 categorias</span>
                <span aria-hidden="true" className="text-border-strong">
                  ·
                </span>
                <span>8 fluxos guiados</span>
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Engenharia reversa do Ghidra, dirigida por{" "}
                <span className="text-primary">seu assistente de IA</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                O Ghidra MCP expõe as capacidades do Ghidra como ferramentas MCP: decompilar,
                renomear, tipar, documentar e emular — direto do seu cliente de IA. Este guia navega
                tudo sem abrir o README.
              </p>
            </Reveal>
            <Reveal delay={180}>
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
            </Reveal>
          </div>
        </section>

        {/* Como funciona — pipeline numerado com conectora */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Como funciona</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Três peças: o plugin dentro do Ghidra, o bridge Python no meio e o cliente de IA na
                ponta.
              </p>
            </div>
          </Reveal>
          <ol className="relative grid gap-4 md:grid-cols-3 md:gap-5">
            <span
              aria-hidden="true"
              className="absolute left-6 right-6 top-6 hidden h-px bg-border md:block"
            />
            {ARCHITECTURE.map((item, index) => (
              <li key={item.title} className="relative">
                <Reveal delay={index * 80}>
                  <div className="h-full rounded-xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-border-strong">
                    <div className="flex items-center gap-3">
                      <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background font-mono text-sm text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* Primeiro uso — timeline vertical */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Primeiro uso</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Do zero às 209 ferramentas no seu cliente de IA, em 4 passos.
              </p>
            </div>
          </Reveal>
          <ol className="relative ml-2 max-w-2xl space-y-5 border-l border-border pl-7">
            {QUICK_START.map((item, index) => (
              <li key={item.step} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[35px] top-1 flex size-2.5 items-center justify-center rounded-full bg-primary"
                />
                <Reveal delay={index * 60}>
                  <Link
                    to="/setup"
                    hash={`passo-${item.step}`}
                    className="group block rounded-lg border border-transparent p-3 -m-3 transition-colors hover:border-border/60 hover:bg-card/50"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-primary">0{item.step}</span>
                      <p className="text-sm font-medium group-hover:text-primary">{item.title}</p>
                    </div>
                    <p className="mt-1 pl-7 text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* Famílias de ferramentas — cards 100% clicáveis */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
                  Famílias de ferramentas
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
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
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topCategories.map(({ id, count }, index) => {
              const meta = getCategoryMeta(id);
              if (!meta) return null;
              return (
                <Reveal key={id} delay={(index % 4) * 50}>
                  <Link
                    to="/tools"
                    search={{ categoria: id }}
                    className="group flex h-full flex-col rounded-xl border border-border/60 bg-card/50 p-4 transition-all duration-250 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:bg-card"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <CategoryIcon icon={meta.icon} className="size-4 shrink-0 text-primary" />
                        <span className="truncate text-sm font-medium">{meta.label}</span>
                      </div>
                      <span className="shrink-0 rounded-full border border-border/60 bg-secondary/80 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        {count}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {meta.summary}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Ver {count} ferramentas <ArrowUpRight className="size-3" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Split hero final */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
              <div className="grid md:grid-cols-2">
                <div className="p-7 sm:p-10">
                  <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
                    Pronto para decompilar seu primeiro binário?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Siga um dos {WORKFLOWS.length} fluxos guiados — documentação de função V5,
                    tipagem de dados, propagação entre versões — ou consulte as {PITFALLS.length}{" "}
                    armadilhas que costumam custar horas.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="gap-2">
                      <Link to="/workflows">
                        Seguir um fluxo <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="gap-2 text-primary hover:text-primary"
                    >
                      <Link to="/pitfalls">
                        <TriangleAlert className="size-4" /> Ver armadilhas
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="border-t border-border/60 bg-surface-sunken p-7 sm:p-10 md:border-l md:border-t-0">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Terminal className="size-4 text-primary" />
                    <span>Do zero às ferramentas</span>
                  </div>
                  <div className="mt-4 space-y-2 font-mono text-xs leading-relaxed">
                    <p className="text-muted-foreground">
                      <span className="text-primary">$</span> uv run bridge-mcp-ghidra
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-primary">✓</span> Instância encontrada: Ghidra 12.1.4
                      (TCP 8089)
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-primary">✓</span> 209 ferramentas registradas
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-primary">→</span> Pronto para receber seu cliente de IA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
