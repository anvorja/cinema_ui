import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_APP_URL: dónde se sirve la app en desarrollo. En local es
  // http://lvh.me:5173 porque Wompi no acepta localhost como URL de retorno
  // (lvh.me resuelve a 127.0.0.1). Vite solo responde a hosts permitidos.
  const env = loadEnv(mode, process.cwd(), '')
  const appUrl = env.VITE_APP_URL ? new URL(env.VITE_APP_URL) : null

  return {
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

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // Asegurar que el directorio público se copie correctamente
    publicDir: 'public',

    // Para desarrollo local con React Router
    server: {
      port: appUrl ? Number(appUrl.port) || 5173 : 5173,
      host: true,
      allowedHosts: appUrl ? [appUrl.hostname] : [],
      open: appUrl ? appUrl.href : true
    },

    // Para preview con React Router
    preview: {
      port: 5173,
      host: true
    }
  }
})
