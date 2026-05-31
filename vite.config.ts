import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Abby-sWorld/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'AbbyWorld',
        short_name: 'AbbyWorld',
        description: 'Personal productivity PWA',
        theme_color: '#1A56DB',
        background_color: '#F7F8FA',
        display: 'standalone',
        scope: '/Abby-sWorld/',
        start_url: '/Abby-sWorld/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      devOptions: { enabled: true },
    }),
  ],
})
