import type { Metadata } from "next";
import { images } from "@/data/business";
import PageHero from "@/components/PageHero";
import ContactInfo from "@/components/sections/ContactInfo";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: "Call, WhatsApp or send an enquiry to Basera Restaurant & Hotel, NH-2 Delhi–Agra Bypass Road, Chourah, Mathura.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello. We'd love to hear from you."
        text="Call, WhatsApp, or send an enquiry. Whatever is easiest for you."
        image={images.contactBanner}
        imageAlt="Cosy restaurant interior (representative stock photo)"
      />
      <section className="py-20 sm:py-24" aria-label="How to reach Basera">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactInfo />
        </div>
      </section>

      <section className="paper bg-sand/50 py-20 sm:py-24" aria-labelledby="enquiry-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Send an enquiry"
              title={<span id="enquiry-heading">Write to us.</span>}
              text="Tell us what you need and we'll contact you shortly. If you leave an email, you'll also get a confirmation copy."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton topic="question" small>Ask a Question</WhatsAppButton>
              <WhatsAppButton topic="hotel" small variant="outline" className="!text-espresso">Book a Room</WhatsAppButton>
              <WhatsAppButton topic="banquet" small variant="outline" className="!text-espresso">Plan an Event</WhatsAppButton>
              <WhatsAppButton topic="order" small variant="outline" className="!text-espresso">Order Now</WhatsAppButton>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-3xl border border-parchment bg-cream p-6 shadow-[0_30px_60px_-40px_rgba(42,28,19,0.5)] sm:p-9">
              <EnquiryForm kind="contact" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
