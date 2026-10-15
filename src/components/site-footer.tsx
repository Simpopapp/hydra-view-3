import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

const NAV = [
  { to: "/tools", label: "Ferramentas" },
  { to: "/workflows", label: "Fluxos" },
  { to: "/concepts", label: "Conceitos" },
  { to: "/setup", label: "Instalação" },
  { to: "/pitfalls", label: "Armadilhas" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav
          aria-label="Navegação do rodapé"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 pb-6"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2 border-t border-border/30 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Guia de uso do Ghidra MCP — 209 ferramentas de engenharia reversa para clientes de IA.
            Projeto open-source.
          </p>
          <a
            href="https://github.com/bethington/ghidra-mcp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-3.5" />
            github.com/bethington/ghidra-mcp
          </a>
          <p className="text-[11px] text-muted-foreground/70">
            Esta interface é uma camada de navegação sobre a documentação canônica — cada seção cita
            sua fonte.
          </p>
        </div>
      </div>
    </footer>
  );
}
