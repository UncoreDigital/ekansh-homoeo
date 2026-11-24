import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://ekansh-clinic-website.vercel.app',
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: false,
    },
  }),
  compressHTML: true,
});
