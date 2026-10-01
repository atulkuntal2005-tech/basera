"use client";

import { useGreeting } from "@/components/useGreeting";

/** The warm, time-aware hello at the top of the hero. */
export default function GreetingChip() {
  const g = useGreeting();
  return (
    <div className="rise inline-flex max-w-full items-center gap-3 rounded-full border border-gold-soft/35 bg-espresso/40 py-2 pl-2 pr-5 backdrop-blur-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/90 text-base" aria-hidden>
        🙏
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-sm font-semibold text-cream" aria-live="polite">{g.hello}</span>
        <span className="block truncate text-xs text-cream/65">{g.note}</span>
      </span>
    </div>
  );
}
