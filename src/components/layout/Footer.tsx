import Link from "next/link";
import { AppImage as Image } from "@/components/ui/AppImage";
import { Download, MapPin } from "lucide-react";
import { event, navItems } from "@/data/event";
import { challenges } from "@/data/challenges";
import { GincanaBand } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer className="mt-auto">
      <GincanaBand />
      <div className="arena-grid bg-navy text-paper-50">
        <div className="mx-auto grid w-full max-w-[76rem] gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-paper-50 px-4 py-3">
              <Image src="/brand/arena-emblem.webp" alt="" width={52} height={45} />
              <Image src="/brand/arena-wordmark.webp" alt="Arena Comp UEPA" width={120} height={52} />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-300">
              Gincana acadêmica do curso de {event.course}, {event.university}, {event.campus}.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-paper-100">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
              {event.datesLabel}
              <br />
              {event.location}
            </p>
          </div>

          <nav aria-label="Rodapé">
            <h2 className="text-sm font-semibold text-gold">Portal</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-paper-100 hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-gold">Desafios</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {challenges.map((c) => (
                <li key={c.slug}>
                  <Link href={`/desafios/${c.slug}`} className="text-paper-100 hover:text-gold">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gold">Documentos oficiais</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {Object.values(event.documents).map((d) => (
                <li key={d.href}>
                  <a href={d.href} download className="group flex items-start gap-2 text-paper-100 hover:text-gold">
                    <Download aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span>
                      {d.title}
                      <span className="block text-xs text-navy-300 group-hover:text-gold/80">PDF, {d.size}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[76rem] flex-col gap-2 px-4 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
            <p>Comissão Organizadora da Arena Comp 2026, UEPA {event.campusAlt}.</p>
            <p>
              Desenvolvido por{" "}
              <a
                href="https://www.linkedin.com/in/frcelipe7/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-paper-100 underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
              >
                frcelipe7
                <span className="sr-only"> (LinkedIn, abre em nova aba)</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
