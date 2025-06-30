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
    'curly': ['error', 'all'],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
      env: {
        jest: true,
      },
    },
    {
      files: ['packages/client/**/*.{ts,tsx}'],
      env: {
        browser: true,
        es2020: true,
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      rules: {
        'no-console': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'off',
        'react/jsx-uses-vars': 'error',
        'curly': ['error', 'all'],
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
};