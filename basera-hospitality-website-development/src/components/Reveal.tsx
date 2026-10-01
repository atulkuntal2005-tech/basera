"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/** Fade + slide-up when scrolled into view. Respects reduced-motion. */
export default function Reveal({ children, delay = 0, y = 22, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Image wrapper: slow zoom-out "reveal" once it enters the viewport. */
export function ImageReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <m.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.12, opacity: 0.6 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </div>
  );
}
