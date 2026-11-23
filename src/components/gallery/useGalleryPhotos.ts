"use client";

import { useEffect, useState } from "react";
import { galleryDriveEndpoint, galleryPhotos } from "@/data/gallery";
import driveSnapshot from "@/data/galeria-drive.json";
import { fetchDrivePhotos, photoFromDrive, type DriveFile } from "@/lib/gallery-drive";
import type { GalleryPhoto } from "@/types";

export type GalleryStatus = "loading" | "ready" | "error";

/** Fotos do Drive lidas no último `npm run build` (scripts/galeria-drive.mjs). */
const snapshotPhotos: GalleryPhoto[] = (driveSnapshot.fotos as DriveFile[]).map(photoFromDrive);
const initialPhotos = [...galleryPhotos, ...snapshotPhotos];

/**
 * Fotos da galeria: arquivos locais (gallery.ts) + pasta do Google Drive.
 * Mostra de imediato a lista gravada no build e, se o Apps Script estiver
 * configurado, troca pela lista ao vivo (fotos novas sem novo build).
 */
export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [status, setStatus] = useState<GalleryStatus>(
    galleryDriveEndpoint && initialPhotos.length === 0 ? "loading" : "ready",
  );

  useEffect(() => {
    if (!galleryDriveEndpoint) return;
    let alive = true;
    fetchDrivePhotos()
      .then((remote) => {
        if (!alive) return;
        setPhotos([...galleryPhotos, ...remote]);
        setStatus("ready");
      })
      .catch(() => {
        // Sem conexão com o Apps Script: mantém a lista do build.
        if (alive && initialPhotos.length === 0) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  return { photos, status };
}
