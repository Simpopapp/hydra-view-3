import type { ToolCategoryMeta } from "./types";

/**
 * Metadado autorado por categoria do catálogo.
 * Se o catálogo ganhar uma categoria nova, ela PRECISA entrar aqui —
 * o teste de integridade (src/test/tool-data.test.ts) falha caso contrário.
 */
export const CATEGORY_META: ToolCategoryMeta[] = [
  {
    id: "program",
    label: "Programas",
    summary: "Abrir, salvar, importar e gerenciar o binário em análise dentro do projeto Ghidra.",
    icon: "package",
  },
  {
    id: "datatype",
    label: "Tipos de dados",
    summary: "Criar e aplicar structs, enums e unions; investigar e validar tipos aplicados.",
    icon: "shapes",
  },
  {
    id: "function",
    label: "Funções",
    summary:
      "Decompilar, renomear, tipar e inspecionar funções — o núcleo do trabalho de RE assistido por IA.",
    icon: "braces",
  },
  {
    id: "analysis",
    label: "Análise",
    summary: "Fluxo de controle, fluxo de dados (P-code), completude e similaridade entre funções.",
    icon: "microscope",
  },
  {
    id: "server",
    label: "Servidor",
    summary:
      "Conexão com o Ghidra Server, check-in/check-out e controle de versão de programas compartilhados.",
    icon: "server",
  },
  {
    id: "debugger",
    label: "Debugger",
    summary: "Depuração dinâmica via TraceRmi: anexo a processos vivos e tradução de endereços.",
    icon: "bug",
  },
  {
    id: "listing",
    label: "Listagem",
    summary: "Enumerar funções, strings, segmentos, imports e globais do binário aberto.",
    icon: "list",
  },
  {
    id: "documentation",
    label: "Documentação",
    summary: "Hashes de função e transferência de documentação entre binários e versões.",
    icon: "book-open",
  },
  {
    id: "project",
    label: "Projeto",
    summary: "Ciclo de vida de projetos Ghidra: criar, abrir, exportar e restaurar.",
    icon: "folder",
  },
  {
    id: "xref",
    label: "Referências cruzadas",
    summary: "Xrefs, grafos de chamadas e rastreamento de usos de código e dados.",
    icon: "git-branch",
  },
  {
    id: "malware",
    label: "Malware",
    summary: "Indicadores de comprometimento e capacidades de análise de segurança.",
    icon: "shield-alert",
  },
  {
    id: "utility",
    label: "Utilitários",
    summary: "Operações auxiliares de conveniência usadas pelos fluxos do operador.",
    icon: "wrench",
  },
  {
    id: "comment",
    label: "Comentários",
    summary: "Comentários de plate, função e código — a camada de documentação do binário.",
    icon: "message-square",
  },
  {
    id: "symbol",
    label: "Símbolos",
    summary: "Rótulos, símbolos globais e renomeação com validação de convenções.",
    icon: "tag",
  },
  {
    id: "headless",
    label: "Headless",
    summary: "Gestão de projetos sem GUI: o servidor standalone para automação em lote.",
    icon: "terminal",
  },
  {
    id: "emulation",
    label: "Emulação",
    summary: "Execução isolada de funções via emulador P-code para validar lógica.",
    icon: "play",
  },
  {
    id: "getter",
    label: "Legado (getter)",
    summary:
      "Categoria residual da taxonomia anterior aos tool groups — mantida por compatibilidade.",
    icon: "archive",
  },
  {
    id: "system",
    label: "Sistema",
    summary: "Estado e identidade do servidor MCP (versão, contagem de endpoints).",
    icon: "database",
  },
];

const byId = new Map(CATEGORY_META.map((meta) => [meta.id, meta]));

export function getCategoryMeta(id: string): ToolCategoryMeta | undefined {
  return byId.get(id);
}
