import Link from "next/link";
import { ArrowRight, BedDouble, PartyPopper } from "lucide-react";
import { business, images } from "@/data/business";
import Photo from "@/components/Photo";
import GreetingChip from "@/components/GreetingChip";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-espresso">
      <div className="absolute inset-0 -z-10">
        <div className="kenburns h-full w-full">
          <Photo image={images.hero} alt="Warmly lit restaurant interior (representative stock photo)" priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/65 to-espresso/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-transparent to-transparent" />
        <div className="jaali absolute inset-0 opacity-50" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-36 sm:px-6 sm:pb-24 lg:px-8">
        <GreetingChip />

        <h1
          className="rise mt-7 max-w-4xl text-[2.6rem] font-medium leading-[1.04] text-cream sm:text-6xl lg:text-[5.4rem]"
          style={{ animationDelay: "0.12s" }}
        >
          Good Food.
          <br />
          Comfortable Stays.
          <br />
          <span className="italic text-gold-soft">Memorable Moments.</span>
        </h1>

        <p className="rise mt-6 max-w-xl text-[1.05rem] leading-relaxed text-cream/80 sm:text-lg" style={{ animationDelay: "0.25s" }}>
          Experience vegetarian dining, comfortable stays and celebrations at Basera Restaurant &amp; Hotel, Mathura.
        </p>

        <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.38s" }}>
          <Link href="/menu" className="btn btn-gold">
            Explore Menu <ArrowRight size={17} aria-hidden />
          </Link>
          <WhatsAppButton topic="order">Order on WhatsApp</WhatsAppButton>
        </div>

        <div className="rise mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm" style={{ animationDelay: "0.5s" }}>
          <Link href="/hotel" className="inline-flex items-center gap-2 py-1 font-semibold text-cream underline-offset-[6px] decoration-gold/70 hover:underline">
            <BedDouble size={17} className="text-gold-soft" aria-hidden /> Book a Room
          </Link>
          <Link href="/banquet" className="inline-flex items-center gap-2 py-1 font-semibold text-cream underline-offset-[6px] decoration-gold/70 hover:underline">
            <PartyPopper size={17} className="text-gold-soft" aria-hidden /> Plan an Event
          </Link>
          <span className="hidden text-cream/50 sm:inline">
            NH-2 Delhi–Agra Bypass, Chourah, {business.address.city}
          </span>
        </div>
      </div>
    </section>
  );
}
