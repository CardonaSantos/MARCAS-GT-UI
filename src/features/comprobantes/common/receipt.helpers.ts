import type {
  DeliveryReceiptSnapshot, DispatchReceiptSnapshot, ReceiptKind, ReceiptRecord,
  ReceiptPreview,
} from "../api/receipt.types";

export const DELIVERY_TERMINAL_STATES = new Set([
  "ENTREGADA", "PARCIAL", "RECHAZADA", "NO_ENTREGADA",
]);

export function dispatchReceiptPath(dispatchId: number, operationId: number) {
  return `/marcas-gt/despachos/${dispatchId}/comprobante/${operationId}`;
}
export function deliveryReceiptPath(deliveryId: number) {
  return `/marcas-gt/entregas/${deliveryId}/comprobante`;
}
export function isDispatchSnapshot(snapshot: ReceiptPreview["snapshot"] | ReceiptRecord["snapshot"]):
  snapshot is DispatchReceiptSnapshot {
  return snapshot.clase === "NOTA_SALIDA_BODEGA";
}
export function isDeliverySnapshot(snapshot: ReceiptPreview["snapshot"] | ReceiptRecord["snapshot"]):
  snapshot is DeliveryReceiptSnapshot {
  return snapshot.clase === "CONSTANCIA_ENTREGA" ||
    snapshot.clase === "CONSTANCIA_INTENTO_ENTREGA";
}
export function receiptTitle(kind: ReceiptKind, snapshot: ReceiptPreview["snapshot"]) {
  if (kind === "SALIDA_DESPACHO") return "Nota de salida de bodega";
  return snapshot.clase === "CONSTANCIA_INTENTO_ENTREGA"
    ? "Constancia de intento de entrega" : "Constancia de entrega";
}
export function dateText(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf())
    ? "—"
    : new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short",
      timeZone: "America/Guatemala" }).format(parsed);
}
export function cleanFilePart(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, "_");
}
