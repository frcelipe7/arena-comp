import type { NextConfig } from "next";
import path from "node:path";

// Subpasta de publicação (padrão /arena-comp). Para a raiz do domínio: PUBLIC_BASE_PATH="".
const basePath = (process.env.PUBLIC_BASE_PATH ?? "/arena-comp").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Site estático: o build gera a pasta out/.
  output: "export",
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Imagens já otimizadas em public/brand (ver AppImage).
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
};

export default nextConfig;
