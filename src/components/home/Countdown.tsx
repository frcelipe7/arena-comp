"use client";

import { useEffect, useState } from "react";
import { event } from "@/data/event";

function diff(target: number) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return { d, h, m };
}

/** Contagem regressiva até o início (03/12, 19h30, horário de Belém). */
export function Countdown() {
  const target = new Date(event.startsAt).getTime();
  const [left, setLeft] = useState<ReturnType<typeof diff> | undefined>(undefined);

  useEffect(() => {
    setLeft(diff(target));
    const id = window.setInterval(() => setLeft(diff(target)), 30_000);
    return () => window.clearInterval(id);
  }, [target]);

  if (left === undefined) return <span className="inline-block h-6" aria-hidden />;
  if (left === null) {
    const endOfEvent = new Date("2026-12-04T17:00:00-03:00").getTime();
    return <span>{Date.now() < endOfEvent ? "A Arena está acontecendo agora." : "A Arena Comp 2026 foi encerrada. Veja os resultados."}</span>;
  }

  const unit = (n: number, s: string, p: string) => (
    <span className="whitespace-nowrap">
      <span className="font-extrabold tabular">{n}</span> {n === 1 ? s : p}
    </span>
  );

  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span>Faltam</span>
      {unit(left.d, "dia", "dias")}
      {unit(left.h, "hora", "horas")}
      <span>e</span>
      {unit(left.m, "minuto", "minutos")}
    </span>
  );
}
