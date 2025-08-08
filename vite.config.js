import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configuración de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Asegurar que los archivos públicos se copien
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Optimización de chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },

  // Asegurar que el directorio público se copie correctamente
  publicDir: 'public',

  // Para desarrollo local con React Router
  server: {
    port: 5173,
    host: true,
    open: true
  },

  // Para preview con React Router
  preview: {
    port: 5173,
    host: true
  }
})