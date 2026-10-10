/** Validaciones monetarias exactas en centavos, alineadas al backend. */
export function moneyCents(value: string | number): number | null {
  const text = String(value).trim();
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(result) && result >= 0 ? result : null;
}

export function validCreditAdvance(
  condition: "CREDITO" | "MIXTO",
  advance: string,
  total: string | number,
): boolean {
  const amount = moneyCents(advance);
  const totalCents = moneyCents(total);
  if (amount === null || totalCents === null || totalCents <= 0) return false;
  return condition === "MIXTO"
    ? amount > 0 && amount < totalCents
    : amount === 0;
}

export function financedCreditAmount(
  total: string | number,
  advance: string,
): string | null {
  const totalCents = moneyCents(total);
  const advanceCents = moneyCents(advance);
  if (totalCents === null || advanceCents === null ||
      advanceCents > totalCents) return null;
  return ((totalCents - advanceCents) / 100).toFixed(2);
}

export function normalizeCreditAdvance(value: string): string {
  const cents = moneyCents(value);
  return cents === null ? value : (cents / 100).toFixed(2);
}
