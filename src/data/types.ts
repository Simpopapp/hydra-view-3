/** Tipos dos dados estáticos da UI. Ver .opencode/prd-project1.md §2.2/§12/§13. */

export type ServerScope = "gui" | "headless";

/** Uma ferramenta MCP do catálogo (gerado, podado). */
export interface McpTool {
  /** Nome da ferramenta sem a barra inicial (ex.: "rename_function"). */
  name: string;
  /** Método HTTP da rota crua — o uso real é via MCP tools/call. */
  method: "GET" | "POST";
  /** Tool-group do bridge (ex.: "function"). */
  category: string;
  /** Nomes de parâmetros conhecidos, alfabéticos. */
  params: string[];
  /** Em quais servidores a ferramenta existe. */
  servers: ServerScope[];
  /** Descrição do catálogo (hand-authored no Java). */
  description: string;
}

export interface ToolCategoryCount {
  id: string;
  count: number;
}

/** Metadado autorado por categoria (src/data/categories-meta.ts). */
export interface ToolCategoryMeta {
  id: string;
  label: string;
  summary: string;
  icon: string;
}

export interface WorkflowStep {
  title: string;
  detail: string;
  /** Nomes de ferramentas que DEVEM existir no catálogo (testado). */
  tools: string[];
  pitfall?: string;
}

export interface Workflow {
  slug: string;
  title: string;
  goal: string;
  prerequisites: string[];
  steps: WorkflowStep[];
  pitfalls: string[];
  sourceRef: string;
}

export interface Pitfall {
  slug: string;
  title: string;
  severity: "critica" | "media";
  symptom: string;
  cause: string;
  remedy: string;
  sourceRef: string;
  relatedTools: string[];
}
