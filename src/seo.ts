// =============================================================================
// src/seo.ts — Schema.org / JSON-LD Builder fuer tour-off-road.de
// =============================================================================
// Zentraler Ort fuer alle strukturierten Daten. Jede Funktion liefert ein
// "@context"-faehiges Objekt zurueck, das in Base.astro per jsonLd-Prop
// uebergeben wird. Sites profitieren von Rich Results in Google Search:
// - Article -> Magazin-Detail (Datum, Autor)
// - Product + AggregateRating -> Ausruestungs-Eintraege (Preis, Rating-Sterne)
// - TouristTrip -> Routen-Detail
// - TouristDestination -> Reiseziele
// - BreadcrumbList -> alle Seiten mit Breadcrumb
// - FAQPage -> Seiten mit QABlock
// - WebSite + SearchAction -> Startseite (Sitelinks-Suche)
// - Organization -> globaler Publisher

import { site } from './site';

const BASE_URL = site.url; // 'https://tour-off-road.de'
const abs = (path: string): string =>
  path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// --- Organization (Publisher) -----------------------------------------------
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'tour-off-road.de',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/favicon.svg`,
  },
  description: site.description,
};

// --- WebSite mit SearchAction (Sitelinks-Suche in Google) -------------------
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: site.name,
  description: site.description,
  inLanguage: 'de-DE',
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/suche/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// --- BreadcrumbList ---------------------------------------------------------
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: abs(it.href) } : {}),
    })),
  };
}

// --- FAQPage ----------------------------------------------------------------
export interface FAQ {
  q: string;
  a: string;
}

export function faqSchema(faqs: FAQ[]): Record<string, unknown> | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// --- Article (Magazin) ------------------------------------------------------
export interface ArticleInput {
  title: string;
  description: string;
  image: string;
  url: string; // absolut oder Pfad
  author: string;
  datePublished: string | Date;
  dateModified?: string | Date;
}

export function articleSchema(a: ArticleInput): Record<string, unknown> {
  const pub = typeof a.datePublished === 'string' ? a.datePublished : a.datePublished.toISOString();
  const mod = a.dateModified
    ? typeof a.dateModified === 'string'
      ? a.dateModified
      : a.dateModified.toISOString()
    : pub;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    image: [a.image],
    author: { '@type': 'Person', name: a.author },
    publisher: { '@id': `${BASE_URL}/#organization` },
    datePublished: pub,
    dateModified: mod,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(a.url) },
    inLanguage: 'de-DE',
  };
}

// --- Product + AggregateRating (Ausruestung) -------------------------------
export interface ProductInput {
  name: string;
  description: string;
  image: string;
  url: string;
  /** "ab 249 €" -> wir extrahieren die Zahl, "EUR", lowPrice */
  price: string;
  /** 0..5 */
  rating?: number;
  category?: string;
  brand?: string;
}

function parsePriceEur(s: string): { value: number | null; currency: string } {
  const match = s.replace(/\./g, '').match(/(\d+(?:,\d+)?)/);
  const num = match ? parseFloat(match[1].replace(',', '.')) : null;
  return { value: num, currency: 'EUR' };
}

export function productSchema(p: ProductInput): Record<string, unknown> {
  const { value, currency } = parsePriceEur(p.price);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: [p.image],
    url: abs(p.url),
    ...(p.category ? { category: p.category } : {}),
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
  };
  if (value != null) {
    schema.offers = {
      '@type': 'Offer',
      price: value.toFixed(2),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: abs(p.url),
    };
  }
  if (p.rating != null && p.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.rating.toFixed(1),
      bestRating: '5',
      ratingCount: '1',
      reviewCount: '1',
    };
  }
  return schema;
}

// --- TouristTrip (Routen) ---------------------------------------------------
export interface TouristTripInput {
  name: string;
  description: string;
  image: string;
  url: string;
  /** Reiseziel-Name (z.B. "Marokko") */
  destination?: string;
  /** ISO-8601-Dauer, z.B. "P5D" fuer 5 Tage */
  days?: number;
}

export function touristTripSchema(t: TouristTripInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t.name,
    description: t.description,
    image: [t.image],
    url: abs(t.url),
  };
  if (t.destination)
    schema.touristType = [{ '@type': 'Place', name: t.destination }];
  if (t.days) schema.itinerary = { '@type': 'ItemList', numberOfItems: t.days };
  return schema;
}

// --- TouristDestination (Reiseziele) ---------------------------------------
export interface DestinationInput {
  name: string;
  description: string;
  image: string;
  url: string;
}

export function destinationSchema(d: DestinationInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: d.name,
    description: d.description,
    image: [d.image],
    url: abs(d.url),
  };
}
