module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parser: 'babel-eslint',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  ],
  plugins: [
    'react',
    "prettier",
    'react-hooks',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': 'off',
    'import/prefere-default-export': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    "react-hoocks/rules-of-hoocks": 'off',
    "react/react-in-jsx-scope": 'off',
    "import/no-extraneous-dependencies": 0
  },
};
