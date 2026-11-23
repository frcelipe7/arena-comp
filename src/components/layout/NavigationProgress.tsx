"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Barra fina no topo que aparece no instante do clique em um link interno
 * e some quando a nova página assume. Dá resposta imediata ao toque,
 * principalmente em conexões lentas de celular.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // âncora na mesma página
      if (/\.(pdf|webp|jpe?g|png)$/i.test(url.pathname)) return;
      window.clearTimeout(timer.current);
      setState("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    setState((s) => (s === "loading" ? "done" : s));
    timer.current = window.setTimeout(() => setState("idle"), 350);
    return () => window.clearTimeout(timer.current);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]"
      style={{ opacity: state === "idle" ? 0 : 1, transition: "opacity 200ms" }}
    >
      <div
        className="h-full origin-left bg-gold shadow-[0_0_8px_var(--color-gold)]"
        style={{
          transform: `scaleX(${state === "loading" ? 0.85 : state === "done" ? 1 : 0})`,
          transition:
            state === "loading"
              ? "transform 2.5s cubic-bezier(0.1, 0.7, 0.2, 1)"
              : state === "done"
                ? "transform 200ms ease-out"
                : "none",
        }}
      />
    </div>
  );
}
