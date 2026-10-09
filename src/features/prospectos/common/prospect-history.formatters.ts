import type { ProspectState } from "../api/prospect-history.types";

const gtDateTime = new Intl.DateTimeFormat("es-GT", {
  timeZone: "America/Guatemala", dateStyle: "medium", timeStyle: "short",
});
export function formatProspectDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : gtDateTime.format(date);
}
export function formatProspectDuration(minutes: number | null): string {
  if (minutes === null) return "En curso";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} h ${rest} min` : `${rest} min`;
}
export function prospectStatusLabel(status: ProspectState): string {
  if (status === "CERRADO") return "Cancelado";
  if (status === "EN_PROSPECTO") return "En curso";
  return "Finalizado";
}
export function prospectDisplayName(row: {
  nombreCompleto: string | null;
  apellido: string | null;
  empresaTienda: string | null;
}): string {
  return [row.nombreCompleto, row.apellido].filter(Boolean).join(" ")
    || row.empresaTienda || "Sin nombre";
}
