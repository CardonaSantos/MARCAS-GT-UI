import type {
  TrackingSessionStatus,
  TrackingAttendanceDetail,
} from "../api/tracking.types";

const TIME_ZONE = "America/Guatemala";

export function formatBusinessDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "—";
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function formatTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-GT", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-GT", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatMinutes(value?: number | null): string {
  if (value === null || value === undefined) return "—";

  const safe = Math.max(0, Math.floor(value));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

export function stateLabel(estado: TrackingSessionStatus): string {
  if (estado === "ACTIVA") return "Activa";
  if (estado === "EXPIRADA") return "Expirada";
  return "Finalizada";
}

export function stateTone(
  estado: TrackingSessionStatus,
): "success" | "neutral" | "warning" {
  if (estado === "ACTIVA") return "success";
  if (estado === "EXPIRADA") return "warning";
  return "neutral";
}

export function attendanceState(detail: TrackingAttendanceDetail) {
  if (detail.resumen.haySesionActiva) {
    return { label: "En jornada", tone: "success" as const };
  }

  if (detail.asistencia.horaSalida) {
    return detail.resumen.sesionesExpiradas > 0
      ? { label: "Finalizada · con expiración", tone: "warning" as const }
      : { label: "Finalizada", tone: "neutral" as const };
  }

  return { label: "Sin cierre", tone: "warning" as const };
}
