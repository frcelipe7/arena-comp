"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/AppImage";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { navItems, event } from "@/data/event";
import { SearchDialog } from "@/components/navigation/SearchDialog";
import { lenisRef } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (menuOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-paper-50"
      >
        Pular para o conteúdo
      </a>
      <header
        className={cn(
          "on-paper sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          scrolled || menuOpen
            ? "border-b border-navy/10 bg-paper-50/92 shadow-[0_1px_0_0_rgb(2_36_66/0.04)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[76rem] items-center gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-10">
          <Link href="/" className="focus-navy flex shrink-0 items-center gap-2.5" aria-label={`${event.name}, página inicial`}>
            <Image src="/brand/arena-emblem.webp" alt="" width={44} height={38} priority className="h-9 w-auto sm:h-10" />
            <Image src="/brand/arena-wordmark.webp" alt="" width={110} height={47} priority className="h-8 w-auto sm:h-9" />
          </Link>

          <nav aria-label="Principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "focus-navy relative rounded-full px-3 py-2 text-[0.9rem] font-medium transition-colors xl:px-3.5",
                      isActive(item.href) ? "bg-navy text-paper-50" : "text-navy hover:bg-navy/8",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="focus-navy flex h-11 items-center gap-2 rounded-full border-2 border-navy/15 bg-white/60 pl-3.5 pr-3 text-sm font-medium text-navy transition-colors hover:border-navy"
            >
              <Search aria-hidden className="size-4" strokeWidth={2.5} />
              <span className="hidden sm:inline lg:hidden xl:inline">Buscar</span>
              <kbd className="hidden rounded border border-navy/20 bg-paper-100 px-1.5 text-[0.7rem] font-semibold text-navy-500 xl:inline">
                Ctrl K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="focus-navy grid size-11 place-items-center rounded-full bg-navy text-paper-50 lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">{menuOpen ? "Fechar menu" : "Abrir menu"}</span>
            </button>
          </div>
        </div>

      </header>
      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-navy text-paper-50 sm:top-[4.5rem] lg:hidden"
        data-lenis-prevent
      >
        <nav aria-label="Menu" className="arena-grid flex min-h-full flex-col px-4 pb-10 pt-6 sm:px-6">
          <ul className="flex flex-col">
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-baseline justify-between border-b border-white/10 py-4 text-3xl font-extrabold tracking-tight">
                Início
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex items-baseline justify-between border-b border-white/10 py-4 text-3xl font-extrabold tracking-tight transition-colors",
                    isActive(item.href) ? "text-gold" : "hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-end justify-between gap-4 pt-10">
            <p className="text-sm text-navy-300">
              03 e 04 de dezembro
              <br />
              {event.location}
            </p>
            <Image src="/brand/mascote-face-2.webp" alt="" width={80} height={78} />
          </div>
        </nav>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
