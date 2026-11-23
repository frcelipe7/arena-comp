import Image, { type ImageProps } from "next/image";
import { withBase } from "@/lib/base-path";

/**
 * next/image para o site estático: as imagens já são publicadas otimizadas
 * (WebP no tamanho de uso), então são servidas como estão, apenas com o
 * prefixo da subpasta de publicação (basePath, ex.: /arena-comp).
 * Funciona igual no `npm run dev` (Turbopack) e no `npm run build`.
 */
export function AppImage({ src, alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} src={typeof src === "string" ? withBase(src) : src} unoptimized />;
}
