import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Aumenta o limite de aviso para 1MB
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Estratégia de split de vendor para melhor performance de carregamento e cache
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('react-virtuoso')) {
              return 'vendor-virtuoso';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-core'; // React, Zustand, etc.
          }
        }
      }
    }
  }
})
