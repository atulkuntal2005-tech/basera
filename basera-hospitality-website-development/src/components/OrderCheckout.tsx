"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { Bike, CheckCircle2, Loader2, Mail, Store, TriangleAlert } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useCart } from "@/components/CartProvider";
import OrderSummary from "@/components/OrderSummary";
import { computeOrder } from "@/lib/order";
import { validateCustomer, type Errors } from "@/lib/validation";
import { buildOrderMessage, waLink } from "@/lib/whatsapp";

const EMPTY = { name: "", phone: "", email: "", orderType: "", address: "", instructions: "", company: "" };

export default function OrderCheckout() {
  const uid = useId();
  const { items, hydrated, clear } = useCart();
  const startedAt = useRef(Date.now());
  const [values, setValues] = useState<Record<string, string>>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "wa">("idle");
  const [msg, setMsg] = useState("");
  const [doneName, setDoneName] = useState("");
  const order = useMemo(() => computeOrder(items), [items]);

  const set = (k: string, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const focusFirst = (errs: Errors) => {
    const first = ["name", "phone", "email", "orderType", "address"].find((k) => errs[k]);
    if (first) document.getElementById(`${uid}-${first}`)?.focus();
  };

  function validate() {
    const res = validateCustomer(values);
    setErrors(res.errors);
    if (!res.ok) {
      setStatus("error");
      setMsg("Please check the highlighted fields.");
      focusFirst(res.errors);
    }
    return res;
  }

  function sendWhatsApp() {
    const res = validate();
    if (!res.ok) return;
    window.open(waLink(buildOrderMessage(res.data, items)), "_blank", "noopener,noreferrer");
    setStatus("wa");
    setMsg("WhatsApp is open with your order ready to go. Just tap Send there and we'll take it from here.");
  }

  async function sendEmail() {
    if (status === "submitting") return;
    const res = validate();
    if (!res.ok) return;
    setStatus("submitting");
    setMsg("");
    try {
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: values, items, company: values.company, startedAt: startedAt.current }),
      });
      const json = await r.json().catch(() => ({}));
      if (r.ok && json.ok) {
        setDoneName(res.data.name);
        setMsg(json.message);
        setStatus("success");
        clear();
      } else {
        if (json.errors) {
          setErrors(json.errors);
          focusFirst(json.errors);
        }
        setStatus("error");
        setMsg(json.message ?? "Something went wrong. Please try again or send your order on WhatsApp.");
      }
    } catch {
      setStatus("error");
      setMsg("We couldn't reach the server. Please check your connection, or send your order on WhatsApp.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="mx-auto max-w-xl rounded-3xl border border-leaf/25 bg-leaf/5 p-10 text-center">
        <CheckCircle2 className="mx-auto text-leaf" size={52} aria-hidden />
        <h2 className="mt-5 text-3xl font-semibold">Dhanyavaad, {doneName.split(" ")[0]}!</h2>
        <p className="mt-3 text-cocoa">{msg}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/menu" className="btn btn-dark">Back to the Menu</Link>
          <Link href="/" className="btn btn-outline">Home</Link>
        </div>
      </div>
    );
  }

  if (hydrated && order.lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-parchment p-10 text-center">
        <h2 className="text-3xl font-semibold">Nothing in your order yet</h2>
        <p className="mt-3 text-cocoa">Pick a few dishes from the menu and come back here to send your order.</p>
        <Link href="/menu" className="btn btn-dark mt-6">Browse the Menu</Link>
      </div>
    );
  }

  const busy = status === "submitting";
  const isDelivery = values.orderType === "Delivery";
  const fieldProps = (k: string) =>
    ({
      id: `${uid}-${k}`,
      name: k,
      value: values[k],
      disabled: busy,
      className: "field",
      "aria-invalid": errors[k] ? true : undefined,
      "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
      onChange: (e: { target: { value: string } }) => set(k, e.target.value),
    }) as const;
  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-1.5 text-sm text-[#b3261e]">{errors[k]}</p>
    ) : null;
  const label = "mb-1.5 block text-sm font-semibold text-cocoa";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <form onSubmit={(e) => e.preventDefault()} noValidate aria-busy={busy} className="space-y-5 rounded-3xl border border-parchment bg-cream p-6 sm:p-9">
        <div>
          <p className="eyebrow">Step 2 of 2</p>
          <h2 className="mt-1 text-3xl font-semibold">Customer Details</h2>
          <p className="mt-2 text-cocoa">Tell us who the order is for and how you would like to receive it.</p>
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Company<input type="text" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} /></label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-name`} className={label}>Name <span className="text-clay" aria-hidden>*</span></label>
            <input {...fieldProps("name")} type="text" required aria-required autoComplete="name" placeholder="Your full name" />
            <Err k="name" />
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className={label}>Phone <span className="text-clay" aria-hidden>*</span></label>
            <input {...fieldProps("phone")} type="tel" inputMode="tel" required aria-required autoComplete="tel" placeholder="98765 43210" />
            <Err k="phone" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-email`} className={label}>Email <span className="font-normal text-umber">(optional)</span></label>
            <input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />
            <Err k="email" />
          </div>
        </div>

        <fieldset aria-describedby={errors.orderType ? `${uid}-orderType-err` : undefined}>
          <legend className={label}>Delivery / Pickup <span className="text-clay" aria-hidden>*</span></legend>
          <div className="grid gap-3 sm:grid-cols-2" id={`${uid}-orderType`} tabIndex={-1}>
            {([
              ["Delivery", Bike, "We bring it to you"],
              ["Pickup", Store, "You collect from Basera"],
            ] as const).map(([v, Icon, sub]) => (
              <label
                key={v}
                className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                  values.orderType === v ? "border-espresso bg-sand/70" : "border-espresso/20 hover:border-espresso/45"
                }`}
              >
                <input type="radio" name="orderType" value={v} checked={values.orderType === v} onChange={() => set("orderType", v)} className="sr-only" disabled={busy} />
                <Icon size={22} className="text-gold-deep" aria-hidden />
                <span>
                  <span className="block font-semibold">{v}</span>
                  <span className="block text-xs text-umber">{sub}</span>
                </span>
              </label>
            ))}
          </div>
          <Err k="orderType" />
        </fieldset>

        {isDelivery && (
          <div>
            <label htmlFor={`${uid}-address`} className={label}>Delivery Address <span className="text-clay" aria-hidden>*</span></label>
            <textarea {...fieldProps("address")} rows={3} maxLength={300} autoComplete="street-address" placeholder="House / street, landmark, area" />
            <Err k="address" />
            <p className="mt-1.5 text-xs text-umber">Delivery availability and charges for your area are confirmed by Basera when they contact you.</p>
          </div>
        )}

        <div>
          <label htmlFor={`${uid}-instructions`} className={label}>Special Instructions <span className="font-normal text-umber">(optional)</span></label>
          <textarea {...fieldProps("instructions")} rows={3} maxLength={500} placeholder="Less spicy, no onion-garlic, timing…" />
        </div>

        {(status === "error" || status === "wa") && msg && (
          <div
            role={status === "error" ? "alert" : "status"}
            className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-sm ${
              status === "error" ? "border-[#b3261e]/30 bg-[#b3261e]/5 text-[#8c1d18]" : "border-leaf/30 bg-leaf/5 text-leaf"
            }`}
          >
            {status === "error" ? <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />}
            <span>{msg}</span>
          </div>
        )}

        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <button type="button" onClick={sendWhatsApp} disabled={busy} className="btn btn-wa">
            <WhatsAppIcon /> Send Order on WhatsApp
          </button>
          <button type="button" onClick={sendEmail} disabled={busy} className="btn btn-dark">
            {busy ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Mail size={17} aria-hidden />}
            {busy ? "Sending…" : "Send Order by Email"}
          </button>
        </div>
        <p className="text-xs text-umber">Nothing is charged online. Basera confirms your order and the final bill directly with you.</p>
      </form>

      <div>
        <div className="lg:sticky lg:top-24">
          <OrderSummary variant="checkout" />
          <Link href="/menu" className="mt-4 block text-center text-sm font-semibold text-gold-deep underline-offset-4 hover:underline">
            + Add more dishes
          </Link>
        </div>
      </div>
    </div>
  );
}
