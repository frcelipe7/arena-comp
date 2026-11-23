"use client";

import { useEffect, useRef, useState } from "react";
import { AppImage as Image } from "@/components/ui/AppImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCORES_REFRESH_MS, dataFromSheet, type StandingsData } from "@/lib/standings-core";
import { buscarPontuacao, temPontos } from "@/lib/pontuacao-planilha.mjs";
import { teams } from "@/data/teams";
import { challenges } from "@/data/challenges";
import { maxTotal } from "@/data/scoring";
import { TeamSwatch } from "@/components/teams/TeamCard";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Placar geral. Sem pontos lançados, mostra as equipes com estado vazio. */
export function Scoreboard({ data: initial, compact = false }: { data: StandingsData; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(initial);
  const { standings } = data;
  const empty = standings.length === 0;
  const signature = standings.map((s) => `${s.team.id}:${s.total}`).join("|");

  // Consulta a planilha ao abrir a página e a cada 60 s (com a aba visível).
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const linhas = await buscarPontuacao({ fetchInit: { cache: "no-store" } });
        if (alive && temPontos(linhas)) setData(dataFromSheet(linhas, new Date().toISOString(), "planilha"));
      } catch {
        // Sem conexão com a planilha: mantém os dados atuais.
      }
    };
    refresh();
    const id = window.setInterval(refresh, SCORES_REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-row]", {
          x: -16,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
        if (!empty) {
          gsap.from("[data-bar]", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
          });
          gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
            const end = Number(el.dataset.count);
            const obj = { v: 0 };
            gsap.to(obj, {
              v: end,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v));
              },
            });
          });
        }
      });
    },
    { scope: ref, dependencies: [signature], revertOnUpdate: true },
  );

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[1.75rem] border-2 border-gold/70 bg-navy-900/90 text-paper-50 shadow-[0_24px_60px_-20px_rgb(1_22_43/0.7)]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gold">
            <span
              aria-hidden
              className={cn("size-2 rounded-full", empty ? "bg-navy-300" : "animate-pulse bg-[#ff4d4d]")}
            />
            {data.status}
          </p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Classificação geral</h3>
        </div>
        <p className="text-right text-xs text-navy-300">
          máx.
          <span className="block text-lg font-bold text-paper-50 tabular">{maxTotal}</span>
        </p>
      </div>

      <table className="w-full text-left">
        <caption className="sr-only">
          {empty ? "Classificação geral: resultados ainda não divulgados" : "Classificação geral da Arena Comp 2026"}
        </caption>
        <thead>
          <tr className="text-xs text-navy-300">
            <th scope="col" className="w-14 py-3 pl-5 font-medium sm:pl-7">
              Pos.
            </th>
            <th scope="col" className="py-3 font-medium">
              Equipe
            </th>
            {!compact &&
              challenges.map((c) => (
                <th key={c.slug} scope="col" className="hidden py-3 text-right font-medium md:table-cell">
                  {c.shortName}
                </th>
              ))}
            {!compact && (
              <th scope="col" className="hidden py-3 text-right font-medium md:table-cell">
                Bônus
              </th>
            )}
            <th scope="col" className="py-3 pr-5 text-right font-medium sm:pr-7">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {empty
            ? teams.map((t) => (
                <tr key={t.id} data-row className="border-t border-white/8">
                  <td className="py-3.5 pl-5 text-lg font-bold text-navy-300 sm:pl-7">–</td>
                  <th scope="row" className="py-3.5 font-semibold">
                    <span className="flex items-center gap-2.5">
                      <TeamSwatch team={t} className="ring-white/60" />
                      {t.name}
                    </span>
                  </th>
                  {!compact &&
                    challenges.map((c) => (
                      <td key={c.slug} className="hidden py-3.5 text-right text-navy-300 md:table-cell">
                        –
                      </td>
                    ))}
                  {!compact && <td className="hidden py-3.5 text-right text-navy-300 md:table-cell">–</td>}
                  <td className="py-3.5 pr-5 text-right font-bold text-navy-300 tabular sm:pr-7">–</td>
                </tr>
              ))
            : standings.map((s) => (
                <tr key={s.team.id} data-row className={cn("border-t border-white/8", s.position === 1 && "bg-gold/10")}>
                  <td className={cn("py-3.5 pl-5 text-lg font-extrabold tabular sm:pl-7", s.position <= 3 ? "text-gold" : "text-paper-100")}>
                    {s.position}º
                  </td>
                  <th scope="row" className="py-3.5 pr-3 font-semibold">
                    <span className="flex items-center gap-2.5">
                      <TeamSwatch team={s.team} className="ring-white/60" />
                      {s.team.name}
                    </span>
                    <span aria-hidden className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
                      <span
                        data-bar
                        className="block h-full rounded-full bg-gold"
                        style={{ width: `${Math.min(100, (Math.max(0, s.total) / maxTotal) * 100)}%` }}
                      />
                    </span>
                  </th>
                  {!compact &&
                    challenges.map((c) => (
                      <td key={c.slug} className="hidden py-3.5 text-right tabular md:table-cell">
                        {s.byChallenge[c.slug] ?? "–"}
                      </td>
                    ))}
                  {!compact && <td className="hidden py-3.5 text-right tabular md:table-cell">{s.bonus ?? "–"}</td>}
                  <td className="py-3.5 pr-5 text-right text-xl font-extrabold tabular sm:pr-7">
                    <span data-count={s.total}>{s.total}</span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {empty && (
        <div className="flex items-center gap-4 border-t border-white/10 bg-navy/60 px-5 py-5 sm:px-7">
          <Image src="/brand/mascote-face-3.webp" alt="" width={215} height={195} className="h-14 w-auto shrink-0" />
          <p className="text-sm leading-relaxed text-navy-300">
            <span className="font-semibold text-paper-50">A classificação será divulgada durante a competição.</span> O
            placar é atualizado pela comissão organizadora ao fim de cada desafio.
          </p>
        </div>
      )}
    </div>
  );
}
