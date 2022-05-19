module.exports = {
  extends: ['plugin:hydrogen/recommended'],
  overrides: [
    // Typescript
    {
      extends: [
        'plugin:hydrogen/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': 1,
      },
    },
  ],
  root: true,
};
