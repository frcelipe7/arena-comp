import { AppImage as Image } from "@/components/ui/AppImage";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";

interface PageHeaderProps {
  title: ReactNode;
  kicker?: string;
  intro?: ReactNode;
  crumbs?: { href: string; label: string }[];
  mascot?: "face-1" | "face-2" | "face-3" | "trofeu" | "laptop";
  children?: ReactNode;
}

const mascotSrc = {
  "face-1": { src: "/brand/mascote-face-1.webp", w: 207, h: 199 },
  "face-2": { src: "/brand/mascote-face-2.webp", w: 208, h: 203 },
  "face-3": { src: "/brand/mascote-face-3.webp", w: 215, h: 195 },
  trofeu: { src: "/brand/mascote-trofeu.webp", w: 397, h: 464 },
  laptop: { src: "/brand/mascote-laptop.webp", w: 333, h: 360 },
};

/** Cabeçalho das páginas internas. */
export function PageHeader({ title, kicker, intro, crumbs = [], mascot, children }: PageHeaderProps) {
  const m = mascot ? mascotSrc[mascot] : null;
  const big = mascot === "trofeu" || mascot === "laptop";
  return (
    <section className="relative overflow-hidden border-b-2 border-navy bg-navy text-paper-50">
      <div aria-hidden className="arena-grid absolute inset-0" />
      <div
        aria-hidden
        className="absolute -right-24 -top-24 size-[26rem] rounded-full border-[28px] border-gold/90 [clip-path:inset(0_50%_0_0)] sm:-right-10"
      />
      <Container className="relative pb-12 pt-8 sm:pb-16 sm:pt-12">
        <nav aria-label="Você está em" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-300">
            <li>
              <Link href="/" className="hover:text-gold">
                Início
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                <ChevronRight aria-hidden className="size-3.5" />
                <Link href={c.href} className="hover:text-gold">
                  {c.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-3xl">
            {kicker && <p className="mb-3 text-lg font-bold text-gold">{kicker}</p>}
            <h1 className="text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{title}</h1>
            {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-300 sm:text-lg">{intro}</p>}
            {children}
          </div>
          {m && (
            <Image
              src={m.src}
              alt=""
              width={m.w}
              height={m.h}
              priority
              className={big ? "hidden h-52 w-auto shrink-0 md:block lg:h-64" : "hidden h-28 w-auto shrink-0 sm:block lg:h-36"}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
