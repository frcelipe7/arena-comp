import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { DayTimeline } from "@/components/schedule/DayTimeline";
import { Container, Notice } from "@/components/ui/primitives";
import { schedule } from "@/data/schedule";
import { event } from "@/data/event";

export const metadata: Metadata = {
  title: "Cronograma",
  description: "Programação da Arena Comp 2026: dia 03 de dezembro a partir das 19h30 e dia 04 de dezembro das 14h às 17h, na UEPA Campus Parauapebas.",
  openGraph: { title: "Cronograma | Arena Comp 2026" },
};

export default function CronogramaPage() {
  return (
    <>
      <PageHeader
        title="Cronograma"
        intro={`${event.datesLabel}, ${event.location}. Chegue antes: o grupo que não se apresentar até 10 minutos após o início de um desafio é considerado ausente.`}
        crumbs={[{ href: "/cronograma", label: "Cronograma" }]}
        mascot="face-2"
      >
        <nav aria-label="Dias" className="mt-8 flex flex-wrap gap-3">
          {schedule.map((d) => (
            <a
              key={d.id}
              href={`#${d.id}`}
              className="rounded-full border-2 border-paper/30 px-4 py-2 text-sm font-semibold text-paper-50 transition-colors hover:border-gold hover:text-gold"
            >
              {d.label}: {d.dayNumber}/12, {d.weekday.toLowerCase()}
            </a>
          ))}
        </nav>
      </PageHeader>
      <Container className="py-14 sm:py-20">
        <Notice tone="pending" className="mb-10 max-w-3xl">
          <strong className="font-semibold">Atualização de datas:</strong> a Arena Comp acontece em 03 e 04 de dezembro. O
          PDF do regimento ainda traz as datas originais (26 e 27 de novembro) e o quadro antigo do primeiro dia, que não
          vale mais.
        </Notice>
        {schedule.map((d) => (
          <DayTimeline key={d.id} day={d} />
        ))}
      </Container>
    </>
  );
}
