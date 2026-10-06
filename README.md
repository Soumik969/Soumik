# SOUMIK969

Research website of **Soumik Sahoo** — B.Tech in Engineering Physics, IIT Bombay.
Experimental quantum devices, quantum transport, superconductivity, topology, non-Hermitian systems and computational physics.

The site is built like an instrument rather than a portfolio template: a layered background field, a live interference-pattern hero, and a
"research atlas" where each project is drawn as the system it studies. Three figures are fully interactive:

| Figure                               | What you can do                                                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Non-Hermitian skin effect** (R-03) | Switch PBC ↔ OBC and tune γ while nine Hatano–Nelson chains evolve in real time; the complex spectrum morphs alongside (exact formulas). |
| **Quantum-dot readout** (R-01)       | Sweep a plunger gate through a Coulomb staircase, or run a 3-level Empty/Load/Read pulse, and follow the signal to the RF readout.       |
| **MTI / superconductor** (R-02)      | Tune interface coupling on a 50-layer film stack and step through the Green's-function derivation pipeline.                              |

All figures are conceptual illustrations. None of them show measured data or research results.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide.
No 3D library: every visual is SVG or Canvas 2D, and each interactive figure is code-split and only mounted when it scrolls near the viewport.

## Editing content

All text comes from the CV and lives in `src/content/`. Edit those files rather than the components:

| File                | Contents                                                                  |
| ------------------- | ------------------------------------------------------------------------- |
| `profile.ts`        | name, contact, CPI, education, achievements, extracurriculars, coursework |
| `research.ts`       | the six research projects (R-01 … R-06)                                   |
| `courseProjects.ts` | the Theoretical Lab entries                                               |
| `timeline.ts`       | the research trajectory                                                   |
| `skills.ts`         | the toolkit graph and tool table                                          |
| `teaching.ts`       | teaching and mentorship                                                   |
| `lab.ts`            | the "Inside the lab" measurement chain                                    |

The downloadable CV is `public/cv/Soumik_Sahoo_CV.pdf`; replace that file to update it.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static site in ./out
npm start          # serve ./out locally
```

## Deploy (GitHub Pages)

`.github/workflows/deploy-pages.yml` builds and publishes the site on every push to `main`.

1. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions** (one-time).
2. Merge into `main`. The site appears at **https://soumik969.github.io/Soumik/**.

For the shorter **https://soumik969.github.io/**, rename the repository to `Soumik969.github.io`; the workflow detects the new base path automatically.
A custom domain such as `soumik969.dev` can be attached later under Settings → Pages (check availability with a registrar first).

## Repository layout

```
src/app/          layout, metadata, page, 404, icons, robots, sitemap
src/components/   layout/ (nav, background layers, depth rail), sections/, research/, theory/, ui/
src/content/      all site text (from the CV)
src/lib/          helpers, including the Hatano–Nelson simulation
public/           CV, project reports, OpenGraph image
legacy/           the previous static site, kept for reference
```
