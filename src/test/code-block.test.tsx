import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CodeBlock } from "@/components/code-block";

function stubClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
}

describe("CodeBlock copy rule", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies the exact payload to the clipboard and announces it for 2 seconds", async () => {
    const writeText = vi.fn(async () => undefined);
    stubClipboard(writeText);
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const payload = '{"name": "rename_function", "arguments": {"call": "D2Game.dll"}}';
    render(<CodeBlock code={payload} label="tools/call" />);

    fireEvent.click(screen.getByRole("button", { name: /copiar código/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(payload));
    // Feedback visível e anunciado em aria-live enquanto durar.
    expect(screen.getByRole("button", { name: /copiado/i })).toBeTruthy();
    expect(screen.getByText("Copiado para a área de transferência")).toBeTruthy();

    // Após 2s o estado volta a "copiar" (permite copiar de novo).
    await vi.advanceTimersByTimeAsync(2000);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /copiar código/i })).toBeTruthy(),
    );

    vi.useRealTimers();
  });

  it("keeps the code selectable when the clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    render(<CodeBlock code="./gradlew buildExtension" />);
    fireEvent.click(screen.getByRole("button", { name: /copiar código/i }));

    // Sem clipboard, nada é anunciado como copiado — e o código segue no DOM.
    expect(screen.queryByText("Copiado para a área de transferência")).toBeNull();
    expect(screen.getByText("./gradlew buildExtension")).toBeTruthy();
  });
});
