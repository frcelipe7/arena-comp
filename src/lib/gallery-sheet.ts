// Lê a aba "Galeria" da planilha de pontuação (preenchida automaticamente pelo
// script deploy/planilha-galeria.gs a partir da pasta do Google Drive).
import { PLANILHA_PADRAO, lerCsv, urlCsv } from "@/lib/pontuacao-planilha.mjs";
import type { DriveFile } from "@/lib/gallery-drive";
import { normalize } from "@/lib/utils";

export const GALLERY_TAB = "Galeria";

/**
 * Retorna as fotos listadas na aba, ou `null` se a aba ainda não existe.
 * (Quando a aba não existe, o Google devolve a primeira aba da planilha;
 * por isso o cabeçalho é conferido antes de usar.)
 */
export async function fetchSheetGallery(): Promise<DriveFile[] | null> {
  const id = process.env.NEXT_PUBLIC_PONTUACAO_SHEET_ID || PLANILHA_PADRAO.id;
  const res = await fetch(`${urlCsv(id, GALLERY_TAB)}&_=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Planilha respondeu ${res.status}`);
  const text = await res.text();
  if (text.trimStart().startsWith("<")) throw new Error("A planilha não está pública");

  const rows = lerCsv(text);
  const header = (rows[0] ?? []).map(normalize);
  const col = (name: string) => header.indexOf(name);
  const iId = col("id");
  const iPasta = col("pasta");
  if (iId < 0 || iPasta < 0) return null; // aba "Galeria" ainda não criada

  const iNome = col("nome");
  const iDesc = col("descricao");
  const iData = col("criadoem");
  return rows
    .slice(1)
    .filter((r) => /^[\w-]{10,}$/.test((r[iId] ?? "").trim()))
    .map((r) => ({
      id: r[iId].trim(),
      nome: (r[iNome] ?? "").trim(),
      pasta: (r[iPasta] ?? "").trim(),
      descricao: (r[iDesc] ?? "").trim(),
      criadoEm: (r[iData] ?? "").trim(),
    }));
}
