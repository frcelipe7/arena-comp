import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { CircleDashed, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "navy" | "outline" | "outline-light" | "ghost";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-navy hover:bg-gold-300 shadow-[0_2px_0_0_var(--color-navy)] active:shadow-none active:translate-y-[2px]",
  navy: "bg-navy text-paper-50 hover:bg-navy-700 focus-navy shadow-[0_2px_0_0_var(--color-gold)] active:shadow-none active:translate-y-[2px]",
  outline: "border-2 border-navy text-navy hover:bg-navy hover:text-paper-50 focus-navy",
  "outline-light": "border-2 border-paper/40 text-paper-50 hover:border-gold hover:text-gold",
  ghost: "text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy focus-navy",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-[var(--ease-out-quart)] select-none sm:text-[0.95rem]";

export function ButtonLink({
  variant = "gold",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={cn(base, variant !== "ghost" && "min-h-12", variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function ExternalButton({
  variant = "gold",
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a className={cn(base, "min-h-12", variants[variant], className)} {...props}>
      {children}
    </a>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

export function SectionHeading({
  kicker,
  title,
  intro,
  tone = "paper",
  className,
  id,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "paper" | "navy";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {kicker && (
        <p
          className={cn(
            "mb-3 flex items-center gap-2 text-sm font-semibold",
            tone === "paper" ? "text-navy-500" : "text-gold",
          )}
        >
          <span aria-hidden className={cn("h-[3px] w-6 rounded-full", tone === "paper" ? "bg-gold" : "bg-gold")} />
          {kicker}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          "text-[2rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-5xl",
          tone === "paper" ? "text-navy" : "text-paper-50",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 max-w-2xl text-base leading-relaxed sm:text-lg", tone === "paper" ? "text-ink-soft" : "text-navy-300")}>
          {intro}
        </p>
      )}
    </div>
  );
}

/** Selo para informações que a organização ainda precisa confirmar. */
export function PendingBadge({ children = "A confirmar", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-pending/60 bg-pending/8 px-2.5 py-1 text-xs font-semibold text-pending",
        className,
      )}
    >
      <CircleDashed aria-hidden className="size-3.5" strokeWidth={2.5} />
      {children}
    </span>
  );
}

export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "pending";
  children: ReactNode;
  className?: string;
}) {
  const Icon = tone === "pending" ? CircleDashed : Info;
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed",
        tone === "pending"
          ? "border-dashed border-pending/50 bg-paper-50/70 text-[#7a3510]"
          : "border-navy/15 bg-paper-50/70 text-ink-soft",
        className,
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", tone === "pending" ? "text-pending" : "text-navy-500")} strokeWidth={2.5} />
      <div>{children}</div>
    </div>
  );
}

/** Faixa "Gincana" da arte de divulgação. */
export function GincanaBand({ className, tone = "gold" }: { className?: string; tone?: "gold" | "navy" }) {
  const words = Array.from({ length: 14 });
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden border-y-2 border-navy py-2.5",
        tone === "gold" ? "bg-gold text-navy" : "bg-navy text-paper-50 border-gold",
        className,
      )}
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-2xl font-extrabold tracking-tight sm:text-3xl motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-8">
            {words.map((_, i) => (
              <span key={i}>
                Gin<span className={tone === "gold" ? "text-paper-50 [-webkit-text-stroke:1.5px_var(--color-navy)]" : "text-gold"}>ca</span>na
                <span className="ml-8 inline-block size-2.5 -translate-y-1 rounded-full bg-current align-middle opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
