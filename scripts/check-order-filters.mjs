import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const filters = read("src/features/pedidos/components/order-filters.tsx");
const state = read("src/features/pedidos/common/use-order-list-state.ts");
const page = read("src/Pages/Pedidos/OrdersPage.tsx");
const datePicker = read("src/ui/components/app/primitives/app-date-picker.tsx");
const backendCompatible = [
  "estado", "estadoPago", "condicionPago", "clienteId",
  "vendedorId", "visitaId", "fechaDesde", "fechaHasta", "soloAbiertos",
];

for (const key of backendCompatible) {
  assert.ok(filters.includes("props." + key), "Filter not exposed: " + key);
  assert.ok(state.includes(key + ":"), "Filter state missing: " + key);
}
for (const label of [
  "Buscar pedido", "Estado del pedido", "Cliente", "Vendedor",
  "Pago y seguimiento", "Estado de pago", "Condición de pago",
  "Visita vinculada", "Tipo de pedidos", "Fecha de creación del pedido",
  "Desde", "Hasta",
]) assert.ok(filters.includes(label), "Missing visible field label: " + label);

assert.ok(filters.includes('boundary="startOfDay"'));
assert.ok(filters.includes('boundary="endOfDay"'));
assert.ok(filters.includes('maxDate={props.fechaHasta || undefined}'));
assert.ok(filters.includes('minDate={props.fechaDesde || undefined}'));
assert.ok(datePicker.includes('maxDate?: AppDateLike'));
assert.ok(filters.includes('htmlFor="orders-created-from"'));
assert.ok(filters.includes('htmlFor="orders-created-to"'));
assert.ok(state.includes('filters.patch({ [key]: value, visitaId: null })'));
assert.ok(state.includes('updateUrl({ [key]: value, visitaId: null, page: 1 })'));
assert.ok(state.includes('filters.patch({ estado: value, soloAbiertos: null })'));
assert.ok(state.includes('...(value ? { estado: null } : {})'));
assert.ok(page.includes("<OrderFilters"));
assert.ok(page.includes("onSoloAbiertosChange={state.setSoloAbiertos}"));
console.log("Pedidos: etiquetas, fechas, selección de visita, estado abierto y filtros API verificados.");
