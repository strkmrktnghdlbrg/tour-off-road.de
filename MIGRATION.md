# MIGRATION.md - tour-off-road.de (WordPress -> Astro)

Stand: 2026-06-01
Quelle der URL-Inventur: Live-Fetch der WP-Startseite, des Footers und der
Blog-Listing-Seite `/thema/blog/` (alle Artikel-Slugs verifiziert).
Ziel-IA: siehe `CONTRACT.md`, Abschnitt 3 (Seiten-Routen / URL-Muster).

Redirect-Dateien:
- `public/_redirects` (Netlify / Cloudflare Pages)
- `public/.htaccess` (Apache / All-Inkl / Hostinger)

Beide Dateien enthalten dieselben Regeln. Es wird ausschliesslich **301**
(permanent) verwendet, um Linkjuice zu uebertragen.

---

## 1. Mapping-Tabelle (alt -> neu)

### Kategorie- / Themen-Seiten

| Alt (WP) | Neu (Astro) | Begruendung |
|----------|-------------|-------------|
| `/thema/ausruestung/` | `/ausruestung/` | Direkte 1:1-Entsprechung des Ausruestungs-Clusters. |
| `/thema/versicherungen/` | `/versicherungen/` | Direkte 1:1-Entsprechung des Versicherungs-Clusters. |
| `/thema/besondere-routen/` | `/routen/` | "Besondere Routen" = Kern des neuen Routen-Atlas. |
| `/thema/trekking/` | `/routen/` | Offroad-Trekking-Touren entsprechen inhaltlich den Routen. |
| `/thema/abenteuer/` | `/magazin/` | Reine Storytelling-/Abenteuer-Inhalte, kein eigener Cluster -> Magazin. |
| `/thema/urlaub/` | `/reiseziele/` | "Urlaub" = laenderbezogene Reiseinhalte -> Reiseziele-Hub. |
| `/thema/blog/` | `/magazin/` | Blog-Archiv wird im neuen Magazin-Listing fortgefuehrt. |

### Statische Seiten

| Alt (WP) | Neu (Astro) | Begruendung |
|----------|-------------|-------------|
| `/uber-uns/` | `/ueber-uns/` | Slug-Korrektur (echter Umlaut im neuen Slug). |
| `/impressum/` | `/impressum/` | **Unveraendert** - kein Redirect. |
| `/datenschutz/` | `/datenschutz/` | **Unveraendert** - kein Redirect. |

### Einzel-Artikel (on-topic, unbedenklich -> Magazin/Versicherungen)

| Alt (WP) | Neu (Astro) | Begruendung |
|----------|-------------|-------------|
| `/suedafrikas-outdoor-abenteuer-kulturelle-schaetze/` | `/magazin/suedafrika-outdoor-abenteuer/` | Reise-/Abenteuer-Artikel, deckt sich mit Magazin-Beispiel im CONTRACT. Keine externen kommerziellen Backlinks. |
| `/volvo-trucks-ruestet-fl-4x4-fuer-extreme-offroad-einsaetze-auf/` | `/magazin/volvo-fl-4x4-offroad/` | On-topic Offroad-Fahrzeug-News. Einziger externer Link ist eine Quellen-Zitation (defence-industry.eu), kein bezahlter Werbe-Backlink -> Redirect vertretbar. |
| `/was-du-ueber-offroad-trekking-wissen-musst/` | `/magazin/offroad-trekking-grundlagen/` | Kern-Thema (Offroad-Trekking-Ratgeber), keine externen kommerziellen Links. |
| `/offroad-trekking-mit-autos/` | `/magazin/offroad-trekking-mit-autos/` | Kern-Thema, on-topic, keine externen kommerziellen Links. |
| `/wie-waehle-ich-das-richtige-auto-fuer-mich-aus/` | `/magazin/richtiges-offroad-fahrzeug-waehlen/` | Fahrzeug-Auswahl-Ratgeber, on-topic, KEINE externen kommerziellen Backlinks verifiziert. |

### Versicherungs-Artikel -> Versicherungs-Cluster

Alle sieben thematisch eindeutig dem Versicherungs-Cluster zugeordnet. Es gibt im
neuen Stack (noch) keine Versicherungs-Detailseiten (`/versicherungen/` ist eine
Single-Page mit Inline-Daten, siehe CONTRACT 3 + 2-keine-Collection). Daher
Redirect aller Detail-Artikel auf die Hub-Seite `/versicherungen/`.

| Alt (WP) | Neu (Astro) |
|----------|-------------|
| `/schuelerreisen-versicherung/` | `/versicherungen/` |
| `/gruppenreisen-versicherung/` | `/versicherungen/` |
| `/langzeitreise-versicherung/` | `/versicherungen/` |
| `/reiseunfall-versicherung/` | `/versicherungen/` |
| `/reisehaftpflicht-versicherung/` | `/versicherungen/` |
| `/reisegepaeck-versicherung/` | `/versicherungen/` |
| `/reisekrankenversicherung/` | `/versicherungen/` |

