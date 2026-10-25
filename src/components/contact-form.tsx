"use client";

import { useSearchParams } from "next/navigation";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/types";
import { EnquiryForm } from "./enquiry-form";

/** General enquiry form; `?type=sell` etc. preselects the enquiry type. */
export function ContactForm({ deliveryReady }: { deliveryReady: boolean }) {
  const type = useSearchParams().get("type");
  const defaultType = (ENQUIRY_TYPES as readonly string[]).includes(type ?? "") && type !== "property" ? (type as EnquiryType) : "buy";
  // Keyed so a different ?type remounts the form with the new default.
  return <EnquiryForm key={defaultType} deliveryReady={deliveryReady} defaultType={defaultType} />;
}
