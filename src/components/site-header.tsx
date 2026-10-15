import { Link, useRouterState } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/components/agent-status";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/tools", label: "Ferramentas" },
  { to: "/workflows", label: "Fluxos" },
  { to: "/concepts", label: "Conceitos" },
  { to: "/setup", label: "Instalação" },
  { to: "/pitfalls", label: "Armadilhas" },
] as const;

function NavLinks({ compact = false }: { compact?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-sm transition-colors",
              compact ? "whitespace-nowrap text-xs" : "",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-primary transition-transform duration-200 ease-out",
                active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Cpu className="size-4" />
            </div>
            <span className="font-serif text-sm font-semibold tracking-tight text-foreground">
              Ghidra MCP
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">guia de uso</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
              <NavLinks />
            </nav>
            <AgentStatus />
          </div>
        </div>
        <nav
          aria-label="Navegação principal (compacta)"
          className="flex gap-1 overflow-x-auto border-t border-border/30 px-4 py-2 md:hidden"
        >
          <NavLinks compact />
        </nav>
      </header>
    </>
  );
}
