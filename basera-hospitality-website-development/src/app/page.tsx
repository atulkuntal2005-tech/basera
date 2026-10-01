import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import About from "@/components/sections/About";
import Restaurant from "@/components/sections/Restaurant";
import Hotel from "@/components/sections/Hotel";
import Banquet from "@/components/sections/Banquet";
import Gallery from "@/components/sections/Gallery";
import ContactInfo from "@/components/sections/ContactInfo";
import CtaBand from "@/components/sections/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <Restaurant />
      <Hotel />
      <Banquet />

      <section className="py-24 sm:py-28" aria-labelledby="gallery-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Gallery"
              title={<span id="gallery-heading">A look at the food, the rooms and the occasions.</span>}
              text="Representative photographs for now. We'll be adding pictures of Basera itself."
            />
          </Reveal>
          <div className="mt-12">
            <Gallery preview />
          </div>
        </div>
      </section>

      <section className="bg-sand/50 py-24 sm:py-28" aria-labelledby="visit-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Find us" title={<span id="visit-heading">Come by, or call ahead.</span>} text="We are on the NH-2 Delhi–Agra Bypass Road at Chourah, Mathura." />
          </Reveal>
          <div className="mt-12">
            <ContactInfo />
          </div>
          <Reveal className="mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-gold-deep underline-offset-4 hover:underline">
              Send us an enquiry <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="pt-20">
        <CtaBand />
      </div>
    </>
  );
}
