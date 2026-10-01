import "server-only";
import nodemailer from "nodemailer";
import { business } from "@/data/business";
import { computeOrder, formatPrice, totalLabel, type CartItem } from "@/lib/order";
import type { EnquiryData, OrderCustomer } from "@/lib/validation";

/**
 * ---------------------------------------------------------------------------
 *  EMAIL SETUP  (server only — nothing here reaches the browser)
 * ---------------------------------------------------------------------------
 *  Set these in .env (or your hosting dashboard):
 *
 *    BUSINESS_EMAIL   = the inbox that should RECEIVE enquiries & orders
 *                       >>> YOUR_BUSINESS_EMAIL goes here <<<
 *    EMAIL_HOST       = SMTP server, e.g. smtp.gmail.com
 *    EMAIL_PORT       = 465 (SSL) or 587 (STARTTLS)
 *    EMAIL_USER       = SMTP login
 *    EMAIL_PASSWORD   = SMTP password / app password
 *    EMAIL_FROM       = optional "From" header
 *
 *  If any of these are missing the API still stores the enquiry in the
 *  database and the visitor still sees a success message; the email step is
 *  simply skipped (and flagged "not_configured" in the database).
 * ---------------------------------------------------------------------------
 */

function config() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT ?? 465);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const to = process.env.BUSINESS_EMAIL || user;
  const looksPlaceholder = (v?: string) => !v || v.startsWith("YOUR_");
  if (looksPlaceholder(host) || looksPlaceholder(user) || looksPlaceholder(pass) || looksPlaceholder(to)) return null;
  return { host: host!, port, user: user!, pass: pass!, to: to! };
}

