#!/usr/bin/env node
/**
 * Baixa a tabela "PontuacaoEquipes" (aba "Página1") e salva uma cópia em
 * src/data/pontuacao-planilha.json (placar inicial do build e reserva).
 * Roda antes de `npm run build`.
 *
 * Uso: npm run pontuacao [-- --ver]
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { PLANILHA_PADRAO, buscarPontuacao, temPontos, urlCsv } from "../src/lib/pontuacao-planilha.mjs";

const id = process.env.PONTUACAO_SHEET_ID || PLANILHA_PADRAO.id;
const aba = process.env.PONTUACAO_ABA || PLANILHA_PADRAO.aba;
const soVer = process.argv.includes("--ver");
const tolerante = process.argv.includes("--tolerante");

console.log(`Lendo "${PLANILHA_PADRAO.tabela}" em "${aba}"…\n${urlCsv(id, aba)}\n`);

try {
  const linhas = await buscarPontuacao({ id, aba });
  const f = (v) => (v === null ? "–" : String(v));
  console.table(
    linhas.map((l) => ({
      Equipe: l.equipe,
      Algoritmo: f(l.algoritmoNatural),
      Maratona: f(l.maratona),
      "Torta na Cara": f(l.perguntasERespostas),
      Robótica: f(l.robotica),
      Bônus: f(l.bonus),
      Total: f(l.total),
    })),
  );
  console.log(temPontos(linhas) ? "Há pontos lançados." : "Nenhum ponto lançado ainda: o placar mostra o estado vazio.");

  if (!soVer) {
    const destino = path.resolve("src/data/pontuacao-planilha.json");
    const dados = { atualizadoEm: new Date().toISOString(), planilha: id, aba, linhas };
    await writeFile(destino, JSON.stringify(dados, null, 2) + "\n", "utf8");
    console.log(`\nCópia salva em ${path.relative(process.cwd(), destino)}`);
  }
} catch (err) {
  console.error(`Erro: ${err instanceof Error ? err.message : err}`);
  if (tolerante) console.warn("Seguindo com a última cópia salva em src/data/pontuacao-planilha.json.");
  else process.exit(1);
}
