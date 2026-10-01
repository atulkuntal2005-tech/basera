import type { Metadata } from "next";
import { ClipboardList, MessageCircle, PhoneCall } from "lucide-react";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import Banquet from "@/components/sections/Banquet";
import CtaBand from "@/components/sections/CtaBand";
import EnquiryModal from "@/components/EnquiryModal";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Banquet & Events in Mathura",
  description: "Enquire about family functions, birthdays, anniversaries and gatherings at Basera Restaurant & Hotel, Mathura.",
  alternates: { canonical: "/banquet" },
};

const steps = [
  { icon: ClipboardList, title: "Tell us about it", text: "Share the occasion, the rough date and how many guests you expect." },
  { icon: PhoneCall, title: "We call you back", text: "We'll talk through what you need, and answer your questions." },
  { icon: MessageCircle, title: "Plan it together", text: "Menu, arrangements and details, worked out with you step by step." },
];

export default function BanquetPage() {
  return (
    <>
      <PageHero
        eyebrow="Banquet & Events"
        title="Gather the people you love."
        text="A convenient venue for celebrations and get-togethers, with good food close at hand."
        image={images.banquet}
        imageAlt="Banquet tables with floral centrepieces (representative stock photo)"
      >
        <EnquiryModal kind="banquet" title="Plan your event" intro="Tell us a little about the occasion and we'll get in touch to talk it through." className="btn btn-gold">
          Plan Your Event
        </EnquiryModal>
      </PageHero>
      <Banquet />
      <section className="py-24" aria-labelledby="steps-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="How it works" title={<span id="steps-heading">Planning, without the stress.</span>} />
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-parchment bg-cream p-7">
                  <div className="flex items-center justify-between">
                    <s.icon className="text-gold-deep" size={26} aria-hidden />
                    <span className="font-display text-5xl font-light text-gold/40" aria-hidden>{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-cocoa">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand topic="banquet" title="Have a date in mind?" text="Message us and we'll let you know if we can host you." />
    </>
  );
}
