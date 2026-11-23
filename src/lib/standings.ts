import "server-only";
import { results, resultsStatus } from "@/data/results";
import snapshot from "@/data/pontuacao-planilha.json";
import { temPontos, type LinhaPontuacao } from "@/lib/pontuacao-planilha.mjs";
import { EMPTY_STANDINGS, dataFromSheet, standingsFromResultsFile, type StandingsData } from "@/lib/standings-core";

export type { Standing, StandingsData } from "@/lib/standings-core";

/**
 * Dados INICIAIS do placar, gravados no HTML durante o `npm run build`.
 *
 * O build roda antes `scripts/pontuacao.mjs` (etapa "prebuild"), que baixa a
 * planilha e atualiza src/data/pontuacao-planilha.json. Depois de carregada,
 * a página consulta a planilha direto do navegador a cada 60 s (Scoreboard),
 * então o site estático fica atualizado sem precisar de novo build.
 *
 * Prioridade: cópia da planilha → src/data/results.ts → vazio.
 */
export async function getStandings(): Promise<StandingsData> {
  const linhas = snapshot.linhas as LinhaPontuacao[];
  if (temPontos(linhas)) return dataFromSheet(linhas, snapshot.atualizadoEm, "copia");

  if (results.length > 0) {
    return { standings: standingsFromResultsFile(), source: "arquivo", status: resultsStatus ?? "Resultados oficiais", updatedAt: null };
  }
  return EMPTY_STANDINGS;
}
