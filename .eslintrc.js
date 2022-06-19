module.exports = {
  extends: ['plugin:hydrogen/recommended'],
  overrides: [
    // Typescript
    {
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:hydrogen/recommended', // Must be last in this list
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
