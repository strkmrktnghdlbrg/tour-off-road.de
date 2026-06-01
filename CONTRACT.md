# CONTRACT.md - tour-off-road.de

Verbindliche Schnittstellen-Doku fuer alle Folge-Agenten (Migration, Content, Verify).
**Single Source of Truth.** Aenderungen an Feldnamen/Props/Routen NUR hier abgestimmt vornehmen.

Stack: Astro 5 + reine `.astro`-Komponenten + Content Layer (`glob()`-Loader). Kein Tailwind.
Globales CSS: `src/styles/global.css` (1:1 aus Mockups, Tokens + Komponenten-Klassen).

---

## 1. Foto-Feld-Konvention (WICHTIG)

Alle Bild-Felder enthalten die **volle `https://images.unsplash.com/...`-URL als String**.
Keine lokalen Pfade, kein Astro-Image-Asset, kein Import. Format z.B.:

```
https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=75
```

Feldnamen je Collection:
- `routen`: `hero` (string), `gallery` (string[])
- `reiseziele`: `hero` (string)
- `ausruestung`: `image` (string)
- `magazin`: `hero` (string)

Das Markup setzt die URL direkt als `background-image:url('...')` (Pixel-Treue zu den Mockups).

---

## 2. Content Collections

Definiert in `src/content.config.ts`. Loader: `glob()`.

### 2.1 routen  ·  Dateien: `src/content/routen/<slug>.md`  ·  Format: Markdown

| Feld | Typ | Hinweis |
|------|-----|---------|
| `title` | string | |
| `slug` | string | = Dateiname, URL-Segment |
| `region` | string | Ref auf `reiseziele`-`slug`, z.B. `"marokko"` |
| `difficulty` | `'leicht' \| 'mittel' \| 'schwer'` | steuert Badge (easy/mid/hard) |
| `days` | number | |
| `distanceKm` | number | |
| `elevationM` | number | |
| `bestSeason` | string | z.B. `"Apr–Okt"` |
| `terrain` | string[] | z.B. `["Fels","Schotter","Sand"]` |
| `vehicle` | string | |
| `fuelAvailability` | string | |
| `hero` | string (Unsplash-URL) | |
| `gallery` | string[] (Unsplash-URLs) | optional, default `[]`; Detail nutzt die ersten 2 |
| `excerpt` | string | |
| `stages` | `{title,desc,km:number,hours:number,stay}[]` | default `[]` |
| `gearNeeded` | string[] | Format `"<Begriff> - <Erklaerung>"` (erstes Wort wird gebold) |
| `faqs` | `{q,a}[]` | default `[]` |
| `related` | string[] | routen-`slug`s; Selbstreferenz wird gefiltert |
| **Body** | Markdown | wird als "Was dich erwartet" gerendert |

### 2.2 reiseziele  ·  Dateien: `src/content/reiseziele/<slug>.md`  ·  Format: Markdown

| Feld | Typ | Hinweis |
|------|-----|---------|
| `title` | string | Detailseite nutzt `title.split(':')[0]` als Kurzname |
| `slug` | string | URL-Segment |
| `continent` | string | |
| `routesCount` | number | |
| `bestSeason` | string | |
| `arrival` | string | |
| `carnetRequired` | boolean | |
| `hero` | string (Unsplash-URL) | |
| `excerpt` | string | |
| `facts` | `{k,v}[]` | default `[]`; rendert FactGrid |
| `faqs` | `{q,a}[]` | default `[]` |
| `topRoutes` | string[] | routen-`slug`s |
| **Body** | Markdown | Laenderbeschreibung |

### 2.3 ausruestung  ·  Dateien: `src/content/ausruestung/<slug>.json`  ·  Format: JSON (oder YAML)

| Feld | Typ | Hinweis |
|------|-----|---------|
| `title` | string | |
| `slug` | string | |
| `category` | `'recovery' \| 'camping' \| 'navigation' \| 'campkueche' \| 'reifen'` | steuert Filter + URL |
| `image` | string (Unsplash-URL) | |
| `price` | string | z.B. `"ab 249 €"` |
| `rating` | number | z.B. `4.9` (Anzeige als `4,9`) |
| `badge` | string \| null | z.B. `"Testsieger"`, default `null` |
| `excerpt` | string | |
| `affiliateUrl` | string | Karte verlinkt direkt hierauf |