export function isMailConfigured(): boolean {
  return config() !== null;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function transport(c: NonNullable<ReturnType<typeof config>>) {
  return nodemailer.createTransport({
    host: c.host,
    port: c.port,
    secure: c.port === 465,
    auth: { user: c.user, pass: c.pass },
  });
}

const fromHeader = (user: string) => process.env.EMAIL_FROM || `"${business.name}" <${user}>`;

function shell(title: string, body: string) {
  return `<div style="background:#f6efe1;padding:24px;font-family:Georgia,'Times New Roman',serif;color:#2a1c13">
  <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e8d9bb;border-radius:14px;overflow:hidden">
    <div style="background:#2a1c13;color:#f6efe1;padding:20px 24px">
      <div style="font-size:22px;letter-spacing:4px">BASERA</div>
      <div style="font-size:12px;letter-spacing:2px;color:#d8b876">RESTAURANT &amp; HOTEL</div>
    </div>
    <div style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6">
      <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:20px">${esc(title)}</h2>
      ${body}
    </div>
  </div></div>`;
}

const row = (label: string, value: string) =>
  value
    ? `<tr><td style="padding:6px 12px 6px 0;color:#7a6652;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;font-weight:600">${esc(value).replace(/\n/g, "<br>")}</td></tr>`
    : "";

/* ------------------------------ ENQUIRIES --------------------------------- */

function enquiryRows(d: EnquiryData): [string, string][] {
  const rows: [string, string][] = [
    ["Customer Name", d.name],
    ["Phone", d.phone],
    ["Email", d.email],
    ["Enquiry Type", d.enquiryType],
  ];
  if (d.form === "hotel") rows.push(["Check-in", d.checkIn], ["Check-out", d.checkOut], ["Guests", d.guests], ["Rooms", d.rooms]);
  else if (d.form === "banquet") rows.push(["Event Type", d.eventType], ["Date", d.eventDate], ["Guests", d.guests]);
  else rows.push(["Date", d.preferredDate], ["Guests", d.guests]);
  rows.push(["Message", d.message]);
  return rows.filter(([, v]) => v);
}

export async function sendEnquiryEmails(d: EnquiryData): Promise<{ business: boolean; customer: boolean }> {
  const c = config();
  if (!c) throw new Error("not_configured");
  const t = transport(c);
  const rows = enquiryRows(d);

  await t.sendMail({
    from: fromHeader(c.user),
    to: c.to,
    replyTo: d.email || undefined,
    subject: `New Website Enquiry - Basera (${d.enquiryType || "General"})`,
    text: ["New Website Enquiry - Basera", "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"),
    html: shell(
      "New Website Enquiry - Basera",
      `<table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) => row(k, v)).join("")}</table>`,
    ),
  });

  let customer = false;
  if (d.email) {
    try {
      await t.sendMail({
        from: fromHeader(c.user),
        to: d.email,
        subject: "We received your enquiry | Basera Restaurant & Hotel",
        text: `Dear ${d.name},\n\nThank you for getting in touch with Basera Restaurant & Hotel. We have received your enquiry and will contact you shortly.\n\nIf it is urgent, please call or WhatsApp us on ${business.phoneDisplay}.\n\nWarm regards,\nTeam Basera\n${business.address.line1}, ${business.address.line2}, ${business.address.city}`,
        html: shell(
          `Thank you, ${d.name}`,
          `<p>We have received your enquiry and will contact you shortly.</p>
           <table style="border-collapse:collapse;width:100%;margin:12px 0">${rows.filter(([k]) => k !== "Email").map(([k, v]) => row(k, v)).join("")}</table>
           <p>If it is urgent, please call or WhatsApp us on <strong>${esc(business.phoneDisplay)}</strong>.</p>
           <p style="margin-top:20px">Warm regards,<br><strong>Team Basera</strong><br>
           <span style="color:#7a6652">${esc(business.address.line1)}, ${esc(business.address.line2)}, ${esc(business.address.city)}</span></p>`,
        ),
      });
      customer = true;
    } catch (err) {
      console.error("[mail] customer confirmation failed", err);
    }
  }
  return { business: true, customer };
}

/* -------------------------------- ORDERS ---------------------------------- */

export async function sendOrderEmails(
  customer: OrderCustomer,
  items: CartItem[],
): Promise<{ business: boolean; customer: boolean }> {
  const c = config();
  if (!c) throw new Error("not_configured");
  const t = transport(c);
  const order = computeOrder(items);

  const itemText = order.lines.map(
    (l, i) => `${i + 1}. ${l.item.name} × ${l.qty} (${l.lineTotal === null ? "price on request" : formatPrice(l.lineTotal)})`,
  );
  const itemHtml = `<table style="border-collapse:collapse;width:100%;margin:8px 0">${order.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${esc(l.item.name)} × ${l.qty}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${l.lineTotal === null ? "On request" : formatPrice(l.lineTotal)}</td></tr>`,
    )
    .join("")}<tr><td style="padding:8px 0;font-weight:700">Total</td><td style="padding:8px 0;text-align:right;font-weight:700">${esc(totalLabel(order))}</td></tr></table>`;

  const details: [string, string][] = [
    ["Customer Name", customer.name],
    ["Phone", customer.phone],
    ["Email", customer.email],
    ["Order Type", customer.orderType],
    ["Address", customer.orderType === "Delivery" ? customer.address : ""],
    ["Special Instructions", customer.instructions],
  ];
  const detailRows = details.filter(([, v]) => v);

  await t.sendMail({
    from: fromHeader(c.user),
    to: c.to,
    replyTo: customer.email || undefined,
    subject: `New Website Order - Basera (${customer.name})`,
    text: [
      "New Website Order - Basera",
      "",
      ...detailRows.map(([k, v]) => `${k}: ${v}`),
      "",
      "Items:",
      ...itemText,
      "",
      `Total: ${totalLabel(order)}`,
    ].join("\n"),
    html: shell(
      "New Website Order - Basera",
      `<table style="border-collapse:collapse;width:100%">${detailRows.map(([k, v]) => row(k, v)).join("")}</table>
       <h3 style="font-family:Georgia,serif;margin:18px 0 4px">Items</h3>${itemHtml}`,
    ),
  });

  let sentToCustomer = false;
  if (customer.email) {
    try {
      await t.sendMail({
        from: fromHeader(c.user),
        to: customer.email,
        subject: "We received your order | Basera Restaurant & Hotel",
        text: `Dear ${customer.name},\n\nThank you for your order request. Basera will contact you shortly on ${customer.phone} to confirm it.\n\nYour items:\n${itemText.join("\n")}\n\nTotal: ${totalLabel(order)}\n\nWarm regards,\nTeam Basera\n${business.phoneDisplay}`,
        html: shell(
          `Thank you, ${customer.name}`,
          `<p>We have received your order request. Basera will contact you shortly on <strong>${esc(customer.phone)}</strong> to confirm it.</p>${itemHtml}
           <p style="margin-top:20px">Warm regards,<br><strong>Team Basera</strong><br><span style="color:#7a6652">${esc(business.phoneDisplay)}</span></p>`,
        ),
      });
      sentToCustomer = true;
    } catch (err) {
      console.error("[mail] order confirmation failed", err);
    }
  }
  return { business: true, customer: sentToCustomer };
}
