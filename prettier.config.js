module.exports = {
  ...require('@hashicorp/platform-cli/config/prettier.config'),
  overrides: [
    {
      files: 'data/docs-redirects.js',
      options: {
        printWidth: Infinity,
      },
    },
  ],
}
