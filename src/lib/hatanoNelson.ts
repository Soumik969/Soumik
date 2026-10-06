/*
 * Hatano–Nelson chain: H ψ_j = t_R ψ_{j−1} + t_L ψ_{j+1}, with t_R = t + γ and
 * t_L = t − γ. Textbook results used here:
 *   PBC: E(k) = 2t cos k − 2iγ sin k            (an ellipse in the complex plane)
 *   OBC: E_n = 2√(t² − γ²) cos(nπ / (N + 1))    (real; eigenstates ∝ (t_R/t_L)^{j/2})
 * Time evolution integrates i dψ/dt = H ψ with RK4.
 */

import { mulberry32 } from "./math";

export type Boundary = "pbc" | "obc";

export function spectrum(n: number, t: number, g: number, boundary: Boundary): [number, number][] {
  const out: [number, number][] = [];
  if (boundary === "pbc") {
    for (let m = 0; m < n; m++) {
      const k = (2 * Math.PI * m) / n;
      out.push([2 * t * Math.cos(k), -2 * g * Math.sin(k)]);
    }
  } else {
    const a = 2 * Math.sqrt(Math.max(0, t * t - g * g));
    for (let m = 1; m <= n; m++) out.push([a * Math.cos((m * Math.PI) / (n + 1)), 0]);
  }
  return out;
}

export class Chains {
  readonly rows: number;
  readonly n: number;
  re: Float64Array;
  im: Float64Array;
  private k: Float64Array[];
  private tmpRe: Float64Array;
  private tmpIm: Float64Array;
  private seed: number;

  constructor(rows: number, n: number, seed = 969) {
    this.rows = rows;
    this.n = n;
    this.re = new Float64Array(rows * n);
    this.im = new Float64Array(rows * n);
    this.k = Array.from({ length: 8 }, () => new Float64Array(n));
    this.tmpRe = new Float64Array(n);
    this.tmpIm = new Float64Array(n);
    this.seed = seed;
    this.inject();
  }

  /** One Gaussian wave packet per chain, at a random position and momentum. */
  inject() {
    const rand = mulberry32(this.seed++);
    const { n } = this;
    for (let r = 0; r < this.rows; r++) {
      const j0 = 3 + rand() * (n - 6);
      const k0 = (rand() - 0.5) * 2 * Math.PI;
      const s = 1.4 + rand() * 1.2;
      for (let j = 0; j < n; j++) {
        const env = Math.exp(-((j - j0) ** 2) / (2 * s * s));
        this.re[r * n + j] = env * Math.cos(k0 * j);
        this.im[r * n + j] = env * Math.sin(k0 * j);
      }
    }
    this.normalize();
  }

  private apply(re: Float64Array, im: Float64Array, outRe: Float64Array, outIm: Float64Array, tR: number, tL: number, pbc: boolean) {
    // d/dt ψ = −i H ψ  ⇒  d(re)/dt = H·im,  d(im)/dt = −H·re  (H real)
    const n = this.n;
    for (let j = 0; j < n; j++) {
      let hr = 0;
      let hi = 0;
      const jm = j - 1;
      const jp = j + 1;
      if (jm >= 0) {
        hr += tR * re[jm];
        hi += tR * im[jm];
      } else if (pbc) {
        hr += tR * re[n - 1];
        hi += tR * im[n - 1];
      }
      if (jp < n) {
        hr += tL * re[jp];
        hi += tL * im[jp];
      } else if (pbc) {
        hr += tL * re[0];
        hi += tL * im[0];
      }
      outRe[j] = hi;
      outIm[j] = -hr;
    }
  }

  step(dt: number, t: number, g: number, boundary: Boundary) {
    const tR = t + g;
    const tL = t - g;
    const pbc = boundary === "pbc";
    const n = this.n;
    const [k1r, k1i, k2r, k2i, k3r, k3i, k4r, k4i] = this.k;
    const xr = this.tmpRe;
    const xi = this.tmpIm;
    for (let r = 0; r < this.rows; r++) {
      const re = this.re.subarray(r * n, r * n + n);
      const im = this.im.subarray(r * n, r * n + n);
      this.apply(re, im, k1r, k1i, tR, tL, pbc);
      for (let j = 0; j < n; j++) {
        xr[j] = re[j] + 0.5 * dt * k1r[j];
        xi[j] = im[j] + 0.5 * dt * k1i[j];
      }
      this.apply(xr, xi, k2r, k2i, tR, tL, pbc);
      for (let j = 0; j < n; j++) {
        xr[j] = re[j] + 0.5 * dt * k2r[j];
        xi[j] = im[j] + 0.5 * dt * k2i[j];
      }
      this.apply(xr, xi, k3r, k3i, tR, tL, pbc);
      for (let j = 0; j < n; j++) {
        xr[j] = re[j] + dt * k3r[j];
        xi[j] = im[j] + dt * k3i[j];
      }
      this.apply(xr, xi, k4r, k4i, tR, tL, pbc);
      for (let j = 0; j < n; j++) {
        re[j] += (dt / 6) * (k1r[j] + 2 * k2r[j] + 2 * k3r[j] + k4r[j]);
        im[j] += (dt / 6) * (k1i[j] + 2 * k2i[j] + 2 * k3i[j] + k4i[j]);
      }
    }
    this.normalize();
  }

  /** Non-Hermitian evolution does not conserve the norm; rescale each chain. */
  normalize() {
    const n = this.n;
    for (let r = 0; r < this.rows; r++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += this.re[r * n + j] ** 2 + this.im[r * n + j] ** 2;
      const f = s > 0 ? 1 / Math.sqrt(s) : 0;
      for (let j = 0; j < n; j++) {
        this.re[r * n + j] *= f;
        this.im[r * n + j] *= f;
      }
    }
  }

  density(r: number, j: number) {
    const i = r * this.n + j;
    return this.re[i] ** 2 + this.im[i] ** 2;
  }

  /** Average probability on the last `w` sites (the right boundary). */
  edgeWeight(w = 3) {
    let s = 0;
    for (let r = 0; r < this.rows; r++) for (let j = this.n - w; j < this.n; j++) s += this.density(r, j);
    return s / this.rows;
  }
}
