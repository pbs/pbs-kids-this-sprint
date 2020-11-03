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
    Build: 'readonly',
    Racing: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'prefer-const': 'off',
    "@typescript-eslint/interface-name-prefix" : 'off',
  }
}
