// Classificação geral (arts. 13 a 16). Roda no build e no navegador.
import { challenges } from "@/data/challenges";
import { results, resultsStatus } from "@/data/results";
import { pointsForPlace } from "@/data/scoring";
import { teamById, teams } from "@/data/teams";
import type { LinhaPontuacao } from "@/lib/pontuacao-planilha.mjs";
import { normalize } from "@/lib/utils";
import type { ChallengeSlug, Team } from "@/types";

/** Intervalo de atualização do placar no navegador (milissegundos). */
export const SCORES_REFRESH_MS = 60_000;

export interface Standing {
  team: Team;
  /** Pontos de cada desafio; null = ainda não lançado. */
  byChallenge: Record<ChallengeSlug, number | null>;
  bonus: number | null;
  penalty: number;
  total: number;
  position: number;
}

export interface StandingsData {
  standings: Standing[];
  /** De onde vieram os números. */
  source: "planilha" | "copia" | "arquivo" | "vazio";
  /** Texto curto exibido no placar. */
  status: string;
  updatedAt: string | null;
}

const tiebreakOrder: (ChallengeSlug | "bonus")[] = ["maratona", "robotica", "perguntas-e-respostas", "algoritmo-natural", "bonus"];

const fieldBySlug: Record<ChallengeSlug, keyof LinhaPontuacao> = {
  "algoritmo-natural": "algoritmoNatural",
  maratona: "maratona",
  "perguntas-e-respostas": "perguntasERespostas",
  robotica: "robotica",
};

/** Ordena pelo total e aplica o desempate do art. 16. */
function rank(rows: Omit<Standing, "position">[]): Standing[] {
  const v = (r: Omit<Standing, "position">, k: ChallengeSlug | "bonus") => (k === "bonus" ? r.bonus : r.byChallenge[k]) ?? 0;
  return [...rows]
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      for (const k of tiebreakOrder) if (v(b, k) !== v(a, k)) return v(b, k) - v(a, k);
      return 0; // empate persiste: sorteio público (art. 16, VI)
    })
    .map((r, i) => ({ ...r, position: i + 1 }));
}

/** Associa o nome escrito na planilha à equipe (aceita nome ou cor). */
function findTeam(nome: string): Team | undefined {
  const n = normalize(nome);
  return teams.find((t) => n === t.id || n === normalize(t.name) || n === normalize(t.colorName) || n.includes(t.id));
}

export function standingsFromSheet(linhas: LinhaPontuacao[]): Standing[] {
  const rows: Omit<Standing, "position">[] = [];
  for (const l of linhas) {
    const team = findTeam(l.equipe);
    if (!team) continue;
    const byChallenge = Object.fromEntries(
      challenges.map((c) => [c.slug, l[fieldBySlug[c.slug]] as number | null]),
    ) as Record<ChallengeSlug, number | null>;
    const penalty = l.penalidade ?? 0;
    const soma = Object.values(byChallenge).reduce<number>((a, b) => a + (b ?? 0), 0) + (l.bonus ?? 0) - penalty;
    rows.push({ team, byChallenge, bonus: l.bonus, penalty, total: l.total ?? soma });
  }
  return rank(rows);
}

export function standingsFromResultsFile(): Standing[] {
  return rank(
    results.map((r) => {
      const byChallenge = Object.fromEntries(
        challenges.map((c) => [c.slug, r.placements[c.slug] ? pointsForPlace(r.placements[c.slug]) : null]),
      ) as Record<ChallengeSlug, number | null>;
      const bonus = r.bonus ? Math.min(10, r.bonus.uniform ?? 0) + Math.min(10, r.bonus.chant ?? 0) : null;
      const penalty = r.penalty ?? 0;
      const total = Object.values(byChallenge).reduce<number>((a, b) => a + (b ?? 0), 0) + (bonus ?? 0) - penalty;
      return { team: teamById[r.team], byChallenge, bonus, penalty, total };
    }),
  );
}

export function updatedLabel(iso: string) {
  const when = new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Belem",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return resultsStatus ?? `Atualizado em ${when}`;
}

/** Monta os dados do placar a partir das linhas da planilha. */
export function dataFromSheet(linhas: LinhaPontuacao[], updatedAt: string, source: "planilha" | "copia"): StandingsData {
  return { standings: standingsFromSheet(linhas), source, status: updatedLabel(updatedAt), updatedAt };
}

export const EMPTY_STANDINGS: StandingsData = { standings: [], source: "vazio", status: "Aguardando o início", updatedAt: null };
