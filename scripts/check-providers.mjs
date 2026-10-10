import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(path, "utf8");

const root = "src/features/proveedores/";
const schema = read(root + "schemas/provider.schemas.ts");
const mapper = read(root + "common/provider.mappers.ts");
const types = read(root + "api/provider.types.ts");
const queries = read(root + "api/provider.queries.ts");
const mutations = read(root + "api/provider.mutations.ts");
const fields = read(root + "components/provider-form-fields.tsx");
const list = read(root + "components/provider-list.tsx");
const edit = read(root + "components/provider-edit-dialog.tsx");
const deletion = read(root + "components/provider-delete-dialog.tsx");
const page = read("src/Pages/CrearProveedor.tsx");
const endpoint = read("src/API/routes/endpoints.ts");
const app = read("src/App.tsx");

assert.ok(schema.includes('nombre: z.string().trim().min(1,'));
assert.ok(schema.includes('correo: optionalEmail'));
assert.ok(schema.includes('telefono: optionalText'));
assert.ok(schema.includes('activo: true'));
assert.ok(!schema.includes('latitud:') && !schema.includes('longitud:'),
  "No send fields absent in Prisma Proveedor");
for (const field of [
  "nombre","correo","telefono","direccion","razonSocial","rfc",
  "nombreContacto","telefonoContacto","emailContacto",
  "pais","ciudad","codigoPostal","notas","activo",
]) {
  assert.ok(schema.includes(field + ":"), "Missing editable field: " + field);
  assert.ok(types.includes(field + ":"), "Missing typed field: " + field);
}
assert.ok(mapper.includes("toProviderPayload"));
assert.ok(mapper.includes("|| null"), "Optional empty values must be nullable for PATCH");
assert.ok(queries.includes("API.useQuery<Provider[]>"));
assert.ok(queries.includes("marcasQueryKeys.proveedores.list()"));
assert.ok(mutations.includes("useCreateProvider"));
assert.ok(mutations.includes("useUpdateProvider"));
assert.ok(mutations.includes("useDeleteProvider"));
assert.ok(mutations.includes('method: "POST"'));
assert.ok(mutations.includes('method: "PATCH"'));
assert.ok(mutations.includes('method: "DELETE"'));
assert.ok(mutations.includes("marcasQueryKeys.proveedores.all"));
assert.ok(mutations.includes("marcasEndpoints.providers.deleteOne(id)"));
assert.ok(endpoint.includes('deleteOne: (id: number) => `/provider/delete-provider/${id}`'),
  "Delete must call safe individual-provider endpoint, never bulk-delete");
assert.ok(fields.includes("AppFormInput"));
assert.ok(fields.includes("AppFormSwitch"));
assert.ok(fields.includes("AppFormTextarea"));
assert.ok(list.includes("AppSearchInput"));
assert.ok(list.includes("PAGE_SIZE = 12"));
assert.ok(edit.includes("AppDialog"));
assert.ok(edit.includes("ProviderFormFields"));
assert.ok(deletion.includes("AppConfirmDialog"));
assert.ok(page.includes("AppTabs<ProviderTab>"));
assert.ok(page.includes("AppFormSubmit"));
assert.ok(page.includes("ProviderFormFields"));
assert.ok(page.includes("await createProvider.mutateAsync(toProviderPayload(values))"));
assert.ok(page.indexOf("await createProvider.mutateAsync") < page.indexOf("handlers.reset(emptyProviderForm)"));
assert.ok(!page.includes("axios") && !page.includes("VITE_API_URL"));
assert.ok(app.includes('path="/marcas-gt/proveedor"'));
assert.ok(app.includes("<CrearProveedor />"));
console.log("Proveedores: CRUD tipado, solo nombre obligatorio, tabs, caché y eliminación individual verificados.");
