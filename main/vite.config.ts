import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Allows unsafe-eval which is required for some Vite development tools
      // This fixes the "Content Security Policy" errors in preview mode
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src 'self' blob:;"
    }
  }
})