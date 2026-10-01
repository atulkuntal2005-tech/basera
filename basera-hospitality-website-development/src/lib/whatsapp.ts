import { business } from "@/data/business";
import { computeOrder, formatPrice, totalLabel } from "@/lib/order";
import type { EnquiryData, OrderCustomer } from "@/lib/validation";

/** The ONLY place a WhatsApp URL is built. Number comes from business.ts. */
export function waLink(message: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled messages for the simple "chat" buttons around the site. */
export const waMessages = {
  general: "Hi Basera, I have a question. Could you help me?",
  restaurant: "Hi Basera, I would like to know more about your restaurant and menu.",
  order: "Hi Basera, I would like to place an order.",
  hotel: "Hi Basera, I would like to enquire about room availability.",
  banquet: "Hi Basera, I would like to enquire about hosting an event/celebration.",
  question: "Hi Basera, I would like to ask a question.",
} as const;

export function buildOrderMessage(
  customer: OrderCustomer,
  items: { id: string; qty: number }[],
): string {
  const order = computeOrder(items);
  const lines = order.lines.map((l, i) => {
    const price = l.lineTotal === null ? "price on request" : formatPrice(l.lineTotal);
    return `${i + 1}. ${l.item.name} × ${l.qty} (${price})`;
  });
  return [
    "Hello Basera Restaurant & Hotel,",
    "",
    "I would like to place an order.",
    "",
    `Customer Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Order Type: ${customer.orderType}`,
    "",
    "Items:",
    ...lines,
    "",
    `Total: ${totalLabel(order)}`,
    "",
    `Address: ${customer.orderType === "Delivery" ? customer.address : "Pickup, no address needed"}`,
    `Special Instructions: ${customer.instructions || "None"}`,
    "",
    "Please confirm my order.",
    "",
    "Thank you.",
  ].join("\n");
}

export function buildEnquiryMessage(d: EnquiryData): string {
  const out: string[] = ["Hello Basera Restaurant & Hotel,", ""];
  if (d.form === "hotel") out.push("I would like to enquire about room availability.");
  else if (d.form === "banquet") out.push("I would like to enquire about hosting an event/celebration.");
  else out.push(`I have an enquiry (${d.enquiryType || "General Query"}).`);
  out.push("");
  const add = (label: string, v: string) => v && out.push(`${label}: ${v}`);
  add("Name", d.name);
  add("Phone", d.phone);
  add("Email", d.email);
  if (d.form === "hotel") {
    add("Check-in", d.checkIn);
    add("Check-out", d.checkOut);
    add("Guests", d.guests);
    add("Rooms", d.rooms);
  } else if (d.form === "banquet") {
    add("Event type", d.eventType);
    add("Event date", d.eventDate);
    add("Guests", d.guests);
  } else {
    add("Preferred date", d.preferredDate);
    add("Guests", d.guests);
  }
  if (d.message) out.push("", d.message);
  out.push("", "Thank you.");
  return out.join("\n");
}
