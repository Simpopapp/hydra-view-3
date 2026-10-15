import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// The agent's own server exposes GET /api/health (proxied same-origin by the dev
// server). The badge must never claim "online" before that check answers, so the
// initial state is "checking" and the fetch only ever runs on the client.
const HEALTH_URL = "/api/health";
const POLL_MS = 20_000;

type AgentStatus = "checking" | "online" | "offline";

async function readAgentStatus(signal: AbortSignal): Promise<AgentStatus> {
  try {
    const res = await fetch(HEALTH_URL, { signal, cache: "no-store" });
    if (!res.ok) return "offline";
    const body = (await res.json()) as { healthy?: unknown };
    return body.healthy === true ? "online" : "offline";
  } catch {
    return "offline";
  }
}

const LABELS: Record<AgentStatus, string> = {
  checking: "Verificando agente",
  online: "Agente online",
  offline: "Agente desligado",
};

export function AgentStatus() {
  const [status, setStatus] = useState<AgentStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const check = async () => {
      const next = await readAgentStatus(controller.signal);
      if (alive) setStatus(next);
    };

    void check();
    const timer = setInterval(() => void check(), POLL_MS);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  return (
    <a
      href="/oc"
      target="_blank"
      rel="noreferrer"
      aria-label={`${LABELS[status]} — abrir a interface do agente`}
      title="Abrir a interface do agente em nova aba"
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          status === "online" && "bg-primary",
          status === "offline" && "bg-destructive",
          status === "checking" && "animate-pulse bg-muted-foreground/50",
        )}
      />
      <span>{LABELS[status]}</span>
    </a>
  );
}
