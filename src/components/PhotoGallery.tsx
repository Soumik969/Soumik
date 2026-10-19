"use client";

/* eslint-disable @next/next/no-img-element -- static export: plain <img> keeps the base path handling simple */
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react";
import type { Photo } from "@/content/photos";
import { rowBreaks } from "@/lib/justify";
import { asset } from "@/lib/site";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./Icons";

type Open = { place: number; index: number };

/** A titled set of photos. `place` on a photo names where it was taken when the group mixes places. */
export type PhotoGroup = { slug: string; name: string; meta?: string; photos: (Photo & { place?: string })[] };

const sameShape = (p: Photo) => Math.abs(p.thumbWidth / p.thumbHeight - p.width / p.height) < 0.02;

/* Row layouts for phones and for wider screens (content width at 390 px and 1000 px, row height, gap — in px).
   Rows scale with the actual width, so between these sizes they just get a little shorter. */
const MOBILE = { width: 358, height: 125, gap: 6 };
const DESKTOP = { width: 968, height: 215, gap: 8 };

/**
 * Full-width rows of thumbnails. Each photo's flex-grow is its aspect ratio, so the photos in a row share one
 * height and together fill the row exactly; zero-height spacers force the row breaks (one set per layout).
 */
function PhotoRows({ photos, onOpen }: { photos: Photo[]; onOpen: (index: number) => void }) {
  const ratios = photos.map((ph) => ph.thumbWidth / ph.thumbHeight);
  const mobile = rowBreaks(ratios, MOBILE.width, MOBILE.height, MOBILE.gap);
  const desktop = rowBreaks(ratios, DESKTOP.width, DESKTOP.height, DESKTOP.gap);

  return (
    <div className="flex flex-wrap gap-x-1.5 sm:gap-x-2">
      {photos.map((ph, i) => (
        <Fragment key={ph.src}>
          <a
            href={asset(ph.src)}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              onOpen(i);
            }}
            className="group relative mb-1.5 block min-w-0 basis-0 overflow-hidden rounded-md bg-surface sm:mb-2"
            style={{ flexGrow: ratios[i], aspectRatio: `${ph.thumbWidth} / ${ph.thumbHeight}` }}
          >
            <img
              src={asset(ph.thumb)}
              alt={ph.alt}
              width={ph.thumbWidth}
              height={ph.thumbHeight}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-[transform,opacity,filter] duration-300 group-hover:scale-[1.03] group-hover:opacity-90 dark:brightness-90 dark:group-hover:opacity-100 dark:group-hover:brightness-105"
            />
          </a>
          {mobile.has(i) && <span aria-hidden className="basis-full sm:hidden" />}
          {desktop.has(i) && <span aria-hidden className="hidden basis-full sm:block" />}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * One section per group with full-width rows of thumbnails (`headings={false}` drops the section titles,
 * for a single group). Each thumbnail links to the full-size image, so it still works without JavaScript;
 * with it, a native <dialog> shows the photo with prev/next, arrow keys, swipe, and Esc to close.
 */
export function PhotoGallery({ groups: places, headings = true }: { groups: PhotoGroup[]; headings?: boolean }) {
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
        <section key={pl.slug} id={pl.slug} aria-labelledby={headings ? `${pl.slug}-title` : undefined} aria-label={headings ? undefined : pl.name}>
          {headings && (
            <>
              <h2 id={`${pl.slug}-title`} className="section-title mb-1">
                {pl.name}
              </h2>
              {pl.meta && <p className="mb-4 text-sm text-muted">{pl.meta}</p>}
            </>
          )}
          <PhotoRows photos={pl.photos} onOpen={(i) => setOpen({ place: p, index: i })} />
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
                  {photo.place ?? place.name} · {index + 1} / {place.photos.length}
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
