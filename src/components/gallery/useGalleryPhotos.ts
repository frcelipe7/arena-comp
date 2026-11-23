"use client";

import { useEffect, useState } from "react";
import driveSnapshot from "@/data/galeria-drive.json";
import { photoFromDrive, type DriveFile } from "@/lib/gallery-drive";
import { fetchSheetGallery } from "@/lib/gallery-sheet";
import type { GalleryPhoto } from "@/types";

export type GalleryStatus = "loading" | "ready" | "error";

const REFRESH_MS = 3 * 60_000;

/** Lista lida do Drive no último build: aparece de imediato e serve de reserva. */
const snapshotPhotos: GalleryPhoto[] = (driveSnapshot.fotos as DriveFile[]).map(photoFromDrive);

/**
 * Fotos da galeria. Lê a aba "Galeria" da planilha (mantida pelo script
 * deploy/planilha-galeria.gs) ao abrir a página e a cada 3 minutos.
 */
export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(snapshotPhotos);
  const [status, setStatus] = useState<GalleryStatus>(snapshotPhotos.length ? "ready" : "loading");

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const files = await fetchSheetGallery();
        if (!alive) return;
        if (files) setPhotos(files.map(photoFromDrive));
        setStatus("ready");
      } catch {
        if (alive) setStatus((s) => (s === "loading" ? (snapshotPhotos.length ? "ready" : "error") : s));
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
