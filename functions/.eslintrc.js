module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "react",
  ],
  settings: {
    react: {
      version: "detect", 
    },
  },
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "react/no-unescaped-entities": "error", // Add this to enforce escaping entities in React
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Add this to ignore unused variables prefixed with an underscore
    "no-undef": "off",
  },
};
