# MailChecker — Node.js

Node.js-only branch of [MailChecker](https://github.com/FGRibreau/mailchecker). Validates email syntax and rejects disposable email domains, including their subdomains.

## Installation

```sh
npm install 'git+ssh://git@github.com/20minutes/mailchecker.git#more-emails'
```

No npm release is required.

## Usage

```js
const MailChecker = require('mailchecker');

MailChecker.isValid('hello@gmail.com'); // true
MailChecker.isValid('hello@yopmail.com'); // false
MailChecker.isValid('not-an-email'); // false

MailChecker.addCustomDomains(['disposable.example']);
MailChecker.blacklist(); // Set of blocked domains
```

CommonJS and TypeScript declarations are included. The runtime has no external dependencies.

## Update the domain list

```sh
npm ci
# Edit list.txt, then regenerate the Node.js module and run the tests:
npm test
```

`npm ci` installs the Husky pre-commit hook (Node.js 18+ required for development). Before each commit, it runs the build and stages the full normalized `list.txt` and generated `platform/node/index.js`, including any unstaged changes to these files. The generated module is tracked so Git dependencies work without a build or development dependencies.

`npm run build` normalizes `list.txt` and regenerates the module from `platform/node/index.tmpl.js`. Docker and other language toolchains are not needed.

The package's `files` allowlist includes only the generated Node.js module and TypeScript declarations, alongside npm's standard metadata, README and license.

## License

MIT — Copyright François-Guillaume Ribreau and contributors. See [LICENSE](LICENSE) and [upstream history](https://github.com/FGRibreau/mailchecker) for credits.
