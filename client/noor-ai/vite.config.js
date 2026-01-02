import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' http://localhost:5000 https://noor-ai.khyatikapil.dev; frame-ancestors *;",
      'Access-Control-Allow-Origin': '*'
    }
  },
  build: {
    // Enable source maps for debugging
    sourcemap: false,
    // Minify with esbuild (no eval)
    minify: 'esbuild'
  }
})
