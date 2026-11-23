import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Respostas rápidas sobre datas, equipes, desafios, pontuação, nota extra e regras da Arena Comp 2026.",
  openGraph: { title: "Perguntas frequentes | Arena Comp 2026" },
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Dúvidas frequentes"
        intro="Respostas diretas, com base no regimento e nas datas atualizadas. Antes de perguntar no grupo, procure aqui."
        crumbs={[{ href: "/faq", label: "Dúvidas" }]}
        mascot="face-2"
      />
      <Container className="py-14 sm:py-20">
        <FaqExplorer />
      </Container>
    </>
  );
}
