// Leitura da tabela "PontuacaoEquipes" (aba "Página1") da planilha de pontuação.
// Módulo em JavaScript puro para ser usado tanto pelo site (src/lib/standings.ts)
// quanto pelo script de linha de comando (scripts/pontuacao.mjs).

export const PLANILHA_PADRAO = {
  id: "1o72KYbuZCXk2Et7BlNabak5INelt-ijhAcuwkGIqhzE",
  aba: "Página1",
  tabela: "PontuacaoEquipes",
};

/**
 * URL pública de exportação em CSV (funciona com a planilha em "qualquer pessoa com o link pode ver").
 * @param {string} id
 * @param {string} aba
 */
export function urlCsv(id, aba) {
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(aba)}`;
}

/** @param {string} s */
function normalizar(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * CSV simples com aspas duplas (formato do Google Sheets).
 * @param {string} texto
 * @returns {string[][]}
 */
export function lerCsv(texto) {
  /** @type {string[][]} */
  const linhas = [];
  /** @type {string[]} */
  let linha = [];
  let campo = "";
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") {
      linha.push(campo);
      campo = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
    } else campo += c;
  }
  if (campo !== "" || linha.length) {
    linha.push(campo);
    linhas.push(linha);
  }
  return linhas;
}

/** Colunas reconhecidas no cabeçalho da tabela. */
const COLUNAS = /** @type {const} */ ({
  equipe: ["equipes", "equipe", "time", "grupo"],
  "algoritmo-natural": ["algoritmo", "algoritmo natural"],
  maratona: ["maratona", "maratona de programacao"],
  "perguntas-e-respostas": ["torta na cara", "perguntas e respostas", "perguntas"],
  robotica: ["robotica"],
  bonus: ["bonus", "identidade e torcida", "bonificacao"],
  penalidade: ["penalidade", "penalidades", "desconto", "descontos"],
  total: ["total"],
});

/**
 * Converte "100", "80,5" ou "" em número (ou null quando vazio).
 * @param {string | undefined} v
 */
function numero(v) {
  if (v === undefined) return null;
  const t = v.trim().replace(/\s/g, "");
  if (t === "" || t === "-" || t === "–") return null;
  const n = Number(t.includes(",") ? t.replace(/\./g, "").replace(",", ".") : t);
  return Number.isFinite(n) ? n : null;
}

/**
 * @typedef {Object} LinhaPontuacao
 * @property {string} equipe Nome como está na planilha
 * @property {number | null} algoritmoNatural
 * @property {number | null} maratona
 * @property {number | null} perguntasERespostas
 * @property {number | null} robotica
 * @property {number | null} bonus
 * @property {number | null} penalidade
 * @property {number | null} total
 */

/**
 * Extrai as linhas da tabela PontuacaoEquipes a partir do CSV da aba.
 * Localiza o cabeçalho pela coluna "Equipes", então funciona mesmo se a tabela
 * não começar na célula A1.
 * @param {string} csv
 * @returns {LinhaPontuacao[]}
 */
export function lerPontuacao(csv) {
  const linhas = lerCsv(csv);
  const iCab = linhas.findIndex((l) => l.some((c) => COLUNAS.equipe.includes(normalizar(c))));
  if (iCab < 0) throw new Error('Cabeçalho da tabela não encontrado (coluna "Equipes").');

  const cab = linhas[iCab].map(normalizar);
  /** @param {readonly string[]} nomes */
  const col = (nomes) => cab.findIndex((c) => nomes.includes(c));
  const idx = Object.fromEntries(Object.entries(COLUNAS).map(([k, nomes]) => [k, col(nomes)]));

  /** @type {LinhaPontuacao[]} */
  const out = [];
  for (const l of linhas.slice(iCab + 1)) {
    const equipe = (l[idx.equipe] ?? "").trim();
    if (!equipe) {
      if (out.length) break; // fim da tabela
      continue;
    }
    /** @param {string} k */
    const v = (k) => (idx[k] >= 0 ? numero(l[idx[k]]) : null);
    out.push({
      equipe,
      algoritmoNatural: v("algoritmo-natural"),
      maratona: v("maratona"),
      perguntasERespostas: v("perguntas-e-respostas"),
      robotica: v("robotica"),
      bonus: v("bonus"),
      penalidade: v("penalidade"),
      total: v("total"),
    });
  }
  return out;
}

/**
 * true quando a comissão já lançou algum ponto (o Total da planilha
 * mostra 0 mesmo vazio, então ele não conta).
 * @param {LinhaPontuacao[]} linhas
 */
export function temPontos(linhas) {
  return linhas.some(
    (l) =>
      l.algoritmoNatural !== null ||
      l.maratona !== null ||
      l.perguntasERespostas !== null ||
      l.robotica !== null ||
      l.bonus !== null ||
      l.penalidade !== null,
  );
}

/**
 * Baixa e interpreta a tabela.
 * @param {{ id?: string; aba?: string; fetchInit?: RequestInit & { next?: { revalidate?: number } } }} [opcoes]
 */
export async function buscarPontuacao(opcoes = {}) {
  const id = opcoes.id ?? PLANILHA_PADRAO.id;
  const aba = opcoes.aba ?? PLANILHA_PADRAO.aba;
  const res = await fetch(urlCsv(id, aba), opcoes.fetchInit);
  if (!res.ok) throw new Error(`Planilha respondeu ${res.status}. Ela está compartilhada como "qualquer pessoa com o link"?`);
  const texto = await res.text();
  if (texto.trimStart().startsWith("<")) {
    throw new Error("A planilha devolveu HTML em vez de CSV. Verifique o compartilhamento público e o nome da aba.");
  }
  return lerPontuacao(texto);
}
