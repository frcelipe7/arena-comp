import { AppImage as Image } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";

/** Estado inicial da galeria, antes de as fotos serem publicadas. */
export function GalleryEmpty({ className, filtered = false }: { className?: string; filtered?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border-2 border-dashed border-navy/35 bg-paper-50/70 px-6 py-12 sm:px-12 sm:py-16",
        className,
      )}
    >
      {/* moldura editorial vazia: proporções do futuro grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden grid-cols-12 grid-rows-6 gap-3 p-4 opacity-60 md:grid">
        <div className="col-span-4 row-span-4 col-start-9 rounded-2xl border-2 border-navy/10" />
        <div className="col-span-3 row-span-2 col-start-9 row-start-5 rounded-2xl border-2 border-navy/10" />
        <div className="col-span-1 row-span-2 col-start-12 row-start-5 rounded-2xl border-2 border-navy/10" />
      </div>
      <div className="relative flex flex-col items-start gap-6 md:max-w-[58%]">
        <Image src="/brand/mascote-laptop.webp" alt="" width={333} height={360} className="h-28 w-auto sm:h-36" />
        <div>
          <p className="text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-3xl">
            {filtered ? "Nenhuma foto nesta categoria ainda." : "Os melhores momentos ainda estão sendo preparados."}
          </p>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-ink-soft">
            Em breve, você poderá reviver os desafios, a integração entre as equipes e os grandes momentos da Arena Comp
            2026 por aqui.
          </p>
        </div>
      </div>
    </div>
  );
}
