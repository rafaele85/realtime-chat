module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
  rules: {
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': 'error',
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-unused-vars': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.ts', '**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
};