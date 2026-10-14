/**
 * Justified photo rows: every row spans the full width and the photos in a row share one height, so a gallery
 * has no ragged edges or empty corners. Row breaks are chosen by dynamic programming to keep each row's height
 * close to `targetHeight` (the last row included), which keeps the photo order.
 *
 * Returns the indices of the photos that end a row (the final photo is left out).
 */
export function rowBreaks(ratios: number[], width: number, targetHeight: number, gap: number): Set<number> {
  const n = ratios.length;
  const cost = new Array<number>(n + 1).fill(Infinity);
  const start = new Array<number>(n + 1).fill(0);
  cost[0] = 0;
  for (let end = 1; end <= n; end++) {
    let sum = 0;
    for (let i = end - 1; i >= 0; i--) {
      sum += ratios[i];
      const height = (width - gap * (end - 1 - i)) / sum;
      // Off-target rows cost the same whether too tall or too short: compare on a log scale.
      const c = cost[i] + Math.log(height / targetHeight) ** 2;
      if (c < cost[end]) {
        cost[end] = c;
        start[end] = i;
      }
      if (height < targetHeight / 3) break; // adding more photos only makes the row shorter
    }
  }
  const breaks = new Set<number>();
  for (let end = start[n]; end > 0; end = start[end]) breaks.add(end - 1);
  return breaks;
}
