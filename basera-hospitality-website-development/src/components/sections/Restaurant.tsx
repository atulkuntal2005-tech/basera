import Link from "next/link";
import { ArrowRight, ChefHat, Coffee, Cookie, Flame, Soup, Wheat } from "lucide-react";
import { images, restaurantCards } from "@/data/business";
import Photo from "@/components/Photo";
import Reveal, { ImageReveal } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";

const icons = [ChefHat, Flame, Soup, Wheat, Cookie, Coffee];

export default function Restaurant() {
  return (
    <section className="jaali relative overflow-hidden bg-espresso py-24 text-cream sm:py-32" aria-labelledby="dining-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionHeading
              light
              eyebrow="Restaurant"
              title={<span id="dining-heading">Dining at Basera</span>}
              text="Vegetarian dining with a wide spread of North Indian favourites and a good variety of other meals to go with them. It is a relaxed, comfortable place to sit down with family, and nobody is rushed."
            />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <ImageReveal className="aspect-[16/10] rounded-3xl">
              <Photo image={images.restaurant} alt="Warm restaurant dining interior (representative stock photo)" sizes="(min-width:1024px) 40vw, 90vw" />
            </ImageReveal>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurantCards.map((c, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={c.name} delay={(i % 3) * 0.08}>
                <Link
                  href={`/menu#${c.menuSlug}`}
                  className="group relative flex h-full items-start gap-5 overflow-hidden rounded-3xl border border-cream/10 bg-cream/[0.04] p-6 transition duration-300 hover:border-gold/60 hover:bg-cream/[0.08]"
                >
                  <span className="font-display text-5xl font-light leading-none text-gold/40 transition-colors group-hover:text-gold" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <Icon size={20} className="text-gold-soft" aria-hidden />
                    <h3 className="mt-2 text-2xl font-medium">{c.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream/65">{c.text}</p>
                  </span>
                  <ArrowRight
                    size={18}
                    className="absolute right-5 top-6 text-gold-soft opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/menu" className="btn btn-gold">
            View Full Menu <ArrowRight size={17} aria-hidden />
          </Link>
          <WhatsAppButton topic="restaurant" variant="light" icon>
            Ask About the Menu
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}
