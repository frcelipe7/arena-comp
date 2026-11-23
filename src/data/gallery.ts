import type { GalleryCategory, GalleryPhoto } from "@/types";


export const galleryDriveEndpoint: string = process.env.NEXT_PUBLIC_GALERIA_URL || "";

/** Pasta pública da galeria no Drive (link "Abrir no Google Drive"). */
export const galleryDriveFolderUrl = "https://drive.google.com/drive/folders/1qbHoemlg6zBQuwaGyO6WBQk-NDZhC3iR";


export const galleryPhotos: GalleryPhoto[] = [];

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "algoritmo-natural", label: "Algoritmo Natural" },
  { id: "maratona", label: "Maratona de Programação" },
  { id: "perguntas-e-respostas", label: "Perguntas e Respostas" },
  { id: "robotica", label: "Robótica" },
  { id: "equipes", label: "Equipes" },
  { id: "premiacao", label: "Premiação" },
  { id: "bastidores", label: "Bastidores" },
];

export const galleryDays = [
  { id: "03/12/2026", label: "Dia 03 de dezembro" },
  { id: "04/12/2026", label: "Dia 04 de dezembro" },
] as const;
