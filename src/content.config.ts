import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ------------------------------------------------------------------
   Foto-Konvention (projektweit):
   Alle Bild-Felder (hero, image, gallery[]) enthalten die VOLLE
   https://images.unsplash.com/...-URL als String. Keine lokalen
   Pfade, kein Astro-Image-Asset. So bleibt das Markup 1:1 zu den
   Mockups (background-image:url(...)).
------------------------------------------------------------------ */

const qa = z.object({ q: z.string(), a: z.string() });

// ---------------- Routen ----------------
const routen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/routen' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    region: z.string(), // ref auf reiseziel-slug, z.B. "marokko"
    difficulty: z.enum(['leicht', 'mittel', 'schwer']),
    days: z.number(),
    distanceKm: z.number(),
    elevationM: z.number(),
    bestSeason: z.string(),
    terrain: z.array(z.string()),
    vehicle: z.string(),
    fuelAvailability: z.string(),
    hero: z.string(), // volle Unsplash-URL
    gallery: z.array(z.string()).default([]),
    excerpt: z.string(),
    stages: z
      .array(
        z.object({
          title: z.string(),
          desc: z.string(),
          km: z.number(),
          hours: z.number(),
          stay: z.string(),
        })
      )
      .default([]),
    gearNeeded: z.array(z.string()).default([]),
    faqs: z.array(qa).default([]),
    related: z.array(z.string()).default([]), // routen-slugs
  }),
});

// ---------------- Reiseziele ----------------
const reiseziele = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reiseziele' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    continent: z.string(),
    routesCount: z.number(),
    bestSeason: z.string(),
    arrival: z.string(),
    carnetRequired: z.boolean(),
    hero: z.string(), // volle Unsplash-URL
    excerpt: z.string(),
    facts: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    faqs: z.array(qa).default([]),
    topRoutes: z.array(z.string()).default([]), // routen-slugs
  }),
});

// ---------------- Ausruestung (Daten) ----------------
const ausruestung = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/ausruestung' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['recovery', 'camping', 'navigation', 'campkueche', 'reifen']),
    image: z.string(), // volle Unsplash-URL
    price: z.string(),
    rating: z.number(),
    badge: z.string().nullable().default(null),
    excerpt: z.string(),
    affiliateUrl: z.string(),
  }),
});

// ---------------- Magazin ----------------
const magazin = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/magazin' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    hero: z.string(), // volle Unsplash-URL
    excerpt: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    readMinutes: z.number(),
    cluster: z.string(), // Hub-Cluster-Zuordnung
  }),
});

export const collections = { routen, reiseziele, ausruestung, magazin };
