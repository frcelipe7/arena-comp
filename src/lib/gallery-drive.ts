import { galleryCategories } from "@/data/gallery";
import { teams } from "@/data/teams";
import { normalize } from "@/lib/utils";
import type { GalleryCategory, GalleryPhoto, TeamId } from "@/types";

export interface DriveFile {
  id: string;
  nome: string;
  /** Caminho de subpastas a partir da pasta raiz, ex.: "equipes/pressman". */
  pasta: string;
  descricao: string;
  criadoEm: string;
}

const DAY_1 = "03/12/2026" as const;
const DAY_2 = "04/12/2026" as const;

/** Nome da pasta no Drive → categoria e dia (dias dos desafios conforme o cronograma). */
const folderRules: { match: string[]; category?: GalleryCategory; day?: GalleryPhoto["day"] }[] = [
  { match: ["03-dezembro", "03-de-dezembro", "dia-03", "dia-1", "dia-01"], day: DAY_1 },
  { match: ["04-dezembro", "04-de-dezembro", "dia-04", "dia-2", "dia-02"], day: DAY_2 },
  { match: ["algoritmo-natural", "algoritmo"], category: "algoritmo-natural", day: DAY_1 },
  { match: ["maratona-programacao", "maratona-de-programacao", "maratona"], category: "maratona" },
  { match: ["perguntas-respostas", "perguntas-e-respostas", "torta-na-cara"], category: "perguntas-e-respostas", day: DAY_2 },
  { match: ["robotica"], category: "robotica", day: DAY_2 },
  { match: ["premiacao"], category: "premiacao", day: DAY_2 },
  { match: ["bastidores"], category: "bastidores" },
  { match: ["equipes", "equipe"], category: "equipes" },
];

const slug = (s: string) => normalize(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function findTeam(segment: string): TeamId | undefined {
  const s = slug(segment);
  return teams.find((t) => s === t.id || s === slug(t.name) || s === slug(t.colorName) || s.includes(t.id))?.id;
}

/** Imagem redimensionada pelo Google. */
export const driveImage = (id: string, width: number) => `https://lh3.googleusercontent.com/d/${id}=w${width}`;

/** Arquivo original (o sufixo "=d" permite baixar a partir de outro site). */
export const driveOriginal = (id: string) => `https://lh3.googleusercontent.com/d/${id}=d`;

export function photoFromDrive(f: DriveFile): GalleryPhoto {
  let category: GalleryCategory | undefined;
  let day: GalleryPhoto["day"];
  let team: TeamId | undefined;

  const segments = f.pasta.split("/").filter(Boolean);
  segments.forEach((seg, i) => {
    const rule = folderRules.find((r) => r.match.includes(slug(seg)));
    if (rule) {
      category = rule.category ?? category;
      day = rule.day ?? day;
      if (rule.category === "equipes" && segments[i + 1]) team = findTeam(segments[i + 1]);
    }
  });

  const label = galleryCategories.find((c) => c.id === category)?.label;
  const teamName = team ? teams.find((t) => t.id === team)?.name : undefined;
  const fallbackAlt = ["Foto da Arena Comp 2026", label, teamName && `equipe ${teamName}`].filter(Boolean).join(", ");

  return {
    id: `drive-${f.id}`,
    src: driveImage(f.id, 2000),
    thumb: driveImage(f.id, 900),
    download: driveOriginal(f.id),
    fileName: f.nome,
    folder: f.pasta,
    alt: f.descricao.trim() || fallbackAlt,
    caption: f.descricao.trim() || undefined,
    category,
    day,
    team,
  };
}
