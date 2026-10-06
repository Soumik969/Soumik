"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { mulberry32, pathFrom, r2 } from "@/lib/math";

/* Geometry is computed once at module load with a seeded PRNG, so the server
   and client produce byte-identical SVG. */

const rand = mulberry32(969);
const STARS = Array.from({ length: 110 }, () => ({
  x: r2(rand() * 1600),
  y: r2(rand() * 1000),
  r: r2(0.4 + rand() * 0.9),
  o: r2(0.15 + rand() * 0.5),
}));

const ORBITS = [
  { rx: 150, ry: 54, rot: -18 },
  { rx: 240, ry: 90, rot: 24 },
  { rx: 330, ry: 120, rot: -36 },
  { rx: 430, ry: 150, rot: 8 },
  { rx: 540, ry: 196, rot: 52 },
];

const CONTOURS = Array.from({ length: 8 }, (_, i) => {
  const R = 70 + i * 52;
  const pts: [number, number][] = [];
  for (let k = 0; k <= 96; k++) {
    const th = (k / 96) * Math.PI * 2;
    const rr = R * (1 + 0.07 * Math.sin(3 * th + i * 0.6) + 0.045 * Math.cos(5 * th - i * 0.3));
    pts.push([rr * Math.cos(th), rr * 0.72 * Math.sin(th)]);
  }
  return pathFrom(pts, true);
});

const WAVES = Array.from({ length: 3 }, (_, j) => {
  const pts: [number, number][] = [];
  for (let x = 0; x <= 1600; x += 8) {
    const env = Math.exp(-(((x - 900) / 420) ** 2));
    pts.push([x, 500 + j * 26 + Math.sin(x / (38 + j * 6)) * 60 * env]);
  }
  return pathFrom(pts);
});

/**
 * Layers 1 and 2 of the page: a fixed field (gradient, grid, stars, noise) and
 * large scientific geometry that drifts with scroll at different rates.
 */
export function BackgroundLayers() {
  const { scrollYProgress } = useScroll();
  const yOrbit = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const yContour = useTransform(scrollYProgress, [0, 1], ["0%", "-46%"]);
  const yWave = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);
  const yStars = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Layer 1 — field */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 78% 8%, rgb(42 169 214 / 0.10), transparent 60%), radial-gradient(900px 700px at 0% 100%, rgb(171 141 255 / 0.07), transparent 60%), linear-gradient(180deg, #050812 0%, #03050a 100%)",
        }}
      />
      <div className="layer-grid absolute inset-0" />
      <motion.svg className="absolute inset-0 h-[110%] w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ y: yStars }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ece6da" opacity={s.o * 0.5} />
        ))}
      </motion.svg>

      {/* Layer 2 — scientific geometry */}
      <motion.div className="absolute top-[-8%] right-[-14%] h-[95vh] w-[95vh] md:right-[-6%]" style={{ y: yOrbit }}>
        <svg viewBox="-600 -600 1200 1200" className="animate-spin-slow h-full w-full opacity-70">
          {ORBITS.map((o, i) => (
            <g key={i} transform={`rotate(${o.rot})`}>
              <ellipse rx={o.rx} ry={o.ry} fill="none" stroke={i === 2 ? "#ab8dff" : "#74e4ff"} strokeOpacity={i === 2 ? 0.12 : 0.09} strokeWidth={1} />
              <circle cx={o.rx} cy={0} r={2.2} fill={i === 2 ? "#ab8dff" : "#74e4ff"} opacity={0.5} />
            </g>
          ))}
          <circle r={3} fill="#74e4ff" opacity={0.6} />
          <circle r={26} fill="none" stroke="#74e4ff" strokeOpacity={0.15} strokeDasharray="2 6" />
        </svg>
      </motion.div>

      <motion.svg className="absolute bottom-[-30%] left-[-18%] h-[90vh] w-[110vh]" viewBox="-520 -400 1040 800" style={{ y: yContour }}>
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#74e4ff" strokeOpacity={0.035 + i * 0.006} strokeWidth={1} />
        ))}
      </motion.svg>

      <motion.svg className="absolute inset-x-0 top-[40%] h-[60vh] w-full" viewBox="0 0 1600 1000" preserveAspectRatio="none" style={{ y: yWave }}>
        {WAVES.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={i === 1 ? "#ab8dff" : "#74e4ff"} strokeOpacity={0.05} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
      </motion.svg>

      <div className="layer-noise absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(3_5_10/0.7)_100%)]" />
    </div>
  );
}
