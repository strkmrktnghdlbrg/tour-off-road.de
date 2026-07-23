// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import outboundGate from './integrations/outbound-gate.mjs';
// https://astro.build/config
// HINWEIS: Keine redirects hier eintragen - Migrations-Agent pflegt sie in public/_redirects.
export default defineConfig({
  site: 'https://tour-off-road.de',
  integrations: [outboundGate(), sitemap()],
});
