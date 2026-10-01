import { Cake, Gift, HeartHandshake, Home, Sparkles, Users } from "lucide-react";
import { eventTypes, images } from "@/data/business";
import EnquiryModal from "@/components/EnquiryModal";
import Photo from "@/components/Photo";
import Reveal, { ImageReveal } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";

const icons = { family: Home, birthday: Cake, anniversary: HeartHandshake, small: Users, social: Sparkles, private: Gift } as const;

export default function Banquet() {
  return (
    <section className="paper bg-sand/60 py-24 sm:py-32" aria-labelledby="celebrate-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <SectionHeading
              eyebrow="Banquet & Events"
              title={<span id="celebrate-heading">Celebrate at Basera</span>}
              text="A convenient venue for celebrations and gatherings, with the restaurant kitchen close at hand. Tell us about your occasion and we will talk through how we can help."
            />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <ImageReveal className="aspect-[16/9] rounded-3xl">
              <Photo image={images.banquet} alt="Banquet tables with floral centrepieces (representative stock photo)" sizes="(min-width:1024px) 50vw, 90vw" />
            </ImageReveal>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((e, i) => {
            const Icon = icons[e.key];
            return (
              <Reveal as="li" key={e.key} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-3xl border border-parchment bg-cream p-6 transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_24px_50px_-28px_rgba(42,28,19,0.5)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-gold-deep transition-colors group-hover:bg-espresso group-hover:text-gold-soft">
                    <Icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{e.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cocoa">{e.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
          <EnquiryModal
            kind="banquet"
            title="Plan your event"
            intro="Tell us a little about the occasion and we'll get in touch to talk it through."
            className="btn btn-dark"
          >
            Plan Your Event
          </EnquiryModal>
          <WhatsAppButton topic="banquet" variant="outline" className="!text-espresso">
            Plan an Event on WhatsApp
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}
