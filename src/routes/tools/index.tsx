import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_COUNTS, TOOLS } from "@/data/tools";
import { getCategoryMeta } from "@/data/categories-meta";
import { cn } from "@/lib/utils";

// Campos podem receber undefined explícito (exactOptionalPropertyTypes):
// limpar um filtro escreve a chave com undefined.
type ToolsSearch = {
  q?: string | undefined;
  categoria?: string | undefined;
  escopo?: "gui" | "headless" | undefined;
};

export const Route = createFileRoute("/tools/")({
  validateSearch: (search: Record<string, unknown>): ToolsSearch => {
    const q = typeof search["q"] === "string" ? search["q"] : undefined;
    const categoria = typeof search["categoria"] === "string" ? search["categoria"] : undefined;
    const escopoRaw = search["escopo"];
    const escopo = escopoRaw === "gui" || escopoRaw === "headless" ? escopoRaw : undefined;
    return { q, categoria, escopo };
  },
  head: () => ({
    meta: [
      { title: "Ferramentas — Catálogo das 209 ferramentas do Ghidra MCP" },
      {
        name: "description",
        content:
          "Navegue pelas 209 ferramentas MCP do Ghidra MCP por categoria e escopo (GUI/headless), com busca por nome e descrição.",
      },
      {
        property: "og:title",
        content: "Ferramentas — Catálogo das 209 ferramentas do Ghidra MCP",
      },
      {
        property: "og:description",
        content:
          "Navegue pelas 209 ferramentas MCP do Ghidra MCP por categoria e escopo, com busca por nome e descrição.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const { q, categoria, escopo } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const setFilter = (patch: ToolsSearch) => {
    void navigate({ search: (prev: ToolsSearch) => ({ ...prev, ...patch }) });
  };

  const filtered = useMemo(() => {
    const query = (q ?? "").trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (categoria && tool.category !== categoria) return false;
      if (escopo && !tool.servers.includes(escopo)) return false;
      if (query) {
        const haystack = `${tool.name} ${tool.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [q, categoria, escopo]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const tool of filtered) {
      const list = map.get(tool.category) ?? [];
      list.push(tool);
      map.set(tool.category, list);
    }
    // Mantém a ordem de contagem do catálogo dentro do resultado filtrado.
    return CATEGORY_COUNTS.filter((c) => map.has(c.id)).map((c) => ({
      id: c.id,
      tools: map.get(c.id) ?? [],
    }));
  }, [filtered]);

  const hasFilters = Boolean(q || categoria || escopo);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Catálogo de ferramentas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {TOOLS.length} ferramentas em {CATEGORY_COUNTS.length} categorias.{" "}
          <span aria-live="polite">{filtered.length} no resultado atual.</span>
        </p>

        {/* Busca */}
        <div className="mt-6 max-w-xl" role="search">
          <label htmlFor="tool-search" className="sr-only">
            Buscar ferramentas por nome ou descrição
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="tool-search"
              type="search"
              value={q ?? ""}
              onChange={(e) => setFilter({ q: e.target.value || undefined })}
              placeholder="Buscar por nome ou descrição (ex.: decompile)"
              className="pl-9"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {CATEGORY_COUNTS.map(({ id, count }) => {
            const meta = getCategoryMeta(id);
            if (!meta) return null;
            const active = categoria === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter({ categoria: active ? undefined : id })}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                <CategoryIcon icon={meta.icon} className="size-3" />
                {meta.label}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Escopo:</span>
          {(["gui", "headless"] as const).map((scope) => {
            const active = escopo === scope;
            return (
              <button
                key={scope}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter({ escopo: active ? undefined : scope })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {scope === "gui" ? "GUI" : "Headless"}
              </button>
            );
          })}
          {hasFilters ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => void navigate({ search: {} })}
            >
              <X className="size-3" /> Limpar filtros
            </Button>
          ) : null}
        </div>

        {/* Resultados */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-border/60 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nada encontrado{q ? <> para “{q}”</> : null} com os filtros atuais.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => void navigate({ search: {} })}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {grouped.map(({ id, tools }) => {
              const meta = getCategoryMeta(id);
              if (!meta) return null;
              return (
                <section key={id} aria-label={meta.label}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-md border border-border/40 bg-secondary/80 text-primary">
                      <CategoryIcon icon={meta.icon} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">{meta.label}</h2>
                      <p className="text-xs text-muted-foreground">{meta.summary}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {tools.length}
                    </Badge>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool) => (
                      <li key={tool.name}>
                        <Link
                          to="/tools/$toolName"
                          params={{ toolName: tool.name }}
                          className="block h-full rounded-lg border border-border/50 bg-card/40 p-3 transition-colors hover:border-primary/40"
                        >
                          <p className="font-mono text-xs font-medium text-foreground">
                            {tool.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {tool.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
