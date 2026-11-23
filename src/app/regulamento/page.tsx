import type { Metadata } from "next";
import { Download, ExternalLink, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AccordionItem } from "@/components/ui/Accordion";
import { Container, ExternalButton, Notice } from "@/components/ui/primitives";
import { ruleChapters } from "@/data/rules";
import { event } from "@/data/event";

export const metadata: Metadata = {
  title: "Regulamento",
  description: "Principais regras da Arena Comp 2026 organizadas por tema e o regimento oficial em PDF para download.",
  openGraph: { title: "Regulamento | Arena Comp 2026" },
};

const highlights = [
  { title: "Participação facultativa", text: "Quem não participa não tem prejuízo na nota regular nem na frequência.", href: "#evento" },
  { title: "Equipes definitivas", text: "Troca só com autorização expressa da comissão e justificativa formal.", href: "#participantes" },
  { title: "Líder e vice-líder", text: "Indicados em até 5 dias corridos após a divulgação da lista.", href: "#participantes" },
  { title: "Tolerância de 10 minutos", text: "Depois disso, o grupo é considerado ausente no desafio, com pontuação zero.", href: "#data-local" },
  { title: "Sem cópia de soluções", text: "Copiar ou compartilhar respostas durante a prova é conduta vedada.", href: "#conduta" },
  { title: "Recurso em 20 minutos", text: "Por escrito, pelo líder ou vice-líder, após a divulgação de cada resultado.", href: "#recursos" },
];

export default function RegulamentoPage() {
  const { regimento, divulgacao } = event.documents;
  return (
    <>
      <PageHeader
        title="Regulamento"
        intro="As regras do regimento organizadas por tema. Esta página facilita a consulta, mas não substitui o documento oficial, que continua disponível na íntegra."
        crumbs={[{ href: "/regulamento", label: "Regulamento" }]}
        mascot="face-3"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ExternalButton href={regimento.href} download>
            <Download aria-hidden className="size-4" />
            Baixar regimento (PDF, {regimento.size})
          </ExternalButton>
          <ExternalButton href={regimento.href} target="_blank" rel="noopener" variant="outline-light">
            <ExternalLink aria-hidden className="size-4" />
            Abrir em nova aba
          </ExternalButton>
        </div>
      </PageHeader>

      <Container className="py-14 sm:py-20">
        <Notice tone="pending" className="max-w-3xl">
          <strong className="font-semibold">Datas atualizadas:</strong> o PDF do regimento foi publicado com as datas
          originais (26 e 27 de novembro, das 14h às 17h). Prevalecem as novas datas: <strong>03 de dezembro, a partir
          das 19h30</strong>, e <strong>04 de dezembro, das 14h às 17h</strong>. As demais regras continuam valendo.
        </Notice>

        <section aria-labelledby="essencial" className="mt-14">
          <h2 id="essencial" className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            O essencial
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h) => (
              <li key={h.title}>
                <a href={h.href} className="focus-navy group block h-full rounded-2xl border-2 border-navy bg-paper-50 p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_var(--color-navy)]">
                  <p className="text-lg font-bold text-navy">{h.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{h.text}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
          <nav aria-label="Capítulos" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="text-sm font-semibold text-navy-500">Capítulos</p>
            <ul className="mt-3 space-y-1 border-l-2 border-navy/15">
              {ruleChapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm font-medium leading-snug text-navy hover:border-gold">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t-2 border-navy">
            {ruleChapters.map((ch, i) => (
              <AccordionItem
                key={ch.id}
                id={ch.id}
                headingLevel="h2"
                defaultOpen={i < 2}
                title={
                  <span>
                    <span className="block text-sm font-medium text-navy-500">{ch.chapter}</span>
                    <span className="text-xl font-extrabold tracking-tight sm:text-2xl">{ch.title}</span>
                  </span>
                }
              >
                <dl className="space-y-5">
                  {ch.articles.map((a) => (
                    <div key={a.ref} className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
                      <dt className="text-sm font-bold text-navy">{a.ref}</dt>
                      <dd className="leading-relaxed text-ink">
                        {a.text}
                        {a.items && (
                          <ol className="mt-2 list-[upper-roman] space-y-1 pl-6 marker:text-navy-500">
                            {a.items.map((it) => (
                              <li key={it}>{it}</li>
                            ))}
                          </ol>
                        )}
                        {a.updated && <p className="mt-2 text-sm font-medium text-pending">{a.updated}</p>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </AccordionItem>
            ))}
          </div>
        </div>

        <section aria-labelledby="docs" className="mt-20">
          <h2 id="docs" className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Documentos oficiais
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { ...regimento, desc: "Regimento completo com os anexos I a V: desafios, critérios, materiais e grupos." },
              { ...divulgacao, desc: "Arte de chamamento da gincana, para compartilhar com a turma." },
            ].map((d) => (
              <li key={d.href} className="flex flex-col rounded-[1.5rem] border-2 border-navy bg-paper-50 p-6">
                <FileText aria-hidden className="size-8 text-gold-700" />
                <h3 className="mt-4 text-xl font-bold text-navy">{d.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{d.desc}</p>
                <p className="mt-2 text-sm text-navy-500">
                  PDF, {d.pages} páginas, {d.size}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ExternalButton href={d.href} download variant="navy">
                    <Download aria-hidden className="size-4" />
                    Baixar
                  </ExternalButton>
                  <ExternalButton href={d.href} target="_blank" rel="noopener" variant="outline">
                    Abrir
                  </ExternalButton>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="comissao" className="mt-16">
          <h2 id="comissao" className="text-lg font-bold text-navy">
            Comissão organizadora
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {event.committee.map((p) => (
              <li key={p.name}>
                <span className="block font-semibold text-navy">{p.name}</span>
                <span className="text-navy-500">{p.role}</span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
