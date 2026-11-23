"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Instância compartilhada (ex.: para pausar a rolagem com um modal aberto). */
export const lenisRef: { current: Lenis | null } = { current: null };

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -96 },
    });
    lenisRef.current = lenis;

    // Sincroniza Lenis com ScrollTrigger usando o ticker do GSAP (um único rAF).
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Na troca de rota, recalcula os gatilhos e respeita âncoras (#).
  useEffect(() => {
    const lenis = lenisRef.current;
    const hash = window.location.hash;
    if (lenis) {
      if (hash) {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) lenis.scrollTo(el, { offset: -96, immediate: true });
      } else {
        lenis.scrollTo(0, { immediate: true });
      }
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
