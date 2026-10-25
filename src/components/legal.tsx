import { business } from "@/config/business";
import { contact } from "@/lib/contact";
import { ContentNeeded } from "./ui";

export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x pb-24">
      <ContentNeeded className="mb-10 max-w-3xl">
        This is a starting draft written to match how this website works. Have it reviewed (and adapted to your actual
        practices) before launch.
      </ContentNeeded>
      <div className="max-w-3xl space-y-10 text-[1.0625rem] leading-relaxed text-ink-2 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink [&_p+p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}

export function ContactLine() {
  const parts = [contact.email && `email ${contact.email}`, contact.phoneDisplay && `call ${contact.phoneDisplay}`].filter(Boolean);
  return (
    <p>
      For questions about this policy, contact {business.name}
      {parts.length ? ` — ${parts.join(" or ")}` : " using the enquiry form on our contact page"}.
    </p>
  );
}