### 2.4 magazin  ·  Dateien: `src/content/magazin/<slug>.md`  ·  Format: Markdown

| Feld | Typ | Hinweis |
|------|-----|---------|
| `title` | string | |
| `slug` | string | URL-Segment |
| `category` | string | z.B. `"Reise"` |
| `hero` | string (Unsplash-URL) | |
| `excerpt` | string | |
| `author` | string | |
| `date` | `coerce.date` | YAML `2026-06-01` |
| `readMinutes` | number | |
| `cluster` | string | Hub-Cluster-Zuordnung |
| **Body** | Markdown | Artikel (gerendert via `render()`) |

---

## 3. Seiten-Routen / URL-Muster

| Route | Datei | Quelle |
|-------|-------|--------|
| `/` | `src/pages/index.astro` | home.html |
| `/routen/` | `src/pages/routen/index.astro` | routen.html (Listing + FilterBar) |
| `/routen/<slug>/` | `src/pages/routen/[slug].astro` | route-atlas-marokko.html |
| `/reiseziele/` | `src/pages/reiseziele/index.astro` | reiseziele.html |
| `/reiseziele/<slug>/` | `src/pages/reiseziele/[slug].astro` | reiseziel-marokko.html |
| `/ausruestung/` | `src/pages/ausruestung/index.astro` | ausruestung.html (Pills + GearCards) |
| `/ausruestung/<category>/` | `src/pages/ausruestung/[category].astro` | gefiltert; category ∈ recovery/camping/navigation/campkueche/reifen |
| `/versicherungen/` | `src/pages/versicherungen/index.astro` | versicherungen.html (Daten inline) |
| `/magazin/` | `src/pages/magazin/index.astro` | Listing |
| `/magazin/<slug>/` | `src/pages/magazin/[slug].astro` | magazin-suedafrika.html |

`getStaticPaths` nutzt jeweils `entry.data.slug` (nicht `entry.id`) als `params`.
Redirects -> `public/_redirects` (NICHT in `astro.config.mjs`).

---

## 4. Komponenten (`src/components/`) + Props

| Komponente | Props |
|------------|-------|
| `Header.astro` | `active?: 'routen'\|'reiseziele'\|'fahrzeuge'\|'ausruestung'\|'ratgeber'\|'versicherungen'\|'magazin'\|null` |
| `Footer.astro` | - |
| `Announce.astro` | `text?`, `linkLabel?`, `href?` |
| `RouteCard.astro` | `href`, `hero`, `title`, `excerpt?`, `difficulty?: 'leicht'\|'mittel'\|'schwer'`, `days?: number`, `meta?: string[]` |
| `DestinationCard.astro` | `href`, `hero`, `title`, `sub?`, `ratio?: 'portrait'\|'wide'` |
| `GearCard.astro` | `href`, `image`, `title`, `category`, `excerpt?`, `price`, `rating: number`, `badge?: string\|null`, `badgeColor?`, `badgeTextColor?` |
| `CompareTable.astro` | `headCols: string[]`, `rows: {provider, cells: string[], rating, href}[]` |
| `FactGrid.astro` | `facts: {k,v}[]` |
| `StageList.astro` | `stages: {title,desc,km:number,hours:number,stay}[]` |
| `QABlock.astro` | `eyebrow?`, `items: {q,a}[]` |
| `Pills.astro` | `items: {label, href?, on?}[]` |
| `FilterBar.astro` | `groups: {label, chips: {label, on?}[]}[]`, `resultCount?` |
| `MagCard.astro` | `href`, `hero`, `category`, `title`, `excerpt?` |
| `Breadcrumb.astro` | `items: {label, href?}[]` (letztes = aktuell, ohne href) |
| `AsideCard.astro` | `title`, `subtitle?` + `<slot>` |
| `CtaBand.astro` | `titleBefore?`, `emphasis?`, `titleAfter?`, `text?`, `primaryLabel?`, `primaryHref?`, `ghostLabel?`, `ghostHref?` |

