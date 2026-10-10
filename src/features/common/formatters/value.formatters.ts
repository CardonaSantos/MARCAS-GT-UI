const dateTimeFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
});

const integerFormatter = new Intl.NumberFormat("es-GT", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("es-GT", {
  maximumFractionDigits: 2,
});

const currencyFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function toValidDate(value: string | Date | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(
  value: string | Date | null | undefined,
  fallback = "—",
) {
  const date = toValidDate(value);

  return date ? dateTimeFormatter.format(date) : fallback;
}

export function formatDate(
  value: string | Date | null | undefined,
  fallback = "—",
) {
  const date = toValidDate(value);

  return date ? dateFormatter.format(date) : fallback;
}

export function formatInteger(
  value: number | null | undefined,
  fallback = "—",
) {
  return typeof value === "number" && Number.isFinite(value)
    ? integerFormatter.format(value)
    : fallback;
}

export function formatDecimal(
  value: number | string | null | undefined,
  fallback = "—",
) {
  const parsed = typeof value === "string" ? Number(value) : value;

  return typeof parsed === "number" && Number.isFinite(parsed)
    ? decimalFormatter.format(parsed)
    : fallback;
}

export function formatMoney(
  value: number | string | null | undefined,
  fallback = "—",
) {
  const parsed = typeof value === "string" ? Number(value) : value;

  return typeof parsed === "number" && Number.isFinite(parsed)
    ? currencyFormatter.format(parsed)
    : fallback;
}
