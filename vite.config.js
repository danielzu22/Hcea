import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` mantiene los assets relativos: funciona igual en local
// (http://hcea.test) y en GitHub Pages (/Hcea/) sin recompilar.
//
// Puerto propio (5190) con `strictPort`: evita compartir el 5173 con otros
// proyectos (por ejemplo itc.cortex.demo) y, si el puerto está ocupado, falla
// en vez de saltar a otro sin que nos demos cuenta.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5190,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5191,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
