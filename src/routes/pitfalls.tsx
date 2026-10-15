import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PITFALLS } from "@/data/pitfalls";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pitfalls")({
  head: () => ({
    meta: [
      { title: "Armadilhas — Ghidra MCP" },
      {
        name: "description",
        content:
          "Armadilhas comuns do Ghidra MCP: programas read-only após upgrade, pseudocódigo fictício, gravações no binário errado e mais — sintoma, causa e remédio.",
      },
      { property: "og:title", content: "Armadilhas — Ghidra MCP" },
      {
        property: "og:description",
        content:
          "Programas read-only, pseudocódigo fictício, gravações no binário errado — sintoma, causa e remédio de cada armadilha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PitfallsPage,
});

const SEVERITY_STYLES: Record<string, string> = {
  critica: "border-primary/40 bg-primary/10 text-primary",
  media: "border-border/60 bg-card/60 text-muted-foreground",
};

const ORDER = ["critica", "media"];

function PitfallsPage() {
  const sorted = [...PITFALLS].sort(
    (a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity),
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Armadilhas</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Falhas conhecidas que custam horas — cada uma com sintoma, causa e remédio. Extraídas dos
          "gotchas" reais do projeto, não de suposições.
        </p>

        <ul className="mt-8 space-y-4">
          {sorted.map((pitfall) => (
            <li key={pitfall.slug}>
              <article className="rounded-xl border border-border/60 bg-card/40 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-lg font-semibold leading-snug">{pitfall.title}</h2>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 gap-1 text-[11px] font-normal",
                      SEVERITY_STYLES[pitfall.severity] ?? "",
                    )}
                  >
                    {pitfall.severity === "critica" ? (
                      <ShieldAlert className="size-3" />
                    ) : (
                      <AlertTriangle className="size-3" />
                    )}
                    {pitfall.severity}
                  </Badge>
                </div>
                <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sintoma
                    </dt>
                    <dd className="mt-0.5 text-muted-foreground">{pitfall.symptom}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Causa
                    </dt>
                    <dd className="mt-0.5 text-muted-foreground">{pitfall.cause}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Remédio
                    </dt>
                    <dd className="mt-0.5 text-muted-foreground">{pitfall.remedy}</dd>
                  </div>
                </dl>
                {pitfall.relatedTools.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">Ferramentas relacionadas:</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {pitfall.relatedTools.map((toolName) => (
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
                ) : null}
                <p className="mt-4 text-[11px] text-muted-foreground/70">
                  Fonte: <code className="font-mono">{pitfall.sourceRef}</code>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
