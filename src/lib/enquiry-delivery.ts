import "server-only";
import { business } from "@/config/business";
import { siteUrl } from "@/config/site";
import type { Enquiry } from "./enquiry-schema";
import { enquiryTypeLabel } from "./labels";

/**
 * Enquiry delivery adapters. Configure one or both in the environment:
 *
 *   EMAIL (via Resend — https://resend.com)
 *     RESEND_API_KEY        API key (server-side only)
 *     ENQUIRY_EMAIL_TO      where enquiries are delivered
 *     ENQUIRY_EMAIL_FROM    a sender on a domain verified in Resend
 *
 *   WEBHOOK (Google Apps Script, Zapier, Make, a CRM, your own API …)
 *     ENQUIRY_WEBHOOK_URL     receives a JSON POST
 *     ENQUIRY_WEBHOOK_SECRET  optional; sent as "Authorization: Bearer <secret>"
 *
 * Nothing is stored by the website itself.
 */

const env = () => ({
  resendKey: process.env.RESEND_API_KEY,
  emailTo: process.env.ENQUIRY_EMAIL_TO,
  emailFrom: process.env.ENQUIRY_EMAIL_FROM,
  webhookUrl: process.env.ENQUIRY_WEBHOOK_URL,
  webhookSecret: process.env.ENQUIRY_WEBHOOK_SECRET,
});

const emailReady = () => {
  const e = env();
  return Boolean(e.resendKey && e.emailTo && e.emailFrom);
};
const webhookReady = () => Boolean(env().webhookUrl);

export function isDeliveryConfigured(): boolean {
  return emailReady() || webhookReady();
}

function asText(e: Enquiry, receivedAt: string) {
  const lines: [string, string | undefined][] = [
    ["Enquiry", enquiryTypeLabel[e.type]],
    ["Regarding", e.subject],
    ["Reference", e.subjectRef],
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email],
    ["Budget", e.budget],
    ["Preferred location", e.location],
    ["Received", receivedAt],
  ];
  const body = lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  return `${body}\n\nMessage:\n${e.message ?? "(none)"}\n\n— Sent from the enquiry form on ${siteUrl}`;
}

async function sendEmail(e: Enquiry, receivedAt: string) {
  const { resendKey, emailTo, emailFrom } = env();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: emailFrom,
      to: emailTo!.split(",").map((s) => s.trim()),
      reply_to: e.email,
      subject: `New enquiry${e.subject ? `: ${e.subject}` : ""} — ${e.name}`,
      text: asText(e, receivedAt),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Email delivery failed (${res.status})`);
}

async function sendWebhook(e: Enquiry, receivedAt: string) {
  const { webhookUrl, webhookSecret } = env();
  const res = await fetch(webhookUrl!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(webhookSecret && { Authorization: `Bearer ${webhookSecret}` }),
    },
    body: JSON.stringify({ ...e, typeLabel: enquiryTypeLabel[e.type], receivedAt, source: siteUrl, business: business.name }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook delivery failed (${res.status})`);
}

/** Resolves true if at least one configured channel accepted the enquiry. */
export async function deliverEnquiry(e: Enquiry): Promise<boolean> {
  const receivedAt = new Date().toISOString();
  const jobs: Promise<void>[] = [];
  if (emailReady()) jobs.push(sendEmail(e, receivedAt));
  if (webhookReady()) jobs.push(sendWebhook(e, receivedAt));
  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    // Log the failure reason only — never the visitor's personal details.
    if (r.status === "rejected") console.error("[enquiry]", r.reason instanceof Error ? r.reason.message : r.reason);
  }
  return results.some((r) => r.status === "fulfilled");
}

/* ── Abuse protection: simple per-IP sliding window (per server instance) ── */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}
