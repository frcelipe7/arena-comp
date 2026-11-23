import "server-only";
import { results, resultsStatus } from "@/data/results";
import snapshot from "@/data/pontuacao-planilha.json";
import { temPontos, type LinhaPontuacao } from "@/lib/pontuacao-planilha.mjs";
import { EMPTY_STANDINGS, dataFromSheet, standingsFromResultsFile, type StandingsData } from "@/lib/standings-core";

export type { Standing, StandingsData } from "@/lib/standings-core";

/**
 * Placar inicial gravado no HTML no build (cópia salva por scripts/pontuacao.mjs).
 * No navegador, o Scoreboard atualiza direto pela planilha.
 */
export async function getStandings(): Promise<StandingsData> {
  const linhas = snapshot.linhas as LinhaPontuacao[];
  if (temPontos(linhas)) return dataFromSheet(linhas, snapshot.atualizadoEm, "copia");

  if (results.length > 0) {
    return { standings: standingsFromResultsFile(), source: "arquivo", status: resultsStatus ?? "Resultados oficiais", updatedAt: null };
  }
  return EMPTY_STANDINGS;
}
