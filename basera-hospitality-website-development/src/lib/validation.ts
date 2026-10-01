/**
 * Validation + sanitisation shared by the browser (instant feedback) and the
 * API routes (the real gatekeeper). Nothing in here touches secrets.
 */

export const ENQUIRY_TYPES = ["Restaurant", "Food Order", "Hotel Room", "Banquet / Event", "General Query"] as const;
export const EVENT_TYPES = [
  "Family Function",
  "Birthday Celebration",
  "Anniversary",
  "Small Gathering",
  "Social Event",
  "Private Function",
  "Other",
] as const;

export type FormKind = "contact" | "hotel" | "banquet";
export type Channel = "email" | "whatsapp";

export type EnquiryData = {
  form: FormKind;
  name: string;
  phone: string;
  email: string;
  enquiryType: string;
  preferredDate: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  eventType: string;
  eventDate: string;
  message: string;
};

export type Errors = Record<string, string>;

/** Strip control characters and angle brackets, trim and cap the length. */
export function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

export function isValidEmail(v: string): boolean {
  return v.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function isValidPhone(v: string): boolean {
  const compact = v.replace(/[\s\-().]/g, "");
  if (/^\+\d{8,15}$/.test(compact)) {
    // +91 numbers must still look like real Indian mobiles
    if (compact.startsWith("+91")) return /^\+91[6-9]\d{9}$/.test(compact);
    return true;
  }
  return /^(?:91|0)?[6-9]\d{9}$/.test(compact);
}

/** Today's date in India as YYYY-MM-DD. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function isValidDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function intInRange(v: string, min: number, max: number) {
  return /^\d{1,4}$/.test(v) && Number(v) >= min && Number(v) <= max;
}

export function sanitizeEnquiry(input: Record<string, unknown>): EnquiryData {
  const form = (["contact", "hotel", "banquet"] as const).find((f) => f === input.form) ?? "contact";
  return {
    form,
    name: clean(input.name, 80),
    phone: clean(input.phone, 20),
    email: clean(input.email, 120).toLowerCase(),
    enquiryType: clean(input.enquiryType, 40),
    preferredDate: clean(input.preferredDate, 10),
    guests: clean(input.guests, 5),
    checkIn: clean(input.checkIn, 10),
    checkOut: clean(input.checkOut, 10),
    rooms: clean(input.rooms, 3),
    eventType: clean(input.eventType, 40),
    eventDate: clean(input.eventDate, 10),
    message: clean(input.message, 1500),
  };
}

export function validateEnquiry(
  input: Record<string, unknown>,
  channel: Channel = "email",
): { ok: boolean; errors: Errors; data: EnquiryData } {
  const data = sanitizeEnquiry(input);
  const errors: Errors = {};
  const today = todayISO();
  const strict = channel === "email";

  if (data.name.length < 2) errors.name = "Please tell us your name.";
  if (!data.phone) errors.phone = "Please add a phone number so we can reach you.";
  else if (!isValidPhone(data.phone)) errors.phone = "That phone number doesn't look right. Try a 10-digit mobile number.";

  if (data.form === "contact") {
    if (strict && !data.email) errors.email = "Please add your email address.";
    if (!(ENQUIRY_TYPES as readonly string[]).includes(data.enquiryType)) errors.enquiryType = "Please choose what your enquiry is about.";
    if (strict && data.message.length < 5) errors.message = "Please write a short message (at least a few words).";
  }
  if (data.email && !isValidEmail(data.email)) errors.email = "That email address doesn't look right.";

  if (data.preferredDate) {
    if (!isValidDate(data.preferredDate)) errors.preferredDate = "Please pick a valid date.";
    else if (data.preferredDate < today) errors.preferredDate = "That date is in the past.";
  }
  if (data.guests && !intInRange(data.guests, 1, 2000)) errors.guests = "Enter guests as a number, 1 or more.";

  if (data.form === "hotel") {
    data.enquiryType = "Hotel Room";
    if (!data.checkIn) errors.checkIn = "Please choose a check-in date.";
    else if (!isValidDate(data.checkIn)) errors.checkIn = "Please pick a valid date.";
    else if (data.checkIn < today) errors.checkIn = "Check-in can't be in the past.";

    if (!data.checkOut) errors.checkOut = "Please choose a check-out date.";
    else if (!isValidDate(data.checkOut)) errors.checkOut = "Please pick a valid date.";
    else if (data.checkIn && isValidDate(data.checkIn) && data.checkOut <= data.checkIn)
      errors.checkOut = "Check-out must be after check-in.";

    if (data.rooms && !intInRange(data.rooms, 1, 50)) errors.rooms = "Enter rooms as a number, 1 or more.";
  }

  if (data.form === "banquet") {
    data.enquiryType = "Banquet / Event";
    if (!(EVENT_TYPES as readonly string[]).includes(data.eventType)) errors.eventType = "Please choose an event type.";
    if (data.eventDate) {
      if (!isValidDate(data.eventDate)) errors.eventDate = "Please pick a valid date.";
      else if (data.eventDate < today) errors.eventDate = "That date is in the past.";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, data };
}

/* ---------------------------------- ORDER --------------------------------- */

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  orderType: "Delivery" | "Pickup" | "";
  address: string;
  instructions: string;
};

export function sanitizeCustomer(input: Record<string, unknown>): OrderCustomer {
  return {
    name: clean(input.name, 80),
    phone: clean(input.phone, 20),
    email: clean(input.email, 120).toLowerCase(),
    orderType: input.orderType === "Delivery" || input.orderType === "Pickup" ? input.orderType : "",
    address: clean(input.address, 300),
    instructions: clean(input.instructions, 500),
  };
}

export function validateCustomer(input: Record<string, unknown>): { ok: boolean; errors: Errors; data: OrderCustomer } {
  const data = sanitizeCustomer(input);
  const errors: Errors = {};
  if (data.name.length < 2) errors.name = "Please tell us your name.";
  if (!data.phone) errors.phone = "Please add a phone number.";
  else if (!isValidPhone(data.phone)) errors.phone = "That phone number doesn't look right. Try a 10-digit mobile number.";
  if (data.email && !isValidEmail(data.email)) errors.email = "That email address doesn't look right.";
  if (!data.orderType) errors.orderType = "Is this for delivery or pickup?";
  if (data.orderType === "Delivery" && data.address.length < 8) errors.address = "Please add a full delivery address.";
  return { ok: Object.keys(errors).length === 0, errors, data };
}
