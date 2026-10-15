import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { architecturePlugin } from './scripts/architecture.mjs';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'public/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { architecture: architecturePlugin },
    rules: {
      'architecture/boundaries': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/tests/**/*.ts'],
    rules: { 'no-console': 'off' },
  }
);
