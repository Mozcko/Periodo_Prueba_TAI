import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  server: {
    proxy: {
      '/posts': 'http://localhost:8000', // Proxy para /posts
    },
  },
});

