# Soumik Sahoo — personal website

Academic website of **Soumik Sahoo**, B.Tech in Engineering Physics at IIT Bombay.
A simple, minimalist design in the style of the [al-folio](https://github.com/alshedivat/al-folio) academic theme: light and dark mode,
About · Projects · CV · Photos · Blog · Contact pages, one page per project, and a Travels page with every photo.

Live at **https://soumik969.github.io/Soumik/** (deployed automatically from `main`).

## Editing content

All text comes from the CV and lives in `src/content/`:

| File            | Contents                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| `profile.ts`    | name, contact, research interests                                               |
| `projects.ts`   | research and course projects (each one gets its own page under `/projects/...`) |
| `photos.ts`     | the Travels page: one section per place                                         |
| `highlights.ts` | the few favourites shown on the Photos page (picked from `photos.ts`)           |

- **Profile photo:** replace `public/profile.jpg` with a 3:4 portrait (960 × 1280 or larger). Set `photo: null` in
  `src/content/profile.ts` to show your initials instead.
- **CV:** replace `public/cv/Soumik_Sahoo_CV.pdf`.
- **Photos:** export a JPEG about 1600 px on the long edge plus a 480 px-tall `-sm` thumbnail, strip the camera metadata (it can
  include GPS), put both in `public/photos/<place>/`, and add an entry to `src/content/photos.ts`. To show one on the Photos page as
  well, add it to `src/content/highlights.ts`.

## Blog

Posts are Markdown files in `content/posts/` (photos go in `public/blog/<post>/`); the Blog page lists them and each gets its own page.
You can write them without touching the code at **`/admin/`** on the live site (it is not linked anywhere and is hidden from search engines):

1. Create a fine-grained GitHub token for this repository only, with **Contents: Read and write**
   ([create one](https://github.com/settings/personal-access-tokens/new)).
2. Open `/admin/`, paste the token once (it is kept in that browser only and sent only to GitHub), then write, preview, add photos and publish.
3. Each save is a commit to `main`; the Pages workflow rebuilds the site in about 2 minutes.

Drafts stay hidden until you untick "Draft". To revoke access, delete the token on GitHub.

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
src/app/          pages: about (/), projects, projects/[slug], cv, photos, travels, contact, 404
src/components/   navbar, theme toggle, footer, profile, project card, photo gallery, icons
src/content/      all site text (from the CV)
public/           CV, project reports, photos, social-share image
legacy/           the original static site, kept for reference
```
