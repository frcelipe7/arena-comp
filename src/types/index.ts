export type TeamId =
  | "grace"
  | "pressman"
  | "kurose"
  | "turing"
  | "sommerville"
  | "ada";

export type ChallengeSlug =
  | "algoritmo-natural"
  | "maratona"
  | "perguntas-e-respostas"
  | "robotica";

export interface Member {
  name: string;
  /** Turma/período, se a organização divulgar. */
  turma?: string;
}

export interface Team {
  id: TeamId;
  /** Número do grupo no Anexo V. */
  group: number;
  name: string;
  colorName: string;
  /** Cor principal usada nos cards. */
  color: string;
  /** Cor do texto sobre a cor principal (contraste). */
  onColor: string;
  /** Cor de destaque para bordas/realces quando a cor principal é muito clara/escura. */
  accent: string;
  /** Inspiração do nome (referência histórica da computação). */
  namesake: { person: string; note: string };
  leader: Member | null;
  viceLeader: Member | null;
  members: Member[];
}

export type ScheduleStatus = "confirmado" | "pendente";

export interface ScheduleItem {
  id: string;
  /** Ex.: "13h40 às 14h". null = horário pendente de confirmação. */
  time: string | null;
  title: string;
  responsible?: string;
  challenge?: ChallengeSlug;
  note?: string;
  status: ScheduleStatus;
}

export interface ScheduleDay {
  id: "dia-1" | "dia-2";
  date: string; // ISO
  dayNumber: string;
  month: string;
  weekday: string;
  label: string;
  summary: string;
  startTime: string;
  endTime: string | null;
  items: ScheduleItem[];
  notices: { tone: "info" | "pending"; text: string }[];
}

export interface Criterion {
  name: string;
  weight?: string;
  description: string;
}

export interface Step {
  title: string;
  items: string[];
}

export interface ChallengeSection {
  id: string;
  title: string;
  /** Parágrafos introdutórios. */
  body?: string[];
  items?: string[];
  steps?: Step[];
}

export interface Challenge {
  slug: ChallengeSlug;
  order: number;
  annex: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  objective: string;
  day: string;
  dayShort: string;
  facts: { label: string; value: string }[];
  format: string[];
  rules: string[];
  criteria: Criterion[];
  criteriaNote?: string;
  scoring: string[];
  scoringTable?: { situation: string; points: string }[];
  penalties: string[];
  tiebreak?: string[];
  materials?: { title: string; items: string[] }[];
  topics?: string[];
  preparation: string[];
  extraSections?: ChallengeSection[];
  practiceLinks?: { label: string; href: string }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
  links?: { label: string; href: string }[];
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export type GalleryCategory =
  | "algoritmo-natural"
  | "maratona"
  | "perguntas-e-respostas"
  | "robotica"
  | "equipes"
  | "premiacao"
  | "bastidores";

export interface GalleryPhoto {
  id: string;
  /** Imagem em alta (visualizador). Caminho de /public ou URL externa (Drive). */
  src: string;
  /** Versão menor para o grid. Se ausente, usa `src`. */
  thumb?: string;
  alt: string;
  caption?: string;
  /** Sem categoria: aparece em "Todos" e no filtro do dia. */
  category?: GalleryCategory;
  day?: "03/12/2026" | "04/12/2026";
  team?: TeamId;
  /** Arquivo original para download (se ausente, usa `src`). */
  download?: string;
  /** Nome do arquivo ao baixar (ex.: "foto-001.jpg"). */
  fileName?: string;
  /** Subpasta de origem no Drive (vira pasta dentro do ZIP). */
  folder?: string;
  /** Dimensões reais (opcionais; ajudam a reservar espaço no grid). */
  width?: number;
  height?: number;
}

export interface TeamResult {
  team: TeamId;
  /** Colocação (1 a 6) em cada desafio. null = ainda não divulgado. */
  placements: Partial<Record<ChallengeSlug, number | null>>;
  /** Bonificação Identidade e Torcida (0 a 20). */
  bonus?: { uniform?: number; chant?: number };
  /** Descontos aplicados (art. 19, II). */
  penalty?: number;
}
