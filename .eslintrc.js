// const { isVariableStatement } = require( "typescript" );

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, "cypress/ globals": true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin: prettier / recommended',
    'extends": "next/core-web-vitals',
    "plugin:cypress/recommended"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', '@typescript-eslint', 'cypress'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': ['error', {
      'ignore': ['data-testid', "testid"]
    }],
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error",
    "cypress/no-async-before": "error",
    "cypress/no-pause": "error"
    ,
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    indent: ['error', 2],
    camelcase: 'warn',
    classMethodsUseThis: 'off',
    noUnusedVars: 'warn',
    noUnusedLocals: 'warn',
    noImplicitReturns: 'warn',
    UPPER_SNAKE_CASE: 'warn',
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
  },
};
