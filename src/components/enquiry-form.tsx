"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { CircleCheck, MessageCircle, TriangleAlert } from "lucide-react";
import { submitEnquiry } from "@/app/actions";
import { business } from "@/config/business";
import { contact, whatsappHref } from "@/lib/contact";
import { enquirySchema, fieldErrors, type EnquiryField, type EnquiryState } from "@/lib/enquiry-schema";
import { enquiryTypeLabel } from "@/lib/labels";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/types";

const initial: EnquiryState = { status: "idle" };

export interface EnquiryFormProps {
  /** Whether a server-side delivery channel is configured (computed on the server). */
  deliveryReady: boolean;
  /** Title of the property / project the enquiry is about. */
  subject?: string;
  /** Slug or ID of the property / project. */
  subjectRef?: string;
  /** Fixes the enquiry type and hides the selector. */
  fixedType?: EnquiryType;
  defaultType?: EnquiryType;
  variant?: "full" | "compact";
  submitLabel?: string;
}

export function EnquiryForm({
  deliveryReady,
  subject,
  subjectRef,
  fixedType,
  defaultType = "buy",
  variant = "full",
  submitLabel = "Send enquiry",
}: EnquiryFormProps) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);
  const [clientErrors, setClientErrors] = useState<Partial<Record<EnquiryField, string>> | null>(null);
  const [handedToWhatsApp, setHandedToWhatsApp] = useState(false);
  const [type, setType] = useState<EnquiryType>(fixedType ?? defaultType);
  const startedRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Without a server channel, fall back to composing the message in WhatsApp.
  const whatsappFallback = !deliveryReady && contact.hasWhatsApp;
  const errors = clientErrors ?? (state.status === "invalid" ? state.errors : {});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = enquirySchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setClientErrors(errs);
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors(null);

    if (whatsappFallback) {
      const d = parsed.data;
      const details = [
        d.subject ? `I am interested in ${d.subject}.` : `Enquiry: ${enquiryTypeLabel[d.type]}.`,
        d.budget && `Budget: ${d.budget}`,
        d.location && `Preferred location: ${d.location}`,
        d.message,
        `— ${d.name}, ${d.phone}${d.email ? `, ${d.email}` : ""}`,
      ]
        .filter(Boolean)
        .join("\n");
      const base = whatsappHref()!.split("?")[0];
      window.open(`${base}?text=${encodeURIComponent(`Hello ${business.name},\n${details}`)}`, "_blank", "noopener");
      setHandedToWhatsApp(true);
      return;
    }
    startTransition(() => formAction(fd));
  }

  if (state.status === "success") {
    return (
      <div role="status" className="border border-forest/30 bg-forest-soft/60 p-6 md:p-8">
        <CircleCheck aria-hidden className="size-8 text-forest" />
        <h3 className="mt-4 font-display text-3xl">Thank you{state.name ? `, ${state.name}` : ""}.</h3>
        <p className="mt-2 leading-relaxed text-ink-2">
          Your enquiry has been sent to {business.name}. We will contact you on the phone number you provided.
        </p>
      </div>
    );
  }

  if (handedToWhatsApp) {
    return (
      <div role="status" className="border border-forest/30 bg-forest-soft/60 p-6 md:p-8">
        <MessageCircle aria-hidden className="size-8 text-forest" />
        <h3 className="mt-4 font-display text-3xl">Almost done — press send in WhatsApp</h3>
        <p className="mt-2 leading-relaxed text-ink-2">
          We opened WhatsApp with your enquiry written out. It reaches us once you press send there.
        </p>
        <button type="button" onClick={() => setHandedToWhatsApp(false)} className="mt-4 min-h-11 text-sm font-medium underline underline-offset-4">
          Back to the form
        </button>
      </div>
    );
  }

  const compact = variant === "compact";
  const showRequirementFields = !compact && (type === "buy" || type === "rent");

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      onFocusCapture={() => {
        if (startedRef.current && !startedRef.current.value) startedRef.current.value = String(Date.now());
      }}
      className="grid gap-5"
    >
      <input ref={startedRef} type="hidden" name="started_at" defaultValue="" />
      {subject && <input type="hidden" name="subject" value={subject} />}
      {subjectRef && <input type="hidden" name="subjectRef" value={subjectRef} />}
      {fixedType && <input type="hidden" name="type" value={fixedType} />}
      {/* Honeypot — hidden from people and assistive technology. */}
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {subject && (
        <p className="border-l-2 border-forest bg-card px-4 py-3 text-sm">
          <span className="text-muted">Enquiring about</span>
          <br />
          <strong className="font-semibold">{subject}</strong>
        </p>
      )}

      {!fixedType && (
        <Field label="What can we help with?" name="type" error={errors.type} required>
          {(props) => (
            <select {...props} value={type} onChange={(e) => setType(e.target.value as EnquiryType)} className="field cursor-pointer">
              {ENQUIRY_TYPES.filter((t) => t !== "property").map((t) => (
                <option key={t} value={t}>
                  {enquiryTypeLabel[t]}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="Your name" name="name" error={errors.name} required>
          {(props) => <input {...props} type="text" autoComplete="name" maxLength={80} className="field" />}
        </Field>
        <Field label="Phone number" name="phone" error={errors.phone} required hint="We’ll call or WhatsApp you on this number.">
          {(props) => <input {...props} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} className="field" />}
        </Field>
      </div>

      <Field label="Email" name="email" error={errors.email} optional>
        {(props) => <input {...props} type="email" autoComplete="email" maxLength={120} className="field" />}
      </Field>

      {showRequirementFields && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={type === "rent" ? "Monthly budget" : "Budget"} name="budget" error={errors.budget} optional>
            {(props) => <input {...props} type="text" maxLength={60} placeholder={type === "rent" ? "e.g. ₹25,000" : "e.g. ₹60 L – ₹80 L"} className="field" />}
          </Field>
          <Field label="Preferred location" name="location" error={errors.location} optional>
            {(props) => <input {...props} type="text" maxLength={80} className="field" />}
          </Field>
        </div>
      )}

      <Field label="Message" name="message" error={errors.message} optional>
        {(props) => (
          <textarea
            {...props}
            rows={compact ? 3 : 5}
            maxLength={2000}
            placeholder={subject ? "Any questions, or a good time to call?" : "Tell us what you are looking for."}
            className="field resize-y"
          />
        )}
      </Field>

      {state.status === "error" && <Alert>{state.message}</Alert>}
      {state.status === "not-configured" && (
        <Alert>
          Our online enquiry form is not connected yet, so <strong>your message has not been sent</strong>.
          {contact.hasPhone || contact.hasEmail ? (
            <>
              {" "}
              Please contact us directly
              {contact.telHref && (
                <>
                  {" "}
                  on{" "}
                  <a href={contact.telHref} className="font-semibold underline underline-offset-2">
                    {contact.phoneDisplay}
                  </a>
                </>
              )}
              {contact.mailtoHref && (
                <>
                  {" "}
                  {contact.telHref ? "or" : "at"}{" "}
                  <a href={contact.mailtoHref} className="font-semibold underline underline-offset-2">
                    {contact.email}
                  </a>
                </>
              )}
              .
            </>
          ) : (
            " Please try again later."
          )}
        </Alert>
      )}

      <div className="flex flex-col gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[2px] bg-forest px-7 font-medium text-paper transition-colors hover:bg-forest-deep disabled:cursor-wait disabled:opacity-70"
        >
          {whatsappFallback && <MessageCircle aria-hidden className="size-4" />}
          {pending ? "Sending…" : whatsappFallback ? "Continue in WhatsApp" : submitLabel}
        </button>
        <p className="text-xs leading-relaxed text-muted">
          {whatsappFallback
            ? "Your enquiry will open in WhatsApp, ready for you to send. "
            : `Your details are sent only to ${business.name} and used to respond to this enquiry. `}
          See our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="flex gap-3 border border-danger/40 bg-danger/5 p-4 text-sm leading-relaxed text-ink">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
      <p>{children}</p>
    </div>
  );
}

type ControlProps = {
  id: string;
  name: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

function Field({
  label,
  name,
  error,
  hint,
  required,
  optional,
  children,
}: {
  label: string;
  name: EnquiryField;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: (props: ControlProps) => React.ReactNode;
}) {
  const id = `enq-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <span className="text-danger" aria-hidden> *</span>}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children({ id, name, required, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
