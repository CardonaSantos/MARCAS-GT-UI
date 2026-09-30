export interface NormalizeAppPayloadOptions {
  trimStrings?: boolean;
  emptyStringToNull?: boolean;
  emptyStringToUndefined?: boolean;
  nullToUndefined?: boolean;
  removeUndefined?: boolean;
  removeNull?: boolean;
  parseNumbers?: boolean;
  parseBooleans?: boolean;
  deep?: boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function parseStringValue(
  value: string,
  options: NormalizeAppPayloadOptions,
): unknown {
  let nextValue = options.trimStrings ? value.trim() : value;

  if (options.parseBooleans) {
    if (nextValue === "true") return true;
    if (nextValue === "false") return false;
  }

  if (options.parseNumbers && nextValue !== "") {
    const parsed = Number(nextValue);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (nextValue === "") {
    if (options.emptyStringToUndefined) return undefined;
    if (options.emptyStringToNull) return null;
  }

  return nextValue;
}

function normalizeValue(
  value: unknown,
  options: NormalizeAppPayloadOptions,
): unknown {
  if (typeof value === "string") {
    return parseStringValue(value, options);
  }

  if (value === null) {
    if (options.nullToUndefined) return undefined;
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    if (!options.deep) return value;

    return value
      .map((item) => normalizeValue(item, options))
      .filter((item) => {
        if (options.removeUndefined && item === undefined) return false;
        if (options.removeNull && item === null) return false;
        return true;
      });
  }

  if (isPlainObject(value)) {
    if (!options.deep) return value;

    const output: Record<string, unknown> = {};

    Object.entries(value).forEach(([key, item]) => {
      const normalized = normalizeValue(item, options);

      if (options.removeUndefined && normalized === undefined) return;
      if (options.removeNull && normalized === null) return;

      output[key] = normalized;
    });

    return output;
  }

  return value;
}

export function normalizeAppPayload<TResult = unknown>(
  value: unknown,
  options: NormalizeAppPayloadOptions = {},
): TResult {
  const normalized = normalizeValue(value, {
    deep: true,
    trimStrings: true,
    ...options,
  });

  return normalized as TResult;
}

export function pickAppPayload<
  TSource extends Record<string, unknown>,
  TKey extends keyof TSource,
>(source: TSource, keys: TKey[]): Pick<TSource, TKey> {
  const output = {} as Pick<TSource, TKey>;

  keys.forEach((key) => {
    output[key] = source[key];
  });

  return output;
}

export function omitAppPayload<
  TSource extends Record<string, unknown>,
  TKey extends keyof TSource,
>(source: TSource, keys: TKey[]): Omit<TSource, TKey> {
  const output = { ...source };

  keys.forEach((key) => {
    delete output[key];
  });

  return output as Omit<TSource, TKey>;
}

export function mapAppPayload<TSource extends Record<string, unknown>, TResult>(
  source: TSource,
  mapper: (source: TSource) => TResult,
): TResult {
  return mapper(source);
}

export function removeEmptyAppPayloadValues<
  TSource extends Record<string, unknown>,
>(source: TSource): Partial<TSource> {
  const output: Partial<TSource> = {};

  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value === null) return;
    if (value === "") return;
    if (Array.isArray(value) && value.length === 0) return;

    output[key as keyof TSource] = value as TSource[keyof TSource];
  });

  return output;
}
