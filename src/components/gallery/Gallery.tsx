"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Check, CheckSquare, ChevronLeft, ChevronRight, Download, ExternalLink, Loader2, X } from "lucide-react";
import { galleryCategories, galleryDays, galleryDriveFolderUrl } from "@/data/gallery";
import { teamById } from "@/data/teams";
import type { GalleryPhoto } from "@/types";
import { GalleryEmpty } from "@/components/gallery/GalleryEmpty";
import { lenisRef } from "@/components/layout/SmoothScroll";
import { useGalleryPhotos } from "@/components/gallery/useGalleryPhotos";
import { downloadPhoto, downloadZip, type ZipProgress } from "@/lib/photo-download";
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

const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

/* ------------------------------------------------------------------ */
/* Estado dos downloads                                                */
/* ------------------------------------------------------------------ */

type DownloadState =
  | { kind: "idle" }
  | { kind: "single"; id: string }
  | { kind: "zip"; progress: ZipProgress }
  | { kind: "done"; message: string; tone: "ok" | "warn" | "error" };

function useDownloads() {
  const [state, setState] = useState<DownloadState>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const busy = state.kind === "single" || state.kind === "zip";

  const finish = useCallback((message: string, tone: "ok" | "warn" | "error") => {
    setState({ kind: "done", message, tone });
    window.setTimeout(() => setState((s) => (s.kind === "done" ? { kind: "idle" } : s)), 6000);
  }, []);

  const one = useCallback(
    async (p: GalleryPhoto) => {
      setState({ kind: "single", id: p.id });
      try {
        await downloadPhoto(p);
        finish("Download da foto iniciado.", "ok");
      } catch {
        finish("Não foi possível baixar a foto. Tente novamente em instantes.", "error");
      }
    },
    [finish],
  );

  const many = useCallback(
    async (list: GalleryPhoto[], zipName: string) => {
      if (list.length === 1) return one(list[0]);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const result = await downloadZip(list, zipName, (progress) => setState({ kind: "zip", progress }), ctrl.signal);
        finish(
          result.failed
            ? `Arquivo .zip pronto. ${plural(result.failed, "foto não pôde", "fotos não puderam")} ser incluída${result.failed === 1 ? "" : "s"}.`
            : `Arquivo .zip com ${plural(result.total, "foto", "fotos")} pronto.`,
          result.failed ? "warn" : "ok",
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") finish("Download cancelado.", "warn");
        else finish("Não foi possível gerar o arquivo .zip. Tente novamente em instantes.", "error");
      } finally {
        abortRef.current = null;
      }
    },
    [finish, one],
  );

  const cancel = useCallback(() => abortRef.current?.abort(), []);
  return { state, busy, one, many, cancel };
}

