import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Challenge } from "@/types";

/** Card de desafio com o número grande do desafio (ordem do art. 11). */
export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <Link
      href={`/desafios/${challenge.slug}`}
      data-card
      className="group relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.75rem] border-2 border-navy bg-navy p-6 text-paper-50 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:shadow-[0_8px_0_0_var(--color-gold)] sm:p-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-2 select-none text-[11rem] font-extrabold leading-none tracking-[-0.08em] text-transparent transition-transform duration-500 ease-[var(--ease-out-expo)] [-webkit-text-stroke:2px_var(--color-gold)] group-hover:-translate-y-2 sm:text-[13rem]"
      >
        0{challenge.order}
      </span>
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-gold">
          Desafio {challenge.order}
          <span className="block font-medium text-navy-300">{challenge.dayShort}</span>
        </p>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-gold/60 text-gold transition-colors duration-200 group-hover:bg-gold group-hover:text-navy">
          <ArrowUpRight aria-hidden className="size-5" />
        </span>
      </div>
      <h3 className="relative mt-6 text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[2.1rem]">
        {challenge.name}
      </h3>
      <p className="relative mt-3 max-w-[30ch] text-sm leading-relaxed text-navy-300">{challenge.tagline}</p>
      <dl className="relative mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 text-sm">
        {challenge.facts.slice(0, 3).map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-navy-300">{f.label}</dt>
            <dd className="font-bold">{f.value}</dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}
