# Contributing to MailChecker

This branch supports Node.js only.

## Add disposable email domains

1. Install development dependencies with `npm ci`.
2. Add domains to `list.txt`.
3. Run `npm test` to normalize the list, regenerate the Node.js module and run the tests.
4. Commit both `list.txt` and `platform/node/index.js`.

The generated module must stay committed: Nova installs this branch directly from Git without a build step. No npm release is needed.
