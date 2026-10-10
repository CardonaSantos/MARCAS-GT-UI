import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (name) => readFileSync(name, "utf8");
const app = read("src/App.tsx");
const endpoints = read("src/API/routes/endpoints.ts");
const page = read("src/Pages/Comprobantes/OperationalReceiptPage.tsx");
const pdf = read("src/features/comprobantes/components/receipt-pdf-document.tsx");
const dispatchDetail = read("src/Pages/Despachos/DispatchDetailPage.tsx");
const deliveryDetail = read("src/Pages/Entregas/DeliveryDetailPage.tsx");
const dispatchOpTable = read("src/features/despachos/components/dispatch-operations-table.tsx");
const deliveryTable = read("src/features/entregas/components/delivery-table.tsx");
const mutate = read("src/features/comprobantes/api/receipt.mutations.ts");
const oldPdf = read("src/components/PDF/VentasPDF/VentaPdfPage.tsx");

for (const token of [
  "/marcas-gt/despachos/:id/comprobante/:operacionId",
  "/marcas-gt/entregas/:id/comprobante",
  "OperationalReceiptPage kind=\"SALIDA_DESPACHO\"",
  "OperationalReceiptPage kind=\"ENTREGA\"",
]) assert.ok(app.includes(token), "Falta ruta o page: " + token);
for (const token of [
  "/comprobantes/despachos/", "/comprobantes/entregas/",
  "vista-previa", "/emitir", "/acciones",
]) assert.ok(endpoints.includes(token), "Falta endpoint: " + token);
for (const token of ["useReceiptPreview(", "useIssueReceipt(", "useRecordReceiptAction(",
  "Abrir para imprimir", "Descargar PDF", "Compartir", "Emite primero"]) {
  assert.ok(page.includes(token), "Falta accion: " + token);
}
assert.ok(pdf.includes('size="A4"') && pdf.includes('size={[226.77, height]}'),
  "Se necesitan ambas plantillas PDF");
assert.ok(dispatchDetail.includes("justDispatchedOperationId") &&
  dispatchOpTable.includes('row.original.tipo !== "SALIDA_DESPACHO"') &&
  dispatchOpTable.includes('row.original.estado !== "APLICADA"'),
  "Falta CTA de operacion confirmada");
assert.ok(deliveryDetail.includes("DELIVERY_TERMINAL_STATES") &&
  deliveryTable.includes("DELIVERY_TERMINAL_STATES"),
  "Falta estado final en CTA entrega");
assert.ok(mutate.includes('method: "POST"') &&
  !page.includes("VITE_API_URL"), "Se debe usar la fachada API");
assert.ok(oldPdf.includes("VentaThermalPDF"), "POS legacy debe conservarse sin reescrituras");
console.log("Contrato UI comprobantes: rutas, permisos visuales, A4/80mm y flujos OK.");
