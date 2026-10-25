import { ContactActions } from "./contact-actions";
import { ButtonLink } from "./ui";

export function EnquiryBand({
  title = (
    <>
      Looking for the right property? <em className="italic">Let’s find it together.</em>
    </>
  ),
  body = "Share what you need — location, budget, size and timing — and we will come back to you with relevant options.",
  href = "/contact",
}: {
  title?: React.ReactNode;
  body?: string;
  href?: string;
}) {
  return (
    <section aria-labelledby="enquiry-band-title" className="on-dark relative overflow-hidden bg-forest text-paper">
      <svg aria-hidden className="absolute -right-24 -bottom-24 h-[28rem] w-[28rem] text-paper/[0.06]" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="0.4">
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={i * 5} y={i * 5} width={100 - i * 10} height={100 - i * 10} />
          ))}
        </g>
      </svg>
      <div className="container-x relative grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="enquiry-band-title" className="font-display text-headline text-balance">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">{body}</p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
          <ButtonLink href={href} variant="light" className="w-full sm:w-auto">
            Enquire now
          </ButtonLink>
          <ContactActions tone="dark" className="lg:justify-end" />
        </div>
      </div>
    </section>
  );
}
