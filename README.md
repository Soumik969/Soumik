# Soumik Sahoo — personal website

Academic website of **Soumik Sahoo**, B.Tech in Engineering Physics at IIT Bombay.
A simple, minimalist design in the style of the [al-folio](https://github.com/alshedivat/al-folio) academic theme: light and dark mode,
About · Projects · CV · Teaching · Photos · Contact pages, and one page per project.

Live at **https://soumik969.github.io/Soumik/** (deployed automatically from `main`).

## Editing content

All text comes from the CV and lives in `src/content/`:

| File          | Contents                                                                        |
| ------------- | ------------------------------------------------------------------------------- |
| `profile.ts`  | name, contact, research interests, news, education, achievements, coursework    |
| `projects.ts` | research and course projects (each one gets its own page under `/projects/...`) |
| `teaching.ts` | teaching and mentorship                                                         |
| `skills.ts`   | technical skills                                                                |
| `photos.ts`   | the Photos page: one section per place, with a caption for every photo          |

- **Profile photo:** put a square photo at `public/profile.jpg` and set `photo: "/profile.jpg"` in `src/content/profile.ts`. Until then the
  About page shows your initials.
- **CV:** replace `public/cv/Soumik_Sahoo_CV.pdf`.
- **News:** add a line to the `news` list in `src/content/profile.ts`.
- **Photos:** export a JPEG about 1800 px on the long edge plus an 800 px-wide `-sm` thumbnail, strip the camera metadata (it can
  include GPS), put both in `public/photos/<place>/`, and add an entry to `src/content/photos.ts`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static site in ./out
```

Built with Next.js (static export), React, TypeScript and Tailwind CSS. No animation or 3D libraries.

## Deploy (GitHub Pages)

`.github/workflows/deploy-pages.yml` builds and publishes the site on every push to `main`.
Set **Settings → Pages → Source** to **GitHub Actions** (one-time) so only this workflow publishes the site.

For the shorter address **https://soumik969.github.io/**, rename the repository to `Soumik969.github.io`; the workflow picks up the new
base path automatically.

## Layout

```
src/app/          pages: about (/), projects, projects/[slug], cv, teaching, photos, contact, 404
src/components/   navbar, theme toggle, footer, profile, project card, photo gallery, icons
src/content/      all site text (from the CV)
public/           CV, project reports, photos, social-share image
legacy/           the original static site, kept for reference
```
