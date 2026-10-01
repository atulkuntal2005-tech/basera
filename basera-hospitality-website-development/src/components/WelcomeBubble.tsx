"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useGreeting } from "@/components/useGreeting";
import { waLink } from "@/lib/whatsapp";

const KEY = "basera-welcome-dismissed";

/** A small, friendly hello that appears once per visit. */
export default function WelcomeBubble() {
  const greeting = useGreeting();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* ignore */
    }
    if (dismissed) return;
    const t = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setShow(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <m.aside
          role="complementary"
          aria-label="Welcome message"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[4.75rem] left-3 right-3 z-30 max-w-[20rem] rounded-2xl border border-parchment bg-cream p-4 pr-10 shadow-[0_18px_50px_-18px_rgba(42,28,19,0.55)] sm:left-5 md:bottom-6"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss welcome message"
            className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full text-umber hover:bg-sand"
          >
            <X size={16} aria-hidden />
          </button>
          <p className="font-display text-lg font-semibold leading-snug">{greeting.hello} 🙏</p>
          <p className="mt-1 text-sm leading-relaxed text-cocoa">
            Looking for a table, a room or a hall for a function? Say hello, and we&apos;ll help you out.
          </p>
          <a
            href={waLink("Namaste Basera! I just visited your website and wanted to say hello.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="btn btn-wa btn-sm mt-3"
          >
            <WhatsAppIcon /> Say hello on WhatsApp
          </a>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
