import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ ini penting agar path asset relatif
  build: {
    outDir: 'dist', // default, tapi pastikan tetap ada
  },
})
