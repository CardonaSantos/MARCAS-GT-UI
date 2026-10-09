import { visitReasons, visitTypes } from "../schemas/visit-workflow.schemas";
import type { VisitReason, VisitType } from "../api/visit-workflow.types";

const guatemala = new Intl.DateTimeFormat("es-GT", {
  timeZone: "America/Guatemala", dateStyle: "medium", timeStyle: "short",
});
export function formatVisitDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : guatemala.format(date);
}
export function visitReasonLabel(reason: VisitReason | null): string {
  return visitReasons.find((option) => option.value === reason)?.label ?? "No especificado";
}
export function visitTypeLabel(type: VisitType | null): string {
  return visitTypes.find((option) => option.value === type)?.label ?? "No especificado";
}
export function visitCustomerName(c: { nombre: string; apellido: string | null }): string {
  return [c.nombre, c.apellido].filter(Boolean).join(" ");
}
