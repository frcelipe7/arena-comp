import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { challenges } from "@/data/challenges";

export const metadata: Metadata = {
  title: "Desafios",
  description: "Os quatro desafios da Arena Comp 2026: Algoritmo Natural, Maratona de Programação, Perguntas e Respostas e Robótica.",
  openGraph: { title: "Desafios | Arena Comp 2026" },
};

const rows: { label: string; get: (i: number) => string }[] = [
  { label: "Quando", get: (i) => challenges[i].dayShort },
  { label: "Integrantes", get: (i) => challenges[i].facts[0].value },
  { label: "Duração", get: (i) => challenges[i].facts.find((f) => f.label.toLowerCase().includes("dura") || f.label === "Cronometrado")?.value ?? "" },
  { label: "Consulta", get: (i) => ["Não prevista no anexo", "Só anotações impressas", "Nenhuma", "Não prevista no anexo"][i] },
  { label: "Vence quem", get: (i) => ["Tem a melhor nota ponderada", "Resolve mais problemas", "Acumula mais pontos", "Tem melhor desempenho nas tarefas"][i] },
];

export default function DesafiosPage() {
  return (
    <>
      <PageHeader
        title="Desafios"
        intro="Cada grupo escolhe quem atua em cada desafio, respeitando o número de integrantes. Os enunciados, as perguntas e os percursos só são revelados na hora."
        crumbs={[{ href: "/desafios", label: "Desafios" }]}
        mascot="laptop"
      />
      <Container className="py-14 sm:py-20">
        <Reveal stagger="[data-card]" className="grid gap-4 sm:grid-cols-2">
          {challenges.map((c) => (
            <ChallengeCard key={c.slug} challenge={c} />
          ))}
        </Reveal>

        <section aria-labelledby="comparativo" className="mt-20">
          <SectionHeading id="comparativo" title="Comparativo rápido" intro="O essencial de cada desafio lado a lado. Detalhes, critérios e penalidades estão na página de cada um." />
          <div className="mt-8 overflow-x-auto rounded-[1.5rem] border-2 border-navy bg-paper-50" data-lenis-prevent>
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Comparativo dos quatro desafios</caption>
              <thead>
                <tr className="bg-navy text-paper-50">
                  <th scope="col" className="w-36 px-5 py-4 font-semibold text-gold">
                    Desafio
                  </th>
                  {challenges.map((c) => (
                    <th key={c.slug} scope="col" className="px-5 py-4 font-bold">
                      <Link href={`/desafios/${c.slug}`} className="underline decoration-gold/0 decoration-2 underline-offset-4 hover:decoration-gold">
                        {c.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-navy/12">
                    <th scope="row" className="px-5 py-4 font-semibold text-navy-500">
                      {r.label}
                    </th>
                    {challenges.map((c, i) => (
                      <td key={c.slug} className="px-5 py-4 font-medium text-navy">
                        {r.get(i)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Em todos os desafios valem as regras gerais de conduta: é proibido consultar materiais, dispositivos ou pessoas
            não autorizados pelo anexo do desafio e copiar soluções de outro grupo (art. 18).
          </p>
        </section>
      </Container>
    </>
  );
}
