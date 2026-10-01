import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { business, mapsOpenUrl, navLinks } from "@/data/business";
import { InstagramIcon } from "@/components/icons";
import WhatsAppButton from "@/components/WhatsAppButton";

const quick = navLinks.filter((l) => l.href !== "/restaurant");

export default function Footer() {
  const a = business.address;
  return (
    <footer className="jaali relative bg-espresso pb-28 pt-16 text-cream/80 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-semibold tracking-[0.28em] text-cream">BASERA</p>
            <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold-soft">Restaurant &amp; Hotel</p>
            <p className="mt-6 max-w-sm leading-relaxed text-cream/70">
              Vegetarian food, rooms to rest in and a hall for your celebrations, all in one place on the Delhi–Agra bypass at Mathura.
            </p>
            <WhatsAppButton topic="order" className="mt-7">Order on WhatsApp</WhatsAppButton>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">Quick Links</h2>
            <ul className="mt-5 space-y-2.5">
              {quick.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-0.5 transition-colors hover:text-gold-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">Contact</h2>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                <a href={`tel:${business.phoneTel}`} className="hover:text-gold-soft">{business.phoneDisplay}</a>
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                <a href={mapsOpenUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">
                  {a.line1}, {a.line2}, {a.city}, {a.state} {a.postalCode}
                </a>
              </li>
              <li className="flex gap-3">
                <InstagramIcon className="mt-0.5 shrink-0 text-gold" />
                <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">
                  @{business.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Basera Restaurant &amp; Hotel. All rights reserved.</p>
          <p className="text-xs">Photos on this site are representative stock images, not pictures of Basera.</p>
        </div>
      </div>
    </footer>
  );
}
