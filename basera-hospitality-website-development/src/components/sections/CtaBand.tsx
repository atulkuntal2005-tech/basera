import Link from "next/link";
import { Phone } from "lucide-react";
import { business } from "@/data/business";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CtaBand({
  title = "Questions? We're just a message away.",
  text = "Ask about the menu, a room or an event. A real person from Basera will get back to you.",
  topic = "question" as "question" | "general" | "restaurant" | "hotel" | "banquet" | "order",
}) {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8" aria-label="Get in touch">
      <Reveal>
        <div className="jaali mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-espresso px-6 py-14 text-center sm:px-14 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-medium text-cream sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">{text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton topic={topic}>Chat on WhatsApp</WhatsAppButton>
            <a href={`tel:${business.phoneTel}`} className="btn btn-light">
              <Phone size={17} aria-hidden /> Call {business.phoneDisplay}
            </a>
            <Link href="/order" className="btn btn-gold">Order Now</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
