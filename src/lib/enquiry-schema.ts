import { z } from "zod";
import { ENQUIRY_TYPES } from "./types";

/** Removes control characters and collapses runs of spaces. */
const clean = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[ \t]+/g, " ").trim())
    .pipe(z.string().max(max, `Please keep this under ${max} characters.`));

const optional = (max: number) =>
  clean(max)
    .optional()
    .transform((s) => s || undefined);

export const enquirySchema = z.object({
  name: clean(80).pipe(z.string().min(2, "Please enter your name.")),
  phone: clean(20).pipe(
    z.string().refine((v) => {
      const digits = v.replace(/\D/g, "");
      return /^[+\d][\d\s-]*$/.test(v) && digits.length >= 10 && digits.length <= 13;
    }, "Please enter a valid phone number, e.g. 98765 43210.")
  ),
  email: clean(120)
    .optional()
    .transform((s) => s || undefined)
    .pipe(z.email("Please enter a valid email address, or leave it blank.").optional()),
  type: z.enum(ENQUIRY_TYPES, { error: "Please choose what your enquiry is about." }),
  subject: optional(160),
  subjectRef: optional(120),
  budget: optional(60),
  location: optional(80),
  message: optional(2000),
});

export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryField = keyof Enquiry;

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | { status: "invalid"; errors: Partial<Record<EnquiryField, string>> }
  | { status: "not-configured" }
  | { status: "error"; message: string };

export function fieldErrors(error: z.ZodError): Partial<Record<EnquiryField, string>> {
  const out: Partial<Record<EnquiryField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as EnquiryField;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
