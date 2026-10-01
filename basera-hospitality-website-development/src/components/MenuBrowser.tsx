"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingBag } from "lucide-react";
import { menuCategories, menuItems, type MenuItem } from "@/data/business";
import { VegMark } from "@/components/icons";
import { useCart } from "@/components/CartProvider";
import OrderSummary from "@/components/OrderSummary";
import WhatsAppButton from "@/components/WhatsAppButton";
import { computeOrder, formatPrice, totalLabel } from "@/lib/order";

function AddControl({ item }: { item: MenuItem }) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(item.id);
  if (qty === 0) {
    return (
      <button type="button" onClick={() => add(item.id)} className="btn btn-dark btn-sm min-w-[5.5rem]" aria-label={`Add ${item.name} to order`}>
        <Plus size={15} aria-hidden /> Add
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1 rounded-full bg-espresso p-1 text-cream" role="group" aria-label={`Quantity of ${item.name}`}>
      <button type="button" onClick={() => setQty(item.id, qty - 1)} aria-label={`Decrease quantity of ${item.name}`} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream/15">
        <Minus size={15} aria-hidden />
      </button>
      <span className="w-6 text-center text-sm font-bold tabular-nums" aria-live="polite">{qty}</span>
      <button type="button" onClick={() => add(item.id)} aria-label={`Increase quantity of ${item.name}`} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream/15">
        <Plus size={15} aria-hidden />
      </button>
    </div>
  );
}

export default function MenuBrowser() {
  const { items } = useCart();
  const [cat, setCat] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Deep links like /menu#paneer-specials from the Restaurant cards
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      if (h && menuCategories.some((c) => c.slug === h)) setCat(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const q = query.trim().toLowerCase();
  const groups = useMemo(
    () =>
      menuCategories
        .filter((c) => cat === "all" || c.slug === cat)
        .map((c) => ({
          ...c,
          items: menuItems.filter(
            (i) => i.category === c.slug && (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)),
          ),
        }))
        .filter((g) => g.items.length > 0),
    [cat, q],
  );

  const order = useMemo(() => computeOrder(items), [items]);
  const chip = (active: boolean) =>
    `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
      active ? "border-espresso bg-espresso text-cream" : "border-espresso/20 bg-cream text-cocoa hover:border-espresso/50"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="min-w-0">
          <div className="sticky top-16 z-20 -mx-4 border-b border-parchment bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-4">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-umber" aria-hidden />
              <label htmlFor="menu-search" className="sr-only">Search the menu</label>
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, e.g. paneer, dosa, lassi"
                className="field !pl-11"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Menu categories">
              <button type="button" className={chip(cat === "all")} aria-pressed={cat === "all"} onClick={() => setCat("all")}>
                All
              </button>
              {menuCategories.map((c) => (
                <button key={c.slug} type="button" className={chip(cat === c.slug)} aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 rounded-2xl bg-sand/70 p-4 text-sm leading-relaxed text-cocoa">
            All dishes are <strong>100% vegetarian</strong>. Availability can vary through the day, and Basera confirms your order and
            the final bill when they contact you.
          </p>

          {groups.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-parchment p-10 text-center">
              <p className="font-display text-2xl">Nothing matches &ldquo;{query}&rdquo;</p>
              <p className="mt-2 text-cocoa">Try a different word, or ask us if we can make it.</p>
              <WhatsAppButton topic="restaurant" className="mt-5">Ask on WhatsApp</WhatsAppButton>
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.slug} id={g.slug} aria-labelledby={`h-${g.slug}`} className="scroll-mt-44 pt-10">
                <div className="flex items-baseline justify-between gap-4 border-b border-espresso/15 pb-3">
                  <h2 id={`h-${g.slug}`} className="text-3xl font-semibold">{g.name}</h2>
                  <p className="hidden text-sm italic text-umber sm:block">{g.blurb}</p>
                </div>
                <ul className="divide-y divide-parchment/80">
                  {g.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <VegMark />
                          <h3 className="font-sans text-[1.02rem] font-bold leading-snug">{item.name}</h3>
                        </div>
                        <p className="mt-1 pl-[1.625rem] text-sm leading-relaxed text-cocoa">{item.description}</p>
                        <p className="mt-1.5 pl-[1.625rem] text-sm font-semibold text-gold-deep">
                          {item.price === null ? "Price on request" : formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <AddControl item={item} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <OrderSummary variant="sidebar" />
          </div>
        </div>
      </div>

      {order.count > 0 && (
        <Link
          href="/order"
          className="fixed inset-x-3 bottom-[4.75rem] z-30 flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-gold px-5 text-espresso shadow-[0_18px_40px_-12px_rgba(42,28,19,0.6)] md:bottom-5 lg:hidden"
        >
          <span className="flex items-center gap-2.5 font-semibold">
            <ShoppingBag size={19} aria-hidden /> View order · {order.count} {order.count === 1 ? "item" : "items"}
          </span>
          <span className="text-sm font-bold">{order.subtotal > 0 ? totalLabel(order).replace(" + items on request", "+") : "Proceed →"}</span>
        </Link>
      )}
    </div>
  );
}
