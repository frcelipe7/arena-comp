import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { ScheduleDay } from "@/types";
import { challengeBySlug } from "@/data/challenges";
import { Notice, PendingBadge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Bloco de um dia: data grande à esquerda, linha do tempo à direita. */
export function DayTimeline({ day, compact = false }: { day: ScheduleDay; compact?: boolean }) {
  const first = day.id === "dia-1";
  return (
    <section
      id={day.id}
      aria-labelledby={`${day.id}-titulo`}
      className="scroll-mt-28 grid gap-6 border-t-2 border-navy py-10 md:grid-cols-[15rem_1fr] md:gap-10 lg:grid-cols-[18rem_1fr]"
    >
      <header className="md:sticky md:top-28 md:self-start">
        <span
          className={cn(
            "inline-block rounded-md px-2 py-0.5 text-sm font-semibold",
            first ? "bg-gold text-navy" : "bg-navy text-paper-50",
          )}
        >
          {day.label} · {day.weekday}
        </span>
        <h2 id={`${day.id}-titulo`} className="mt-2 flex items-baseline gap-3">
          <span className="text-[6.5rem] font-extrabold leading-[0.8] tracking-[-0.06em] text-navy tabular sm:text-[8rem]">
            {day.dayNumber}
          </span>
          <span className="text-2xl font-bold text-navy">
            de dezembro
            <span className="sr-only"> de 2026</span>
          </span>
        </h2>
        <p className="mt-4 flex items-center gap-2 text-lg font-semibold text-navy">
          <Clock aria-hidden className="size-5 text-gold-700" />
          {day.endTime ? `${day.startTime} às ${day.endTime}` : `Início às ${day.startTime}`}
        </p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{day.summary}</p>
      </header>

      <div>
        <ol className="relative">
          {day.items.map((item, i) => {
            const challenge = item.challenge ? challengeBySlug[item.challenge] : null;
            const pending = item.status === "pendente";
            return (
              <li
                key={item.id}
                id={item.id}
                className="relative scroll-mt-28 grid grid-cols-[1.25rem_1fr] gap-x-4 pb-7 last:pb-0 sm:grid-cols-[1.25rem_11rem_1fr]"
              >
                {/* trilho */}
                <span aria-hidden className="relative flex justify-center">
                  <span
                    className={cn(
                      "relative z-10 mt-1.5 size-3.5 rounded-full border-2 border-navy",
                      pending ? "border-dashed bg-paper-50" : challenge ? "bg-gold" : "bg-navy",
                    )}
                  />
                  {i < day.items.length - 1 && (
                    <span className={cn("absolute bottom-[-0.25rem] top-6 w-0.5", pending ? "border-l-2 border-dashed border-navy/30" : "bg-navy/25")} />
                  )}
                </span>
                <div className="col-start-2 sm:col-start-2">
                  {item.time ? (
                    <p className="text-base font-bold text-navy tabular sm:pt-0.5">{item.time}</p>
                  ) : (
                    <PendingBadge>Horário a confirmar</PendingBadge>
                  )}
                </div>
                <div className="col-start-2 mt-1.5 sm:col-start-3 sm:mt-0">
                  <h3 className="text-lg font-semibold leading-snug text-navy">{item.title}</h3>
                  {item.responsible && !compact && <p className="mt-0.5 text-sm text-navy-500">{item.responsible}</p>}
                  {item.note && !compact && <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">{item.note}</p>}
                  {challenge && (
                    <Link
                      href={`/desafios/${challenge.slug}`}
                      className="focus-navy mt-2 inline-flex items-center gap-1 text-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy"
                    >
                      Regras do desafio
                      <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        {!compact && day.notices.length > 0 && (
          <div className="mt-8 space-y-3">
            {day.notices.map((n) => (
              <Notice key={n.text} tone={n.tone}>
                {n.text}
              </Notice>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
