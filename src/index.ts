export type ValueType = 'string' | 'boolean' | 'number';
export type DefaultValue = string | boolean | number | undefined;

interface TypeMap<Default> {
  string: Default extends undefined ? string | undefined : string;
  boolean: Default extends undefined ? boolean | undefined : boolean;
  number: Default extends undefined ? number | undefined : number;
}

type EnvReturn<
  Value extends ValueType,
  Default extends DefaultValue,
> = TypeMap<Default>[Value];

export class EnvError extends Error {
  code: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ReadEnvValueError';
    this.code = code || 'READ_ENV_VALUE_ERROR';
    Object.setPrototypeOf(this, EnvError.prototype);
  }
}

export function env<Value extends ValueType, Default extends DefaultValue>(
  key: string,
  valueType: Value,
  defaultValue?: Default
): EnvReturn<Value, Default> {
  let value = process.env[key];
  if (typeof value === 'string') {
    value = value.trim();
  }
  if (undefined === value || value === '') {
    return defaultValue as EnvReturn<Value, Default>;
  }

  if (valueType === 'string') {
    return value as EnvReturn<Value, Default>;
  }

  if (valueType === 'boolean') {
    let booleanValue = false;
    value = value.toLowerCase();
    if (value === 'true' || value === '1' || value === 'yes') {
      booleanValue = true;
    } else if (value === 'false' || value === '0' || value === 'no') {
      booleanValue = false;
    } else {
      throw new EnvError(
        `Invalid boolean value: ${value} on process.env.${key}`,
        'ERR_ENV_INVALID_BOOLEAN_VALUE'
      );
    }
    return booleanValue as EnvReturn<Value, Default>;
  }

  if (valueType === 'number') {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      throw new EnvError(
        `Invalid number value: ${value} on process.env.${key}`,
        'ERR_ENV_INVALID_NUMBER_VALUE'
      );
    }
    return numberValue as EnvReturn<Value, Default>;
  }

  throw new EnvError(
    `Invalid value type: ${valueType}`,
    'ERR_ENV_INVALID_VALUE_TYPE'
  );
}
