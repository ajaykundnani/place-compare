import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/place-compare/",
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "NearLio",
        short_name: "NearLio",
        description:
          "Save India addresses locally, search nearby places, compare distance, and open directions in Google Maps.",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/place-compare/",
        start_url: "/place-compare/",
        icons: [
          { src: "NearLio-PWA.png", sizes: "72x72", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "96x96", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "128x128", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "144x144", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "152x152", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "192x192", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "384x384", type: "image/png" },
          { src: "NearLio-PWA.png", sizes: "512x512", type: "image/png" },
          {
            src: "NearLio-PWA.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "nominatim-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: /^https:\/\/router\.project-osrm\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osrm-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
