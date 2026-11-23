import { withBase } from "@/lib/base-path";

/**
 * Informações gerais da Arena Comp 2026.
 * Datas atualizadas: 03 e 04 de dezembro de 2026 (prevalecem sobre as
 * datas originais do regimento, 26 e 27 de novembro).
 */
export const event = {
  name: "Arena Comp 2026",
  shortName: "Arena Comp",
  year: 2026,
  tagline: "Quatro desafios, seis equipes e dois dias para pôr em prática o que se aprende em sala.",
  description:
    "Gincana acadêmica do curso de Engenharia de Software da UEPA, Campus Parauapebas. Datas, cronograma, equipes, desafios, regras e pontuação em um só lugar.",
  course: "Engenharia de Software",
  university: "Universidade do Estado do Pará",
  universityShort: "UEPA",
  campus: "Campus Parauapebas",
  campusAlt: "Campus XXIII",
  location: "UEPA, Campus Parauapebas",
  datesLabel: "03 e 04 de dezembro de 2026",
  /** Início confirmado do evento (horário de Belém, UTC-3). */
  startsAt: "2026-12-03T19:30:00-03:00",
  days: [
    { id: "dia-1", date: "2026-12-03", short: "03 dez", weekday: "Quinta-feira", hours: "A partir das 19h30" },
    { id: "dia-2", date: "2026-12-04", short: "04 dez", weekday: "Sexta-feira", hours: "14h às 17h (presença a partir das 13h40)" },
  ],
  stats: [
    { value: "6", label: "equipes" },
    { value: "4", label: "desafios" },
    { value: "2", label: "dias de competição" },
    { value: "420", label: "pontos em disputa, no máximo" },
  ],
  documents: {
    regimento: {
      href: withBase("/docs/regimento-arena-comp-2026.pdf"),
      title: "Regimento da Arena Comp 2026",
      size: "835 KB",
      pages: 25,
    },
    divulgacao: {
      href: withBase("/docs/gincana-arena-comp-2026.pdf"),
      title: "Arte de divulgação da gincana",
      size: "13,4 MB",
      pages: 3,
    },
  },
  committee: [
    { name: "Vanessa Castro Rezende", role: "Docente coordenadora" },
    { name: "Alan Cloves Silva Barreto", role: "Docente colaborador" },
    { name: "Jacqueline Cristina Teixeira do Rosário", role: "Docente colaboradora" },
    { name: "Keny Lucas da Silva Goes", role: "Docente colaborador" },
  ],
} as const;

export const navItems = [
  { href: "/cronograma", label: "Cronograma" },
  { href: "/equipes", label: "Equipes" },
  { href: "/desafios", label: "Desafios" },
  { href: "/pontuacao", label: "Pontuação" },
  { href: "/regulamento", label: "Regulamento" },
  { href: "/faq", label: "Dúvidas" },
  { href: "/galeria", label: "Galeria" },
] as const;
