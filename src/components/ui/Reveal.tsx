"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seletor dos filhos que entram em sequência. Sem ele, o bloco entra inteiro. */
  stagger?: string;
  id?: string;
}

/**
 * Entrada discreta ao rolar. O conteúdo é visível sem JavaScript
 * e com "reduzir movimento" ativado.
 */
export function Reveal({ children, className, as: Tag = "div", stagger, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = ref.current;
        if (!el) return;
        const targets = stagger ? gsap.utils.toArray<HTMLElement>(stagger, el) : [el];
        if (!targets.length) return;
        gsap.from(targets, {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
