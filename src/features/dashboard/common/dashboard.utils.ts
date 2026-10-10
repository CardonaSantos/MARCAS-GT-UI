import type {
  DashboardResponse, DashboardSection, DashboardSectionKey,
  DashboardSections, DailyPoint,
} from "../api/dashboard.types";

export function getDashboardSection<K extends DashboardSectionKey>(
  response: DashboardResponse | undefined,
  key: K,
): DashboardSection<DashboardSections[K]> | undefined {
  return response?.sections[key];
}

export const moneyGt = (value: string | number | null | undefined) => {
  const n = Number(value ?? 0);
  return Number.isFinite(n)
    ? new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", minimumFractionDigits: 2 }).format(n)
    : "—";
};
export const countGt = (value: number | undefined | null) =>
  value == null ? "—" : new Intl.NumberFormat("es-GT").format(value);

export const dateGt = (iso?: string | null) => {
  if (!iso) return "—";
  const timestamp = new Date(iso);
  return Number.isNaN(timestamp.getTime())
    ? "—"
    : new Intl.DateTimeFormat("es-GT", {
      dateStyle: "medium", timeZone: "America/Guatemala",
    }).format(timestamp);
};

export const timeGt = (iso?: string | null) => {
  if (!iso) return "Sin señal";
  const timestamp = new Date(iso);
  return Number.isNaN(timestamp.getTime())
    ? "Sin señal"
    : new Intl.DateTimeFormat("es-GT", {
      hour: "2-digit", minute: "2-digit", timeZone: "America/Guatemala",
    }).format(timestamp);
};

export function dateInGuatemala(value = new Date()): string {
  // formatToParts evita depender del orden de fecha que implementa cada navegador/ICU.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Guatemala", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(value);
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? "";
  return get("year") + "-" + get("month") + "-" + get("day");
}

export function dashboardDates(days: number) {
  const current = dateInGuatemala();
  const d = new Date(current + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - days + 1);
  return { desde: d.toISOString().slice(0, 10), hasta: current };
}

export function asChartAmount(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Normaliza días sin registros únicamente cuando el servidor confirmó OK. */
export function fillDailyRows(rows: DailyPoint[], from: string, to: string): DailyPoint[] {
  const start = Date.parse(from + "T00:00:00Z");
  const end = Date.parse(to + "T00:00:00Z");
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start || end - start > 365 * 86400000)
    return rows;
  const index = new Map(rows.map((item) => [item.dia, item]));
  const result: DailyPoint[] = [];
  for (let ms = start; ms <= end; ms += 86400000) {
    const day = new Date(ms).toISOString().slice(0, 10);
    result.push(index.get(day) ?? { dia: day, cantidad: 0, monto: "0.00" });
  }
  return result;
}
