import { describe, expect, it } from "vitest";
import { WORKFLOWS } from "@/data/workflows";
import { TOOLS } from "@/data/tools";
import { PITFALLS } from "@/data/pitfalls";

const TOOL_NAMES = new Set(TOOLS.map((t) => t.name));

describe("workflows", () => {
  it("tem 8 fluxos", () => {
    expect(WORKFLOWS.length).toBe(8);
  });

  it("slugs são únicos e URL-safe", () => {
    const slugs = WORKFLOWS.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("cada fluxo tem objetivo e ao menos 3 etapas", () => {
    for (const workflow of WORKFLOWS) {
      expect(workflow.goal.length).toBeGreaterThan(10);
      expect(workflow.steps.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("toda ferramenta citada em etapas existe no catálogo", () => {
    const broken: string[] = [];
    for (const workflow of WORKFLOWS) {
      for (const step of workflow.steps) {
        for (const toolName of step.tools) {
          if (!TOOL_NAMES.has(toolName)) broken.push(`${workflow.slug}: ${toolName}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("armadilhas de fluxo são texto livre informativo", () => {
    for (const workflow of WORKFLOWS) {
      for (const pitfall of workflow.pitfalls) {
        // Referências estruturadas de ferramentas em armadilhas vivem em
        // PITFALLS.relatedTools (validado na suíte de pitfalls); aqui a
        // armadilha de etapa/fluxo é prosa livre com fonte citada.
        expect(pitfall.length).toBeGreaterThan(10);
      }
    }
  });
});

describe("pitfalls", () => {
  it("tem ao menos 7 armadilhas", () => {
    expect(PITFALLS.length).toBeGreaterThanOrEqual(7);
  });

  it("severidade é crítica ou média", () => {
    for (const pitfall of PITFALLS) {
      expect(["critica", "media"]).toContain(pitfall.severity);
    }
  });

  it("toda armadilha tem sintoma, causa e remédio preenchidos", () => {
    for (const pitfall of PITFALLS) {
      expect(pitfall.symptom.length).toBeGreaterThan(10);
      expect(pitfall.cause.length).toBeGreaterThan(10);
      expect(pitfall.remedy.length).toBeGreaterThan(10);
    }
  });

  it("todas as ferramentas relacionadas existem no catálogo", () => {
    const broken: string[] = [];
    for (const pitfall of PITFALLS) {
      for (const toolName of pitfall.relatedTools) {
        if (!TOOL_NAMES.has(toolName)) broken.push(`${pitfall.slug}: ${toolName}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
