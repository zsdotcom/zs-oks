import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/unit/setup.ts'],
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['app/src/**/*.{ts,tsx}'],
      exclude: [
        'tests/unit/**',
        'app/src/**/*.{test,spec}.{ts,tsx}',
        'app/src/**/*.{bench,benchmark}.{ts,tsx}',
        'app/src/index.tsx',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 85,
        lines: 80,
      },
    },
    benchmark: {
      include: ['tests/unit/**/*.{bench,benchmark}.{ts,tsx}'],
      outputJson: './benchmark-results.json',
    },
  },
});