> Hinweis: Sollten spaeter echte Versicherungs-Detailseiten entstehen
> (z.B. `/versicherungen/reisekrankenversicherung/`), sollten diese sieben
> Redirects auf die jeweilige Detail-URL praezisiert werden, um Relevanz und
> Ranking-Signale 1:1 zu erhalten.

---

## 2. MANUELL PRUEFEN (Guest-Posts / Backlinks) - KEIN Redirect anlegen!

Folgende Artikel wirken thematisch off-topic und/oder enthalten kommerzielle
dofollow-Backlinks zu Drittseiten. Das sind mit hoher Wahrscheinlichkeit
**bezahlte Gastbeitraege**. Solche URLs duerfen NICHT umgebogen oder geloescht
werden, sonst bricht der verkaufte Backlink (Vertrags-/Geld-Risiko).

**Regel: Diese URLs 1:1 unter exakt der alten Adresse erhalten** (z.B. als
statische Seite/Markdown-Migration unter identischem Slug ohne Cluster-Praefix),
oder die WP-Seite fuer diese Pfade weiter ausliefern. KEIN Eintrag in
`_redirects` / `.htaccess`.

| URL | Externer Backlink (dofollow) | Befund |
|-----|------------------------------|--------|
| `/wie-sie-den-perfekten-veranstaltungsort-auswaehlen/` | `schlossneuhaus.com` ("Schloss Neuhaus bei Sinsheim") | Off-topic (Event-Location), klassischer bezahlter Gastbeitrag. ERHALTEN. |
| `/was-ist-mein-auto-wert/` | `kfz-sachverstaendigenbuero-rhein-neckar.de` ("KFZ Gutachten Frankfurt") | Kommerzieller Backlink zu KFZ-Gutachter, bezahlter Gastbeitrag. ERHALTEN. |
| `/last-minute-reisen/` | `reisefein.de` ("Last-Minute Reisen am Flughafen") | Kommerzieller Backlink zu Reise-Buchungsseite, bezahlter Gastbeitrag. ERHALTEN. |
| `/smartphone-urlaub-reparieren-lassen/` | (kein externer Link verifiziert) | Stark off-topic (Smartphone-Reparatur). Kein externer Link gefunden, aber Muster eines Gastbeitrags. Vorsichtshalber ERHALTEN, bis manuell geklaert. |

**To-do manuell:**
1. Pro URL pruefen, ob ein aktiver bezahlter Backlink-Vertrag besteht.
2. Falls ja: Inhalt 1:1 unter altem Slug nach Astro uebernehmen (z.B.
   `src/content/magazin/<alter-slug>.md` + dedizierte Route ODER WP-Seite
   weiter ausliefern). Externe dofollow-Links unveraendert lassen, NICHT auf
   nofollow setzen.
3. Falls kein Vertrag (z.B. `/smartphone-urlaub-reparieren-lassen/`):
   entweder ebenfalls erhalten oder bewusst 410/Redirect setzen - aber nur
   nach expliziter Freigabe.

---

## 3. Offene To-Dos (Setup / Deploy)

- [ ] **GTM-ID**: eigene Container-ID fuer tour-off-road.de anlegen und in
      `Base.astro` einsetzen (noch nicht vergeben).
- [ ] **Google AdSense**: `ca-pub-XXXXXXXXXXXXXXXX` Publisher-ID + ggf.
      `ads.txt` ergaenzen (noch offen).
- [ ] **Amazon-Partner-Tag**: Im CONTRACT-Beispiel steht Platzhalter
      `tag=touroffroad-21`. Echtes Partner-Tag verifizieren / anlegen und in
      allen `ausruestung`-`affiliateUrl`-Feldern setzen.
- [ ] **Stay22 / GetYourGuide**: Falls Reiseziel-Buchungen monetarisiert werden,
      individuelle lmaID anfragen (NIEMALS aus anderem Projekt uebernehmen).
- [ ] **Hosting / Deploy**: Zielplattform fixieren. Bei All-Inkl/Hostinger
      greift `.htaccess`; bei Cloudflare Pages/Netlify greift `_redirects`.
      Nicht benoetigte Datei vor Deploy entfernen, damit keine doppelten
      Regeln greifen.
- [ ] **Guest-Post-Erhalt umsetzen** (siehe Abschnitt 2): vier Legacy-URLs
      1:1 bereitstellen, bevor die WP-Instanz abgeschaltet wird.
- [ ] **Sitemap + robots.txt** nach Deploy pruefen (alte WP-Sitemap-URLs
      `/sitemap.xml` ggf. auf neue Astro-Sitemap umleiten).
- [ ] **Magazin-Slugs final**: Die fuenf neuen Magazin-Slugs in dieser Tabelle
      muessen mit den tatsaechlich angelegten `src/content/magazin/<slug>.md`
      Dateien des Content-Agents uebereinstimmen. Bei Abweichung Redirect-
      Zielpfade angleichen.
