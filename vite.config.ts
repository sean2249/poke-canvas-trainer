import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { devApi } from './vite-dev-api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 本機開發時提供 /api（正式環境由 Cloudflare Pages Function 提供）
    devApi(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '30天寶可夢繪畫特訓營',
        short_name: '寶可夢特訓營',
        description: '新手從零開始的 30 天手繪陪跑培育指南',
        theme_color: '#f59e0b',
        background_color: '#fffbeb',
        display: 'standalone',
        lang: 'zh-Hant',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Don't precache API routes; let them hit the network.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})