function DownloadStatus({ state, onCancel, className }: { state: DownloadState; onCancel: () => void; className?: string }) {
  if (state.kind === "idle") return <p role="status" aria-live="polite" className="sr-only" />;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-medium shadow-[0_10px_30px_-10px_rgb(1_22_43/0.6)]",
        state.kind === "done" && state.tone === "error"
          ? "border-pending bg-paper-50 text-[#7a3510]"
          : "border-navy bg-navy text-paper-50",
        className,
      )}
    >
      {state.kind === "single" && (
        <>
          <Loader2 aria-hidden className="size-4 animate-spin text-gold" />
          Preparando o download…
        </>
      )}
      {state.kind === "zip" && (
        <>
          <Loader2 aria-hidden className="size-4 shrink-0 animate-spin text-gold" />
          <span className="min-w-0">
            Juntando as fotos no .zip: <span className="tabular">{state.progress.done} de {state.progress.total}</span>
            <span aria-hidden className="mt-1.5 block h-1 w-40 overflow-hidden rounded-full bg-white/15">
              <span
                className="block h-full rounded-full bg-gold transition-[width] duration-300"
                style={{ width: `${(state.progress.done / Math.max(1, state.progress.total)) * 100}%` }}
              />
            </span>
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto rounded-full border border-white/30 px-3 py-1 text-xs font-semibold hover:border-gold hover:text-gold"
          >
            Cancelar
          </button>
        </>
      )}
      {state.kind === "done" && (
        <>
          {state.tone !== "error" && <Check aria-hidden className="size-4 shrink-0 text-gold" />}
          {state.message}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Galeria                                                             */
/* ------------------------------------------------------------------ */

/** Galeria editorial com filtros, seleção, download e visualizador ampliado. */
export function Gallery() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const downloads = useDownloads();

  const { photos: allPhotos, status } = useGalleryPhotos();
  const photos = useMemo(() => allPhotos.filter((p) => matches(p, filter)), [allPhotos, filter]);
  const counts = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.id, allPhotos.filter((p) => matches(p, f.id)).length])),
    [allPhotos],
  );
  const selectedPhotos = useMemo(() => allPhotos.filter((p) => selected.has(p.id)), [allPhotos, selected]);
  const allVisibleSelected = photos.length > 0 && photos.every((p) => selected.has(p.id));
  const filterLabel = filters.find((f) => f.id === filter)?.label ?? "";
  const zipNameForFilter = `arena-comp-2026-${filter === "todos" ? "todas-as-fotos" : filterLabel.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")}.zip`;

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

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) photos.forEach((p) => next.delete(p.id));
      else photos.forEach((p) => next.add(p.id));
      return next;
    });

  const exitSelection = () => {
    setSelecting(false);
    setSelected(new Set());
  };

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
  const dialogOpen = openIndex !== null;

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
              <span className={cn("rounded-full px-1.5 text-xs tabular", active ? "bg-gold text-navy" : "bg-navy/8 text-navy-500")}>
                {status === "loading" ? "…" : counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ações de download */}
      {photos.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 border-y-2 border-navy/10 py-3">
          <p className="mr-auto text-sm text-navy-500">
            {selecting ? "Toque nas fotos para selecionar." : plural(photos.length, "foto", "fotos")}
          </p>
          <button
            type="button"
            aria-pressed={selecting}
            onClick={() => (selecting ? exitSelection() : setSelecting(true))}
            className={cn(
              "focus-navy inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
              selecting ? "border-navy bg-navy text-paper-50" : "border-navy/25 text-navy hover:border-navy",
            )}
          >
            <CheckSquare aria-hidden className="size-4" />
            {selecting ? "Cancelar seleção" : "Selecionar"}
          </button>
          <button
            type="button"
            disabled={downloads.busy}
            onClick={() => downloads.many(photos, zipNameForFilter)}
            className="focus-navy inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-navy shadow-[0_2px_0_0_var(--color-navy)] transition-[background-color,transform] hover:bg-gold-300 active:translate-y-[2px] active:shadow-none disabled:opacity-60"
          >
            <Download aria-hidden className="size-4" />
            {filter === "todos" ? "Baixar todas" : "Baixar desta categoria"} ({photos.length})
          </button>
          {allPhotos.some((p) => p.download?.includes("google")) && (
            <a
              href={galleryDriveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-navy inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy"
            >
              Abrir no Google Drive
              <ExternalLink aria-hidden className="size-3.5" />
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {photos.length} foto{photos.length === 1 ? "" : "s"} exibida{photos.length === 1 ? "" : "s"}.
        {selecting && ` ${plural(selected.size, "foto selecionada", "fotos selecionadas")}.`}
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
            {photos.map((p, i) => {
              const isSelected = selected.has(p.id);
              return (
                <li key={p.id} data-photo className="break-inside-avoid">
                  <button
                    type="button"
                    aria-pressed={selecting ? isSelected : undefined}
                    aria-label={selecting ? `${isSelected ? "Desmarcar" : "Selecionar"}: ${p.alt}` : `Ampliar: ${p.alt}`}
                    onClick={(e) => {
                      if (selecting) return toggle(p.id);
                      lastTrigger.current = e.currentTarget;
                      setOpenIndex(i);
                    }}
                    className={cn(
                      "focus-navy group relative block w-full overflow-hidden rounded-2xl border-2 bg-navy transition-[border-color,box-shadow] duration-200",
                      isSelected ? "border-gold shadow-[0_0_0_3px_var(--color-gold)]" : "border-navy",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas (Drive), já redimensionadas */}
                    <img
                      src={photoUrl(p, "thumb")}
                      alt=""
                      width={p.width}
                      height={p.height}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={cn(
                        "h-auto min-h-24 w-full bg-navy transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)]",
                        !selecting && "group-hover:scale-[1.03]",
                        selecting && !isSelected && "opacity-80",
                      )}
                    />
                    {selecting && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-3 top-3 grid size-8 place-items-center rounded-full border-2 transition-colors",
                          isSelected ? "border-navy bg-gold text-navy" : "border-white bg-navy/50 text-transparent",
                        )}
                      >
                        <Check className="size-4" strokeWidth={3} />
                      </span>
                    )}
                    {p.caption && !selecting && (
                      <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy-950/85 to-transparent p-4 pt-10 text-left text-sm font-medium text-paper-50 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        {p.caption}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Barra fixa da seleção + status dos downloads (fora do visualizador) */}
      {!dialogOpen && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-2 px-4">
          <DownloadStatus state={downloads.state} onCancel={downloads.cancel} />
          {selecting && (
            <div
              role="toolbar"
              aria-label="Fotos selecionadas"
              className="pointer-events-auto flex w-full max-w-xl flex-wrap items-center gap-2 rounded-2xl border-2 border-gold bg-navy p-2 pl-4 text-paper-50 shadow-[0_16px_40px_-12px_rgb(1_22_43/0.7)]"
            >
              <p className="mr-auto text-sm font-semibold tabular">{plural(selected.size, "selecionada", "selecionadas")}</p>
              <button
                type="button"
                onClick={selectAllVisible}
                className="min-h-10 rounded-full px-3 text-sm font-semibold text-paper-100 hover:text-gold"
              >
                {allVisibleSelected ? "Limpar" : "Selecionar todas"}
              </button>
              <button
                type="button"
                disabled={selected.size === 0 || downloads.busy}
                onClick={() => downloads.many(selectedPhotos, "arena-comp-2026-selecao.zip")}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-navy hover:bg-gold-300 disabled:opacity-50"
              >
                <Download aria-hidden className="size-4" />
                Baixar{selected.size > 0 && ` (${selected.size})`}
              </button>
              <button
                type="button"
                onClick={exitSelection}
                className="grid size-10 place-items-center rounded-full text-paper-100 hover:bg-white/10"
              >
                <X aria-hidden className="size-5" />
                <span className="sr-only">Sair da seleção</span>
              </button>
            </div>
          )}
        </div>
      )}

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
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
              <p className="mr-auto text-sm text-navy-300 tabular">
                {openIndex! + 1} de {photos.length}
              </p>
              <button
                type="button"
                disabled={downloads.busy}
                onClick={() => downloads.one(current)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-navy hover:bg-gold-300 disabled:opacity-60"
              >
                {downloads.state.kind === "single" && downloads.state.id === current.id ? (
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                ) : (
                  <Download aria-hidden className="size-4" />
                )}
                Baixar foto
              </button>
              {photos.length > 1 && (
                <button
                  type="button"
                  disabled={downloads.busy}
                  onClick={() => downloads.many(photos, zipNameForFilter)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white/25 px-4 text-sm font-semibold hover:border-gold hover:text-gold disabled:opacity-60"
                >
                  <Download aria-hidden className="size-4" />
                  <span className="hidden sm:inline">Baixar todas</span>
                  <span className="sm:hidden">Todas</span> ({photos.length})
                </button>
              )}
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
            {/* status dos downloads dentro do visualizador (o dialog fica por cima do resto da página) */}
            <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4">
              <DownloadStatus state={downloads.state} onCancel={downloads.cancel} />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
