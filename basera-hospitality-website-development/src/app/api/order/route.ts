import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { sendOrderEmails } from "@/lib/mailer";
import { computeOrder, totalLabel, type CartItem } from "@/lib/order";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateCustomer } from "@/lib/validation";

export const runtime = "nodejs";

const FAIL_MESSAGE =
  "Sorry, we couldn't send your order just now. Please try again, or send it on WhatsApp or call +91 94122 78120.";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object") throw new Error("bad body");
  } catch {
    return NextResponse.json({ ok: false, message: "That request didn't look right." }, { status: 400 });
  }

  const startedAt = Number(body.startedAt);
  if (body.company || (Number.isFinite(startedAt) && Date.now() - startedAt < 1500)) {
    return NextResponse.json({ ok: true, message: "Thank you! Your order request has been received." });
  }
  if (!rateLimit(`order:${clientIp(req)}`)) {
    return NextResponse.json(
      { ok: false, message: "You've sent a few orders already. Please wait a little, or call us directly." },
      { status: 429 },
    );
  }

  const { ok, errors, data: customer } = validateCustomer((body.customer ?? {}) as Record<string, unknown>);

  // Never trust prices/names from the browser: rebuild the order from ids + quantities.
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 60) : [];
  const items: CartItem[] = rawItems
    .map((i) => ({ id: String((i as CartItem)?.id ?? ""), qty: Number((i as CartItem)?.qty) }))
    .filter((i) => i.id && Number.isInteger(i.qty));
  const order = computeOrder(items);

  if (!ok) return NextResponse.json({ ok: false, errors, message: "Please check the highlighted fields." }, { status: 400 });
  if (order.lines.length === 0)
    return NextResponse.json({ ok: false, message: "Your order is empty. Please add a few dishes first." }, { status: 400 });

  const cleanItems: CartItem[] = order.lines.map((l) => ({ id: l.item.id, qty: l.qty }));

  let rowId: number | null = null;
  try {
    const [row] = await db
      .insert(enquiries)
      .values({
        kind: "order",
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
        payload: {
          customer,
          items: order.lines.map((l) => ({ id: l.item.id, name: l.item.name, qty: l.qty, lineTotal: l.lineTotal })),
          total: totalLabel(order),
        },
      })
      .returning({ id: enquiries.id });
    rowId = row.id;
  } catch (err) {
    console.error("[order] db insert failed", err);
  }

  let emailStatus: "sent" | "not_configured" | "failed" = "sent";
  try {
    await sendOrderEmails(customer, cleanItems);
  } catch (err) {
    emailStatus = err instanceof Error && err.message === "not_configured" ? "not_configured" : "failed";
    if (emailStatus === "failed") console.error("[order] email failed", err);
  }

  if (rowId !== null) {
    try {
      await db.update(enquiries).set({ emailStatus }).where(eq(enquiries.id, rowId));
    } catch {
      /* non-fatal */
    }
  }

  if (rowId === null && emailStatus !== "sent") return NextResponse.json({ ok: false, message: FAIL_MESSAGE }, { status: 500 });

  return NextResponse.json({
    ok: true,
    message: "Thank you! Your order request has been received. Basera will contact you shortly to confirm it.",
  });
}
