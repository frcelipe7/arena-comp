import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Gallery } from "@/components/gallery/Gallery";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Memórias da Arena",
  description: "Registros fotográficos oficiais da Arena Comp 2026: desafios, equipes, premiação e bastidores.",
  openGraph: { title: "Memórias da Arena | Arena Comp 2026" },
};

export default function GaleriaPage() {
  return (
    <>
      <PageHeader
        kicker="Memórias da Arena"
        title="Dois dias. Seis equipes. Muitas histórias."
        intro="Os momentos, as conquistas, os desafios e as pessoas que fizeram parte da Arena Comp 2026. Confira os registros da nossa competição."
        crumbs={[{ href: "/galeria", label: "Galeria" }]}
        mascot="face-1"
      />
      <Container className="py-14 sm:py-20">
        <Gallery />
      </Container>
    </>
  );
}
