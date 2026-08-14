// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import outboundGate from './integrations/outbound-gate.mjs';

// rehype-Plugin: Provisionslinks aus dem Markdown in einem neuen Tab oeffnen.
// Grund: Bei aktiven AdSense Auto Ads feuert auf Mobilgeraeten das Vignette-
// Interstitial genau beim Verlassen der Seite. Es schiebt sich zwischen Klick und
// Partnerseite, das Partner-Cookie wird nie gesetzt, die Vermittlung ist verloren.
const AFFILIATE_HOSTS =
  /(amazon\.[a-z.]{2,6}\/[^"'\s]*tag=|amzn\.to|awin1\.com|financeads|adcell|digistore24|tradedoubler|belboon|webgains|shareasale|zanox|partner-ads|daisycon|tradetracker|linksynergy|impact\.com|partnerize|stay22\.com|getyourguide|booking\.com|expedia\.|agoda\.|hotels\.com|check24|smava|auxmoney|idealo\.)/i;

function rehypeAffiliateBlank() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties && node.properties.href;
        if (typeof href === 'string' && AFFILIATE_HOSTS.test(href)) {
          node.properties.target = '_blank';
          const rel = new Set(
            String(node.properties.rel || '').split(/\s+/).filter(Boolean)
          );
          rel.add('sponsored'); rel.add('nofollow'); rel.add('noopener');
          node.properties.rel = [...rel];
        }
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}

// https://astro.build/config
// HINWEIS: Keine redirects hier eintragen - Migrations-Agent pflegt sie in public/_redirects.
export default defineConfig({
  site: 'https://tour-off-road.de',
  integrations: [outboundGate(), sitemap({
      // noindex-Seiten gehoeren nicht in die Sitemap (GSC meldet sie sonst
      // als "Durch noindex-Tag ausgeschlossen").
      filter: (page) =>
        !page.includes("/datenschutz") &&
        !page.includes("/impressum"),
    })],
  markdown: { rehypePlugins: [rehypeAffiliateBlank] },
});
