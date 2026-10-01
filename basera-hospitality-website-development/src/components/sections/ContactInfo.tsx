import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { business, mapsDirectionsUrl, mapsEmbedUrl, mapsOpenUrl } from "@/data/business";
import { InstagramIcon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactInfo() {
  const a = business.address;
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <Reveal className="lg:col-span-5">
        <div className="flex h-full flex-col rounded-3xl border border-parchment bg-cream p-7 sm:p-9">
          <h3 className="text-3xl font-semibold">{business.name}</h3>
          <ul className="mt-7 space-y-6">
            <li className="flex gap-4">
              <MapPin className="mt-1 shrink-0 text-gold-deep" size={22} aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-umber">Address</p>
                <address className="mt-1 not-italic leading-relaxed">
                  {a.line1},
                  <br />
                  {a.line2},
                  <br />
                  {a.city}, {a.state} {a.postalCode}
                </address>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 shrink-0 text-gold-deep" size={22} aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-umber">Phone</p>
                <a href={`tel:${business.phoneTel}`} className="mt-1 inline-block text-lg font-semibold hover:text-gold-deep">
                  {business.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <InstagramIcon className="mt-1 shrink-0 text-gold-deep" width="22" height="22" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-umber">Instagram</p>
                <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold hover:text-gold-deep">
                  @{business.instagramHandle}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-1 shrink-0 text-gold-deep" size={22} aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-umber">Timings</p>
                <p className="mt-1 text-cocoa">Please call or WhatsApp us to confirm timings before you visit.</p>
              </div>
            </li>
          </ul>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={`tel:${business.phoneTel}`} className="btn btn-dark">
              <Phone size={17} aria-hidden /> Call Now
            </a>
            <WhatsAppButton topic="general">WhatsApp</WhatsAppButton>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm:col-span-2">
              <Navigation size={17} aria-hidden /> Get Directions
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-7">
        <div className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-parchment bg-sand">
          <iframe
            title="Map showing the location of Basera Restaurant & Hotel, Mathura"
            src={mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[20rem] w-full flex-1 border-0"
            allowFullScreen
          />
          <div className="flex items-center justify-between gap-3 bg-cream px-5 py-3">
            <p className="text-sm text-cocoa">Chourah, NH-2 Delhi–Agra Bypass</p>
            <a href={mapsOpenUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold-deep underline-offset-4 hover:underline">
              Open in Google Maps
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
