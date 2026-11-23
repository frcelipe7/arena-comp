import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AccordionItem } from "@/components/ui/Accordion";
import { Container, Notice } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { TeamChip } from "@/components/teams/TeamCard";
import { challengeBySlug, challenges, quizRounds } from "@/data/challenges";
import { teamById } from "@/data/teams";
import type { ChallengeSlug } from "@/types";

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = challengeBySlug[slug as ChallengeSlug];
  if (!c) return {};
  return {
    title: c.name,
    description: `${c.description} ${c.facts.map((f) => `${f.label}: ${f.value}`).join(". ")}.`,
    openGraph: { title: `${c.name} | Arena Comp 2026`, description: c.tagline },
  };
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="scroll-mt-28 border-t-2 border-navy pt-8">
      <h2 id={`${id}-t`} className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 leading-relaxed text-ink">
          <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-gold-700" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function DesafioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = challengeBySlug[slug as ChallengeSlug];
  if (!c) notFound();

  const idx = challenges.findIndex((x) => x.slug === c.slug);
  const prev = challenges[idx - 1];
  const next = challenges[idx + 1];

  const toc = [
    { id: "formato", label: "Formato" },
    { id: "regras", label: "Regras" },
    ...(c.extraSections?.map((s) => ({ id: s.id, label: s.title.split(":")[0] })) ?? []),
    ...(c.slug === "perguntas-e-respostas" ? [{ id: "confrontos", label: "Confrontos" }] : []),
    { id: "criterios", label: "Avaliação e pontuação" },
    { id: "penalidades", label: "Penalidades" },
    ...(c.materials ? [{ id: "materiais", label: "Materiais" }] : []),
    { id: "preparacao", label: "Como se preparar" },
  ];

  return (
    <>
      <PageHeader
        title={c.name}
        intro={c.description}
        crumbs={[
          { href: "/desafios", label: "Desafios" },
          { href: `/desafios/${c.slug}`, label: c.name },
        ]}
        mascot={c.slug === "maratona" ? "laptop" : c.slug === "perguntas-e-respostas" ? "face-2" : c.slug === "robotica" ? "face-3" : "face-1"}
      >
        <p className="mt-6 inline-flex rounded-full bg-gold px-3 py-1 text-sm font-semibold text-navy">
          Desafio {c.order} · {c.annex} · {c.day}
        </p>
      </PageHeader>

      {/* Fatos principais: sempre visíveis */}
      <div className="border-b-2 border-navy bg-paper-50/80">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {c.facts.map((f, i) => (
              <div key={f.label} className={`py-6 ${i % 2 === 1 ? "pl-5" : "pr-5"} lg:px-6 ${i > 0 ? "lg:border-l-2 lg:border-navy/12" : "lg:pl-0"} ${i < 2 ? "max-lg:border-b-2 max-lg:border-navy/12" : ""} ${i % 2 === 1 ? "max-lg:border-l-2 max-lg:border-navy/12" : ""}`}>
                <dt className="text-sm font-medium text-navy-500">{f.label}</dt>
                <dd className="mt-1 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="Nesta página" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="text-sm font-semibold text-navy-500">Nesta página</p>
            <ul className="mt-3 space-y-1 border-l-2 border-navy/15">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm font-medium text-navy hover:border-gold">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-14">
            <Reveal className="rounded-[1.5rem] border-2 border-navy bg-navy p-6 text-paper-50 sm:p-8">
              <p className="text-sm font-semibold text-gold">Objetivo</p>
              <p className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{c.objective}</p>
            </Reveal>

            <Block id="formato" title="Formato">
              <List items={c.format} />
            </Block>

            <Block id="regras" title="Regras">
              <List items={c.rules} />
              {c.slug === "maratona" && (
                <Notice className="mt-6">
                  A proibição de inteligência artificial generativa é expressa neste desafio. Nos demais, valem as regras
                  específicas de cada anexo.
                </Notice>
              )}
            </Block>

            {c.extraSections?.map((s) => (
              <Block key={s.id} id={s.id} title={s.title}>
                {s.body?.map((p) => (
                  <p key={p} className="mb-5 max-w-prose leading-relaxed text-ink">
                    {p}
                  </p>
                ))}
                <div className="border-t-2 border-navy/80">
                  {s.steps?.map((st, i) => (
                    <AccordionItem key={st.title} title={`Etapa ${i + 1}: ${st.title}`} defaultOpen={i === 0}>
                      <ol className="list-decimal space-y-2 pl-5 leading-relaxed text-ink marker:font-semibold marker:text-navy-500">
                        {st.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ol>
                    </AccordionItem>
                  ))}
                </div>
                {s.items && (
                  <div className="mt-6 rounded-2xl bg-paper-50 p-5">
                    <h3 className="font-semibold text-navy">Estratégias que podem ser usadas</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {s.items.map((it) => (
                        <li key={it} className="rounded-full border border-navy/20 bg-white/70 px-3 py-1 text-sm text-navy">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Block>
            ))}

            {c.slug === "perguntas-e-respostas" && (
              <Block id="confrontos" title="Confrontos das cinco rodadas">
                <p className="mb-6 max-w-prose text-ink-soft">
                  Sequência definida pela organização. Cada duelo tem 3 perguntas de 10 pontos.
                </p>
                <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {quizRounds.map((r) => (
                    <li key={r.round} className="rounded-2xl border-2 border-navy bg-paper-50 p-5">
                      <h3 className="text-sm font-bold text-navy-500">Rodada {r.round}</h3>
                      <ul className="mt-3 space-y-2.5">
                        {r.duels.map(([a, b]) => (
                          <li key={a + b} className="flex items-center justify-between gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm text-navy">
                            <TeamChip team={teamById[a]} />
                            <span className="text-xs font-bold text-gold-700">×</span>
                            <TeamChip team={teamById[b]} className="flex-row-reverse" />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Block>
            )}

            <Block id="criterios" title="Avaliação e pontuação">
              <div className="overflow-hidden rounded-2xl border-2 border-navy">
                <table className="w-full text-left text-sm sm:text-base">
                  <caption className="sr-only">Critérios de avaliação</caption>
                  <thead className="bg-navy text-paper-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Critério
                      </th>
                      {c.criteria.some((x) => x.weight) && (
                        <th scope="col" className="px-4 py-3 text-right font-semibold">
                          Peso
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-paper-50">
                    {c.criteria.map((cr) => (
                      <tr key={cr.name} className="border-t border-navy/12 align-top">
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-navy">{cr.name}</span>
                          <span className="mt-0.5 block text-sm text-ink-soft">{cr.description}</span>
                        </td>
                        {cr.weight && <td className="px-4 py-3.5 text-right text-xl font-extrabold text-navy tabular">{cr.weight}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {c.criteriaNote && <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">{c.criteriaNote}</p>}

              {c.scoringTable && (
                <div className="mt-8 overflow-hidden rounded-2xl border-2 border-navy">
                  <table className="w-full text-left text-sm sm:text-base">
                    <caption className="bg-gold px-4 py-3 text-left font-semibold text-navy">Pontuação interna por pergunta</caption>
                    <tbody className="bg-paper-50">
                      {c.scoringTable.map((s) => (
                        <tr key={s.situation} className="border-t border-navy/12">
                          <th scope="row" className="px-4 py-3.5 font-medium text-navy">
                            {s.situation}
                          </th>
                          <td className="whitespace-nowrap px-4 py-3.5 text-right font-extrabold text-navy tabular">{s.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6">
                <List items={c.scoring} />
              </div>

              {c.tiebreak && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-navy">Desempate, nesta ordem</h3>
                  <ol className="mt-3 space-y-2">
                    {c.tiebreak.map((t, i) => (
                      <li key={t} className="flex gap-3 leading-relaxed">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-paper-50">{i + 1}</span>
                        <span className="pt-0.5">{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <p className="mt-6 text-sm">
                <Link href="/pontuacao" className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">
                  Como os desafios formam a classificação geral
                </Link>
              </p>
            </Block>

            <Block id="penalidades" title="Penalidades">
              <List items={c.penalties} />
            </Block>

            {c.materials && (
              <Block id="materiais" title="Materiais permitidos">
                <div className="grid gap-4 md:grid-cols-2">
                  {c.materials.map((m) => (
                    <div key={m.title} className="rounded-2xl border-2 border-navy bg-paper-50 p-5">
                      <h3 className="font-bold text-navy">{m.title}</h3>
                      <ul className="mt-3 space-y-1.5 text-sm text-ink">
                        {m.items.map((it) => (
                          <li key={it} className="flex gap-2">
                            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-700" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            <Block id="preparacao" title="Como se preparar">
              {c.topics && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-navy">{c.slug === "perguntas-e-respostas" ? "Temas" : c.slug === "robotica" ? "O que estudar antes" : "Conteúdos cobrados"}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {c.topics.map((t) => (
                      <li key={t} className="rounded-full bg-navy px-3.5 py-1.5 text-sm font-medium text-paper-50">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <List items={c.preparation} />
              {c.practiceLinks && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {c.practiceLinks.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-navy inline-flex items-center gap-2 rounded-full border-2 border-navy px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-paper-50"
                    >
                      Treinar no {l.label}
                      <ExternalLink aria-hidden className="size-3.5" />
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  ))}
                </div>
              )}
            </Block>

            <nav aria-label="Outros desafios" className="grid gap-3 border-t-2 border-navy pt-8 sm:grid-cols-2">
              {prev ? (
                <Link href={`/desafios/${prev.slug}`} className="focus-navy group rounded-2xl border-2 border-navy/20 p-5 transition-colors hover:border-navy">
                  <span className="flex items-center gap-1.5 text-sm text-navy-500">
                    <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" /> Desafio anterior
                  </span>
                  <span className="mt-1 block text-lg font-bold text-navy">{prev.name}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/desafios/${next.slug}`} className="focus-navy group rounded-2xl border-2 border-navy/20 p-5 text-right transition-colors hover:border-navy">
                  <span className="flex items-center justify-end gap-1.5 text-sm text-navy-500">
                    Próximo desafio <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-1 block text-lg font-bold text-navy">{next.name}</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </Container>
    </>
  );
}
