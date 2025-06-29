import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 12002,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Access-Control-Allow-Origin': '*',
    },
    cors: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'three': ['three'],
          'gsap': ['gsap'],
          'utils': ['axios', '@vueuse/core', '@vueuse/motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['three', 'gsap', 'lenis', 'vue', 'vue-router', 'pinia', 'axios']
  }
})
