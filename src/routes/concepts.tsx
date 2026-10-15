import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ListTree, MessagesSquare, Network, Server } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORY_COUNTS, TOOLS } from "@/data/tools";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Conceitos — Ghidra MCP" },
      {
        name: "description",
        content:
          "Conceitos do Ghidra MCP: instâncias e transportes, grupos de ferramentas, resolução de programas, convenções de nomenclatura e variantes de linguagem.",
      },
      { property: "og:title", content: "Conceitos — Ghidra MCP" },
      {
        property: "og:description",
        content:
          "Instâncias e transportes, grupos de ferramentas, resolução de programas, convenções de nomenclatura e variantes de linguagem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConceptsPage,
});

const CONCEPTS = [
  {
    id: "instancias-e-transportes",
    icon: <Network className="size-5 text-primary" />,
    title: "Instâncias e transportes",
    body: (
      <>
        <p>
          Cada processo Ghidra com a extensão ativa é uma <strong>instância</strong>. O servidor
          HTTP escuta em Unix socket (
          <code className="font-mono text-xs">ghidra-&lt;pid&gt;.sock</code>) e TCP (porta 8089, com
          fallback nas seguintes). O bridge descobre as instâncias automaticamente — rode{" "}
          <code className="font-mono text-xs">list_instances</code> para vê-las.
        </p>
        <p>
          Dois servidores existem: a <strong>GUI</strong> (plugin no Ghidra desktop, menu Tools &gt;
          GhidraMCP) e o <strong>headless</strong> (automação sem interface). 186 das 209
          ferramentas existem em ambos; as diferenças por ferramenta aparecem no catálogo e no badge
          de escopo de cada página.
        </p>
      </>
    ),
  },
  {
    id: "grupos-de-ferramentas",
    icon: <ListTree className="size-5 text-primary" />,
    title: "Grupos de ferramentas (lazy loading)",
    body: (
      <>
        <p>
          209 ferramentas carregadas de uma vez gastariam muito contexto do seu assistente. O bridge
          as divide em <strong>grupos por categoria</strong>: {CATEGORY_COUNTS.length} no total.
          Três grupos básicos (listar, função, programa) vêm sempre; os demais você carrega sob
          demanda.
        </p>
        <p>
          No seu cliente de IA: <code className="font-mono text-xs">list_tool_groups</code> para
          ver, <code className="font-mono text-xs">load_tool_group</code> /{" "}
          <code className="font-mono text-xs">unload_tool_group</code> para alternar e{" "}
          <code className="font-mono text-xs">search_tools</code> para achar por nome.
        </p>
      </>
    ),
  },
  {
    id: "programa-ativo",
    icon: <Layers className="size-5 text-primary" />,
    title: "Programa ativo e resolução de nomes",
    body: (
      <>
        <p>
          A maioria das ferramentas aceita um parâmetro{" "}
          <code className="font-mono text-xs">program</code>. Sem ele, vale o programa corrente do
          servidor — cuidado em trabalho multi-versão (veja a página de armadilhas). A resolução
          aceita caminho completo do projeto, nome exato e substring <em>única</em>; substring
          ambígua é um erro que lista os candidatos, nunca "o primeiro hit".
        </p>
        <p>
          Programas são abertos sob demanda e mantidos num cache LRU (padrão 8) — você não precisa
          gerenciar aberturas manualmente, mas{" "}
          <code className="font-mono text-xs">close_program</code> libera checkouts.
        </p>
      </>
    ),
  },
  {
    id: "convencoes-de-nomenclatura",
    icon: <MessagesSquare className="size-5 text-primary" />,
    title: "Convenções de nomenclatura",
    body: (
      <>
        <p>
          As ferramentas de renomeação validam as convenções automaticamente: funções em PascalCase
          com verbo, globais com prefixo <code className="font-mono text-xs">g_</code>, labels em
          snake_case, campos de struct com notação húngara aplicada automaticamente. Você não
          precisa decorar as regras — as ferramentas avisam.
        </p>
        <p>
          Comentários de plate seguem o padrão Algorithm / Parameters / Returns; o scanner de
          convenções reclama quando falta seção. Documentação consistente é o que permite a
          propagação entre versões por hash.
        </p>
      </>
    ),
  },
  {
    id: "variantes-de-linguagem",
    icon: <Server className="size-5 text-primary" />,
    title: "Variantes de linguagem e decompilação",
    body: (
      <>
        <p>
          O decompilador do Ghidra depende da linguagem/variante carregada. O servidor carimba{" "}
          <strong>toda</strong> resposta com C usando{" "}
          <code className="font-mono text-xs">language_id</code> e{" "}
          <code className="font-mono text-xs">variant</code>; processadores com mais de um
          decodificador SLEIGH recebem também{" "}
          <code className="font-mono text-xs">variant_ambiguous</code> com as opções.
        </p>
        <p>
          Nomear uma variante que o programa não usa é recusado (
          <code className="font-mono text-xs">variant_mismatch</code>). Para x86 isso quase nunca
          importa (uma decodificação só); para PowerPC/ARM/MIPS, confira o carimbo antes de confiar
          no pseudocódigo.
        </p>
      </>
    ),
  },
];

function ConceptsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Conceitos</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          O vocabulário mínimo para usar o Ghidra MCP bem — tudo o que aparece repetidamente nas
          ferramentas e nos fluxos.
        </p>
        <nav aria-label="Índice" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {CONCEPTS.map((concept) => (
              <li key={concept.id}>
                <a
                  href={`#${concept.id}`}
                  className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {concept.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-4">
          {CONCEPTS.map((concept) => (
            <section
              key={concept.id}
              id={concept.id}
              className="scroll-mt-24 rounded-xl border border-border/60 bg-card/40 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md border border-border/40 bg-secondary/80">
                  {concept.icon}
                </div>
                <h2 className="font-serif text-lg font-semibold">{concept.title}</h2>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
                {concept.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Fontes: <code className="font-mono">AGENTS.md</code> ·{" "}
          <code className="font-mono">docs/connection-triage-guide.md</code> ·{" "}
          <code className="font-mono">python/bridge_mcp_ghidra/</code> · {TOOLS.length} endpoints em{" "}
          <code className="font-mono">tests/endpoints.json</code>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
