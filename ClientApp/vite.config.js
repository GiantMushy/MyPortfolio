import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use different build output for local dev vs CI (GitHub Actions)
const isCI = process.env.GITHUB_ACTIONS === 'true'
const base = process.env.VITE_BASE || '/'
const outDir = isCI ? 'dist' : '../wwwroot'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,    assetsDir: 'assets',  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7193',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
