// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import vercel from '@astrojs/vercel';

// Domaine définitif à renseigner avant mise en ligne (sert au sitemap, aux balises canonical et Open Graph).
const SITE_URL = process.env.SITE_URL ?? 'https://www.pareglass-auto.fr';

export default defineConfig({
  site: SITE_URL,
  // Pages statiques, sauf /api/vehicule qui tourne côté serveur (clé API cachée).
  // Hébergé sur Vercel : /api/vehicule devient une fonction serverless.
  output: 'static',
  adapter: vercel(),
  env: {
    schema: {
      // Identification du véhicule par la plaque (voir src/lib/vehicle)
      PLATE_API_PROVIDER: envField.enum({
        context: 'server',
        access: 'secret',
        values: ['apiplaque', 'mock', 'off'],
        optional: true,
      }),
      PLATE_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      PLATE_API_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  // Port fixe (le 8080 est déjà pris en local)
  server: { port: 4321, host: true },
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, url: item.url.replace(/(?<!\/\/[^/]*)\/$/, '') }),
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR' } },
    }),
    compress({ Image: false, SVG: false }),
  ],
  // Cast : @tailwindcss/vite embarque une version de Vite plus récente que celle d'Astro 5 (types seulement).
  vite: { plugins: [/** @type {any} */ (tailwindcss())] },
});
