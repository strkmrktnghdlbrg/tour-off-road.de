# Improvement-Plan: tour-off-road.de

> Automatisches Audit vom 2026-07-04. Abarbeitbar von jeder Claude-Session. Vor Deploy: Hosting laut ClickUp-Task prüfen.

## 1. Status (Live?, Hosting/Deploy, Build-Stand)

- **LIVE**: `https://tour-off-road.de/` liefert 200 (Astro-Build, last-modified 2026-06-20). Memory-Stand "Mockup-Phase" ist veraltet, die Seite ist deployed.
- **Canonical OK**: `www.tour-off-road.de` -> 301 auf Apex. Server: LiteSpeed (A2 Hosting).
- **Deploy**: GitHub Actions `.github/workflows/deploy.yml`, SFTP-Mirror von `dist/` nach `nl1-ts109.a2hosting.com` (A2 Hosting). `dist/` ist ins Repo committet (Build-Commits "build: <timestamp>").
- **Build-Stand**: Astro 5, kein Tailwind, Content Collections (9 Reiseziele, 9 Routen, Ausrüstung, ~111 Content-Dateien). Suche, Silo-Verlinkung, Redirects (`public/_redirects` + `.htaccess`-Regeln laut MIGRATION.md) vorhanden.
- **Git-Zustand KAPUTT (lokal)**: Working Tree hat 71 unaufgelöste Merge-Konflikte (`UU`) in `dist/`-Dateien plus staged Änderungen, Branch ist 1 Commit hinter `origin/main` (f0c68a9). Der Live-Stand auf origin ist neuer als der lokale.

## 2. Kritische Findings (Sicherheit, kaputte Links, Canonical)

1. **Lokales Repo in unaufgelöstem Merge-Zustand**: 71 `UU`-Konflikte in `dist/`, `.git/AUTO_MERGE` vorhanden. Jede Session, die hier baut/committet, riskiert Konflikt-Marker im Live-HTML. Fix: `git merge --abort` bzw. `git reset --hard origin/main` (lokale dist-Änderungen sind wertlos, origin ist neuer), danach frisch bauen.
2. **robots.txt fehlt (404)**: Damit fehlt der `Sitemap:`-Verweis auf `/sitemap-index.xml` (die existiert und liefert 200). `public/robots.txt` anlegen.
3. **AWIN-Links laufen alle untracked**: `src/site.ts` Zeile 24: `publisherId: ''`. Der `awinDeeplink()`-Helper fällt dadurch bewusst auf rohe Händler-URLs zurück, d.h. alle AWIN-Platzierungen (Versicherungen, Gear) generieren 0 Provision.
4. Keine hartkodierten Secrets gefunden (api_key/AKIA/Bearer sauber), Web3Forms-Key ist der bekannte öffentliche Formular-Key (unkritisch). Kein Mixed Content, keine Debug-/Backup-Dateien in `public/`.
5. Canonical www/apex korrekt (301), kein Handlungsbedarf.

## 3. Vollendung (was zum Fertigstellen fehlt)

- Git-Zustand reparieren (siehe oben), sonst ist das Projekt für Folge-Sessions blockiert.
- AWIN-Publisher-ID eintragen sobald Programme freigegeben sind; `AFFILIATE-AWIN.md` listet die fertig recherchierten Advertiser (HanseMerkur 11705, Bergzeit 12557, Fritz Berger 70949 usw.) inkl. clickref-Konvention.
- AdSense ist NICHT eingebunden: `ads.txt` (pub-3946820918041547) und Datenschutz-Erwähnung existieren, aber kein `adsbygoogle.js`-Script in `src/layouts/Base.astro`. Entweder Script einbauen oder ads.txt/Datenschutz-Absatz entfernen (inkonsistenter Zustand).
- Kein GTM eingebunden (falls Tracking gewünscht).
- Legacy-/Domain-Merge-Seiten (`auto-service-wieblingen`, `was-ist-mein-auto-wert`, `street-skate-offroad-fahrspass`, `flucht-ins-mansfelder-land` u.a.) prüfen: bezahlte Gastartikel an exakter URL erhalten (Regel!), aber intern aus Navigation/Silos heraushalten.

## 4. Monetarisierung (vorhanden / fehlend / kaputt)

**Vorhanden:**
- Amazon-Tag `touroffroad-21` (zentral in `src/site.ts`, Ausrüstungs-Silo).
- AWIN-Deeplink-Infrastruktur (`awinDeeplink()` in `src/site.ts`) + komplette Partner-Recherche in `AFFILIATE-AWIN.md`.
- Web3Forms Kontaktformular (`src/pages/kontakt.astro`).
- `public/ads.txt` mit pub-3946820918041547.

