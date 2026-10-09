import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const root = "src/features/clientes/";
const page = read("src/Pages/CreateClient.tsx");
const routes = read("src/App.tsx");
const api = read("src/API/routes/endpoints.ts");
const schema = read(root + "schemas/customer.schemas.ts");
const types = read(root + "api/customer.types.ts");
const queries = read(root + "api/customer-location.queries.ts");
const mutations = read(root + "api/customer.mutations.ts");
const mapper = read(root + "common/customer.mappers.ts");
const identity = read(root + "components/customer-identity-fields.tsx");
const location = read(root + "components/customer-location-fields.tsx");
const commercial = read(root + "components/customer-commercial-fields.tsx");
const preferences = read(root + "components/customer-preferences-fields.tsx");

for (const field of [
  "nombre", "apellido", "correo", "telefono", "direccion", "departamentoId",
  "municipioId", "tipoCliente", "categoriasInteres", "volumenCompra",
  "presupuestoMensual", "preferenciaContacto", "comentarios", "descuentoInicial",
]) {
  assert.ok(schema.includes(field + ":"), "Missing schema field: " + field);
  assert.ok(types.includes(field), "Missing API field: " + field);
}
assert.ok(types.includes("latitud?: number"));
assert.ok(types.includes("longitud?: number"));
assert.ok(schema.includes("coordenadas: coordinates"));
assert.ok(schema.includes(".superRefine("));
assert.ok(mapper.includes("toCreateCustomerPayload"));
assert.ok(mapper.includes("split"));
assert.ok(mapper.includes("Number(values.descuentoInicial) > 0"));
assert.ok(!mapper.includes("municipio: values."));
assert.ok(api.includes('departments: "/customer-location/get-departamentos"'));
assert.ok(api.includes('/customer-location/get-municipios/'));
assert.ok(queries.includes("API.useQuery<CustomerDepartment[]>"));
assert.ok(queries.includes("API.useQuery<CustomerMunicipality[]>"));
assert.ok(queries.includes("enabled: departmentId > 0"));
assert.ok(mutations.includes("API.useMutation<CreatedCustomer, CreateCustomerPayload>"));
assert.ok(mutations.includes("marcasEndpoints.customers.root"));
assert.ok(mutations.includes("marcasQueryKeys.clientes.all"));
assert.ok(identity.includes("AppFormInput<CustomerFormValues>"));
assert.ok(location.includes("AppFormSingleSelect<CustomerFormValues, number>"));
assert.ok(location.includes('setValue("municipioId", 0'));
assert.ok(commercial.includes("AppFormMultiSelect<CustomerFormValues, string>"));
assert.ok(preferences.includes("AppFormTextarea<CustomerFormValues>"));
assert.ok(page.includes("CustomerIdentityFields"));
assert.ok(page.includes("CustomerLocationFields"));
assert.ok(page.includes("CustomerCommercialFields"));
assert.ok(page.includes("CustomerPreferencesFields"));
assert.ok(page.includes("zodResolver(customerSchema)"));
assert.ok(page.includes("AppFormSubmit"));
assert.ok(page.includes("await createCustomer.mutateAsync(toCreateCustomerPayload(values))"));
assert.ok(page.indexOf("await createCustomer.mutateAsync") < page.indexOf("handlers.reset(emptyCustomerForm)"));
assert.ok(!page.includes("axios"));
assert.ok(!page.includes("window.location.reload"));
assert.ok(!page.includes("VITE_API_URL"));
assert.ok(routes.includes('path="/marcas-gt/crear-cliente"'));
assert.ok(routes.includes("<CreateClient />"));
console.log("Crear cliente: contrato, validaciones, ubicación dependiente, formulario y ruta verificadas.");
