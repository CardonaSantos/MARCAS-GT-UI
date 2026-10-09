import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(path, "utf8");
const routes = read("src/App.tsx");
const list = read("src/Pages/Pedidos/OrdersPage.tsx");
const detail = read("src/Pages/Pedidos/OrderDetailPage.tsx");
const sellers = read("src/features/pedidos/components/order-selects.tsx");
const edit = read("src/Pages/Pedidos/EditOrderPage.tsx");

for (const path of [
  "/marcas-gt/pedidos/nuevo",
  "/marcas-gt/pedidos/:id/editar",
  "/marcas-gt/pedidos/:id/cancelar",
]) {
  const at = routes.indexOf('path="' + path + '"');
  assert.ok(at >= 0, "Falta la ruta " + path);
  assert.match(routes.slice(at, at + 190), /roles=\{\["ADMIN", "VENDEDOR", "BODEGA"\]\}/,
    "BODEGA debe tener acceso a " + path);
}
assert.ok(list.includes('["ADMIN", "VENDEDOR", "BODEGA"].includes(role ?? "")'),
  "La lista debe ofrecer crear y editar pedidos a BODEGA");
assert.ok(detail.includes('["ADMIN", "VENDEDOR", "BODEGA"].includes(role ?? "")'),
  "El detalle debe ofrecer acciones comerciales a BODEGA");
assert.ok(detail.includes('role === "ADMIN" && order.acciones.puedeConfirmar'),
  "Solo ADMIN puede ver la confirmacion");
assert.ok(detail.includes('(role === "ADMIN" || role === "VENDEDOR") &&'),
  "Tramitar credito sigue limitado a comercial y ADMIN");
assert.ok(sellers.includes('["ADMIN", "VENDEDOR", "BODEGA"].includes(user.rol)'),
  "El selector debe permitir al responsable BODEGA creado por backend");
assert.ok(edit.includes("query.data?.acciones.puedeEditar"),
  "La edicion debe respetar restricciones de estado del dominio");
console.log("Permisos UI Pedidos BODEGA: rutas, acciones, credito y estado OK.");
