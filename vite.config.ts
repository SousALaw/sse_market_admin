import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// 动态设置 base 参数
const base = '/test_admin/';

export default defineConfig({
  base,
  plugins: [
    vue(),
    vueJsxPlugin(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/test_admin/',
      srcDir: 'src',
      strategies: 'generateSW',
      manifest: {
        name: 'SSE MARKET Admin',
        short_name: 'SSE Admin',
        scope: `${base}`,
        start_url: `${base}`,
        display: 'fullscreen',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: `${base}android-chrome-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: false,
        type: 'module',
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.ssemarket\.cn\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: new RegExp(`^https://ssemarket\.cn${base}.*\.html$`),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: new RegExp(`^https://ssemarket\.cn${base}.*\.js$`),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'js-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: new RegExp(`^https://ssemarket\.cn${base}.*\.css$`),
            handler: 'CacheFirst',
            options: {
              cacheName: 'css-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: ({ request }: { request: Request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
            },
          },
        ],
        globPatterns: [
          `${base}index.html`,
          `${base}favicon.ico`,
          `${base}manifest.json`,
          `${base}android-chrome-192x192.png`,
          `${base}android-chrome-512x512.png`,
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
  },
});
