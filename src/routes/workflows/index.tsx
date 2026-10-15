import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WORKFLOWS } from "@/data/workflows";

export const Route = createFileRoute("/workflows/")({
  head: () => ({
    meta: [
      { title: "Fluxos de trabalho — Ghidra MCP" },
      {
        name: "description",
        content:
          "8 fluxos guiados do Ghidra MCP: documentação de função V5, tipagem de dados, structs, dataflow, propagação entre versões, emulação e depuração.",
      },
      {
        property: "og:title",
        content: "Fluxos de trabalho — Ghidra MCP",
      },
      {
        property: "og:description",
        content:
          "8 fluxos guiados: documentação de função, tipagem, structs, dataflow, propagação entre versões, emulação e depuração dinâmica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Fluxos de trabalho</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cada fluxo é a sequência canônica de ferramentas para um objetivo de engenharia reversa —
          na ordem certa, com as armadilhas do caminho.
        </p>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {WORKFLOWS.map((workflow, index) => (
            <li key={workflow.slug}>
              <Link
                to="/workflows/$slug"
                params={{ slug: workflow.slug }}
                className="group flex h-full flex-col rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {workflow.steps.length} etapas
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-lg font-semibold group-hover:text-primary">
                  {workflow.title}
                </h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {workflow.goal}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                  Abrir fluxo <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
