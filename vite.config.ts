import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  base: '/',
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'apikey'],
      credentials: true
    },
    proxy: {
      '/rest/v1': {
        target: 'https://edejazcguedqylhchwjg.supabase.co',
        changeOrigin: true,
        secure: false,
        headers: {
          'apikey': process.env.VITE_SUPABASE_ANON_KEY
        }
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'lucide': ['lucide-vue-next']
        }
      }
    }
  }
})
