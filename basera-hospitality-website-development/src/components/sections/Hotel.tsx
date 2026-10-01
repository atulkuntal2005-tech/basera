import { Armchair, BedDouble, Car, HeartHandshake, MapPin, Snowflake, UtensilsCrossed } from "lucide-react";
import { hotelHighlights, images } from "@/data/business";
import EnquiryModal from "@/components/EnquiryModal";
import Photo from "@/components/Photo";
import Reveal, { ImageReveal } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";

const icons = { stay: BedDouble, ac: Snowflake, location: MapPin, food: UtensilsCrossed, parking: Car, care: HeartHandshake } as const;

export default function Hotel() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="stay-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:order-2 lg:col-span-5">
          <div className="relative">
            <ImageReveal className="aspect-[4/5] rounded-3xl shadow-[0_40px_70px_-35px_rgba(42,28,19,0.6)]">
              <Photo image={images.hotel} alt="Hotel room with fresh white bedding (representative stock photo)" sizes="(min-width:1024px) 40vw, 90vw" />
            </ImageReveal>
            <Reveal delay={0.2} className="absolute -bottom-6 -left-3 hidden w-2/5 sm:block">
              <div className="overflow-hidden rounded-2xl border-[6px] border-cream shadow-xl">
                <div className="aspect-[4/3]">
                  <Photo image={images.hotelSecondary} alt="Comfortable bedroom (representative stock photo)" sizes="20vw" />
                </div>
              </div>
            </Reveal>
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-cream/95 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-espresso">
              <Armchair size={14} className="text-gold-deep" aria-hidden /> AC rooms
            </span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              eyebrow="Hotel"
              title={<span id="stay-heading">Stay at Basera</span>}
              text="Whether you are passing through on the Delhi–Agra road or visiting Mathura for a few days, we have comfortable rooms and a kitchen just downstairs. Tell us your dates and we will let you know what is available."
            />
          </Reveal>

          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {hotelHighlights.map((h, i) => {
              const Icon = icons[h.key];
              return (
                <Reveal as="li" key={h.key} delay={(i % 2) * 0.08}>
                  <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold-deep">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-bold">{h.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-cocoa">{h.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <EnquiryModal
              kind="hotel"
              title="Enquire about rooms"
              intro="Share your dates and we'll get back to you about availability and rates."
              className="btn btn-dark"
            >
              Enquire About Rooms
            </EnquiryModal>
            <WhatsAppButton topic="hotel" variant="outline" className="!text-espresso">
              Book a Room on WhatsApp
            </WhatsAppButton>
          </Reveal>
          <p className="mt-4 text-sm text-umber">Room types and rates are shared when you enquire, so you always get current information.</p>
        </div>
      </div>
    </section>
  );
}
