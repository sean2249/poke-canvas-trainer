import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 會把站台放在 /<repo>/ 子路徑底下。
// 若改用自訂網域或 <user>.github.io 主 repo，請把 base 改為 '/'。
const base = '/poke-canvas-trainer/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
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
    }),
  ],
})
