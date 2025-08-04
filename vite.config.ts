import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Untuk username.github.io, gunakan '/'
  server: {
    port: 7482,
    open: true
  },
  build: {
    outDir: 'dist' // atau 'build'
  }
})