"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/** Loads only the lightweight animation features to keep the JS bundle small. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
