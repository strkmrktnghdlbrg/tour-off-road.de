# tour-off-road.de

Offroad- und Overland-Reiseportal. Astro 5 mit handgeschriebenem CSS (kein Tailwind), Content Layer, reine `.astro`-Komponenten.

## Stack

- Astro 5 (`@astrojs/sitemap`, `@astrojs/rss`)
- Globales Stylesheet `src/styles/global.css` (Design "Dust & Blaze", 1:1 aus den Mockups)
- Content Collections via `glob()`-Loader: `routen`, `reiseziele`, `ausruestung`, `magazin`

## Befehle

```bash
npm install      # Abhaengigkeiten installieren
npm run dev      # Dev-Server auf http://localhost:4321
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal testen
```

## Struktur

- `src/layouts/Base.astro` - HTML-Grundgeruest mit Meta/OG/Canonical, importiert das globale CSS
- `src/components/` - wiederverwendbare UI-Bausteine (Header, Footer, Cards, Tabellen ...)
- `src/content/` - Markdown/Daten je Collection
- `src/content.config.ts` - Zod-Schemas + Loader
- `src/pages/` - Routen/URL-Struktur

## Konventionen

- Foto-Felder enthalten immer die volle `https://images.unsplash.com/...`-URL als String (siehe `CONTRACT.md`).
- Keine Em-Dashes im Content, echte Umlaute (oe -> ö usw.).
- Redirects gehoeren in `public/_redirects` (nicht in `astro.config.mjs`).

Die verbindliche Schnittstellen-Doku fuer Folge-Agenten ist `CONTRACT.md`.
