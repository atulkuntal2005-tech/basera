"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { computeOrder, formatPrice, totalLabel } from "@/lib/order";

type Props = {
  /** "sidebar" shows a Proceed to Order link; "checkout" is used beside the form */
  variant?: "sidebar" | "checkout";
  className?: string;
};

export default function OrderSummary({ variant = "sidebar", className = "" }: Props) {
  const { items, hydrated, setQty, remove, clear } = useCart();
  const order = useMemo(() => computeOrder(items), [items]);

  const stepBtn =
    "flex h-8 w-8 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-espresso hover:text-cream";

  return (
    <aside aria-label="Order summary" className={`rounded-3xl border border-parchment bg-cream p-5 shadow-[0_24px_50px_-30px_rgba(42,28,19,0.5)] sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        {order.count > 0 && (
          <span className="rounded-full bg-espresso px-2.5 py-1 text-xs font-bold text-cream">
            {order.count} {order.count === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {!hydrated ? (
        <div className="mt-6 h-24 animate-pulse rounded-2xl bg-sand" aria-hidden />
      ) : order.lines.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-sand/70 p-6 text-center">
          <ShoppingBag className="mx-auto text-gold-deep" size={30} aria-hidden />
          <p className="mt-3 font-semibold">Your order is empty</p>
          <p className="mt-1 text-sm text-cocoa">Add a few dishes from the menu and they will show up here.</p>
        </div>
      ) : (
        <>
          <ul className="mt-5 divide-y divide-parchment" aria-live="polite">
            {order.lines.map((l) => (
              <li key={l.item.id} className="py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-semibold leading-snug">{l.item.name}</p>
                  <button
                    type="button"
                    onClick={() => remove(l.item.id)}
                    aria-label={`Remove ${l.item.name}`}
                    className="-mr-1.5 -mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-umber hover:bg-sand hover:text-clay"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button type="button" className={stepBtn} onClick={() => setQty(l.item.id, l.qty - 1)} aria-label={`Decrease quantity of ${l.item.name}`}>
                      <Minus size={14} aria-hidden />
                    </button>
                    <span className="w-6 text-center font-semibold tabular-nums" aria-label={`Quantity ${l.qty}`}>{l.qty}</span>
                    <button type="button" className={stepBtn} onClick={() => setQty(l.item.id, l.qty + 1)} aria-label={`Increase quantity of ${l.item.name}`}>
                      <Plus size={14} aria-hidden />
                    </button>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-umber">
                      {l.item.price === null ? "Price on request" : `${formatPrice(l.item.price)} each`}
                    </p>
                    {l.lineTotal !== null && <p className="font-semibold">{formatPrice(l.lineTotal)}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-2 space-y-2 border-t border-espresso/15 pt-4 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-cocoa">Subtotal</dt>
              <dd className="text-right font-semibold">
                {order.subtotal > 0 ? formatPrice(order.subtotal) : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="text-right font-display text-lg font-semibold">{totalLabel(order)}</dd>
            </div>
          </dl>
          {order.unpriced > 0 && (
            <p className="mt-3 rounded-xl bg-sand/80 p-3 text-xs leading-relaxed text-cocoa">
              {order.unpriced === order.lines.length ? "Prices are shared" : "Some prices are shared"} by Basera when they confirm your order,
              so your final bill is always accurate.
            </p>
          )}

          <div className="mt-5 grid gap-2.5">
            {variant === "sidebar" && (
              <Link href="/order" className="btn btn-dark">
                Proceed to Order
              </Link>
            )}
            <button type="button" onClick={clear} className="btn btn-outline btn-sm">
              <Trash2 size={15} aria-hidden /> Clear Order
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
