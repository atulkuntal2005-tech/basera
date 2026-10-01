"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Phone, ShoppingBag } from "lucide-react";
import { business, navLinks } from "@/data/business";
import { useCart } from "@/components/CartProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled && !open;
  const light = !solid; // light text over dark hero / dark menu

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "bg-cream/92 shadow-[0_1px_0_rgba(42,28,19,0.08),0_10px_30px_-18px_rgba(42,28,19,0.35)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ${solid ? "h-16" : "h-20"}`}>
          <Link href="/" onClick={() => setOpen(false)} aria-label="Basera Restaurant & Hotel, home" className="group leading-none">
            <span className={`block font-display text-2xl font-semibold tracking-[0.28em] transition-colors ${light ? "text-cream" : "text-espresso"}`}>
              BASERA
            </span>
            <span className={`mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.3em] transition-colors ${light ? "text-gold-soft" : "text-gold-deep"}`}>
              Restaurant &amp; Hotel
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                        light ? "text-cream/85 hover:text-cream" : "text-cocoa hover:text-espresso"
                      } ${active ? (light ? "text-cream" : "text-espresso") : ""}`}
                    >
                      {l.label}
                      <span
                        className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/order"
              aria-label={`Your order, ${count} ${count === 1 ? "item" : "items"}`}
              className={`relative hidden h-11 w-11 items-center justify-center rounded-full border transition-colors sm:inline-flex ${
                light ? "border-cream/35 text-cream hover:bg-cream/10" : "border-espresso/20 text-espresso hover:bg-espresso/5"
              }`}
            >
              <ShoppingBag size={18} aria-hidden />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.68rem] font-bold text-espresso">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/order" className="btn btn-gold btn-sm hidden sm:inline-flex">
              Order / Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full xl:hidden ${light ? "text-cream" : "text-espresso"}`}
            >
              <span className="relative block h-4 w-6">
                <span className={`absolute left-0 h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "top-[7px] rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-[7px] h-0.5 w-6 rounded bg-current transition-all duration-200 ${open ? "scale-x-0 opacity-0" : ""}`} />
                <span className={`absolute left-0 h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="jaali fixed inset-0 z-40 overflow-y-auto bg-espresso xl:hidden"
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto flex min-h-full max-w-lg flex-col px-6 pb-10 pt-28">
              <nav aria-label="Mobile">
                <ul className="space-y-1">
                  {navLinks.map((l, i) => {
                    const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                    return (
                      <m.li
                        key={l.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-baseline gap-4 border-b border-cream/10 py-3 font-display text-3xl transition-colors ${
                            active ? "text-gold-soft" : "text-cream hover:text-gold-soft"
                          }`}
                        >
                          <span className="font-sans text-xs tracking-widest text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                          {l.label}
                        </Link>
                      </m.li>
                    );
                  })}
                </ul>
              </nav>

              <m.div
                className="mt-8 grid gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.45 }}
              >
                <Link href="/order" onClick={() => setOpen(false)} className="btn btn-gold">
                  <ShoppingBag size={18} aria-hidden /> Order / Enquire {count > 0 && `(${count})`}
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <WhatsAppButton topic="general" className="w-full">WhatsApp</WhatsAppButton>
                  <a href={`tel:${business.phoneTel}`} className="btn btn-light w-full">
                    <Phone size={18} aria-hidden /> Call
                  </a>
                </div>
                <p className="mt-2 text-center text-sm text-cream/60">{business.phoneDisplay}</p>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
