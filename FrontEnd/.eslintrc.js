module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    // ... (aturan Anda yang lain mungkin ada di sini)
  },

  // ------------------------------------
  // ❗️ TAMBAHKAN BAGIAN INI ❗️
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "babel.config.js",
    ".eslintrc.js",
    "vue.config.js",
  ]
  // ------------------------------------
}