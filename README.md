# Glimmer Clinics website

## Run it
1. Put your `App.jsx` into `src/App.jsx` (replace the placeholder).
2. `npm install`
3. `npm run fix`   (applies all fixes; keeps a clean backup and is safe to re-run)
4. `npm run dev`   → local preview
5. `npm run build` → production files in `dist/`, upload to any host

## Still needs real content from the clinic (edit CONFIG at the top of App.jsx)
- `brand.logoUrl` – the real logo file (put it in `public/` and use `/logo.svg`)
- `images.hero.url` and gallery photos – the site uses illustrated placeholders until real photos are supplied
- `contact.openingHours` – e.g. `[{ d: "Sat–Thu", h: "10:00 – 20:00" }]`
- `contact.mapsUrl` – the clinic's Google Maps share link
- `experts` – practitioner names, titles and credentials (section stays hidden while empty)
- `showReviews` / `rating.verified` – turn on only once real, consented reviews exist
- Analytics – events are pushed to `window.dataLayer`; add your Google Tag Manager snippet to `index.html`
