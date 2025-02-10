export type ValueType = 'string' | 'boolean' | 'number';
export type DefaultValue = string | boolean | number | undefined;

type TypeMap<D> = {
  'string': D extends undefined ? string | undefined : string;
  'boolean': D extends undefined ? boolean | undefined : boolean;
  'number': D extends undefined ? number | undefined : number;
};

type EnvReturn<V extends ValueType, D extends DefaultValue> = TypeMap<D>[V];

export function env<V extends ValueType, D extends DefaultValue>(key: string, valueType: V, defaultValue?: D): EnvReturn<V, D> {
  let value = process.env[key];
  if (typeof value === 'string') {
    value = value.trim();
  }
  if (!value) {
    return defaultValue as EnvReturn<V, D>;
  }

  if (valueType === 'string') {
    return value as EnvReturn<V, D>;
  }

  if (valueType === 'boolean') {
    let booleanValue = false;
    if (value === 'true' || value === '1') {
      booleanValue = true;
    } else if (value === 'false' || value === '0') {
      booleanValue = false;
    } else {
      throw new TypeError(`Invalid boolean value: ${value} on process.env.${key}`);
    }
    return booleanValue as EnvReturn<V, D>;
  }

  if (valueType === 'number') {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      throw new TypeError(`Invalid number value: ${value} on process.env.${key}`);
    }
    return numberValue as EnvReturn<V, D>;
  }

  throw new TypeError(`Invalid value type: ${valueType}`);
}
