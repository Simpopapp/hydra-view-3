import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AgentStatus } from "@/components/agent-status";

function jsonResponse(body: unknown): Response {
  return { ok: true, json: async () => body } as unknown as Response;
}

describe("Agent status badge", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not claim the agent is online before the health check answers", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );

    render(<AgentStatus />);

    expect(screen.queryByText("Agente online")).toBeNull();
    expect(screen.getByText("Verificando agente")).toBeTruthy();
  });

  it("reports online only when the health endpoint says healthy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ healthy: true })),
    );

    render(<AgentStatus />);

    await waitFor(() => expect(screen.getByText("Agente online")).toBeTruthy());
  });

  it("reports offline when the health endpoint answers unhealthy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ healthy: false })),
    );

    render(<AgentStatus />);

    await waitFor(() => expect(screen.getByText("Agente desligado")).toBeTruthy());
  });

  it("reports offline when the health endpoint is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("connection refused");
      }),
    );

    render(<AgentStatus />);

    await waitFor(() => expect(screen.getByText("Agente desligado")).toBeTruthy());
  });

  it("links the badge to the agent interface at /oc", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ healthy: true })),
    );

    render(<AgentStatus />);

    await waitFor(() => expect(screen.getByText("Agente online")).toBeTruthy());
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/oc");
  });
});
