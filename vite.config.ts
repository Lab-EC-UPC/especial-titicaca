import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        // Separa las librerías grandes en chunks propios: se cachean entre
        // deploys y se descargan en paralelo, sin meterlas en el bundle de cada
        // sección. El código de cada sección ya se parte por su import lazy.
        manualChunks: {
          react: ['react', 'react-dom'],
          gsap: ['gsap', '@gsap/react'],
          motion: ['motion'],
          lenis: ['lenis'],
        },
      },
    },
  },
})