`Base.astro` (Layout): Props `title`, `description?`, `image?` (Unsplash-URL), `path?`.

---

## 5. Beispiel-Frontmatter (copy-paste-faehig)

### routen (`src/content/routen/<slug>.md`)
```yaml
---
title: "Atlas-Überquerung: vom Hohen Atlas in die Wüste"
slug: "atlas-ueberquerung-marokko"
region: "marokko"
difficulty: "schwer"           # leicht | mittel | schwer
days: 5
distanceKm: 410
elevationM: 2260
bestSeason: "Apr–Okt"
terrain: ["Fels", "Schotter", "Sand"]
vehicle: "4×4 mit Untersetzung"
fuelAvailability: "spärlich"
hero: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=900&q=75"
gallery:
  - "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=70"
  - "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&q=70"
excerpt: "Hochgebirgspisten, Berber-Dörfer und der Tizi-n-Tichka-Pass."
stages:
  - { title: "Marrakesch → Telouet", desc: "Auffahrt über den Pass.", km: 82, hours: 4, stay: "Wildcamp am Fluss" }
gearNeeded:
  - "Sandbleche - für die Dünenabschnitte unverzichtbar."
faqs:
  - { q: "Für Anfänger geeignet?", a: "Nein, 4×4 mit Untersetzung nötig." }
related:
  - "erg-chebbi-duenen-loop"
---

## Was dich erwartet
Body-Text in Markdown ...
```

### reiseziele (`src/content/reiseziele/<slug>.md`)
```yaml
---
title: "Marokko: das Offroad-Paradies vor der Haustür"
slug: "marokko"
continent: "Afrika"
routesCount: 38
bestSeason: "Apr–Okt"
arrival: "Fähre"
carnetRequired: false
hero: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=75"
excerpt: "Hoher Atlas, Schotterpisten, echte Sahara-Dünen."
facts:
  - { k: "Beste Reisezeit", v: "Apr–Okt" }
  - { k: "Anreise", v: "Fähre" }
  - { k: "Carnet", v: "nicht nötig" }
  - { k: "Routen", v: "38" }
faqs:
  - { q: "Beste Zeit?", a: "April bis Oktober für die Atlas-Pässe." }
topRoutes:
  - "atlas-ueberquerung-marokko"
---

## Warum Marokko
Body-Text in Markdown ...
```

### ausruestung (`src/content/ausruestung/<slug>.json`)
```json
{
  "title": "Maxtrax MKII Sandbleche",
  "slug": "maxtrax-mkii",
  "category": "recovery",
  "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=70",
  "price": "ab 249 €",
  "rating": 4.9,
  "badge": "Testsieger",
  "excerpt": "Der Standard zum Freikommen aus Sand & Schlamm. Unkaputtbar.",
  "affiliateUrl": "https://www.amazon.de/dp/XXXX?tag=touroffroad-21"
}
```

### magazin (`src/content/magazin/<slug>.md`)
```yaml
---
title: "Südafrikas Outdoor-Abenteuer und kulturelle Schätze entdecken"
slug: "suedafrika-outdoor-abenteuer"
category: "Reise"
hero: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200&q=75"
excerpt: "Von der Garden Route bis in die Karoo - vier Wochen im Allrad."
author: "Joshua Stark"
date: 2026-06-01
readMinutes: 8
cluster: "reiseziele"
---

Body-Text in Markdown ...
```

---

## 6. Konventionen (verpflichtend)

- **Keine Em-Dashes** (—) im Content. Nur normaler Bindestrich (-).
- **Echte Umlaute** (ö/ä/ü/ß), nie ASCII-Ersatz.
- Difficulty-Badge-Klassen: `leicht`→`badge easy`, `mittel`→`badge mid`, `schwer`→`badge hard`.
- Ausruestung-`category`-Werte sind die URL-Segmente unter `/ausruestung/<category>/`.
- Listing-Seiten enthalten aktuell zusaetzliche Demo-Kacheln (inline) aus den Mockups.
  Sobald echte Eintraege via Content-Agent existieren, koennen die `demo*`-Arrays in
  `routen/index`, `reiseziele/index`, `ausruestung/index`, `magazin/index` reduziert/entfernt werden.
