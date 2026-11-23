"use client";

import { useEffect, useState } from "react";
import { galleryDriveEndpoint, galleryPhotos } from "@/data/gallery";
import driveSnapshot from "@/data/galeria-drive.json";
import { fetchDrivePhotos, photoFromDrive, type DriveFile } from "@/lib/gallery-drive";
import { fetchSheetGallery } from "@/lib/gallery-sheet";
import type { GalleryPhoto } from "@/types";

export type GalleryStatus = "loading" | "ready" | "error";

/** Intervalo de atualização enquanto a página está aberta. */
const REFRESH_MS = 3 * 60_000;

/** Fotos do Drive lidas no último `npm run build` (reserva). */
const snapshotPhotos: GalleryPhoto[] = (driveSnapshot.fotos as DriveFile[]).map(photoFromDrive);
const initialPhotos = [...galleryPhotos, ...snapshotPhotos];

/**
 * Fontes ao vivo, em ordem:
 * 1. Aba "Galeria" da planilha (atualizada a cada 5 min pelo script da planilha).
 * 2. Apps Script publicado como app da Web (opcional, galleryDriveEndpoint).
 * Retorna null se nenhuma fonte ao vivo estiver disponível.
 */
async function fetchLive(): Promise<GalleryPhoto[] | null> {
  try {
    const files = await fetchSheetGallery();
    if (files) return files.map(photoFromDrive);
  } catch {
    // segue para a próxima fonte
  }
  if (galleryDriveEndpoint) return fetchDrivePhotos();
  return null;
}

/**
 * Fotos da galeria: arquivos locais (gallery.ts) + pasta do Google Drive.
 * Mostra de imediato a lista gravada no build e, assim que a planilha
 * responde, troca pela lista ao vivo (fotos novas sem novo build).
 */
export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [status, setStatus] = useState<GalleryStatus>(initialPhotos.length ? "ready" : "loading");

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const live = await fetchLive();
        if (!alive) return;
        if (live) setPhotos([...galleryPhotos, ...live]);
        setStatus("ready");
      } catch {
        if (alive) setStatus((s) => (s === "loading" && initialPhotos.length === 0 ? "error" : s === "loading" ? "ready" : s));
      }
    };
    refresh();
    const id = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return { photos, status };
}
