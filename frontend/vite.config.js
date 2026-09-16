import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/sitemap.xml': 'http://127.0.0.1:8000',
      '/robots.txt': 'http://127.0.0.1:8000'
    }
  }
});
