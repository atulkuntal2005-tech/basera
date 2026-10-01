"use client";

import Link from "next/link";
import { Phone, ShoppingBag } from "lucide-react";
import { business } from "@/data/business";
import { WhatsAppIcon } from "@/components/icons";
import { useCart } from "@/components/CartProvider";
import { waLink, waMessages } from "@/lib/whatsapp";

/** Thumb-friendly action bar, phones only. */
export default function StickyMobileCta() {
  const { count } = useCart();
  const item =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.72rem] font-semibold tracking-wide transition-colors active:bg-white/10";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-espresso/96 pb-[env(safe-area-inset-bottom)] text-cream backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-md divide-x divide-cream/10">
        <a href={waLink(waMessages.general)} target="_blank" rel="noopener noreferrer" className={item}>
          <WhatsAppIcon className="text-[#3ddc84]" width="1.3em" height="1.3em" />
          WhatsApp
        </a>
        <a href={`tel:${business.phoneTel}`} className={item}>
          <Phone size={20} aria-hidden className="text-gold-soft" />
          Call
        </a>
        <Link href="/order" className={`${item} relative`}>
          <span className="relative">
            <ShoppingBag size={20} aria-hidden className="text-gold-soft" />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-bold text-espresso">
                {count}
              </span>
            )}
          </span>
          Order
        </Link>
      </div>
    </nav>
  );
}
