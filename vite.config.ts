import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Speech to Text PWA',
        short_name: 'SpeechText',
        description: 'A Progressive Web App for speech-to-text conversion',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.svg',
            sizes: '64x64',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'maskable-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'mobile-screenshot.svg',
            sizes: '750x1334',
            type: 'image/svg+xml',
            form_factor: 'narrow'
          },
          {
            src: 'desktop-screenshot.svg',
            sizes: '2880x1800',
            type: 'image/svg+xml',
            form_factor: 'wide'
          }
        ]
      }
    })
  ],
  base: '/PWA004/'
})