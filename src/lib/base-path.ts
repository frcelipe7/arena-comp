/**
 * Subpasta onde o site é publicado (ex.: https://feliperaphael.com.br/arena-comp).
 * Definida em next.config.ts (variável PUBLIC_BASE_PATH no build).
 * Links (<Link>) e arquivos /_next já recebem o prefixo automaticamente;
 * use `withBase` para caminhos de /public usados fora de <Image> (PDFs, CSS, metadados).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (basePath && (path === basePath || path.startsWith(basePath + "/"))) return path;
  return basePath + path;
}
