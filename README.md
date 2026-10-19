# Glimmer Clinics — Website

Single-page React (Vite) website for Glimmer Clinics, El Nozha, Cairo.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static site is written to `dist/` and can be hosted on Netlify, Vercel, or any static host.

## Customize

All clinic content, images, booking settings and contact details live in the `CONFIG` object at the top of `src/App.jsx`.

- Set `rating.verified` to `true` only after checking the Google listing.
- Add expert entries to `experts` once the clinic confirms credentials.
- Replace illustrated placeholders by setting an image `url` in `CONFIG`.
- Set `brand.logoUrl` to swap in the official logo.
