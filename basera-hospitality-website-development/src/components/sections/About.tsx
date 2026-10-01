import Link from "next/link";
import { ArrowRight, BedDouble, PartyPopper, UtensilsCrossed } from "lucide-react";
import { images } from "@/data/business";
import Photo from "@/components/Photo";
import Reveal, { ImageReveal } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const pillars = [
  { icon: UtensilsCrossed, title: "The restaurant", text: "Vegetarian food for lunch, dinner and everything between." },
  { icon: BedDouble, title: "The hotel", text: "Simple, comfortable rooms for when you need to rest." },
  { icon: PartyPopper, title: "The banquet", text: "Room to bring family and friends together." },
];

const values = [
  ["Hospitality", "You are a guest first, a customer second."],
  ["Food", "Vegetarian, freshly cooked, and easy to share."],
  ["Convenience", "Meal, room and event space at one address."],
  ["Family-friendly", "A comfortable place for all ages at one table."],
  ["Mathura", "Right on the NH-2 Delhi–Agra Bypass Road, at Chourah."],
];

export default function About({ full = false }: { full?: boolean }) {
  return (
    <section className="paper overflow-hidden py-24 sm:py-32" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <ImageReveal className="aspect-[4/5] rounded-t-[999px] rounded-b-3xl shadow-[0_40px_70px_-35px_rgba(42,28,19,0.6)]">
            <Photo image={images.about} alt="Indian vegetarian thali with naan, paneer curry and rice (representative stock photo)" sizes="(min-width:1024px) 40vw, 90vw" />
          </ImageReveal>
          <Reveal delay={0.25} className="absolute -bottom-8 -right-2 w-[46%] sm:-right-6">
            <div className="overflow-hidden rounded-2xl border-[6px] border-cream shadow-xl">
              <div className="aspect-square">
                <Photo image={images.aboutSmall} alt="Paneer in a rich gravy (representative stock photo)" sizes="25vw" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              eyebrow="About Basera"
              title={
                <span id="about-heading">
                  A meal, a room and a <em className="text-gold-deep">celebration</em>, under one roof.
                </span>
              }
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 max-w-xl space-y-4 text-[1.05rem] leading-relaxed text-cocoa">
              <p>
                In Hindi, <em>basera</em> means a place to rest, somewhere that feels like home for a while. That is the feeling we want
                every guest to carry out of the door.
              </p>
              <p>
                Basera Restaurant &amp; Hotel brings together a vegetarian restaurant, hotel accommodation and banquet facilities on the
                NH-2 Delhi–Agra Bypass Road in Mathura. Stop by for a family meal, stay a night or two, or plan a get-together. It is all
                in one place, which makes everything a little easier.
              </p>
            </div>
          </Reveal>

          <ul className="mt-9 grid gap-4 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.15 + i * 0.08}>
                <div className="h-full rounded-2xl border border-parchment bg-cream/80 p-5">
                  <p.icon size={22} className="text-gold-deep" aria-hidden />
                  <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cocoa">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          {full && (
            <Reveal delay={0.1}>
              <h3 className="mt-12 text-2xl font-semibold">What we care about</h3>
              <dl className="mt-4 divide-y divide-parchment border-y border-parchment">
                {values.map(([t, d]) => (
                  <div key={t} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <dt className="font-display text-lg font-semibold text-gold-deep">{t}</dt>
                    <dd className="text-cocoa">{d}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {!full && (
            <Reveal delay={0.3}>
              <Link href="/about" className="btn btn-dark mt-10">
                Discover Basera <ArrowRight size={17} aria-hidden />
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
