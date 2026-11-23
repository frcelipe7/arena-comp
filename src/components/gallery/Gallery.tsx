"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategories, galleryDays } from "@/data/gallery";
import { teamById } from "@/data/teams";
import type { GalleryPhoto } from "@/types";
import { GalleryEmpty } from "@/components/gallery/GalleryEmpty";
import { lenisRef } from "@/components/layout/SmoothScroll";
import { useGalleryPhotos } from "@/components/gallery/useGalleryPhotos";
import { withBase } from "@/lib/base-path";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type Filter = "todos" | (typeof galleryDays)[number]["id"] | NonNullable<GalleryPhoto["category"]>;

/** URL da foto: caminhos de /public recebem o basePath; URLs do Drive ficam como estão. */
export const photoUrl = (p: GalleryPhoto, size: "thumb" | "full") => withBase(size === "thumb" ? (p.thumb ?? p.src) : p.src);

const dayLabel = (d?: string) => (d === "03/12/2026" ? "03 de dezembro" : d === "04/12/2026" ? "04 de dezembro" : null);

const filters: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos os momentos" },
  ...galleryDays.map((d) => ({ id: d.id as Filter, label: d.label })),
  ...galleryCategories.map((c) => ({ id: c.id as Filter, label: c.label })),
];

function matches(p: GalleryPhoto, f: Filter) {
  if (f === "todos") return true;
  if (f === p.day) return true;
  return p.category === f;
}

/** Galeria editorial com filtros e visualizador ampliado. */
export function Gallery() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const { photos: allPhotos, status } = useGalleryPhotos();
  const photos = useMemo(() => allPhotos.filter((p) => matches(p, filter)), [allPhotos, filter]);
  const counts = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.id, allPhotos.filter((p) => matches(p, f.id)).length])),
    [allPhotos],
  );

  useGSAP(
    () => {
      if (!photos.length) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-photo]", { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.04, ease: "power2.out" });
      });
    },
    { scope: gridRef, dependencies: [filter, allPhotos.length], revertOnUpdate: true },
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openIndex !== null && !d.open) {
      d.showModal();
      lenisRef.current?.stop();
    } else if (openIndex === null && d.open) {
      d.close();
      lenisRef.current?.start();
      lastTrigger.current?.focus();
    }
  }, [openIndex]);

  // gesto de arrastar no celular
  const touchX = useRef<number | null>(null);

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <div>
      <div role="group" aria-label="Filtrar fotos" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" data-lenis-prevent>
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={cn(
                "focus-navy flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97]",
                active ? "border-navy bg-navy text-paper-50" : "border-navy/20 bg-paper-50/70 text-navy hover:border-navy",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular",
                  active ? "bg-gold text-navy" : "bg-navy/8 text-navy-500",
                )}
              >
                {status === "loading" ? "…" : counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {photos.length} foto{photos.length === 1 ? "" : "s"} exibida{photos.length === 1 ? "" : "s"}.
      </p>

      <div ref={gridRef} className="mt-8">
        {status === "loading" && allPhotos.length === 0 ? (
          <div aria-busy="true" aria-label="Carregando fotos" className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>div]:mb-4">
            {[260, 340, 220, 300, 380, 240].map((h, i) => (
              <div key={i} className="animate-pulse break-inside-avoid rounded-2xl border-2 border-navy/10 bg-navy/8" style={{ height: h }} />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <>
            {status === "error" && (
              <p role="status" className="mb-4 text-sm text-pending">
                Não foi possível carregar as fotos agora. Tente recarregar a página em instantes.
              </p>
            )}
            <GalleryEmpty filtered={allPhotos.length > 0} />
          </>
        ) : (
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
            {photos.map((p, i) => (
              <li key={p.id} data-photo className="break-inside-avoid">
                <button
                  type="button"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setOpenIndex(i);
                  }}
                  className="focus-navy group relative block w-full overflow-hidden rounded-2xl border-2 border-navy bg-navy"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas (Drive), já redimensionadas */}
                  <img
                    src={photoUrl(p, "thumb")}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-auto min-h-24 w-full bg-navy transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  {p.caption && (
                    <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy-950/85 to-transparent p-4 pt-10 text-left text-sm font-medium text-paper-50 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      {p.caption}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        aria-label="Visualizador de fotos"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-navy-950/96 p-0 text-paper-50"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-sm text-navy-300 tabular">
                {openIndex! + 1} de {photos.length}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="grid size-11 place-items-center rounded-full border-2 border-white/25 hover:border-gold hover:text-gold"
              >
                <X className="size-5" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
              {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas (Drive) */}
              <img
                key={current.id}
                src={photoUrl(current, "full")}
                alt={current.alt}
                referrerPolicy="no-referrer"
                className="max-h-full w-auto max-w-full rounded-xl object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy/80 hover:bg-gold hover:text-navy sm:left-5"
                  >
                    <ChevronLeft className="size-6" />
                    <span className="sr-only">Foto anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy/80 hover:bg-gold hover:text-navy sm:right-5"
                  >
                    <ChevronRight className="size-6" />
                    <span className="sr-only">Próxima foto</span>
                  </button>
                </>
              )}
            </div>
            <div className="px-4 pb-6 pt-4 text-center sm:px-6">
              {current.caption && <p className="font-semibold">{current.caption}</p>}
              <p className="mt-1 text-sm text-navy-300">
                {[dayLabel(current.day), current.team && `Equipe ${teamById[current.team].name}`].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
