module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    "@vue/typescript",
    "plugin:@typescript-eslint/recommended",
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
      "src": ["./src"],
      "extensions": [".js", ".vue"]
    }],
    "vue-i18n/no-missing-keys": 0
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.json'
    }
  }
}