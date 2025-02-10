# read-env-value

[![NPM Version](https://img.shields.io/npm/v/read-env-value)](https://www.npmjs.com/package/read-env-value)
[![NPM Downloads](https://img.shields.io/npm/dm/read-env-value)](https://www.npmjs.com/package/read-env-value)
[![NPM License](https://img.shields.io/npm/l/read-env-value)](https://github.com/node-modules/read-env-value/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/node-modules/read-env-value/branch/master/graph/badge.svg)](https://codecov.io/gh/node-modules/read-env-value)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/node-modules/read-env-value/ci.yml?branch=master)](https://github.com/node-modules/read-env-value/actions/workflows/ci.yml?query=branch%3Amaster)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/node-modules/read-env-value)

Read env with default value

## Usage

```ts
import { env } from 'read-env-value';

// read env 'NODE_ENV' with default value 'development'
const value = env('NODE_ENV', 'string', 'development');
```

## API

### env(key: string, type: 'string' | 'number' | 'boolean', defaultValue?: string | number | boolean)

#### Parameters

- `key`: The environment variable key to read.
- `type`: The type of the value to be returned.
- `defaultValue`: The default value to return if the environment variable is not set.

#### Returns

- The value of the environment variable.

#### Example

```ts
import { env } from 'read-env-value';

const value = env('NODE_ENV', 'string', 'development');
```

## License

[MIT](./LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=node-modules/read-env-value)](https://github.com/node-modules/read-env-value/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
