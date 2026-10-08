import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const routes = readFileSync("src/ui/components/Layout/marcas-sidebar-routes.ts", "utf8");
const app = readFileSync("src/App.tsx", "utf8");
const admin = routes.split("const adminRoutes: MarcasRoute[] = [")[1]
  ?.split("const sellerRoutes: MarcasRoute[] = [")[0];
assert.ok(admin, "No se encontró la sección ADMIN");

const expectedHrefs = [
  "/marcas-gt/analisis",
  "/marcas-gt/bodegas",
  "/marcas-gt/clientes",
  "/marcas-gt/crear-categoria",
  "/marcas-gt/crear-cliente",
  "/marcas-gt/crear-productos",
  "/marcas-gt/creditos",
  "/marcas-gt/creditos/cartera",
  "/marcas-gt/creditos/politicas",
  "/marcas-gt/dashboard",
  "/marcas-gt/despachos",
  "/marcas-gt/empresa-info",
  "/marcas-gt/entregas",
  "/marcas-gt/facturacion/configuracion-fiscal",
  "/marcas-gt/facturacion/cuentas-por-cobrar",
  "/marcas-gt/facturacion/facturas",
  "/marcas-gt/hacer-ventas",
  "/marcas-gt/historial-prospectos",
  "/marcas-gt/historial-visitas",
  "/marcas-gt/inventario",
  "/marcas-gt/inventario/ajustes/nuevo",
  "/marcas-gt/inventario/devoluciones/nueva",
  "/marcas-gt/inventario/disponibilidad",
  "/marcas-gt/inventario/entradas/nueva",
  "/marcas-gt/inventario/movimientos",
  "/marcas-gt/inventario/reservas",
  "/marcas-gt/pagos",
  "/marcas-gt/pagos/bancos",
  "/marcas-gt/pedidos",
  "/marcas-gt/prospecto",
  "/marcas-gt/proveedor",
  "/marcas-gt/registrar-entrada-salida",
  "/marcas-gt/registro-entregas",
  "/marcas-gt/reportes",
  "/marcas-gt/requisiciones",
  "/marcas-gt/saldos",
  "/marcas-gt/tracking",
  "/marcas-gt/tracking/historial",
  "/marcas-gt/transferencias",
  "/marcas-gt/transporte/conductores",
  "/marcas-gt/transporte/envios",
  "/marcas-gt/transporte/transportistas",
  "/marcas-gt/transporte/vehiculos",
  "/marcas-gt/usuarios",
  "/marcas-gt/ventas",
  "/marcas-gt/ver-productos",
  "/marcas-gt/visita",
].sort();

const matches = [...admin.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(matches.slice().sort(), expectedHrefs, "Enlaces ADMIN incompletos, duplicados o alterados");

const appPaths = new Set([...app.matchAll(/path="([^"]+)"/g)].map((match) => match[1]));
for (const href of matches) {
  assert.ok(appPaths.has(href), `Enlace ADMIN sin ruta React Router: ${href}`);
}

const groupLabels = [...admin.matchAll(/^    label: "([^"]+)",$/gm)].map(match => match[1]);
assert.equal(groupLabels.length, 12, "El menú de ADMIN debe tener doce grupos operativos");
assert.equal(new Set(groupLabels).size, 12, "Hay grupos duplicados");

for (const section of [
  "Inventario y bodegas",
  "Operaciones de bodega",
  "Personal y seguimiento",
]) assert.ok(groupLabels.includes(section), `Sección poco clara o ausente: ${section}`);

const sidebar = readFileSync("src/ui/components/Layout/app-sidebar.tsx", "utf8");
assert.ok(sidebar.includes("alwaysExpanded={isAdmin}"),
  "El menú ADMIN debe permanecer desplegado.");
assert.ok(sidebar.includes("alwaysExpanded || open"),
  "Los grupos del ADMIN no deben cerrarse automáticamente.");
assert.ok(!sidebar.includes("adminAccordion"),
  "El administrador ya no utiliza el acordeón inicial.");


for (const required of [
  'exactPaths: ["/marcas-gt/inventario"]',
  'exactPaths: ["/marcas-gt/tracking"]',
  'exactPaths: ["/marcas-gt/pagos"]',
  'activePaths: ["/marcas-gt/tracking/historial", "/marcas-gt/tracking/jornadas"]',
]) assert.ok(admin.includes(required), `Falta selección precisa: ${required}`);

assert.ok(routes.includes('if (role === "BODEGA") return warehouseRoutes;'));
assert.ok(routes.includes('if (role === "CONTABILIDAD") return accountingRoutes;'));
assert.ok(routes.includes('if (role === "REPARTIDOR") return deliveryRoutes;'));
assert.ok(routes.includes('return sellerRoutes;'));

console.log(`Sidebar ADMIN verificado: ${groupLabels.length} secciones, ${matches.length} enlaces válidos; menús de otros roles preservados.`);
