module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    '@pbs/eslint-config-pbs-kids',
    'plugin:vue/essential',
    '@vue/typescript/recommended'
  ],
  globals: {
    PIVOTAL_CONFIG: 'readonly',
    ENV: 'readonly',
    SECONDS: 'readonly',
    MINUTES: 'readonly',
    HOURS: 'readonly',
    DAYS: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    '@typescript-eslint/interface-name-prefix' : 'off',
    '@typescript-eslint/camelcase' : 'off',
    'brace-style': ["error", "stroustrup"],
    'new-cap' : 'off',
    'no-console': 'off',
    'prefer-const': 'off',
  }
}
