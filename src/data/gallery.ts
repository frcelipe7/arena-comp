import type { GalleryCategory, GalleryPhoto } from "@/types";

/**
 * Memórias da Arena — registros fotográficos oficiais.
 *
 * FONTE PRINCIPAL: GOOGLE DRIVE
 * As fotos ficam numa pasta do Drive, lida pelo Apps Script em
 * deploy/galeria-apps-script.gs. Basta colocar as fotos nas subpastas:
 *
 *   03-dezembro/  04-dezembro/  algoritmo-natural/  maratona-programacao/
 *   perguntas-respostas/  robotica/  premiacao/  bastidores/
 *   equipes/<nome-da-equipe>/   (pressman, turing, sommerville, kurose, ada, grace)
 *
 * e elas aparecem no site (galeria e destaque da home) em até ~2 minutos,
 * sem novo build. A "Descrição" do arquivo no Drive vira a legenda.
 *
 * Cole abaixo a URL do Apps Script publicado (termina em /exec).
 * Pode também ser definida no build pela variável NEXT_PUBLIC_GALERIA_URL.
 */
export const galleryDriveEndpoint: string = process.env.NEXT_PUBLIC_GALERIA_URL || "";

/**
 * FONTE OPCIONAL: ARQUIVOS DO PRÓPRIO SITE
 * Fotos em public/images/gallery/ (rode `npm run galeria:otimizar`) podem ser
 * registradas aqui. Elas aparecem junto com as do Drive.
 *
 * Exemplo:
 * {
 *   id: "arena-001",
 *   src: "/images/gallery/day-01/foto-001.webp",
 *   alt: "Equipe Ada apresentando o grito de guerra na abertura",
 *   caption: "Abertura da Arena Comp 2026",
 *   category: "equipes",
 *   day: "03/12/2026",
 *   team: "ada",
 *   width: 1600,
 *   height: 1067,
 * },
 */
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
