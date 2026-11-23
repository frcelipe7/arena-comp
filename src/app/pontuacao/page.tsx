import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Shirt } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Scoreboard } from "@/components/scoreboard/Scoreboard";
import { getStandings } from "@/lib/standings";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { bonus, generalTiebreak, maxTotal, n2Conversion, n2Rules, placementPoints } from "@/data/scoring";
import { challenges } from "@/data/challenges";

export const metadata: Metadata = {
  title: "Pontuação e classificação",
  description: "Pontos por colocação, bonificação Identidade e Torcida, critérios de desempate e conversão em nota extra na N2 da Arena Comp 2026.",
  openGraph: { title: "Pontuação | Arena Comp 2026" },
};

export default async function PontuacaoPage() {
  const placar = await getStandings();
  return (
    <>
      <PageHeader
        title="Pontuação"
        intro={`Cada desafio vale de 30 a 100 pontos pela colocação. Com a bonificação, uma equipe pode somar até ${maxTotal} pontos, e a classificação final vira nota extra na N2.`}
        crumbs={[{ href: "/pontuacao", label: "Pontuação" }]}
        mascot="trofeu"
      />

      {/* A conta */}
      <section aria-labelledby="conta" className="py-14 sm:py-20">
        <Container>
          <h2 id="conta" className="sr-only">
            Como a pontuação geral é calculada
          </h2>
          <Reveal stagger="[data-term]" className="flex flex-wrap items-stretch gap-3 text-navy">
            {challenges.map((c, i) => (
              <div key={c.slug} data-term className="flex items-center gap-3">
                <div className="rounded-2xl border-2 border-navy bg-paper-50 px-4 py-3">
                  <p className="text-xs font-medium text-navy-500">{c.name}</p>
                  <p className="text-2xl font-extrabold tabular">até 100</p>
                </div>
                <span aria-hidden className="text-2xl font-extrabold text-gold-700">
                  {i < challenges.length - 1 ? "+" : "+"}
                </span>
              </div>
            ))}
            <div data-term className="flex items-center gap-3">
              <div className="rounded-2xl border-2 border-navy bg-paper-50 px-4 py-3">
                <p className="text-xs font-medium text-navy-500">Identidade e Torcida</p>
                <p className="text-2xl font-extrabold tabular">até 20</p>
              </div>
              <span aria-hidden className="text-2xl font-extrabold text-gold-700">
                =
              </span>
            </div>
            <div data-term className="rounded-2xl border-2 border-navy bg-gold px-5 py-3 shadow-[0_4px_0_0_var(--color-navy)]">
              <p className="text-xs font-semibold">Máximo</p>
              <p className="text-2xl font-extrabold tabular">{maxTotal} pontos</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="grid gap-16 pb-20 lg:grid-cols-2 lg:gap-12">
        <section id="colocacao" aria-labelledby="colocacao-t" className="scroll-mt-28">
          <SectionHeading id="colocacao-t" title="Pontos por colocação" intro="Vale para cada um dos quatro desafios (art. 13)." />
          <ol className="mt-8 space-y-2">
            {placementPoints.map((p) => (
              <li key={p.place} className="grid grid-cols-[3.5rem_1fr_4rem] items-center gap-4">
                <span className="text-2xl font-extrabold text-navy tabular">{p.place}º</span>
                <span aria-hidden className="h-4 overflow-hidden rounded-full bg-navy/10">
                  <span className="block h-full rounded-full bg-navy" style={{ width: `${p.points}%` }} />
                </span>
                <span className="text-right text-xl font-extrabold text-navy tabular">{p.points}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="bonificacao" aria-labelledby="bonificacao-t" className="scroll-mt-28">
          <SectionHeading id="bonificacao-t" title="Bonificação Identidade e Torcida" intro={`Até ${bonus.max} pontos extras (art. 14), avaliados por ${bonus.criteria.join(", ")}.`} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {bonus.items.map((b, i) => {
              const Icon = i === 0 ? Shirt : Megaphone;
              return (
                <div key={b.name} className="rounded-2xl border-2 border-navy bg-paper-50 p-5">
                  <Icon aria-hidden className="size-6 text-gold-700" />
                  <p className="mt-4 text-4xl font-extrabold tracking-tight text-navy tabular">até {b.max}</p>
                  <p className="mt-1 font-medium text-navy">{b.name}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            O grito de guerra é autoral, dura no máximo 1 minuto e é apresentado na abertura do primeiro dia. Camisetas na
            cor e com o nome da equipe.{" "}
            <Link href="/regulamento#identidade" className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">
              Regras de identidade visual
            </Link>
          </p>
        </section>
      </Container>

      <section id="desempate" aria-labelledby="desempate-t" className="scroll-mt-20 border-y-2 border-navy bg-paper-50/70 py-16 sm:py-20">
        <Container>
          <SectionHeading id="desempate-t" title="Desempate da classificação geral" intro="Se duas equipes empatarem no total, os critérios são aplicados um após o outro, nesta ordem (art. 16)." />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {generalTiebreak.map((t, i) => (
              <li key={t.label} className="flex items-start gap-4 rounded-2xl border-2 border-navy/15 bg-paper-50 p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-base font-extrabold text-gold tabular">{i + 1}</span>
                <span className="pt-1 font-medium leading-snug text-navy">{t.label}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="nota-extra" aria-labelledby="nota-t" className="scroll-mt-20 py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading id="nota-t" title="Nota extra na N2" intro="A classificação final do grupo é convertida em até 1,0 ponto extra na Nota 2, somado à nota regular (art. 17)." />
            <ul className="mt-8 space-y-3">
              {n2Rules.map((r) => (
                <li key={r} className="flex gap-3 leading-relaxed text-ink">
                  <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-gold-700" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border-2 border-navy self-start">
            <table className="w-full text-left">
              <caption className="bg-navy px-5 py-4 text-left text-lg font-bold text-paper-50">Conversão da classificação final</caption>
              <thead>
                <tr className="bg-paper-100 text-sm text-navy-500">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Colocação
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Presente nos 2 dias
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Só 1 dia (50%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-paper-50">
                {n2Conversion.map((n) => (
                  <tr key={n.place} className="border-t border-navy/12">
                    <th scope="row" className="px-5 py-3.5 text-lg font-extrabold text-navy tabular">
                      {n.place}º lugar
                    </th>
                    <td className="px-5 py-3.5 text-right text-lg font-extrabold text-navy tabular">+{n.extra}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-navy-500 tabular">
                      +{(Number(n.extra.replace(",", ".")) / 2).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section aria-labelledby="placar-t" className="relative overflow-hidden bg-navy py-20 text-paper-50">
        <div aria-hidden className="arena-grid absolute inset-0" />
        <Container className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading id="placar-t" tone="navy" kicker="Placar" title="Classificação geral" intro="O placar soma os pontos automaticamente assim que a comissão divulga o resultado de cada desafio." />
          <Scoreboard data={placar} />
        </Container>
      </section>
    </>
  );
}
