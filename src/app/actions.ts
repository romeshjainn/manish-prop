"use server";

import { headers } from "next/headers";
import { deliverEnquiry, isDeliveryConfigured, rateLimited } from "@/lib/enquiry-delivery";
import { enquirySchema, fieldErrors, type EnquiryState } from "@/lib/enquiry-schema";

const MIN_FILL_MS = 2500;

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company_website") ?? "").length > 0) {
    return { status: "success", name: "" };
  }

  const startedAt = Number(formData.get("started_at"));
  // Set by the form script on first interaction; absent when JavaScript is off.
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "That was very quick — please check your details and send again." };
  }

  const raw = Object.fromEntries(
    ["name", "phone", "email", "type", "subject", "subjectRef", "budget", "location", "message"].map((k) => [
      k,
      typeof formData.get(k) === "string" ? (formData.get(k) as string) : undefined,
    ])
  );
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error) };

  if (!isDeliveryConfigured()) return { status: "not-configured" };

  // Counted only for valid submissions, so correcting typos never locks anyone out.
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many enquiries from this connection. Please try again in a few minutes." };
  }

  const delivered = await deliverEnquiry(parsed.data);
  if (!delivered) {
    return { status: "error", message: "We couldn’t send your enquiry just now. Please try again shortly." };
  }
  return { status: "success", name: parsed.data.name.split(" ")[0] };
}
