import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { TeamCard } from "@/components/teams/TeamCard";
import { Scoreboard } from "@/components/scoreboard/Scoreboard";
import { getStandings } from "@/lib/standings";
import { Container, Notice, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { teams } from "@/data/teams";

export const metadata: Metadata = {
  title: "Equipes",
  description: "As seis equipes da Arena Comp 2026: Grace, Pressman, Kurose, Turing, Sommerville e Ada. Cores, líderes, integrantes e classificação geral.",
  openGraph: { title: "Equipes | Arena Comp 2026" },
};

export default async function EquipesPage() {
  const placar = await getStandings();
  return (
    <>
      <PageHeader
        title="Equipes"
        intro="Seis grupos definidos pela comissão organizadora, com integrantes de todas as turmas. Encontre a sua equipe e a sua cor."
        crumbs={[{ href: "/equipes", label: "Equipes" }]}
        mascot="face-1"
      >
        <nav aria-label="Ir para a equipe" className="mt-8 flex flex-wrap gap-2">
          {teams.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="flex items-center gap-2 rounded-full border-2 border-paper/25 py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-paper-50 transition-colors hover:border-gold"
            >
              <span aria-hidden className="size-5 rounded-full border-2 border-paper-50/70" style={{ backgroundColor: t.color }} />
              {t.name}
            </a>
          ))}
        </nav>
      </PageHeader>

      <Container className="py-14 sm:py-20">
        <Notice className="max-w-3xl">
          A composição das equipes é definitiva: não é permitido trocar de grupo, salvo autorização expressa da comissão
          mediante justificativa formal. Cada grupo indica um líder e um vice-líder em até 5 dias corridos após a
          divulgação da lista.{" "}
          <Link href="/regulamento#participantes" className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">
            Ver regras dos grupos
          </Link>
        </Notice>

        <Reveal stagger="article" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </Reveal>
      </Container>

      <section id="classificacao" aria-labelledby="classificacao-titulo" className="relative scroll-mt-20 overflow-hidden bg-navy py-20 text-paper-50 sm:py-24">
        <div aria-hidden className="arena-grid absolute inset-0" />
        <Container className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            id="classificacao-titulo"
            tone="navy"
            kicker="Placar"
            title="Classificação geral"
            intro="Soma dos pontos dos quatro desafios mais a bonificação Identidade e Torcida, até 420 pontos. Os resultados aparecem aqui assim que divulgados pela comissão."
          />
          <Scoreboard data={placar} />
        </Container>
      </section>
    </>
  );
}
