"use client";

import { useSyncExternalStore } from "react";

export type Greeting = { hello: string; note: string };

function compute(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()),
  );
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

const COPY: Record<string, Greeting> = {
  // Server render + first paint use this neutral one, then it upgrades on the client.
  default: { hello: "Namaste, welcome to Basera", note: "Take a look around. We're glad you dropped by." },
  morning: { hello: "Namaste, good morning", note: "Hope your day is off to a gentle start." },
  afternoon: { hello: "Namaste, good afternoon", note: "Thinking about lunch? Have a look at the menu." },
  evening: { hello: "Namaste, good evening", note: "Dinner plans? We'd love to host you." },
  night: { hello: "Namaste, good evening", note: "Planning a trip to Mathura? Write to us and we'll help." },
};

const subscribe = () => () => {};

/** Time-of-day greeting in Indian time. Hydration-safe via useSyncExternalStore. */
export function useGreeting(): Greeting {
  const part = useSyncExternalStore(subscribe, compute, () => "default");
  return COPY[part] ?? COPY.default;
}
