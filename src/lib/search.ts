import { challenges } from "@/data/challenges";
import { event } from "@/data/event";
import { faq } from "@/data/faq";
import { ruleChapters } from "@/data/rules";
import { schedule } from "@/data/schedule";
import { bonus, n2Conversion, placementPoints } from "@/data/scoring";
import { teams } from "@/data/teams";
import { normalize } from "@/lib/utils";

export type SearchKind = "Equipe" | "Desafio" | "Regra" | "Horário" | "Pontuação" | "Dúvida" | "Integrante" | "Página";

export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: string;
  excerpt: string;
  href: string;
  keywords?: string;
}

function build(): SearchEntry[] {
  const entries: SearchEntry[] = [
    { id: "p-cronograma", kind: "Página", title: "Cronograma", excerpt: "Programação dos dias 03 e 04 de dezembro.", href: "/cronograma", keywords: "programacao horario agenda data" },
    { id: "p-equipes", kind: "Página", title: "Equipes", excerpt: "As seis equipes, cores, líderes e integrantes.", href: "/equipes", keywords: "times grupos cor" },
    { id: "p-pontuacao", kind: "Página", title: "Pontuação e classificação", excerpt: "Pontos por colocação, bonificação, desempate e nota extra.", href: "/pontuacao", keywords: "placar ranking nota n2" },
    { id: "p-regulamento", kind: "Página", title: "Regulamento", excerpt: "Regras principais e PDF oficial do regimento.", href: "/regulamento", keywords: "regimento edital pdf download" },
    { id: "p-galeria", kind: "Página", title: "Galeria", excerpt: "Memórias da Arena: fotos da competição.", href: "/galeria", keywords: "fotos imagens memorias" },
    { id: "p-local", kind: "Página", title: "Local do evento", excerpt: event.location, href: "/#inicio", keywords: "onde endereco campus parauapebas uepa" },
  ];

  for (const t of teams) {
    entries.push({
      id: `team-${t.id}`,
      kind: "Equipe",
      title: `Equipe ${t.name}`,
      excerpt: `Equipe de cor ${t.colorName.toLowerCase()}${t.members.length ? `, ${t.members.length} integrantes` : ""}.`,
      href: `/equipes#${t.id}`,
      keywords: `${t.colorName} ${t.namesake.person}`,
    });
    const people = [
      t.leader && { name: t.leader.name, role: "Líder" },
      t.viceLeader && { name: t.viceLeader.name, role: "Vice-líder" },
      ...t.members
        .filter((m) => m.name !== t.leader?.name && m.name !== t.viceLeader?.name)
        .map((m) => ({ name: m.name, role: "Integrante" })),
    ].filter(Boolean) as { name: string; role: string }[];
    for (const p of people) {
      entries.push({
        id: `member-${t.id}-${p.name}`,
        kind: "Integrante",
        title: p.name,
        excerpt: `${p.role}, equipe ${t.name} (${t.colorName.toLowerCase()})`,
        href: `/equipes#${t.id}`,
      });
    }
  }

  for (const c of challenges) {
    entries.push({
      id: `ch-${c.slug}`,
      kind: "Desafio",
      title: c.name,
      excerpt: c.tagline,
      href: `/desafios/${c.slug}`,
      keywords: `${c.shortName} ${c.facts.map((f) => f.value + " " + f.label).join(" ")} ${(c.topics ?? []).join(" ")}`,
    });
    c.rules.forEach((r, i) =>
      entries.push({ id: `ch-${c.slug}-r${i}`, kind: "Regra", title: `${c.name}: regra`, excerpt: r, href: `/desafios/${c.slug}#regras` }),
    );
    c.penalties.forEach((r, i) =>
      entries.push({ id: `ch-${c.slug}-p${i}`, kind: "Regra", title: `${c.name}: penalidade`, excerpt: r, href: `/desafios/${c.slug}#penalidades` }),
    );
    c.format.forEach((r, i) =>
      entries.push({ id: `ch-${c.slug}-f${i}`, kind: "Desafio", title: `${c.name}: formato`, excerpt: r, href: `/desafios/${c.slug}#formato` }),
    );
    c.criteria.forEach((r, i) =>
      entries.push({
        id: `ch-${c.slug}-c${i}`,
        kind: "Pontuação",
        title: `${c.name}: ${r.name}${r.weight ? ` (${r.weight})` : ""}`,
        excerpt: r.description,
        href: `/desafios/${c.slug}#criterios`,
      }),
    );
    c.materials?.forEach((m, i) =>
      entries.push({ id: `ch-${c.slug}-m${i}`, kind: "Regra", title: `${c.name}: materiais (${m.title.toLowerCase()})`, excerpt: m.items.join(", "), href: `/desafios/${c.slug}#materiais` }),
    );
  }

  for (const day of schedule) {
    for (const item of day.items) {
      entries.push({
        id: `sch-${item.id}`,
        kind: "Horário",
        title: item.title,
        excerpt: `${day.dayNumber} de dezembro, ${item.time ?? "horário a confirmar"}`,
        href: `/cronograma#${item.id}`,
        keywords: day.weekday,
      });
    }
  }

  entries.push(
    {
      id: "sc-placement",
      kind: "Pontuação",
      title: "Pontos por colocação",
      excerpt: placementPoints.map((p) => `${p.place}º: ${p.points}`).join(", "),
      href: "/pontuacao#colocacao",
      keywords: "primeiro lugar 100 pontos",
    },
    {
      id: "sc-bonus",
      kind: "Pontuação",
      title: "Bonificação Identidade e Torcida",
      excerpt: bonus.items.map((b) => `${b.name}: até ${b.max}`).join("; "),
      href: "/pontuacao#bonificacao",
      keywords: "grito de guerra camiseta uniforme",
    },
    {
      id: "sc-n2",
      kind: "Pontuação",
      title: "Nota extra na N2",
      excerpt: n2Conversion.map((p) => `${p.place}º: ${p.extra}`).join(", "),
      href: "/pontuacao#nota-extra",
      keywords: "nota extra n2 ponto",
    },
    { id: "sc-total", kind: "Pontuação", title: "Pontuação máxima: 420 pontos", excerpt: "Quatro desafios (400) mais bonificação (20).", href: "/pontuacao" },
  );

  for (const ch of ruleChapters) {
    for (const a of ch.articles) {
      entries.push({
        id: `rule-${ch.id}-${a.ref}`,
        kind: "Regra",
        title: `${a.ref}, ${ch.title.toLowerCase()}`,
        excerpt: a.text + (a.items ? " " + a.items.join(" ") : ""),
        href: `/regulamento#${ch.id}`,
      });
    }
  }

  for (const cat of faq) {
    for (const q of cat.items) {
      entries.push({ id: `faq-${q.id}`, kind: "Dúvida", title: q.question, excerpt: q.answer.join(" "), href: `/faq#${q.id}` });
    }
  }

  return entries;
}

const index = build().map((e) => ({
  entry: e,
  title: normalize(e.title),
  hay: normalize(`${e.title} ${e.excerpt} ${e.keywords ?? ""} ${e.kind}`),
}));

export function search(query: string, limit = 24): SearchEntry[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const item of index) {
    if (!terms.every((t) => item.hay.includes(t))) continue;
    let s = 0;
    if (item.title.startsWith(q)) s += 50;
    if (item.title.includes(q)) s += 25;
    for (const t of terms) if (item.title.includes(t)) s += 8;
    if (["Equipe", "Desafio", "Página", "Integrante"].includes(item.entry.kind)) s += 6;
    scored.push({ e: item.entry, s });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}

export const searchSuggestions = ["Python", "Turing", "torta", "13h40", "internet", "N2", "robô sumô", "recurso"];
