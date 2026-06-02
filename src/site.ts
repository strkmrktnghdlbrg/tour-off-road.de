// =============================================================================
// src/site.ts — globale Seiten- & Affiliate-Konfiguration
// =============================================================================
// Zentrale Stelle für Tracking-/Affiliate-IDs. Nach Annahme bei AWIN hier nur
// die `awin.publisherId` eintragen — alle Deeplinks werden dann automatisch
// getrackt. Solange leer, liefern die Helper unverfolgte Direktlinks zurück,
// d.h. die Seite funktioniert auch VOR der Programm-Freigabe.

export const site = {
  name: 'tour-off-road.de',
  url: 'https://tour-off-road.de',
  description:
    'Das Reiseportal für Offroad, Overland und alle, die das Abenteuer abseits der Straße suchen.',
};

// -----------------------------------------------------------------------------
// AWIN
// -----------------------------------------------------------------------------
export const awin = {
  /**
   * AWIN Publisher-ID (= `awinaffid`). NACH ANNAHME hier eintragen.
   * Beispiel: '1234567'. Leer lassen, bis der Account bestätigt ist.
   */
  publisherId: '',
  /** Globaler Schalter. Greift nur, wenn `publisherId` gesetzt ist. */
  enabled: true,
};

// -----------------------------------------------------------------------------
// Amazon (PA-API / Partnernet) — separat, hier nur der Vollständigkeit halber
// -----------------------------------------------------------------------------
export const amazon = {
  /** Amazon-Partner-Tag, z.B. 'tour-off-road-21'. Leer lassen bis vergeben. */
  partnerTag: '',
  marketplace: 'amazon.de',
};

// -----------------------------------------------------------------------------
// AWIN-Deeplink-Helper
// -----------------------------------------------------------------------------
export interface AwinDeeplinkOptions {
  /** AWIN Advertiser-/Merchant-ID (`awinmid`). */
  merchantId: number | string;
  /** Ziel-URL beim Händler (Produkt- oder Landingpage). */
  target: string;
  /** SubID zur Platzierungs-Zuordnung (`clickref`), z.B. 'gear-maxtrax'. */
  clickref?: string;
}

/**
 * Baut einen AWIN-Deeplink (cread.php) mit korrekt URL-kodiertem Ziel.
 *
 * Fällt bewusst auf die rohe Ziel-URL zurück, wenn `awin.publisherId` oder die
 * Merchant-ID fehlen oder AWIN deaktiviert ist — so bleiben alle Links immer
 * klickbar (untracked) und der Build funktioniert vor der Programm-Annahme.
 */
export function awinDeeplink({ merchantId, target, clickref }: AwinDeeplinkOptions): string {
  const affid = (awin.publisherId ?? '').trim();
  const mid = String(merchantId ?? '').trim();
  if (!awin.enabled || !affid || !mid || !target) return target || '#';

  const params = new URLSearchParams({
    awinmid: mid,
    awinaffid: affid,
    ued: target, // URLSearchParams kodiert das Ziel automatisch
  });
  if (clickref) params.set('clickref', clickref);
  return `https://www.awin1.com/cread.php?${params.toString()}`;
}
