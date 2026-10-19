import { photoPlaces, type Photo } from "./photos";

/**
 * The few favourites shown on the Photos page; every photo is on the Travels page. Each entry is
 * "<place slug>/<file name>" for an image in public/photos/, listed in the order shown.
 */
const picks = [
  "luxembourg/20260606-1513131",
  "luxembourg/20260613-154841",
  "mullerthal/20260614-103633",
  "bruges/20260627-111827",
  "bruges/20260627-132501",
  "brussels/20260627-162454",
  "paris/20260705-081427",
  "paris/20260705-220502",
  "paris/20260705-214917",
  "trier/20260708-173523",
  "strasbourg/20260711-115008",
  "bern/20260711-155317",
  "bern/20260711-170605",
  "solothurn/20260711-210854",
  "basel/20260712-054839",
  "saarburg/20260719-173945",
  "interlaken/20260726-133218",
  "interlaken/20260726-135058",
  "interlaken/20260726-160818",
  "interlaken/20260726-1119461",
  "interlaken/20260725-184858",
  "istanbul/20260812-223007",
  "istanbul/20260813-112744",
  "istanbul/20260813-132446",
];

export const highlights: (Photo & { place: string })[] = picks.map((pick) => {
  const [slug] = pick.split("/");
  const place = photoPlaces.find((p) => p.slug === slug);
  const photo = place?.photos.find((ph) => ph.src === `/photos/${pick}.jpg`);
  if (!place || !photo) throw new Error(`highlights.ts: no photo "${pick}"`);
  return { ...photo, place: place.name };
});

/** Totals for the link to the Travels page; Food is not a place. */
export const travelStats = {
  photos: photoPlaces.reduce((n, p) => n + p.photos.length, 0),
  places: photoPlaces.filter((p) => p.slug !== "food").length,
};
