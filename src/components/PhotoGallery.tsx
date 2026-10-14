"use client";

/* eslint-disable @next/next/no-img-element -- static export: plain <img> keeps the base path handling simple */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react";
import type { Photo, PhotoPlace } from "@/content/photos";
import { asset } from "@/lib/site";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./Icons";

type Open = { place: number; index: number };

const sameShape = (p: Photo) => Math.abs(p.thumbWidth / p.thumbHeight - p.width / p.height) < 0.02;

/**
 * One section per place with a masonry grid of thumbnails. Each thumbnail links to the full-size image,
 * so it still works without JavaScript; with it, a native <dialog> shows the photo with prev/next,
 * arrow keys, swipe, and Esc to close.
 */
export function PhotoGallery({ places }: { places: PhotoPlace[] }) {
  const [open, setOpen] = useState<Open | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const place = open ? places[open.place] : null;
  const photo = open && place ? place.photos[open.index] : null;
  const index = open?.index ?? 0;

  const step = useCallback(
    (by: number) =>
      setOpen((o) => {
        if (!o) return o;
        const n = places[o.place].photos.length;
        return { ...o, index: (o.index + by + n) % n };
      }),
    [places],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Warm the cache for the neighbours so prev/next feel instant.
  useEffect(() => {
    if (!open) return;
    const list = places[open.place].photos;
    for (const by of [1, -1]) {
      const next = list[(open.index + by + list.length) % list.length];
      new Image().src = asset(next.src);
    }
  }, [open, places]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  }

  function onTouchEnd(e: TouchEvent) {
    const start = touchX.current;
    touchX.current = null;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }

  return (
    <>
      {places.map((pl, p) => (
        <section key={pl.slug} id={pl.slug} aria-labelledby={`${pl.slug}-title`}>
          <h2 id={`${pl.slug}-title`} className="section-title mb-1">
            {pl.name}
          </h2>
          <p className="mb-4 text-sm text-muted">
            {pl.country} · {pl.date}
          </p>
          <ul className="columns-2 gap-3 sm:columns-3">
            {pl.photos.map((ph, i) => (
              <li key={ph.src} className="mb-3 break-inside-avoid">
                <a
                  href={asset(ph.src)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    setOpen({ place: p, index: i });
                  }}
                  className="group block overflow-hidden rounded-md bg-surface"
                >
                  <img
                    src={asset(ph.thumb)}
                    alt={ph.alt}
                    width={ph.thumbWidth}
                    height={ph.thumbHeight}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full transition-[transform,opacity] duration-300 group-hover:scale-[1.02] group-hover:opacity-90"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <dialog
        ref={dialog}
        aria-label={place ? `${place.name} photos` : "Photo"}
        onClose={() => setOpen(null)}
        onKeyDown={onKeyDown}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
        className="lightbox"
      >
        {place && photo && (
          <>
            <figure className="flex flex-col items-center gap-3" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
              <img
                key={photo.src}
                src={asset(photo.src)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="lightbox-img rounded-sm bg-white/5 bg-cover bg-center"
                style={
                  {
                    "--ratio": (photo.width / photo.height).toFixed(4),
                    aspectRatio: `${photo.width} / ${photo.height}`,
                    // The thumbnail doubles as a placeholder while the full image loads, unless it was cropped.
                    backgroundImage: sameShape(photo) ? `url("${asset(photo.thumb)}")` : undefined,
                  } as CSSProperties
                }
              />
              <figcaption className="max-w-[min(94vw,48rem)] px-2 text-center text-sm text-white/85">
                {photo.alt}
                <span className="ml-2 whitespace-nowrap text-white/55">
                  {place.name} · {index + 1} / {place.photos.length}
                </span>
              </figcaption>
            </figure>

            <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="lightbox-btn top-3 right-3">
              <CloseIcon size={24} />
            </button>
            {place.photos.length > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="lightbox-btn top-1/2 left-2 -translate-y-1/2 sm:left-4">
                  <ChevronLeftIcon size={28} />
                </button>
                <button type="button" aria-label="Next photo" onClick={() => step(1)} className="lightbox-btn top-1/2 right-2 -translate-y-1/2 sm:right-4">
                  <ChevronRightIcon size={28} />
                </button>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
