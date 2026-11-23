// Download de fotos da galeria: uma (arquivo original) ou várias em .zip, no navegador.
import { Zip, ZipPassThrough } from "fflate";
import { withBase } from "@/lib/base-path";
import type { GalleryPhoto } from "@/types";

const DRIVE_ID = /googleusercontent\.com\/d\/([\w-]+)=d$/;

function baseName(p: GalleryPhoto) {
  if (p.fileName) return p.fileName;
  const fromSrc = p.src.split("?")[0].split("/").pop() ?? "";
  return /\.\w{3,4}$/.test(fromSrc) ? fromSrc : `${p.id}.jpg`;
}

/** Arquivo original; se falhar, a versão em resolução máxima do Google. */
async function fetchPhoto(p: GalleryPhoto, signal?: AbortSignal): Promise<Blob> {
  const urls = [p.download ?? p.src];
  const id = p.download?.match(DRIVE_ID)?.[1];
  if (id) urls.push(`https://lh3.googleusercontent.com/d/${id}=s0`);

  let lastError: unknown;
  for (const raw of urls) {
    try {
      const res = await fetch(withBase(raw), { signal, referrerPolicy: "no-referrer" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      // Arquivos muito grandes recebem uma página de aviso do Drive em vez do arquivo.
      if (blob.type.startsWith("text/html")) throw new Error("O Drive devolveu uma página em vez da foto");
      return blob;
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
    }
  }
  throw lastError;
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Baixa uma foto (arquivo original). */
export async function downloadPhoto(p: GalleryPhoto) {
  saveBlob(await fetchPhoto(p), baseName(p));
}

export interface ZipProgress {
  done: number;
  total: number;
  failed: number;
}

/** Salva várias fotos num .zip com as subpastas do Drive; falhas são puladas e contadas. */
export async function downloadZip(
  photos: GalleryPhoto[],
  zipName: string,
  onProgress: (p: ZipProgress) => void,
  signal?: AbortSignal,
): Promise<ZipProgress> {
  const parts: Uint8Array[] = [];
  let resolveZip!: () => void;
  let rejectZip!: (e: unknown) => void;
  const finished = new Promise<void>((res, rej) => {
    resolveZip = res;
    rejectZip = rej;
  });
  const zip = new Zip((err, chunk, final) => {
    if (err) return rejectZip(err);
    parts.push(chunk);
    if (final) resolveZip();
  });

  const used = new Set<string>();
  const uniquePath = (p: GalleryPhoto) => {
    const folder = p.folder ? p.folder.replace(/[\\:*?"<>|]/g, "-") + "/" : "";
    const name = baseName(p).replace(/[\\/:*?"<>|]/g, "-");
    let path = folder + name;
    for (let n = 2; used.has(path.toLowerCase()); n++) path = folder + name.replace(/(\.\w+)?$/, ` (${n})$1`);
    used.add(path.toLowerCase());
    return path;
  };

  const progress: ZipProgress = { done: 0, total: photos.length, failed: 0 };
  onProgress({ ...progress });

  // 4 downloads em paralelo; fotos entram no zip sem recompressão.
  let next = 0;
  const worker = async () => {
    while (next < photos.length) {
      if (signal?.aborted) return;
      const p = photos[next++];
      try {
        const bytes = new Uint8Array(await (await fetchPhoto(p, signal)).arrayBuffer());
        const entry = new ZipPassThrough(uniquePath(p));
        zip.add(entry);
        entry.push(bytes, true);
      } catch {
        if (signal?.aborted) return;
        progress.failed++;
      }
      progress.done++;
      onProgress({ ...progress });
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, photos.length) }, worker));

  if (signal?.aborted) {
    zip.terminate();
    throw new DOMException("Download cancelado", "AbortError");
  }
  if (progress.failed === photos.length) {
    zip.terminate();
    throw new Error("Nenhuma foto pôde ser baixada");
  }
  zip.end();
  await finished;
  saveBlob(new Blob(parts as BlobPart[], { type: "application/zip" }), zipName);
  return progress;
}
