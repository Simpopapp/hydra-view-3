import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  label?: string;
  /** Mostra o rótulo textual "Copiado" além do ícone. Padrão: true. */
  showCopiedLabel?: boolean;
}

export function CodeBlock({ code, label, showCopiedLabel = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponível — o código continua visível para seleção manual.
      setCopied(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border/60 bg-surface-sunken">
      {label ? (
        <div className="border-b border-border/40 px-4 py-2 text-xs text-muted-foreground">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
      <div aria-live="polite" className="sr-only">
        {copied ? "Copiado para a área de transferência" : ""}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copiado" : "Copiar código"}
        className={cn(
          "absolute right-2 top-2 flex items-center gap-1.5 rounded-md border border-border/60 bg-background/80 p-1.5 text-muted-foreground transition-colors hover:text-foreground",
          copied && "border-primary/40 text-primary",
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied && showCopiedLabel ? (
          <span className="pr-1 text-[11px] font-medium">Copiado</span>
        ) : null}
      </button>
    </div>
  );
}
