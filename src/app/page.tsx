import { AppImage as Image } from "@/components/ui/AppImage";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, CalendarClock, Download, FileText, HelpCircle, Swords, Trophy, Users } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ButtonLink, Container, ExternalButton, GincanaBand, PendingBadge, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Scoreboard } from "@/components/scoreboard/Scoreboard";
import { getStandings } from "@/lib/standings";
import { GalleryTeaser } from "@/components/gallery/GalleryTeaser";
import { challenges } from "@/data/challenges";
import { event } from "@/data/event";
import { schedule } from "@/data/schedule";
import { teams } from "@/data/teams";

const shortcuts = [
  { href: "/cronograma", label: "Cronograma", hint: "Horários dos dois dias", icon: CalendarClock },
  { href: "/equipes", label: "Equipes", hint: "Cores e integrantes", icon: Users },
  { href: "/desafios", label: "Desafios", hint: "Formato e regras", icon: Swords },
  { href: "/pontuacao", label: "Pontuação", hint: "Pontos e nota extra", icon: Trophy },
  { href: "/regulamento", label: "Regulamento", hint: "Regras e PDF oficial", icon: BookOpenText },
  { href: "/faq", label: "Dúvidas", hint: "Respostas rápidas", icon: HelpCircle },
];

export default async function Home() {
  const placar = await getStandings();
  return (
    <>
      <Hero />

      {/* Atalhos */}
      <nav aria-label="Atalhos" className="border-y-2 border-navy bg-paper-50/80">
        <Container className="px-0 sm:px-0 lg:px-0">
          <ul className="grid grid-cols-2 gap-px bg-navy/15 sm:grid-cols-3 lg:grid-cols-6">
            {shortcuts.map(({ href, label, hint, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="focus-navy group flex h-full items-center gap-3 bg-paper-50 px-4 py-4 transition-colors hover:bg-navy hover:text-paper-50 sm:px-5">
                  <Icon aria-hidden className="size-5 shrink-0 text-gold-700 transition-colors group-hover:text-gold" />
                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{label}</span>
                    <span className="block truncate text-xs text-navy-500 group-hover:text-navy-300">{hint}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Números do evento */}
      <section aria-labelledby="numeros" className="py-16 sm:py-24">
        <Container>
          <h2 id="numeros" className="sr-only">
            A Arena em números
          </h2>
          <Reveal stagger="[data-stat]" className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border-2 border-navy bg-navy lg:grid-cols-4">
            {event.stats.map((s, i) => (
              <div key={s.label} data-stat className={i === 3 ? "bg-gold p-6 sm:p-8" : "bg-paper-50 p-6 sm:p-8"}>
                <p className="text-[clamp(3.6rem,10vw,6.5rem)] font-extrabold leading-[0.85] tracking-[-0.06em] text-navy tabular">
                  {s.value}
                </p>
                <p className="mt-3 text-sm font-semibold text-navy sm:text-base">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Desafios */}
      <section aria-labelledby="desafios-home" className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="desafios-home"
              kicker="Os desafios"
              title="Quatro provas, uma em cada área"
              intro="Lógica, programação, conhecimento e robótica. Cada desafio distribui de 30 a 100 pontos pela colocação."
            />
            <ButtonLink href="/desafios" variant="ghost">
              Comparar os desafios
            </ButtonLink>
          </div>
          <Reveal stagger="[data-card]" className="mt-10 grid gap-4 sm:grid-cols-2">
            {challenges.map((c) => (
              <ChallengeCard key={c.slug} challenge={c} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Cronograma resumido */}
      <section aria-labelledby="dias-home" className="border-t-2 border-navy bg-paper-50/60 py-20 sm:py-28">
        <Container>
          <SectionHeading id="dias-home" kicker="Programação" title="Dois dias de arena" />
          <Reveal stagger="[data-day]" className="mt-10 grid gap-4 lg:grid-cols-2">
            {schedule.map((day) => (
              <article key={day.id} data-day className="flex flex-col rounded-[1.75rem] border-2 border-navy bg-paper-50 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[5.5rem] font-extrabold leading-[0.8] tracking-[-0.06em] text-navy tabular">{day.dayNumber}</span>
                    <span className="text-lg font-bold leading-tight text-navy">
                      dez
                      <span className="block text-sm font-medium text-navy-500">{day.weekday}</span>
                    </span>
                  </div>
                  <span className="rounded-full bg-navy px-3 py-1 text-sm font-bold text-paper-50 tabular">
                    {day.endTime ? `${day.startTime === "13h40" ? "14h" : day.startTime} às ${day.endTime}` : `${day.startTime}`}
                  </span>
                </div>
                <ul className="mt-6 divide-y divide-navy/12 border-t border-navy/12">
                  {day.items
                    .filter((it) => it.challenge || it.id === "d1-inicio" || it.id === "d2-final")
                    .map((it) => (
                      <li key={it.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                        <span className="font-semibold text-navy">{it.title}</span>
                        {it.time ? (
                          <span className="text-sm font-semibold text-navy-500 tabular">{it.time}</span>
                        ) : (
                          <PendingBadge />
                        )}
                      </li>
                    ))}
                </ul>
                <Link
                  href={`/cronograma#${day.id}`}
                  className="focus-navy mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy"
                >
                  Programação completa do {day.label.toLowerCase()}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Equipes + placar */}
      <section aria-labelledby="equipes-home" className="relative overflow-hidden bg-navy py-20 text-paper-50 sm:py-28">
        <div aria-hidden className="arena-grid absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <SectionHeading
                id="equipes-home"
                tone="navy"
                kicker="Equipes"
                title="Seis cores na disputa"
                intro="Grupos definidos pela comissão, com integrantes de todas as turmas. A cor é de uso exclusivo de cada equipe nas camisetas e adereços."
              />
              <Reveal as="ul" stagger="li" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {teams.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/equipes#${t.id}`}
                      className="group flex h-full flex-col justify-between gap-6 rounded-2xl border-2 border-white/15 p-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold"
                    >
                      <span
                        aria-hidden
                        className="block h-10 w-10 rounded-full border-2 border-paper-50/70 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: t.color }}
                      />
                      <span>
                        <span className="block text-xl font-extrabold tracking-tight">{t.name}</span>
                        <span className="text-sm text-navy-300">{t.colorName}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </Reveal>
              <ButtonLink href="/equipes" variant="outline-light" className="mt-8">
                Ver equipes e integrantes
              </ButtonLink>
            </div>
            <div>
              <Scoreboard data={placar} compact />
              <p className="mt-4 text-sm text-navy-300">
                Quer entender a conta?{" "}
                <Link href="/pontuacao" className="font-semibold text-gold underline underline-offset-4">
                  Veja como funciona a pontuação
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      <GincanaBand tone="navy" />

      {/* Galeria */}
      <section aria-labelledby="memorias" className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="memorias"
              kicker="Memórias da Arena"
              title="Dois dias. Seis equipes. Muitas histórias."
              intro="Os momentos, as conquistas, os desafios e as pessoas que fizeram parte da Arena Comp 2026."
            />
            <ButtonLink href="/galeria" variant="outline">
              Ver todas as fotos
            </ButtonLink>
          </div>
          <Reveal className="mt-10">
            <GalleryTeaser />
          </Reveal>
        </Container>
      </section>

      {/* Regulamento */}
      <section aria-labelledby="regulamento-home" className="pb-20 sm:pb-28">
        <Container>
          <Reveal className="relative grid overflow-hidden rounded-[1.75rem] border-2 border-navy bg-gold md:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-10">
              <h2 id="regulamento-home" className="max-w-xl text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] text-navy sm:text-[2.6rem]">
                Antes de competir, conheça as regras
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-navy">
                O regulamento organiza o regimento por tema: participação, equipes, conduta, penalidades e recursos. O PDF
                oficial continua disponível na íntegra.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/regulamento" variant="navy">
                  <FileText aria-hidden className="size-4" />
                  Ler o regulamento
                </ButtonLink>
                <ExternalButton href={event.documents.regimento.href} download variant="outline">
                  <Download aria-hidden className="size-4" />
                  Baixar regimento (PDF)
                </ExternalButton>
              </div>
            </div>
            <Image
              src="/brand/mascote-laptop.webp"
              alt=""
              width={333}
              height={360}
              className="mx-auto -mb-1 h-56 w-auto self-end pr-6 md:h-72"
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
