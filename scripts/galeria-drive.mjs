#!/usr/bin/env node
/**
 * Lê a pasta pública da galeria no Google Drive e salva a lista de fotos em
 * src/data/galeria-drive.json. Roda antes de `npm run build`; a lista vira a
 * galeria inicial do site (as atualizações ao vivo vêm da aba "Galeria" da planilha).
 *
 * Uso: npm run galeria:drive [-- --ver]
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const PASTA_PADRAO = "1qbHoemlg6zBQuwaGyO6WBQk-NDZhC3iR";
const raiz = process.env.GALERIA_PASTA_ID || PASTA_PADRAO;
const soVer = process.argv.includes("--ver");
const tolerante = process.argv.includes("--tolerante");
const IMAGEM = /\.(jpe?g|png|webp|gif|heic|heif|bmp|tiff?)$/i;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** Lista o conteúdo de uma pasta pública pela visualização incorporada do Drive. */
async function listar(id) {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${id}`);
  if (!res.ok) throw new Error(`Pasta ${id} respondeu ${res.status}`);
  const html = await res.text();
  const itens = [];
  const re = /<a href="([^"]+)"[^>]*>[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>[\s\S]*?<div class="flip-entry-last-modified"><div>([^<]*)<\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const href = decode(m[1]);
    const nome = decode(m[2]).trim();
    const pasta = href.match(/\/folders\/([\w-]+)/);
    const arquivo = href.match(/\/file\/d\/([\w-]+)/);
    if (pasta) itens.push({ tipo: "pasta", id: pasta[1], nome });
    else if (arquivo) itens.push({ tipo: "arquivo", id: arquivo[1], nome, modificado: m[3].trim() });
  }
  if (!itens.length && !/flip-entries/.test(html)) {
    throw new Error("Resposta inesperada do Drive. A pasta está pública (qualquer pessoa com o link)?");
  }
  return itens;
}

async function varrer(id, caminho, fotos) {
  for (const item of await listar(id)) {
    if (item.tipo === "pasta") await varrer(item.id, [...caminho, item.nome], fotos);
    else if (IMAGEM.test(item.nome)) {
      fotos.push({ id: item.id, nome: item.nome, pasta: caminho.join("/"), descricao: "", criadoEm: "" });
    }
  }
}

try {
  const fotos = [];
  await varrer(raiz, [], fotos);
  fotos.sort((a, b) => (a.pasta === b.pasta ? a.nome.localeCompare(b.nome, "pt-BR", { numeric: true }) : a.pasta.localeCompare(b.pasta)));

  const porPasta = fotos.reduce((acc, f) => ((acc[f.pasta || "(raiz)"] = (acc[f.pasta || "(raiz)"] ?? 0) + 1), acc), {});
  console.log(`Galeria no Drive: ${fotos.length} foto(s)`);
  if (fotos.length) console.table(porPasta);

  if (!soVer) {
    const destino = path.resolve("src/data/galeria-drive.json");
    await writeFile(destino, JSON.stringify({ atualizadoEm: new Date().toISOString(), pasta: raiz, fotos }, null, 2) + "\n", "utf8");
    console.log(`Lista salva em ${path.relative(process.cwd(), destino)}`);
  }
} catch (err) {
  console.error(`Erro ao ler a galeria do Drive: ${err instanceof Error ? err.message : err}`);
  if (tolerante) console.warn("Seguindo com a última lista salva em src/data/galeria-drive.json.");
  else process.exit(1);
}
