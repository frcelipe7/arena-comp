import Image, { type ImageProps } from "next/image";
import { withBase } from "@/lib/base-path";

/** next/image sem otimização no servidor, com o prefixo da subpasta de publicação. */
export function AppImage({ src, alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} src={typeof src === "string" ? withBase(src) : src} unoptimized />;
}
