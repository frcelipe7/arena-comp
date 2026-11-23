#!/usr/bin/env node
/**
 * Otimiza as fotos da galeria (Memórias da Arena).
 *
 * Uso:
 *   1. Coloque as fotos originais (JPG/PNG/HEIC exportado etc.) em
 *      public/images/gallery/<pasta>/  (day-01, day-02, teams, challenges, award-ceremony, bastidores)
 *   2. Rode:  npm run galeria:otimizar
 *
 * O script converte cada foto para WebP com no máximo 1800 px no lado maior,
 * apaga o original pesado e imprime um registro pronto para colar em
 * src/data/gallery.ts (com width/height corretos).
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images/gallery");
const MAX = 1800;
const INPUT = /\.(jpe?g|png|tiff?|webp)$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (INPUT.test(entry.name)) yield full;
  }
}

const folderCategory = {
  "day-01": "bastidores",
  "day-02": "bastidores",
  teams: "equipes",
  challenges: "bastidores",
  "award-ceremony": "premiacao",
  bastidores: "bastidores",
};

const records = [];
let n = 0;

for await (const file of walk(ROOT)) {
  const out = file.replace(/\.[^.]+$/, ".webp");
  const alreadyOptimized = file === out;
  const meta = await sharp(file).metadata();
  const big = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX;

  let info;
  if (!alreadyOptimized || big) {
    const before = (await stat(file)).size;
    const buffer = await sharp(file)
      .rotate() // respeita a orientação EXIF do celular
      .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    await sharp(buffer.data).toFile(out);
    if (!alreadyOptimized) await unlink(file);
    info = buffer.info;
    console.log(
      `✓ ${path.relative(ROOT, out)}  ${(before / 1024).toFixed(0)} KB → ${(buffer.data.length / 1024).toFixed(0)} KB`,
    );
  } else {
    info = { width: meta.width, height: meta.height };
  }

  n += 1;
  const rel = "/" + path.relative("public", out).split(path.sep).join("/");
  const folder = path.relative(ROOT, out).split(path.sep)[0];
  records.push(
    `  {\n    id: "arena-${String(n).padStart(3, "0")}",\n    src: "${rel}",\n    alt: "DESCREVA O QUE APARECE NA FOTO",\n    caption: "",\n    category: "${folderCategory[folder] ?? "bastidores"}",\n    day: "${folder === "day-02" ? "04/12/2026" : "03/12/2026"}",\n    width: ${info.width},\n    height: ${info.height},\n  },`,
  );
}

if (records.length === 0) {
  console.log("Nenhuma foto encontrada em public/images/gallery/.");
} else {
  console.log("\nRegistros para src/data/gallery.ts (ajuste alt, legenda, categoria, dia e equipe):\n");
  console.log(records.join("\n"));
}
