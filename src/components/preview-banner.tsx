import { business } from "@/config/business";
import { previewMode } from "@/config/site";

/** Persistent notice so sample content is never mistaken for real inventory. */
export function PreviewBanner() {
  if (!previewMode) return null;
  return (
    <div role="note" className="bg-bronze text-paper">
      <p className="container-x py-2 text-center text-[0.8125rem] leading-snug">
        <strong className="font-semibold">Preview mode.</strong> Listings and projects marked “Sample” and all
        photography marked “Illustrative” are demonstration content — not {business.name} inventory.
      </p>
    </div>
  );
}
