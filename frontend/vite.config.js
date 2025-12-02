import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for frontend
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173
  }
})
