import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/y20/',
  build: {
    outDir: '../../dist/y20',
    emptyOutDir: true
  }
})