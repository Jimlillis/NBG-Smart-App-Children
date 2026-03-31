import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            // Όταν το backend δεν τρέχει, αντί για noisy ECONNREFUSED logs,
            // επιστρέφουμε 502 ώστε το UI να κάνει graceful fallback.
            if ('writeHead' in res) {
              const serverRes = res
              if (!serverRes.headersSent) {
                serverRes.writeHead(502, { 'Content-Type': 'application/json' })
              }
              serverRes.end(
                JSON.stringify({
                  error: 'BackendUnavailable',
                  message:
                    'Το backend δεν είναι διαθέσιμο στο http://localhost:8000. Ξεκίνα το backend και ξαναδοκίμασε.',
                }),
              )
              return
            }

            // net.Socket περίπτωση
            res.destroy()
          })
        },
      },
    },
  },
})
