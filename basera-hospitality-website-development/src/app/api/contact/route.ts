import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { sendEnquiryEmails } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateEnquiry } from "@/lib/validation";

export const runtime = "nodejs";

const FAIL_MESSAGE =
  "Sorry, we couldn't send that just now. Please try again, or call or WhatsApp us on +91 94122 78120.";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object") throw new Error("bad body");
  } catch {
    return NextResponse.json({ ok: false, message: "That request didn't look right." }, { status: 400 });
  }

  // Spam protection 1: honeypot field (real people never see or fill it).
  // Spam protection 2: a human needs more than ~1.5s to fill in a form.
  const startedAt = Number(body.startedAt);
  if (body.company || (Number.isFinite(startedAt) && Date.now() - startedAt < 1500)) {
    return NextResponse.json({ ok: true, message: "Thank you! Your enquiry has been received. Basera will contact you shortly." });
  }

  // Spam protection 3: rate limit by IP.
  if (!rateLimit(`contact:${clientIp(req)}`)) {
    return NextResponse.json(
      { ok: false, message: "You've sent a few enquiries already. Please wait a little, or call us directly." },
      { status: 429 },
    );
  }

  const { ok, errors, data } = validateEnquiry(body, "email");
  if (!ok) return NextResponse.json({ ok: false, errors, message: "Please check the highlighted fields." }, { status: 400 });

  // 1) Keep a copy in the database, always.
  let rowId: number | null = null;
  try {
    const [row] = await db
      .insert(enquiries)
      .values({ kind: data.form, name: data.name, phone: data.phone, email: data.email || null, payload: data })
      .returning({ id: enquiries.id });
    rowId = row.id;
  } catch (err) {
    console.error("[contact] db insert failed", err);
  }

  // 2) Email the business (+ confirmation to the customer when an email was given).
  let emailStatus: "sent" | "not_configured" | "failed" = "sent";
  try {
    await sendEnquiryEmails(data);
  } catch (err) {
    emailStatus = err instanceof Error && err.message === "not_configured" ? "not_configured" : "failed";
    if (emailStatus === "failed") console.error("[contact] email failed", err);
  }

  if (rowId !== null) {
    try {
      await db.update(enquiries).set({ emailStatus }).where(eq(enquiries.id, rowId));
    } catch {
      /* non-fatal */
    }
  }

  // Only a real failure if we neither saved it nor emailed it.
  if (rowId === null && emailStatus !== "sent") {
    return NextResponse.json({ ok: false, message: FAIL_MESSAGE }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you! Your enquiry has been received. Basera will contact you shortly.",
  });
}
