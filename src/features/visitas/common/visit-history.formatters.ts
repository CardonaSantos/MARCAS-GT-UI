import type { VisitStatus } from "../api/visit-workflow.types";

const dateTime = new Intl.DateTimeFormat("es-GT", {
  timeZone: "America/Guatemala", dateStyle: "medium", timeStyle: "short",
});
export function visitDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTime.format(date);
}
export function visitDuration(minutes: number | null): string {
  if (minutes === null) return "En curso";
  const h = Math.floor(minutes / 60);
  return h ? `${h} h ${minutes % 60} min` : `${minutes} min`;
}
export function visitStatusLabel(s: VisitStatus): string {
  return s === "FINALIZADA" ? "Finalizada" : s === "CANCELADA" ? "Cancelada" : "En curso";
}
export function customerName(c: { nombre: string; apellido: string | null }) {
  return [c.nombre, c.apellido].filter(Boolean).join(" ") || "Sin nombre";
}
