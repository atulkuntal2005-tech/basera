"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import {
  ENQUIRY_TYPES,
  EVENT_TYPES,
  todayISO,
  validateEnquiry,
  type Errors,
  type FormKind,
} from "@/lib/validation";
import { buildEnquiryMessage, waLink } from "@/lib/whatsapp";

type FieldDef = {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "date" | "number" | "select" | "textarea";
  required?: boolean;
  options?: readonly string[];
  half?: boolean;
  autoComplete?: string;
  placeholder?: string;
};

const FIELDS: Record<FormKind, FieldDef[]> = {
  contact: [
    { name: "name", label: "Name", type: "text", required: true, half: true, autoComplete: "name", placeholder: "Your full name" },
    { name: "phone", label: "Phone", type: "tel", required: true, half: true, autoComplete: "tel", placeholder: "98765 43210" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "you@example.com" },
    { name: "enquiryType", label: "Enquiry Type", type: "select", required: true, options: ENQUIRY_TYPES, half: true },
    { name: "preferredDate", label: "Preferred Date", type: "date", half: true },
    { name: "guests", label: "Number of Guests", type: "number", half: true, placeholder: "e.g. 4" },
    { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell us what you have in mind…" },
  ],
  hotel: [
    { name: "name", label: "Name", type: "text", required: true, half: true, autoComplete: "name", placeholder: "Your full name" },
    { name: "phone", label: "Phone", type: "tel", required: true, half: true, autoComplete: "tel", placeholder: "98765 43210" },
    { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
    { name: "checkIn", label: "Check-in", type: "date", required: true, half: true },
    { name: "checkOut", label: "Check-out", type: "date", required: true, half: true },
    { name: "guests", label: "Guests", type: "number", half: true, placeholder: "e.g. 2" },
    { name: "rooms", label: "Number of Rooms", type: "number", half: true, placeholder: "e.g. 1" },
    { name: "message", label: "Message", type: "textarea", placeholder: "Anything we should know? Arrival time, special requests…" },
  ],
  banquet: [
    { name: "name", label: "Name", type: "text", required: true, half: true, autoComplete: "name", placeholder: "Your full name" },
    { name: "phone", label: "Phone", type: "tel", required: true, half: true, autoComplete: "tel", placeholder: "98765 43210" },
    { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
    { name: "eventType", label: "Event Type", type: "select", required: true, options: EVENT_TYPES, half: true },
    { name: "eventDate", label: "Event Date", type: "date", half: true },
    { name: "guests", label: "Number of Guests", type: "number", placeholder: "e.g. 50" },
    { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about the occasion…" },
  ],
};

const SUBMIT_LABEL: Record<FormKind, string> = { contact: "Send Enquiry", hotel: "Send Enquiry", banquet: "Send Enquiry" };

type Props = {
  kind: FormKind;
  /** Pre-select the Enquiry Type on the general form */
  defaultType?: string;
  onSuccess?: () => void;
  autoFocus?: boolean;
};

export default function EnquiryForm({ kind, defaultType, onSuccess, autoFocus = false }: Props) {
  const uid = useId();
  const startedAt = useRef(Date.now());
  const [values, setValues] = useState<Record<string, string>>({
    enquiryType: kind === "contact" ? (defaultType ?? "") : "",
    eventType: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const fields = FIELDS[kind];
  const today = todayISO();

  const set = (name: string, v: string) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = fields.find((f) => errs[f.name]);
    if (first) document.getElementById(`${uid}-${first.name}`)?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const { ok, errors: errs } = validateEnquiry({ ...values, form: kind }, "email");
    setErrors(errs);
    if (!ok) {
      setStatus("error");
      setServerMsg("Please check the highlighted fields.");
      focusFirstError(errs);
      return;
    }
    setStatus("submitting");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, form: kind, startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        setServerMsg(json.message ?? "Thank you! Your enquiry has been received. Basera will contact you shortly.");
        onSuccess?.();
      } else {
        if (json.errors) {
          setErrors(json.errors);
          focusFirstError(json.errors);
        }
        setStatus("error");
        setServerMsg(json.message ?? "Something went wrong. Please try again or WhatsApp us.");
      }
    } catch {
      setStatus("error");
      setServerMsg("We couldn't reach the server. Please check your connection, or WhatsApp us instead.");
    }
  }

  function onWhatsApp() {
    const { ok, errors: errs, data } = validateEnquiry({ ...values, form: kind }, "whatsapp");
    setErrors(errs);
    if (!ok) {
      setStatus("error");
      setServerMsg("Please check the highlighted fields before opening WhatsApp.");
      focusFirstError(errs);
      return;
    }
    setStatus("idle");
    setServerMsg("");
    window.open(waLink(buildEnquiryMessage(data)), "_blank", "noopener,noreferrer");
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-leaf/25 bg-leaf/5 p-8 text-center">
        <CheckCircle2 className="mx-auto text-leaf" size={44} aria-hidden />
        <h3 className="mt-4 text-2xl font-semibold">Dhanyavaad!</h3>
        <p className="mx-auto mt-2 max-w-sm text-cocoa">{serverMsg}</p>
        <button
          type="button"
          className="btn btn-outline mt-6"
          onClick={() => {
            setValues({ enquiryType: kind === "contact" ? (defaultType ?? "") : "", eventType: "" });
            setStatus("idle");
            startedAt.current = Date.now();
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-busy={busy}>
      {/* Honeypot: hidden from people, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" value={values.company ?? ""} onChange={(e) => set("company", e.target.value)} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f, i) => {
          const id = `${uid}-${f.name}`;
          const err = errors[f.name];
          const common = {
            id,
            name: f.name,
            required: f.required,
            "aria-required": f.required || undefined,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : undefined,
            className: "field",
            value: values[f.name] ?? "",
            disabled: busy,
          } as const;
          return (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-cocoa">
                {f.label}
                {f.required && <span className="text-clay" aria-hidden> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  {...common}
                  placeholder={f.placeholder}
                  maxLength={1500}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              ) : f.type === "select" ? (
                <select {...common} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Select…</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...common}
                  type={f.type}
                  inputMode={f.type === "tel" ? "tel" : f.type === "number" ? "numeric" : undefined}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  autoFocus={autoFocus && i === 0}
                  min={f.type === "date" ? (f.name === "checkOut" && values.checkIn ? values.checkIn : today) : f.type === "number" ? 1 : undefined}
                  suppressHydrationWarning={f.type === "date"}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {err && (
                <p id={`${id}-err`} className="mt-1.5 text-sm text-[#b3261e]">
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {status === "error" && serverMsg && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#b3261e]/30 bg-[#b3261e]/5 p-3.5 text-sm text-[#8c1d18]">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>{serverMsg}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row">
        <button type="submit" disabled={busy} className="btn btn-dark flex-1">
          {busy ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={17} aria-hidden />}
          {busy ? "Sending…" : SUBMIT_LABEL[kind]}
        </button>
        <button type="button" onClick={onWhatsApp} disabled={busy} className="btn btn-wa flex-1">
          <WhatsAppIcon />
          {kind === "contact" ? "WhatsApp" : "WhatsApp Enquiry"}
        </button>
      </div>
      <p className="text-xs text-umber">
        Fields marked * are required. We only use your details to reply to this enquiry.
      </p>
    </form>
  );
}