**Kaputt:**
- AWIN: `publisherId: ''` -> alle Links untracked (siehe Kritisch #3).
- AdSense: ads.txt ohne eingebundenes Script = keine Ads, keine Einnahmen.

**Fehlend:**
- **Stay22 komplett** (kein `stay22` im Code): Für 9 Reiseziele + 9 Routen fehlt Hotel-/Unterkunfts-Monetarisierung. Individuelle lmaID für tour-off-road.de beim User erfragen (nie übernehmen!). Map-Embed MUSS `https://www.stay22.com/embed/gm` nutzen (nicht `/embed/widget`).
- **GetYourGuide**: keine Einbindung. Für Marokko/Island/Südafrika gibt es buchbare 4x4-/Wüsten-Touren, GYG-Widget pro Reiseziel-Seite einbauen.
- GTM fehlt.

## 5. SEO & Traffic (Struktur, interne Links, GEO/AI-Search)

- **Gut**: `@astrojs/sitemap` aktiv (`sitemap-index.xml` live 200), `site` gesetzt, JSON-LD-Layer in `src/seo.ts` mit Article, BreadcrumbList, FAQPage, ItemList, AggregateRating, Brand u.a. RSS vorhanden. Silo-Verlinkung (Related-/Sibling-Blöcke, Hub-Spoke) laut letztem Commit umgesetzt.
- **Fehlend**: `robots.txt` mit Sitemap-Verweis (Kritisch #2).
- **GEO/AI-Search**: FAQPage-Schema existiert, prüfen ob jede Routen-/Reiseziel-Seite einen frage-basierten FAQ-Block hat ("Braucht man für die F26 ein Allrad-Fahrzeug?", "Welche Reifen für Marokko-Pisten?"). Kontext-Attribute (Schwierigkeit, beste Jahreszeit, Fahrzeuganforderung) sind als extrahierbare Tabellen ideal für LLM-Snippets.
- Content-Basis (111 Dateien) ist solide; Ausbau in Richtung Buyer-Intent (siehe §6) hat mehr Hebel als weitere Info-Artikel.

## 6. Neue Buyer-Intent-Seiten (Tabelle: URL | Keyword-Idee | Monetarisierung)

| URL | Keyword-Idee | Monetarisierung |
|---|---|---|
| `/ausruestung/dachzelt-test/` | Dachzelt Test 2026 / bestes Dachzelt | Amazon `touroffroad-21` + AWIN Fritz Berger/CampingWagner |
| `/ausruestung/overlanding-packliste/` | Overlanding Packliste / Offroad Packliste | Amazon + AWIN Bergzeit |
| `/ausruestung/sandbleche-test/` | Sandbleche Test (Maxtrax & Co.) | Amazon + AWIN |
| `/ausruestung/kompressor-kuehlbox-test/` | Kompressor-Kühlbox 12V Test | Amazon |
| `/reiseziele/marokko/tour-buchen/` | Marokko Offroad-Tour buchen / geführte 4x4-Tour | GYG-Widget + AWIN-Veranstalter |
| `/mietwagen/4x4-mieten-namibia/` | 4x4 mieten Namibia Dachzelt | AWIN (Sunny Cars/billiger-mietwagen) |
| `/mietwagen/4x4-mieten-island/` | Island Jeep mieten Hochland F-Roads | AWIN Mietwagen + Stay22 |
| `/versicherungen/langzeit-auslandskrankenversicherung/` | Auslandskrankenversicherung Langzeitreise Overlander | AWIN HanseMerkur (15% CPO, höchste Provision) |
| `/reiseziele/<slug>/uebernachten/` (je Ziel) | Camping & Hotels entlang der Route | Stay22 Map `/embed/gm` |
| `/ausruestung/dachzelt-mieten/` | Dachzelt mieten Erfahrungen | Lead/AWIN, ergänzt Kauf-Seite |

## 7. Priorisierte Tasks (nummerierte [ ]-Checkliste, konkret für eine frische Session, mit Dateipfaden)

1. [ ] Git reparieren: in `/Users/joshuastark/Documents/Claude Code/Hotel, Reiseportale/tour-off-road-astro` den Merge abbrechen und auf origin syncen (`git merge --abort` bzw. `git reset --hard origin/main`), dann `npm run build` und prüfen, dass `git status` sauber ist.
2. [x] `public/robots.txt` anlegen (Allow all + `Sitemap: https://tour-off-road.de/sitemap-index.xml`), bauen, deployen.
3. [ ] AWIN-Publisher-ID beim User erfragen und in `src/site.ts` (`awin.publisherId`, Zeile 24) eintragen; Stichprobe: gerenderte Links auf `/versicherungen/` müssen `awin1.com/cread.php` enthalten.
4. [ ] AdSense-Entscheidung: `adsbygoogle.js?client=ca-pub-3946820918041547` in `src/layouts/Base.astro` einbauen (Vorlage: urlaubsreisezeit-astro `src/layouts/Base.astro` Zeile 34) oder ads.txt + Datenschutz-Absatz (`src/pages/datenschutz.astro` Zeile 230) entfernen.
5. [ ] Stay22: individuelle lmaID für tour-off-road.de beim User erfragen, Allez-Script in `src/layouts/Base.astro` + Map-Komponente mit `https://www.stay22.com/embed/gm` für Reiseziel-Seiten (`src/pages/reiseziele/[slug].astro`).
6. [ ] GYG-Widget-Komponente bauen (Vorlage urlaubsreisezeit-astro `src/components/GygWidget.astro`, eigene Partner-ID klären) und auf Reiseziel-Seiten Marokko/Island/Südafrika einbinden.
7. [ ] 3 Buyer-Intent-Seiten aus §6 bauen, Start mit `/ausruestung/dachzelt-test/`, `/ausruestung/overlanding-packliste/`, `/versicherungen/langzeit-auslandskrankenversicherung/` (Content Collections unter `src/content/ausruestung/`).
8. [ ] FAQ-Blöcke + FAQPage-Schema (via `src/seo.ts`) auf allen Routen-Seiten (`src/pages/routen/[slug].astro`) verifizieren/nachrüsten (GEO/AI-Search).
9. [ ] Nach allen Änderungen: build + commit + push (Auto-Deploy via GitHub Actions auf A2 Hosting) und Live-Stichprobe.
