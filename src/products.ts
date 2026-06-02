// =============================================================================
// src/products.ts — AWIN-Merchant-Registry & Affiliate-Link-Auflösung
// =============================================================================
// Hier liegen die Merchant-IDs (`awinmid`) aller Partnerprogramme. NACH ANNAHME
// eines Programms genügt es, die jeweilige `awinmid` zu setzen (bzw. zu
// verifizieren) — der Rest (Deeplink-Bau, Tracking) passiert automatisch über
// die Helper. Die hier hinterlegten IDs stammen aus den AWIN-Merchant-Profilen
// (Stand 2026-06; nach Annahme im AWIN-Dashboard gegenprüfen).
//
// Recherche-Hintergrund & Provisionen: siehe AFFILIATE-AWIN.md im Projekt-Root.

import { awinDeeplink } from './site';

export type MerchantCluster =
  | 'versicherung'
  | 'ausruestung'
  | 'reifen'
  | 'reiseplanung'
  | 'navigation'
  | 'faehre';

export interface AwinMerchant {
  /** Anzeigename. */
  name: string;
  /**
   * AWIN Advertiser-ID (`awinmid`).
   * `null` = noch nicht angenommen / nicht eingetragen -> Direktlink (untracked).
   * Sobald angenommen: ID setzen, fertig.
   */
  awinmid: number | null;
  /** Fallback-Ziel, wenn kein produktspezifisches Ziel übergeben wird. */
  homepage: string;
  cluster: MerchantCluster;
  /** Provisions-Richtwert (nur Doku). */
  commission?: string;
  /** AWIN-Merchant-Profil zur Verifikation. */
  profile?: string;
}

// -----------------------------------------------------------------------------
// Registry — IDs sind die recherchierten AWIN-Profil-IDs. Nach Annahme prüfen.
// Wer für ein Programm (noch) nicht angenommen ist: `awinmid: null` setzen,
// dann bleibt der Link ein untracked Direktlink zum Händler.
// -----------------------------------------------------------------------------
export const awinMerchants = {
  // --- Versicherungen -------------------------------------------------------
  hansemerkur: {
    name: 'HanseMerkur Reiseversicherung',
    awinmid: 11705,
    homepage: 'https://www.hansemerkur.de/reiseversicherung',
    cluster: 'versicherung',
    commission: '12-15% CPO',
    profile: 'https://ui.awin.com/merchant-profile/11705',
  },
  allianzdirect: {
    name: 'Allianz Direct',
    awinmid: 20468,
    homepage: 'https://www.allianzdirect.de/',
    cluster: 'versicherung',
    profile: 'https://ui.awin.com/merchant-profile/20468',
  },

  // --- Ausrüstung -----------------------------------------------------------
  bergzeit: {
    name: 'Bergzeit',
    awinmid: 12557,
    homepage: 'https://www.bergzeit.de/',
    cluster: 'ausruestung',
    commission: '8-10%',
    profile: 'https://ui.awin.com/merchant-profile/12557',
  },
  globetrotter: {
    name: 'Globetrotter',
    awinmid: null, // AWIN, aber manuelle Freigabe -> ID nach Annahme eintragen
    homepage: 'https://www.globetrotter.de/',
    cluster: 'ausruestung',
    commission: 'bis 8%',
  },
  fritzberger: {
    name: 'Fritz Berger',
    awinmid: 70949,
    homepage: 'https://www.fritz-berger.de/',
    cluster: 'ausruestung',
    commission: '5%',
    profile: 'https://ui.awin.com/merchant-profile/70949',
  },
  campingwagner: {
    name: 'CampingWagner',
    awinmid: 12158,
    homepage: 'https://www.campingwagner.de/',
    cluster: 'ausruestung',
    profile: 'https://ui.awin.com/merchant-profile/12158',
  },

  // --- Reifen & Autozubehör -------------------------------------------------
  reifencom: {
    name: 'Reifen.com',
    awinmid: 7605,
    homepage: 'https://www.reifen.com/',
    cluster: 'reifen',
    commission: 'bis 5%',
    profile: 'https://ui.awin.com/merchant-profile/7605',
  },
  reifendirekt: {
    name: 'ReifenDirekt.de',
    awinmid: 11823,
    homepage: 'https://www.reifendirekt.de/',
    cluster: 'reifen',
    profile: 'https://ui.awin.com/merchant-profile/11823',
  },
  autodoc: {
    name: 'Autodoc',
    awinmid: 10444,
    homepage: 'https://www.autodoc.de/',
    cluster: 'reifen',
    profile: 'https://ui.awin.com/merchant-profile/10444',
  },

  // --- Reiseplanung / Anreise ----------------------------------------------
  sunnycars: {
    name: 'Sunny Cars',
    awinmid: 13830,
    homepage: 'https://www.sunnycars.de/',
    cluster: 'reiseplanung',
    commission: '8%',
    profile: 'https://ui.awin.com/merchant-profile/13830',
  },
  roadsurfer: {
    name: 'Roadsurfer',
    awinmid: 76432,
    homepage: 'https://roadsurfer.com/de/',
    cluster: 'reiseplanung',
    profile: 'https://ui.awin.com/merchant-profile/76432',
  },
  outdooractive: {
    name: 'Outdooractive',
    awinmid: 17147,
    homepage: 'https://www.outdooractive.com/de/',
    cluster: 'navigation',
    commission: '5-50% (Pro-Abo)',
    profile: 'https://ui.awin.com/merchant-profile/17147',
  },
  directferries: {
    name: 'Direct Ferries',
    awinmid: null, // ggf. eigenes Programm -> AWIN-Verfügbarkeit prüfen
    homepage: 'https://www.directferries.de/',
    cluster: 'faehre',
    commission: '50% der DF-Provision',
  },
} satisfies Record<string, AwinMerchant>;

