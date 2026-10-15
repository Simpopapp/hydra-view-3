/**
 * Gera `src/data/tools.ts` a partir de `tests/endpoints.json` (a fonte de
 * verdade do catálogo de ferramentas MCP).
 *
 * Idempotente: rodar duas vezes produz a mesma saída.
 * NÃO editar `src/data/tools.ts` à mão — re-rodar este script:
 *
 *   bun scripts/generate-tool-data.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

interface CatalogEntry {
  path: string;
  method: string;
  category: string;
  params: string[];
  servers: string[];
  description: string;
}

interface CatalogFile {
  version: string;
  total_endpoints: number;
  endpoints: CatalogEntry[];
}

const ROOT = resolve(import.meta.dir, "..");
const INPUT = resolve(ROOT, "tests/endpoints.json");
const OUTPUT = resolve(ROOT, "src/data/tools.ts");

const catalog: CatalogFile = JSON.parse(readFileSync(INPUT, "utf-8"));

const tools = catalog.endpoints.map((entry) => {
  const name = entry.path.replace(/^\//, "");
  return {
    name,
    method: entry.method,
    category: entry.category,
    params: [...entry.params].sort(),
    servers: [...entry.servers].sort() as ("gui" | "headless")[],
    description: entry.description,
  };
});

tools.sort((a, b) => a.name.localeCompare(b.name));

const categoryCounts = new Map<string, number>();
for (const tool of tools) {
  categoryCounts.set(tool.category, (categoryCounts.get(tool.category) ?? 0) + 1);
}
const categories = [...categoryCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([id, count]) => ({ id, count }));

const header = `// GERADO POR scripts/generate-tool-data.ts a partir de tests/endpoints.json.
// NÃO editar à mão: re-gerar com \`bun scripts/generate-tool-data.ts\`.
// Versão do catálogo de origem: ${catalog.version} (${catalog.total_endpoints} endpoints).

import type { McpTool, ToolCategoryCount } from "./types";

export const CATALOG_VERSION = ${JSON.stringify(catalog.version)};

export const TOOLS: McpTool[] = ${JSON.stringify(tools, null, 2)};

/** Contagem por categoria, ordenada por contagem desc depois nome. */
export const CATEGORY_COUNTS: ToolCategoryCount[] = ${JSON.stringify(categories, null, 2)};
`;

writeFileSync(OUTPUT, header, "utf-8");

console.log(
  `OK: ${tools.length} ferramentas em ${categories.length} categorias -> src/data/tools.ts`,
);
