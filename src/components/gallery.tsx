"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import type { MediaImage } from "@/lib/types";
import { IllustrativeTag, ImageFallback } from "./media";

const kindLabel: Record<MediaImage["kind"], string | null> = {
  photo: null,
  render: "Artist’s impression",
  plan: "Plan",
  illustrative: "Illustrative image — not this property",
};

export function Gallery({ images, title }: { images: MediaImage[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10]">
        <ImageFallback label={title} />
      </div>
    );
  }

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const current = images[index];
  const mosaic = images.length >= 3;
  const tiles = images.slice(0, mosaic ? 3 : 1);

  return (
    <div>
      <div className={`grid gap-2 ${mosaic ? "md:grid-cols-3 md:grid-rows-2" : ""}`}>
        {tiles.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => open(i)}
            className={`group relative overflow-hidden bg-paper-2 ${
              i === 0
                ? mosaic
                  ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[30rem]"
                  : "aspect-[16/10]"
                : "hidden aspect-[4/3] md:block"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "33vw"}
              className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
            />
            {img.kind === "illustrative" && <IllustrativeTag className="bottom-2 left-2" />}
            <span className="sr-only">Open photo {i + 1} of {images.length} in full screen</span>
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => open(0)}
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          <Images aria-hidden className="size-4" />
          View all {images.length} images
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${title} — image gallery`}
        className="on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper open:flex open:flex-col"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm text-paper/80" aria-live="polite">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex size-12 items-center justify-center rounded-full hover:bg-paper/10"
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Close gallery</span>
          </button>
        </div>
        <div className="relative flex-1">
          <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 hover:bg-ink md:left-6"
              >
                <ChevronLeft aria-hidden className="size-6" />
                <span className="sr-only">Previous image</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 hover:bg-ink md:right-6"
              >
                <ChevronRight aria-hidden className="size-6" />
                <span className="sr-only">Next image</span>
              </button>
            </>
          )}
        </div>
        <div className="px-4 py-4 text-center text-sm text-paper/80">
          <p>{current.caption ?? current.alt}</p>
          {kindLabel[current.kind] && (
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/60">{kindLabel[current.kind]}</p>
          )}
        </div>
      </dialog>
    </div>
  );
}
