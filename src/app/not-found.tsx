import { AppImage as Image } from "@/components/ui/AppImage";
import { ButtonLink, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-6 py-24 sm:py-32">
      <Image src="/brand/mascote-face-3.webp" alt="" width={215} height={195} className="h-24 w-auto" />
      <h1 className="text-4xl font-extrabold tracking-tight text-navy sm:text-6xl">Página não encontrada</h1>
      <p className="max-w-lg text-lg text-ink-soft">
        O endereço pode ter mudado. Use a busca no topo ou volte para o início para encontrar cronograma, equipes e regras.
      </p>
      <ButtonLink href="/" variant="navy">
        Voltar para o início
      </ButtonLink>
    </Container>
  );
}
