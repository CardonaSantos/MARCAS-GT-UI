const GUATEMALA_TIME_ZONE = "America/Guatemala";

/**
 * Asistencia.fecha es un día lógico guardado por el backend como medianoche UTC.
 * No debe convertirse a America/Guatemala porque 00:00Z caería en el día anterior.
 */
export function formatTrackingBusinessDate(value: string): string {
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return "—";

  return `${day}/${month}/${year}`;
}

export function formatTrackingTime(value: string | null): string {
  if (!value) return "—";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("es-GT", {
    timeZone: GUATEMALA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

export function formatTrackingDateTime(value: string | null): string {
  if (!value) return "—";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("es-GT", {
    timeZone: GUATEMALA_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

export function formatTrackingDuration(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours <= 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;

  return `${hours} h ${minutes} min`;
}
