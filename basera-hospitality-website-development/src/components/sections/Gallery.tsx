"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/data/business";
import Photo, { pexelsUrl } from "@/components/Photo";

const shapeClass = { wide: "aspect-[4/3]", tall: "aspect-[3/4]", square: "aspect-square" } as const;

export default function Gallery({ preview = false }: { preview?: boolean }) {
  const [filter, setFilter] = useState<GalleryCategory | "All">("All");
  const [active, setActive] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const list = useMemo(() => {
    const base = filter === "All" ? galleryImages : galleryImages.filter((g) => g.category === filter);
    return preview ? galleryImages.slice(0, 6) : base;
  }, [filter, preview]);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((d: number) => setActive((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (active === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [active, close, step]);

  const current = active !== null ? list[active] : null;

  return (
    <div>
      {!preview && (
        <div role="group" aria-label="Filter photos" className="mb-10 flex flex-wrap gap-2">
          {(["All", ...galleryCategories] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors ${
                filter === c ? "border-espresso bg-espresso text-cream" : "border-espresso/20 text-cocoa hover:border-espresso/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {list.map((g, i) => (
          <li key={g.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setActive(i);
              }}
              aria-label={`Open photo: ${g.caption}`}
              className={`group relative block w-full overflow-hidden rounded-2xl bg-sand ${shapeClass[g.shape]}`}
            >
              <span className="block h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                <Photo image={g} alt={g.alt} sizes="(min-width:1024px) 33vw, 50vw" />
              </span>
              <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-soft">{g.category}</span>
                <span className="mt-0.5 text-left text-sm font-medium text-cream">{g.caption}</span>
              </span>
              <span className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-espresso opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
                <Expand size={15} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {preview ? (
        <div className="mt-10">
          <Link href="/gallery" className="btn btn-dark">
            See the Full Gallery <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      ) : (
        <p className="mt-8 text-sm text-umber">
          These are representative stock photographs, not pictures of Basera itself. Basera&apos;s own photos will replace them.
        </p>
      )}

      {current &&
        createPortal(
          <AnimatePresence>
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Photo viewer"
              className="fixed inset-0 z-[80] flex flex-col bg-espresso/95 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(e) => e.target === e.currentTarget && close()}
            >
              <div className="flex items-center justify-between px-4 py-3 text-cream">
                <p className="text-sm text-cream/70">
                  {(active ?? 0) + 1} / {list.length}
                </p>
                <button
                  type="button"
                  onClick={close}
                  autoFocus
                  aria-label="Close photo viewer"
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream/10"
                >
                  <X size={22} aria-hidden />
                </button>
              </div>
              <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onMouseDown={(e) => e.target === e.currentTarget && close()}>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-espresso/60 text-cream hover:bg-cream/15 sm:left-4"
                >
                  <ChevronLeft aria-hidden />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={current.id}
                  src={current.src ?? pexelsUrl(current.pexelsId ?? 0, 1600)}
                  alt={current.alt}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                />
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-espresso/60 text-cream hover:bg-cream/15 sm:right-4"
                >
                  <ChevronRight aria-hidden />
                </button>
              </div>
              <p className="px-4 py-4 text-center text-sm text-cream/80">
                <span className="font-semibold text-gold-soft">{current.category}</span> · {current.caption}
              </p>
            </m.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
