import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Listen on all addresses
    proxy: {
      // Proxy WebSocket connections to backend
      '/ws': {
        target: 'ws://localhost:8000',
        changeOrigin: true,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('WebSocket proxy error:', err);
          });
          proxy.on('proxyReqWs', (proxyReq, req, socket, head) => {
            console.log('WebSocket upgrade request:', req.url);
          });
        }
      },
      // Proxy API calls to backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Keep the /api prefix when forwarding to backend
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
            console.error('Request:', req.method, req.url);
            // Send a proper error response instead of letting it fail silently
            res.writeHead(502, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'Backend service unavailable', details: err.message }));
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying API request:', req.method, req.url, '->', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Proxy VNC connections to backend container
      '/vnc': {
        target: 'http://localhost:6080',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/vnc/, '')
      },
      '/websockify': {
        target: 'http://localhost:6080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
