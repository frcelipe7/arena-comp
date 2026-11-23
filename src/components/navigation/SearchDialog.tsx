"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppImage as Image } from "@/components/ui/AppImage";
import { CornerDownLeft, Search, X } from "lucide-react";
import { search, searchSuggestions, type SearchEntry } from "@/lib/search";
import { lenisRef } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

const kindStyle: Record<SearchEntry["kind"], string> = {
  Equipe: "bg-gold text-navy",
  Integrante: "bg-gold-300 text-navy",
  Desafio: "bg-navy text-paper-50",
  Regra: "bg-paper-300 text-navy",
  Horário: "bg-navy-700 text-paper-50",
  Pontuação: "bg-gold/30 text-navy",
  Dúvida: "bg-paper-100 text-navy border border-navy/20",
  Página: "bg-white text-navy border border-navy/20",
};

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lenisRef.current?.stop();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) lenisRef.current?.start();
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (entry: SearchEntry) => {
    onClose();
    setQuery("");
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="Buscar no portal"
      className="m-0 mx-auto mt-[max(1rem,8vh)] w-[min(100%-2rem,44rem)] max-w-none overflow-visible bg-transparent p-0 text-navy backdrop:bg-transparent"
    >
      <div className="on-paper overflow-hidden rounded-3xl border-2 border-navy bg-paper-50 shadow-[0_6px_0_0_var(--color-navy)]">
        <div className="flex items-center gap-3 border-b-2 border-navy/10 px-4 sm:px-5">
          <Search aria-hidden className="size-5 shrink-0 text-navy-500" strokeWidth={2.5} />
          <label htmlFor="global-search" className="sr-only">
            Buscar equipes, desafios, regras, horários e pontuação
          </label>
          <input
            ref={inputRef}
            id="global-search"
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Busque por equipe, desafio, regra, horário..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results.length ? `sr-${results[active]?.id}` : undefined}
            className="h-16 w-full bg-transparent text-base font-medium text-navy outline-none placeholder:text-navy-500/70 sm:text-lg"
          />
          <button
            type="button"
            onClick={onClose}
            className="focus-navy grid size-9 shrink-0 place-items-center rounded-full text-navy-500 hover:bg-navy/8 hover:text-navy"
          >
            <X className="size-5" />
            <span className="sr-only">Fechar busca</span>
          </button>
        </div>

        <div className="max-h-[min(60vh,32rem)] overflow-y-auto overscroll-contain" data-lenis-prevent>
          {query.trim() === "" ? (
            <div className="p-5">
              <p className="text-sm font-semibold text-navy-500">Experimente buscar</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {searchSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      inputRef.current?.focus();
                    }}
                    className="focus-navy rounded-full border border-navy/20 bg-white/70 px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-navy hover:bg-navy hover:text-paper-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="flex items-center gap-4 p-6">
              <Image src="/brand/mascote-face-3.webp" alt="" width={64} height={60} className="shrink-0" />
              <div>
                <p className="font-semibold">Nada encontrado para “{query}”.</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Tente outro termo, como o nome de uma equipe ou desafio. Se a dúvida não está no portal, fale com a comissão organizadora.
                </p>
              </div>
            </div>
          ) : (
            <ul id="search-results" ref={listRef} role="listbox" aria-label="Resultados" className="p-2">
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`sr-${r.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 transition-colors",
                    i === active ? "bg-navy text-paper-50" : "hover:bg-navy/5",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[0.7rem] font-bold",
                      i === active ? "bg-gold text-navy" : kindStyle[r.kind],
                    )}
                  >
                    {r.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{r.title}</span>
                    <span className={cn("mt-0.5 line-clamp-2 block text-sm", i === active ? "text-navy-300" : "text-ink-soft")}>
                      {r.excerpt}
                    </span>
                  </span>
                  {i === active && <CornerDownLeft aria-hidden className="mt-1 hidden size-4 shrink-0 text-gold sm:block" />}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="hidden items-center gap-4 border-t-2 border-navy/10 px-5 py-2.5 text-xs text-navy-500 sm:flex">
          <span>
            <kbd className="rounded border border-navy/20 bg-white px-1.5 font-sans">↑</kbd>{" "}
            <kbd className="rounded border border-navy/20 bg-white px-1.5 font-sans">↓</kbd> navegar
          </span>
          <span>
            <kbd className="rounded border border-navy/20 bg-white px-1.5 font-sans">Enter</kbd> abrir
          </span>
          <span>
            <kbd className="rounded border border-navy/20 bg-white px-1.5 font-sans">Esc</kbd> fechar
          </span>
          <span className="ml-auto">{query && `${results.length} resultado${results.length === 1 ? "" : "s"}`}</span>
        </div>
      </div>
    </dialog>
  );
}
