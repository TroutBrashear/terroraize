import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  
  server: { 
    proxy: {
      '/api': {
        target: 'https://api.featherless.ai/v1',
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    }
  }
})
