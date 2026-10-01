import Link from "next/link";
import { ArrowUpRight, BedDouble, MessageCircle, PartyPopper, UtensilsCrossed } from "lucide-react";
import { services } from "@/data/business";
import Reveal from "@/components/Reveal";

const icons = {
  dining: UtensilsCrossed,
  stay: BedDouble,
  events: PartyPopper,
  contact: MessageCircle,
} as const;

export default function Features() {
  return (
    <section aria-label="What Basera offers" className="relative z-10 -mt-14 px-4 sm:-mt-16 sm:px-6 lg:px-8">
      <ul className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => {
          const Icon = icons[s.key];
          return (
            <Reveal as="li" key={s.key} delay={i * 0.08}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-3xl border border-parchment/80 bg-cream p-6 shadow-[0_24px_50px_-28px_rgba(42,28,19,0.45)] transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_30px_60px_-26px_rgba(42,28,19,0.55)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-espresso text-gold-soft transition-colors duration-300 group-hover:bg-gold group-hover:text-espresso">
                  <Icon size={21} aria-hidden />
                </span>
                <h2 className="mt-5 font-sans text-[0.8rem] font-bold uppercase tracking-[0.18em] text-espresso">{s.title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-cocoa">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-deep">
                  Learn more
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
