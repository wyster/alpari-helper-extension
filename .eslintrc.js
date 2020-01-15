module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    "@vue/typescript",
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:vue/strongly-recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/vue",
    "plugin:vue-i18n/recommended"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": 0,
    "vue-i18n/no-dynamic-keys": "error",
    "vue-i18n/no-unused-keys": ["error", {
      "src": "./src",
      "extensions": [".js", ".vue"]
    }],
    "vue-i18n/no-missing-keys": 0,
    "vue-i18n/no-raw-text": 0
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.json'
    }
  }
};
