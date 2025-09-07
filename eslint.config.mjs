// eslint.config.mjs
import js from "@eslint/js";
import unicorn from "eslint-plugin-unicorn";
import eslintPluginHtml from "eslint-plugin-html";

export default [
  js.configs.recommended,

  // HTML ファイル用設定
  {
    files: ["**/*.html"],
    plugins: {
      html: eslintPluginHtml,
      unicorn
    },
    rules: {
      ...unicorn.configs.recommended.rules
    }
  },

  // JS/TS ファイル用設定
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      unicorn
    },
    rules: {
      ...unicorn.configs.recommended.rules
    }
  }
];