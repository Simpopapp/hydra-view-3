import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getWorkflow, WORKFLOWS } from "@/data/workflows";

export const Route = createFileRoute("/workflows/$slug")({
  head: ({ params }) => {
    const workflow = getWorkflow(params.slug);
    const title = workflow
      ? `${workflow.title} — Fluxo de trabalho · Ghidra MCP`
      : "Fluxo não encontrado — Ghidra MCP";
    const description = workflow?.goal ?? "Fluxo de trabalho não encontrado.";
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
  component: WorkflowDetailPage,
});

function WorkflowDetailPage() {
  const { slug } = Route.useParams();
  const workflow = getWorkflow(slug);
  if (!workflow) {
    throw notFound();
  }

  const index = WORKFLOWS.findIndex((w) => w.slug === workflow.slug);
  const next = WORKFLOWS[index + 1];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Link
          to="/workflows"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Todos os fluxos
        </Link>

        <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight">{workflow.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{workflow.goal}</p>

        {workflow.prerequisites.length > 0 ? (
          <div className="mt-6 rounded-lg border border-border/50 bg-card/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pré-requisitos
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {workflow.prerequisites.map((pre) => (
                <li key={pre} className="flex gap-2">
                  <span aria-hidden="true" className="text-primary">
                    ›
                  </span>
                  {pre}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ol className="mt-8 space-y-4">
          {workflow.steps.map((step, stepIndex) => (
            <li key={step.title}>
              <div className="rounded-xl border border-border/60 bg-card/40 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {stepIndex + 1}
                  </span>
                  <h2 className="text-sm font-semibold">{step.title}</h2>
                </div>
                <p className="mt-3 pl-10 text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
                <div className="mt-3 pl-10">
                  <p className="text-xs font-medium text-muted-foreground">Ferramentas:</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {step.tools.map((toolName) => (
                      <Link
                        key={toolName}
                        to="/tools/$toolName"
                        params={{ toolName }}
                        className="rounded-md border border-border/50 bg-background/60 px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {toolName}
                      </Link>
                    ))}
                  </div>
                </div>
                {step.pitfall ? (
                  <div className="ml-10 mt-3 flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>{step.pitfall}</span>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        {workflow.pitfalls.length > 0 ? (
          <section className="mt-8" aria-label="Armadilhas deste fluxo">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
              <AlertTriangle className="size-4 text-primary" /> Cuidados
            </h2>
            <ul className="mt-3 space-y-2">
              {workflow.pitfalls.map((pitfall) => (
                <li
                  key={pitfall}
                  className="rounded-lg border border-border/50 bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {pitfall}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-6 text-xs text-muted-foreground">
          Fonte: <code className="font-mono">{workflow.sourceRef}</code>
        </p>

        {next ? (
          <Link
            to="/workflows/$slug"
            params={{ slug: next.slug }}
            className="mt-8 flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/40"
          >
            <div>
              <p className="text-xs text-muted-foreground">Próximo fluxo</p>
              <p className="text-sm font-semibold">{next.title}</p>
            </div>
            <ArrowRight className="size-4 text-primary" />
          </Link>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
