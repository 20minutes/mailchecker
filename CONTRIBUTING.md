# Contributing to MailChecker

This branch supports Node.js 24+ only. Tests use the built-in Node.js test runner.

## Add disposable email domains

1. Install development dependencies with `yarn install --frozen-lockfile`.
2. Add domains to `list.txt`.
3. Run `yarn test` to normalize the list, regenerate the Node.js module and run the tests.
4. Commit your changes. The pre-commit hook runs the build and stages both `list.txt` and `platform/node/index.js` automatically, including any unstaged changes to these files.

The generated module must stay committed. No npm release is needed.
