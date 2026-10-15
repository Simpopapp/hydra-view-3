import { useEffect, useRef, useState } from "react";

/**
 * Entrada de conteúdo ao rolar (fade + 8px translate), uma única vez.
 * SSR-safe: o estado inicial é "não visível" e o observer só é anexado em
 * useEffect — o render inicial do servidor e o da hidratação coincidem.
 * Respeita prefers-reduced-motion via CSS (transições zeradas no stylesheet).
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

/** Classes utilitárias do reveal — use com o hook para manter um só padrão. */
export const revealClasses = (revealed: boolean, className?: string) =>
  [
    "transition-[transform,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
    revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");
