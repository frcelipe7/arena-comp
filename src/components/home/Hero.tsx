"use client";

import { useRef } from "react";
import { AppImage as Image } from "@/components/ui/AppImage";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import { event } from "@/data/event";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { Countdown } from "@/components/home/Countdown";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Única sequência de entrada orquestrada do portal.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from("[data-hero='word']", { yPercent: 105, duration: 1.05, stagger: 0.09 })
          .from("[data-hero='year']", { autoAlpha: 0, x: -20, duration: 0.7 }, "-=0.6")
          .from("[data-hero='crescent']", { rotate: -120, autoAlpha: 0, duration: 1.3, ease: "expo.out" }, 0.1)
          .from("[data-hero='mascot']", { y: 80, autoAlpha: 0, duration: 1.1, ease: "back.out(1.4)" }, 0.35)
          .from("[data-hero='fade']", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.07 }, "-=0.8");

        // flutuação leve do troféu
        gsap.to("[data-hero='mascot-img']", {
          y: -8,
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4,
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} aria-labelledby="hero-title" className="on-paper relative overflow-hidden">
      <Container className="relative grid items-center gap-6 pb-14 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6 lg:pb-20">
        <div className="relative z-10">
          <div data-hero="fade" className="flex items-center gap-3">
            <Image src="/brand/uepa-logo.webp" alt="UEPA, Universidade do Estado do Pará" width={339} height={146} className="h-9 w-auto sm:h-10" priority />
            <span aria-hidden className="h-8 w-0.5 bg-navy" />
            <p className="text-sm font-bold leading-tight text-navy">
              {event.campusAlt}
              <span className="block font-medium text-navy-500">{event.course}</span>
            </p>
          </div>

          <h1 id="hero-title" className="mt-8 sm:mt-10">
            <span className="sr-only">Arena Comp 2026</span>
            <span aria-hidden className="display inline-flex flex-col text-[clamp(4.4rem,16vw,9.5rem)]">
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-hero="word" className="block text-navy">
                  Arena
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero="word" className="block text-gold [text-shadow:0_3px_0_var(--color-navy)]">
                  Comp
                </span>
              </span>
              <span
                data-hero="year"
                className="-mt-[0.02em] self-end text-[clamp(1.7rem,4.6vw,3rem)] font-extrabold tracking-[-0.03em] text-navy"
              >
                2026
              </span>
            </span>
          </h1>

          <p data-hero="fade" className="mt-6 max-w-[34ch] text-lg font-medium leading-snug text-navy sm:text-xl">
            {event.tagline}
          </p>

          <dl data-hero="fade" className="mt-8 grid max-w-xl grid-cols-2 overflow-hidden rounded-2xl border-2 border-navy bg-paper-50/80 shadow-[0_4px_0_0_var(--color-navy)]">
            <div className="border-r-2 border-navy p-4">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-navy-500">
                <CalendarDays aria-hidden className="size-3.5" /> Dia 1, quinta
              </dt>
              <dd className="mt-1">
                <span className="block text-3xl font-extrabold tracking-tight text-navy">03 dez</span>
                <span className="text-sm font-semibold text-navy">a partir das 19h30</span>
              </dd>
            </div>
            <div className="p-4">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-navy-500">
                <CalendarDays aria-hidden className="size-3.5" /> Dia 2, sexta
              </dt>
              <dd className="mt-1">
                <span className="block text-3xl font-extrabold tracking-tight text-navy">04 dez</span>
                <span className="text-sm font-semibold text-navy">das 14h às 17h</span>
              </dd>
            </div>
            <div className="col-span-2 flex items-center gap-2 border-t-2 border-navy bg-navy px-4 py-3 text-sm font-medium text-paper-50">
              <MapPin aria-hidden className="size-4 shrink-0 text-gold" />
              {event.location}
            </div>
          </dl>

          <div data-hero="fade" className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/cronograma" variant="navy">
              Consultar programação
            </ButtonLink>
            <ButtonLink href="/equipes" variant="outline">
              Conhecer as equipes
            </ButtonLink>
          </div>

          <p data-hero="fade" className="mt-6 flex items-start gap-2 text-sm text-navy">
            <Timer aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-700" />
            <Countdown />
          </p>
        </div>

        {/* Composição do mascote: crescente dourado inspirado no emblema */}
        <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[28rem] lg:max-w-none">
          <div
            data-hero="crescent"
            className="absolute inset-[4%] rounded-full border-[clamp(18px,4vw,34px)] border-gold [clip-path:polygon(0_0,58%_0,42%_100%,0_100%)]"
          />
          <div className="absolute inset-[13%] rounded-full bg-navy" />
          <div className="arena-grid absolute inset-[13%] rounded-full opacity-70" />
          <div className="absolute inset-x-[6%] bottom-[8%] h-[16%] rounded-[50%] bg-navy-950/25 blur-xl" />
          <div data-hero="mascot" className="absolute inset-x-[8%] bottom-[2%] top-[4%]">
            <div data-hero="mascot-img" className="relative h-full w-full">
              <Image
                src="/brand/mascote-trofeu.webp"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="-scale-x-100 object-contain object-bottom drop-shadow-[0_10px_0_rgb(2_36_66/0.12)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
