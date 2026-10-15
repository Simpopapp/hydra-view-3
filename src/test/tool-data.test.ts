import { describe, expect, it } from "vitest";
import { CATALOG_VERSION, CATEGORY_COUNTS, TOOLS } from "@/data/tools";
import { CATEGORY_META, getCategoryMeta } from "@/data/categories-meta";

// Valores concretos do PRD (.opencode/prd-project1.md): 209 ferramentas em 18 categorias.
describe("catálogo de ferramentas (dados gerados)", () => {
  it("contém exatamente 209 ferramentas", () => {
    expect(TOOLS).toHaveLength(209);
  });

  it("contém exatamente 18 categorias", () => {
    expect(CATEGORY_COUNTS).toHaveLength(18);
  });

  it("soma das contagens por categoria = total de ferramentas", () => {
    const sum = CATEGORY_COUNTS.reduce((acc, c) => acc + c.count, 0);
    expect(sum).toBe(TOOLS.length);
  });

  it("nenhum nome de ferramenta duplicado", () => {
    const names = TOOLS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("toda ferramenta tem categoria, descrição e escopo não vazios", () => {
    for (const tool of TOOLS) {
      expect(tool.category.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.servers.length).toBeGreaterThan(0);
    }
  });

  it("toda categoria do catálogo tem metadado autorado (label/summary/icon)", () => {
    for (const { id } of CATEGORY_COUNTS) {
      const meta = getCategoryMeta(id);
      expect(meta, `categoria sem meta: ${id}`).toBeDefined();
      expect(meta?.label.length).toBeGreaterThan(0);
      expect(meta?.summary.length).toBeGreaterThan(0);
      expect(meta?.icon.length).toBeGreaterThan(0);
    }
    expect(CATEGORY_META.length).toBe(CATEGORY_COUNTS.length);
  });

  it("as maiores categorias batem com o inventário do PRD", () => {
    const byId = new Map(CATEGORY_COUNTS.map((c) => [c.id, c.count]));
    expect(byId.get("program")).toBe(33);
    expect(byId.get("datatype")).toBe(32);
    expect(byId.get("function")).toBe(23);
    expect(byId.get("analysis")).toBe(20);
  });

  it("registra a versão do catálogo de origem", () => {
    expect(CATALOG_VERSION.length).toBeGreaterThan(0);
  });
});
