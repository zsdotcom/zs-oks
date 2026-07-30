import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: process.env.BASE_PATH || '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com",
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://fonts.googleapis.com",
          "img-src 'self' data: https://*.tile.openstreetmap.org https://unpkg.com",
          // connect-src: include the known API hosts the app may call. Keep this list explicit and avoid ellipses.
          "connect-src 'self' https://*.tile.openstreetmap.org https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com https://api.deepseek.com https://api.groq.com https://api.ollama.ai https://api.openrouter.ai https://api.cerebras.ai https://api.github.com https://api.cloudflare.com ws://localhost:3000 ws://127.0.0.1:3000",
          "font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com https://fonts.googleapis.com",
          "frame-src 'self' about:",
          "worker-src 'self' blob:",
          "manifest-src 'self'",
        ].join('; '),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      process.env.ANALYZE ? visualizer({
        filename: 'dist/stats.html',
        title: 'Open Knowledge Studio Bundle Analysis',
        template: 'treemap',
        gzipSize: true,
      }) : undefined,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor';
            }
          },
        },
      },
    },
});
