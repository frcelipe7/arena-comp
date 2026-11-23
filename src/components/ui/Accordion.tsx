"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  tone?: "paper" | "navy";
  className?: string;
  /** Controle externo (opcional). */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  headingLevel?: "h2" | "h3" | "h4";
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  id,
  tone = "paper",
  className,
  open: controlledOpen,
  onToggle,
  headingLevel: Heading = "h3",
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const uid = useId();
  const btnId = `${uid}-btn`;
  const panelId = `${uid}-panel`;

  const toggle = () => {
    const next = !open;
    if (controlledOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div
      id={id}
      className={cn(
        "border-b scroll-mt-28",
        tone === "paper" ? "border-navy/15" : "border-white/12",
        className,
      )}
    >
      <Heading className="m-0">
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className={cn(
            "group flex w-full items-start justify-between gap-6 py-5 text-left text-base font-semibold leading-snug transition-colors sm:text-lg",
            tone === "paper" ? "focus-navy hover:text-navy-700" : "hover:text-gold-300",
          )}
        >
          <span>{title}</span>
          <span
            aria-hidden
            className={cn(
              "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-quart)]",
              tone === "paper"
                ? "border-navy/25 group-hover:bg-navy group-hover:text-paper"
                : "border-white/25 group-hover:bg-gold group-hover:text-navy",
              open && "rotate-45",
              open && (tone === "paper" ? "bg-navy text-paper" : "bg-gold text-navy"),
            )}
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </span>
        </button>
      </Heading>
      <div id={panelId} role="region" aria-labelledby={btnId} className="accordion-panel" data-open={open}>
        <div inert={!open}>
          <div className="pb-6 pr-2 sm:pr-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
