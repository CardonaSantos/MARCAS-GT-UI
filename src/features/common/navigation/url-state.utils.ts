export function parsePositiveIntParam(
  value: string | null,
  fallback?: number,
) {
  if (!value) return fallback ?? null;

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback ?? null;
  }

  return parsed;
}

export function parseOptionalBooleanParam(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

export function parseEnumParam<TValue extends string>(
  value: string | null,
  allowed: readonly TValue[],
  fallback?: TValue,
) {
  if (value && allowed.includes(value as TValue)) {
    return value as TValue;
  }

  return fallback ?? null;
}

export function setSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | number | boolean | null | undefined,
) {
  if (value === null || value === undefined || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}
