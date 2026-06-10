import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import * as path from 'path'

const analyze = process.env.ANALYZE === 'true'
const base = process.env.VITE_PUBLIC_BASE || '/'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    analyze &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  // 로컬 개발/빌드에서는 '/', GitHub Pages 배포 빌드에서만 env로 override 합니다.
  base,
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './common'),
      '@': path.resolve(__dirname, './src'),
      '@/shared/lib/dev':
        command === 'build'
          ? path.resolve(__dirname, './src/shared/lib/dev/index.prod.ts')
          : path.resolve(__dirname, './src/shared/lib/dev/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // react·recoil·styled-components 간 순환 청크를 피하기 위해 query만 분리합니다.
          if (id.includes('@tanstack')) return 'vendor-query'
        },
      },
    },
  },
}))
