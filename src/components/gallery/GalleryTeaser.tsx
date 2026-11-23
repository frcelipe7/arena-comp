"use client";

import Link from "next/link";
import { GalleryEmpty } from "@/components/gallery/GalleryEmpty";
import { photoUrl } from "@/components/gallery/Gallery";
import { useGalleryPhotos } from "@/components/gallery/useGalleryPhotos";
import { cn } from "@/lib/utils";

const spans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

/** Destaque da galeria na página inicial: as 5 primeiras fotos (Drive + locais). */
export function GalleryTeaser() {
  const { photos: all, status } = useGalleryPhotos();
  const photos = all.slice(0, 5);

  if (status === "loading" && photos.length === 0) {
    return (
      <div aria-busy="true" aria-label="Carregando fotos" className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4">
        {spans.map((s, i) => (
          <div key={i} className={cn("animate-pulse rounded-2xl border-2 border-navy/10 bg-navy/8", s)} />
        ))}
      </div>
    );
  }
  if (photos.length === 0) return <GalleryEmpty />;

  return (
    <ul className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4">
      {photos.map((p, i) => (
        <li key={p.id} className={cn("relative overflow-hidden rounded-2xl border-2 border-navy bg-navy", spans[i])}>
          <Link href="/galeria" className="focus-navy group block h-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas (Drive), já redimensionadas */}
            <img
              src={photoUrl(p, "thumb")}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
