import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', 'node_modules/', 'coverage/', 'e2e-results/', 'playwright-report/'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'e2e/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { project: ['./tsconfig.app.json', './tsconfig.node.json'] },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
