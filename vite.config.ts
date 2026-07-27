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
          "connect-src 'self' https://*.tile.openstreetmap.org https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com https://api.deepseek.com https://api.groq.com https://cdn.jsdelivr.net https://tr.ocl.dghs.gov.bd https://icd11.dghs.gov.bd https://fhir.dghs.gov.bd https://sandbox.fhir.dghs.gov.bd https://api.github.com https://ghoapi.azureedge.net https://data.who.int https://data.cdc.gov https://delphi.cmu.edu https://api.open-meteo.com https://data.humdata.org https://openrouter.ai https://api.cerebras.ai https://models.inference.ai.azure.com https://api.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com https://api.reliefweb.int https://cdnjs.cloudflare.com https://api.worldbank.org https://openlibrary.org https://www.googleapis.com https://newsapi.org https://www.ebi.ac.uk https://api.crossref.org https://api.telegram.org https://discord.com https://api.search.brave.com",
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
