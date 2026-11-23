import type { ChallengeSlug } from "@/types";

/** Quadro 3: pontos por colocação em cada desafio (art. 13). */
export const placementPoints: { place: number; points: number }[] = [
  { place: 1, points: 100 },
  { place: 2, points: 80 },
  { place: 3, points: 60 },
  { place: 4, points: 50 },
  { place: 5, points: 40 },
  { place: 6, points: 30 },
];

export function pointsForPlace(place: number | null | undefined): number {
  if (!place) return 0;
  return placementPoints.find((p) => p.place === place)?.points ?? 0;
}

/** Art. 14: Identidade e Torcida. */
export const bonus = {
  max: 20,
  items: [
    { name: "Uniformização completa do grupo nos dois dias", max: 10 },
    { name: "Grito de guerra", max: 10 },
  ],
  criteria: ["criatividade", "originalidade", "sincronia", "adequação ao ambiente acadêmico"],
};

/** Art. 15. */
export const maxTotal = 420;

/** Art. 16: desempate da classificação geral, nesta ordem. */
export const generalTiebreak: { label: string; challenge?: ChallengeSlug | "bonus" }[] = [
  { label: "Maior pontuação obtida na Maratona de Programação", challenge: "maratona" },
  { label: "Maior pontuação obtida no Desafio de Robótica", challenge: "robotica" },
  { label: "Maior pontuação obtida no Desafio Perguntas e Respostas", challenge: "perguntas-e-respostas" },
  { label: "Maior pontuação obtida no Desafio Algoritmo Natural", challenge: "algoritmo-natural" },
  { label: "Maior pontuação obtida no quesito Identidade e Torcida", challenge: "bonus" },
  { label: "Sorteio realizado publicamente pela comissão organizadora" },
];

/** Quadro 4: conversão da classificação final em pontuação extra na N2 (art. 17). */
export const n2Conversion: { place: number; extra: string }[] = [
  { place: 1, extra: "1,0" },
  { place: 2, extra: "0,8" },
  { place: 3, extra: "0,6" },
  { place: 4, extra: "0,5" },
  { place: 5, extra: "0,4" },
  { place: 6, extra: "0,3" },
];

export const n2Rules: string[] = [
  "A pontuação extra é atribuída ao grupo e estendida a todos os integrantes presentes nos dois dias de evento.",
  "Quem participar de apenas um dos dias recebe 50% da pontuação extra obtida pelo grupo.",
  "Quem optar por não participar não recebe pontuação extra, sem qualquer prejuízo à nota regular do período nem à frequência.",
  "A frequência é registrada por lista de presença em cada dia, sob responsabilidade do líder do grupo e da comissão organizadora.",
  "A pontuação extra vale exclusivamente nas disciplinas regulares que ainda não tenham sido consolidadas (art. 3º).",
];
