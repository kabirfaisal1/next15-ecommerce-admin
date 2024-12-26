// const { isVariableStatement } = require( "typescript" );

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, "cypress/globals": true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    'plugin:cypress/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', '@typescript-eslint', 'cypress'],
  rules: {
    'react-refresh/only-export-components': [
      'error',
      { allowConstantExport: true },
    ],
    'react/prop-types': ['error', {
      'ignore': ['data-testid', 'testid']
    }],
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'error',
    'cypress/no-force': 'error',
    'cypress/no-async-tests': 'error',
    'cypress/no-async-before': 'error',
    'cypress/no-pause': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    indent: ['error', 2],
    camelcase: 'error',
    classMethodsUseThis: 'off',
    'no-unused-vars': 'off',
    'no-unused-locals': 'off',
    'no-implicit-returns': 'error',
    'UPPER_SNAKE_CASE': 'error',
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
    }],
  },
};
