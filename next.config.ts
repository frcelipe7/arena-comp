import type { NextConfig } from "next";
import path from "node:path";

/**
 * Subpasta onde o site é publicado. Padrão: /arena-comp
 * (https://feliperaphael.com.br/arena-comp). Para publicar na raiz de um
 * domínio, rode o build com PUBLIC_BASE_PATH="" .
 */
const basePath = (process.env.PUBLIC_BASE_PATH ?? "/arena-comp").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Site 100% estático: `npm run build` gera a pasta `out/`.
  output: "export",
  basePath,
  // Gera /cronograma/index.html etc., que funciona em qualquer servidor sem regras extras.
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Evita que o Next procure lockfiles em pastas acima do projeto.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Imagens já publicadas otimizadas (WebP no tamanho de uso). O componente
    // AppImage serve como estão e acrescenta o basePath.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
};

export default nextConfig;
