module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
  ],
  overrides: [
    {
      files: ['*.vue', '*.js'],
      rules: {
        'no-unused-vars': 'off',
        'no-console': 'off',
      }
    }
  ],
  rules: {
    semi: 'error',
    // quotes: ['warn', 'single'],
    'no-console': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  }
};