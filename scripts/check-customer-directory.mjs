import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(p, "utf8");
const base = "src/features/clientes/";
const page = read("src/Pages/Customers.tsx");
const endpoints = read("src/API/routes/endpoints.ts");
const types = read(base + "api/customer-directory.types.ts");
const queries = read(base + "api/customer-directory.queries.ts");
const state = read(base + "common/use-customer-directory-state.ts");
const filters = read(base + "components/customer-directory-filters.tsx");
const table = read(base + "components/customer-directory-table.tsx");
const detail = read(base + "components/customer-directory-detail-dialog.tsx");
const mutation = read(base + "api/customer-directory.mutations.ts");
const app = read("src/App.tsx");

assert.ok(app.includes('path="/marcas-gt/clientes"'));
assert.ok(endpoints.includes('directory: "/customers/directorio"'));
assert.ok(endpoints.includes('directoryDetail: (id: number) => `/customers/directorio/${id}`'));
assert.ok(queries.includes("API.useQuery<CustomerDirectoryPage>"));
assert.ok(queries.includes("API.useQuery<CustomerDirectoryDetail>"));
assert.ok(queries.includes("params: { ...filters }"));
assert.ok(queries.includes("marcasQueryKeys.clientes.list(filters)"));
assert.ok(queries.includes("marcasQueryKeys.clientes.detail(id ?? 0)"));
for (const field of ["page", "limit", "search", "departamentoId", "municipioId",
  "tipoCliente", "volumenCompra", "presupuestoMensual", "intereses", "sortBy", "sortDir"]) {
  assert.ok(types.includes(field + (["page", "limit", "sortBy", "sortDir"].includes(field) ? ":" : "?")),
    "Missing filter type " + field);
}
assert.ok(state.includes("useSearchParams"));
assert.ok(state.includes('...(key === "departamentoId" ? { municipioId: null } : {})'));
assert.ok(filters.includes("AppMultiSelect"));
assert.ok(filters.includes("AppSingleSelect"));
assert.ok(filters.includes("AppSearchInput"));
assert.ok(filters.includes("customerInterestOptions"));
assert.ok(table.includes("AppDataTable<CustomerDirectoryItem>"));
assert.ok(table.includes('paginationMode="server"'));
assert.ok(table.includes('responsiveMode="cards"'));
assert.ok(table.includes("createAppRowActionsColumn"));
assert.ok(table.includes("onDetail"));
assert.ok(table.includes("historial-cliente-ventas"));
assert.ok(table.includes("editar-cliente"));
assert.ok(detail.includes("perfilFiscal"));
assert.ok(detail.includes("cliente"));
assert.ok(detail.includes("actividad"));
assert.ok(mutation.includes('method: "DELETE"'));
assert.ok(page.includes("AppConfirmDialog"));
assert.ok(page.includes("activityTotal > 0"));
assert.ok(page.includes("CustomerDirectoryTable"));
assert.ok(page.includes("CustomerDirectoryFilters"));
assert.ok(page.includes("CustomerDirectoryDetailDialog"));
assert.ok(!page.includes("axios") && !page.includes("jwtDecode"));
assert.ok(!page.includes("/customers/get-all-customers"));
assert.ok(!table.includes("any[]"));
console.log("Directorio de clientes: contratos, paginación, filtros, acciones y responsive validados.");
