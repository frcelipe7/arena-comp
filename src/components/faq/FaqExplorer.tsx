"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/AppImage";
import { ArrowUpRight, Search } from "lucide-react";
import { faq } from "@/data/faq";
import { AccordionItem } from "@/components/ui/Accordion";
import { cn, normalize } from "@/lib/utils";

export function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("todas");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // Abre a pergunta indicada na URL (ex.: /faq#ia).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setOpenIds(new Set([id]));
  }, []);

  const q = normalize(query);
  const groups = useMemo(
    () =>
      faq
        .filter((c) => category === "todas" || c.id === category)
        .map((c) => ({
          ...c,
          items: c.items.filter((i) => !q || normalize(i.question + " " + i.answer.join(" ")).includes(q)),
        }))
        .filter((c) => c.items.length > 0),
    [q, category],
  );
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const setOpen = (id: string, open: boolean) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <label htmlFor="faq-search" className="text-sm font-semibold text-navy">
          Procurar uma dúvida
        </label>
        <div className="relative mt-2">
          <Search aria-hidden className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-500" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: internet, nota, atraso"
            className="focus-navy h-12 w-full rounded-full border-2 border-navy/20 bg-paper-50 pl-10 pr-4 text-base text-navy outline-none transition-colors placeholder:text-navy-500/70 focus:border-navy"
          />
        </div>
        <div role="group" aria-label="Categorias" className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:px-0" data-lenis-prevent>
          {[{ id: "todas", title: "Todas" }, ...faq].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "focus-navy shrink-0 rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors lg:rounded-xl",
                category === c.id ? "bg-navy text-paper-50" : "bg-paper-50/60 text-navy hover:bg-navy/8",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-navy-500" aria-live="polite">
          {total} pergunta{total === 1 ? "" : "s"}
        </p>
      </aside>

      <div className="min-w-0">
        {groups.length === 0 ? (
          <div className="flex items-start gap-4 rounded-2xl border-2 border-dashed border-navy/30 p-6">
            <Image src="/brand/mascote-face-3.webp" alt="" width={215} height={195} className="h-16 w-auto shrink-0" />
            <div>
              <p className="font-semibold text-navy">Nenhuma pergunta encontrada para “{query}”.</p>
              <p className="mt-1 text-sm text-ink-soft">
                Tente outra palavra. Casos não previstos no regimento são resolvidos pela comissão organizadora: fale com o
                líder do seu grupo.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.id} aria-labelledby={`faq-${g.id}`}>
                <h2 id={`faq-${g.id}`} className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                  {g.title}
                </h2>
                <div className="mt-3 border-t-2 border-navy">
                  {g.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      id={item.id}
                      title={item.question}
                      open={Boolean(q) || openIds.has(item.id)}
                      onToggle={(o) => setOpen(item.id, o)}
                    >
                      <div className="space-y-3 text-base leading-relaxed text-ink-soft">
                        {item.answer.map((a) => (
                          <p key={a}>{a}</p>
                        ))}
                      </div>
                      {item.links && (
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                          {item.links.map((l) => (
                            <Link
                              key={l.href}
                              href={l.href}
                              className="focus-navy inline-flex items-center gap-1 text-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy"
                            >
                              {l.label}
                              <ArrowUpRight aria-hidden className="size-4" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </AccordionItem>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
