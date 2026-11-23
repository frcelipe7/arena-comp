#!/usr/bin/env node
// Serve a pasta out/ no mesmo caminho da VPS (basePath), para testar o build estático.
// Uso: npm run preview  →  http://localhost:3000/arena-comp/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const base = (process.env.PUBLIC_BASE_PATH ?? "/arena-comp").replace(/\/+$/, "");
const root = path.resolve("out");
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const full = path.join(root, rel);
  if (!full.startsWith(root)) return null;
  for (const candidate of [full, path.join(full, "index.html"), full + ".html"]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/" || url.pathname === base) {
    res.writeHead(302, { Location: base + "/" }).end();
    return;
  }
  if (!url.pathname.startsWith(base + "/")) {
    res.writeHead(404).end("Fora do basePath");
    return;
  }
  const file = await resolveFile(url.pathname.slice(base.length));
  const target = file ?? path.join(root, "404.html");
  res.writeHead(file ? 200 : 404, { "Content-Type": types[path.extname(target)] ?? "application/octet-stream" });
  res.end(await readFile(target));
}).listen(port, () => console.log(`Build estático em http://localhost:${port}${base}/`));
