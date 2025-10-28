export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      globals: {
        window: true,
        document: true,
      },
    },
    rules: {
      semi: ["error", "always"],
    },
  },
];
