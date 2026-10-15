// Reports a caught error so it reaches Lovable error capture (the platform
// collects console output). Dependency-free and browser-safe: safe to call
// from SSR or the client; never throws.

type ErrorContext = { boundary?: string; [key: string]: unknown };

function serialize(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export function reportLovableError(error: unknown, context?: ErrorContext): void {
  try {
    const payload = {
      ...serialize(error),
      ...(context ? { context } : {}),
      ts: new Date().toISOString(),
    };
    // The preview/observability pipeline captures console output; a single
    // structured line keeps the stack and context together.
    console.error("[lovable-error]", payload);
  } catch {
    // Never let reporting itself break the error UI.
  }
}
