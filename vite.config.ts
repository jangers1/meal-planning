import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router';
            if (id.includes('slate')) return 'slate';
            if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
            if (id.includes('react') || id.includes('scheduler')) return 'react';
            // default vendor fallback
            return 'vendor';
          }
        }
      }
    },
    // Allow a slightly higher limit while still keeping an eye on bundle size
    chunkSizeWarningLimit: 650,
  }
})
