import { menuItemById, type MenuItem } from "@/data/business";

export type CartItem = { id: string; qty: number };
export type OrderLine = { item: MenuItem; qty: number; lineTotal: number | null };

export const MAX_QTY = 50;

export function formatPrice(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Resolve cart ids against the menu data (so names and prices always come from business.ts). */
export function computeOrder(items: CartItem[]) {
  const lines: OrderLine[] = [];
  for (const { id, qty } of items) {
    const item = menuItemById.get(id);
    if (!item || !Number.isInteger(qty) || qty < 1) continue;
    const q = Math.min(qty, MAX_QTY);
    lines.push({ item, qty: q, lineTotal: item.price === null ? null : item.price * q });
  }
  const subtotal = lines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0);
  const unpriced = lines.filter((l) => l.lineTotal === null).length;
  const allPriced = lines.length > 0 && unpriced === 0;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, subtotal, unpriced, allPriced, count };
}

export function totalLabel(o: ReturnType<typeof computeOrder>): string {
  if (o.lines.length === 0) return "—";
  if (o.allPriced) return formatPrice(o.subtotal);
  if (o.subtotal > 0) return `${formatPrice(o.subtotal)} + items on request`;
  return "To be confirmed by Basera";
}
