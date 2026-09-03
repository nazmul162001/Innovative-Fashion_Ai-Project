// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://inovativefashion.com',
  output: 'static',
  compressHTML: true,
  // Hover-only prefetch avoids flooding the network on first paint (prefetchAll hurts TTI).
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      cssMinify: true,
      target: 'es2022',
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          // Stable vendor splits → better long-term caching + parallel download.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('gsap') || id.includes('@gsap')) return 'vendor-gsap';
            if (id.includes('react-dom')) return 'vendor-react-dom';
            if (id.includes('/react/') || id.endsWith('/react.js') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('nanostores') || id.includes('@nanostores')) return 'vendor-store';
            if (id.includes('lucide-react')) return 'vendor-icons';
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'gsap', '@gsap/react', 'nanostores', '@nanostores/react'],
    },
  },
});