export type MerchantKey = keyof typeof awinMerchants;

// -----------------------------------------------------------------------------
// Default-Merchant je Ausrüstungs-Kategorie (überschreibbar per `merchant`-Feld
// im Produkt-Frontmatter). So bekommt jeder Gear-Eintrag ohne Mehraufwand einen
// sinnvollen Partner.
// -----------------------------------------------------------------------------
export const categoryMerchant: Record<string, MerchantKey> = {
  recovery: 'bergzeit',
  camping: 'fritzberger',
  navigation: 'bergzeit',
  campkueche: 'fritzberger',
  reifen: 'reifencom',
};

// -----------------------------------------------------------------------------
// Helper
// -----------------------------------------------------------------------------

/**
 * Link zu einem Händler (optional produktspezifisch).
 * - kein gültiger Merchant -> Ziel/`#`
 * - Merchant ohne `awinmid` (noch nicht angenommen) -> Direktlink (untracked)
 * - Merchant mit `awinmid` + gesetzter Publisher-ID -> getrackter AWIN-Deeplink
 */
export function merchantLink(
  key: MerchantKey,
  opts: { target?: string; clickref?: string } = {},
): string {
  const m = awinMerchants[key];
  if (!m) return opts.target ?? '#';
  const target = opts.target ?? m.homepage;
  if (m.awinmid == null) return target; // noch nicht angenommen -> Direktlink
  return awinDeeplink({ merchantId: m.awinmid, target, clickref: opts.clickref });
}

/**
 * Auflösung des Affiliate-Links für einen Ausrüstungs-Eintrag.
 * Reihenfolge: explizites `merchant`-Feld -> Kategorie-Default -> roher
 * `affiliateUrl`. `affiliateUrl` (falls != '#') hat Vorrang als Deeplink-Ziel.
 */
export function gearAffiliateHref(
  data: { slug: string; category: string; merchant?: string | null; affiliateUrl?: string },
  clickref?: string,
): string {
  const key = (data.merchant ?? categoryMerchant[data.category]) as MerchantKey | undefined;
  const explicitTarget =
    data.affiliateUrl && data.affiliateUrl !== '#' ? data.affiliateUrl : undefined;
  if (key && awinMerchants[key]) {
    return merchantLink(key, { target: explicitTarget, clickref: clickref ?? `gear-${data.slug}` });
  }
  return explicitTarget ?? '#';
}
