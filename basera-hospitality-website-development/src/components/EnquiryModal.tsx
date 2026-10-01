"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import type { FormKind } from "@/lib/validation";

type Props = {
  kind: Exclude<FormKind, "contact">;
  title: string;
  intro: string;
  children: ReactNode;
  className?: string;
};

/** A button that opens an accessible dialog containing the hotel / banquet enquiry form. */
export default function EnquiryModal({ kind, title, intro, children, className = "btn btn-gold" }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        // Keep keyboard focus inside the dialog
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])',
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button ref={triggerRef} type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children}
      </button>
      {open &&
        createPortal(
          <AnimatePresence>
            <m.div
              className="fixed inset-0 z-[70] flex items-end justify-center bg-espresso/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
            >
              <m.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-${kind}-title`}
                className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-[1.75rem] bg-cream p-5 shadow-2xl sm:rounded-[1.75rem] sm:p-9"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close form"
                  className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-cocoa hover:bg-sand"
                >
                  <X size={20} aria-hidden />
                </button>
                <p className="eyebrow">Basera</p>
                <h2 id={`modal-${kind}-title`} className="mt-1 pr-10 text-3xl font-semibold">
                  {title}
                </h2>
                <p className="mb-6 mt-2 text-cocoa">{intro}</p>
                <EnquiryForm kind={kind} autoFocus />
              </m.div>
            </m.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
