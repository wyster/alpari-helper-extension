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
    "prettier/vue"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": 0
  }
}