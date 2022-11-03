module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:import/recommended',
    'standard',
    'next',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'comma-dangle': 0,
    'quotes': 0,
    'space-before-function-paren': 0,
    'operator-linebreak': ['off'],
    'camelcase': 0,
    'react-hooks/exhaustive-deps': 0,
    "prefer-const": ["off", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }],
    "@next/next/no-img-element": 0,
    "dot-notation": 0,
  },
  ignorePatterns: ['coverage.json', '/coverage/*', '/test/*'],
}
