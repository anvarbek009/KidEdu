import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api.js';

function kideduApiPlugin() {
  return {
    name: 'kidedu-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
          await handleApiRequest(req, res);
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
          await handleApiRequest(req, res);
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), kideduApiPlugin()],
  server: {
    port: 5173,
    open: false
  }
});
