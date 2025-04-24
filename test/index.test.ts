import assert from 'node:assert/strict';
import { test, beforeEach } from 'vitest';
import { mock, restore } from 'mm';
import { env } from '../src/index.js';

beforeEach(restore);

test('should return default value if env is not set', () => {
  assert.equal(env('TEST_ENV_STRING', 'string', 'default'), 'default');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);
  assert.equal(env('TEST_ENV_NUMBER', 'number', 0), 0);
});

test('should return undefined if env is not set', () => {
  assert.equal(env('TEST_ENV_STRING', 'string'), undefined);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean'), undefined);
  assert.equal(env('TEST_ENV_NUMBER', 'number'), undefined);

  assert.equal(env('TEST_ENV_STRING', 'string') ?? null, null);
  assert.equal(env('TEST_ENV_NUMBER', 'number') ?? 0, 0);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean') ?? false, false);
  assert.equal(env('TEST_ENV_STRING', 'string') ?? 'default', 'default');
});

test('should return env value if env is set to empty string', () => {
  mock(process.env, 'TEST_ENV_STRING', '');
  mock(process.env, 'TEST_ENV_BOOLEAN', '');
  mock(process.env, 'TEST_ENV_NUMBER', '');

  assert.equal(env('TEST_ENV_STRING', 'string', ''), '');
  assert.equal(env('TEST_ENV_STRING', 'string'), undefined);
  assert.equal(env('TEST_ENV_STRING', 'string', 'default string'), 'default string');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', true), true);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean'), undefined);
  assert.equal(env('TEST_ENV_NUMBER', 'number', 3306), 3306);
  assert.equal(env('TEST_ENV_NUMBER', 'number', 0), 0);
  assert.equal(env('TEST_ENV_NUMBER', 'number', -123), -123);
  assert.equal(env('TEST_ENV_NUMBER', 'number'), undefined);

  mock(process.env, 'TEST_ENV_STRING', '    ');
  mock(process.env, 'TEST_ENV_BOOLEAN', '  \t  ');
  mock(process.env, 'TEST_ENV_NUMBER', '   \t\t\t  ');

  assert.equal(env('TEST_ENV_STRING', 'string', ''), '');
  assert.equal(env('TEST_ENV_STRING', 'string'), undefined);
  assert.equal(env('TEST_ENV_STRING', 'string', 'default string'), 'default string');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', true), true);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean'), undefined);
  assert.equal(env('TEST_ENV_NUMBER', 'number', 3306), 3306);
  assert.equal(env('TEST_ENV_NUMBER', 'number', 0), 0);
  assert.equal(env('TEST_ENV_NUMBER', 'number'), undefined);
});

test('should throw error if env is set to invalid value', () => {
  mock(process.env, 'TEST_ENV_BOOLEAN', 'invalid');
  assert.throws(() => env('TEST_ENV_BOOLEAN', 'boolean', false), /Invalid boolean value: invalid on process.env.TEST_ENV_BOOLEAN/);

  mock(process.env, 'TEST_ENV_NUMBER', 'invalid');
  assert.throws(() => env('TEST_ENV_NUMBER', 'number', 0), /Invalid number value: invalid on process.env.TEST_ENV_NUMBER/);

  mock(process.env, 'TEST_ENV_NUMBER', 'abc');
  assert.throws(() => env('TEST_ENV_NUMBER', 'number', 0), /Invalid number value: abc on process.env.TEST_ENV_NUMBER/);
});

test('should throw error if value type is invalid', () => {
  mock(process.env, 'TEST_ENV_STRING', '123');
  assert.throws(() => (env as any)('TEST_ENV_STRING', 'float', 'default'), /Invalid value type: float/);
});

test('should work with string value', () => {
  mock(process.env, 'TEST_ENV_STRING', 'http://localhost:3000');
  assert.equal(env('TEST_ENV_STRING', 'string', 'default'), 'http://localhost:3000');

  mock(process.env, 'TEST_ENV_STRING', '      ');
  assert.equal(env('TEST_ENV_STRING', 'string', 'default'), 'default');
});

test('should work with boolean value', () => {
  mock(process.env, 'TEST_ENV_BOOLEAN', 'true');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), true);

  mock(process.env, 'TEST_ENV_BOOLEAN', 'false');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', true), false);

  mock(process.env, 'TEST_ENV_BOOLEAN', '1');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), true);

  mock(process.env, 'TEST_ENV_BOOLEAN', '0');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', true), false);

  mock(process.env, 'TEST_ENV_BOOLEAN', 'yes');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', true), true);

  mock(process.env, 'TEST_ENV_BOOLEAN', 'no');
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);

  mock(process.env, 'TEST_ENV_BOOLEAN', false);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);

  mock(process.env, 'TEST_ENV_BOOLEAN', 0);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);

  mock(process.env, 'TEST_ENV_BOOLEAN', 0);
  assert.equal(env('TEST_ENV_BOOLEAN', 'boolean', false), false);
});

test('should work with number value', () => {
  mock(process.env, 'TEST_ENV_NUMBER', '123');
  assert.equal(env('TEST_ENV_NUMBER', 'number', 0), 123);

  mock(process.env, 'TEST_ENV_NUMBER', '-123');
  assert.equal(env('TEST_ENV_NUMBER', 'number', 0), -123);

  mock(process.env, 'TEST_ENV_NUMBER', '123.456');
  assert.equal(env('TEST_ENV_NUMBER', 'number', 0), 123.456);

  mock(process.env, 'TEST_ENV_NUMBER', '0');
  assert.equal(env('TEST_ENV_NUMBER', 'number', 10), 0);
});
