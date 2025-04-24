export type ValueType = 'string' | 'boolean' | 'number';
export type DefaultValue = string | boolean | number | undefined;

type TypeMap<D> = {
  'string': D extends undefined ? string | undefined : string;
  'boolean': D extends undefined ? boolean | undefined : boolean;
  'number': D extends undefined ? number | undefined : number;
};

type EnvReturn<V extends ValueType, D extends DefaultValue> = TypeMap<D>[V];

export class EnvError extends Error {
  code: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ReadEnvValueError';
    this.code = code || 'READ_ENV_VALUE_ERROR';
    Object.setPrototypeOf(this, EnvError.prototype);
  }
}

export function env<V extends ValueType, D extends DefaultValue>(key: string, valueType: V, defaultValue?: D): EnvReturn<V, D> {
  let value = process.env[key];
  if (typeof value === 'string') {
    value = value.trim();
  }
  if (undefined === value || value === '') {
    return defaultValue as EnvReturn<V, D>;
  }

  if (valueType === 'string') {
    return value as EnvReturn<V, D>;
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
        'ERR_ENV_INVALID_BOOLEAN_VALUE',
      );
    }
    return booleanValue as EnvReturn<V, D>;
  }

  if (valueType === 'number') {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      throw new EnvError(
        `Invalid number value: ${value} on process.env.${key}`,
        'ERR_ENV_INVALID_NUMBER_VALUE',
      );
    }
    return numberValue as EnvReturn<V, D>;
  }

  throw new EnvError(
    `Invalid value type: ${valueType}`,
    'ERR_ENV_INVALID_VALUE_TYPE',
  );
}
