import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const prefix = "src/features/prospectos/";
const page = read("src/Pages/ProspectoFormulario.tsx");
const api = read("src/API/routes/endpoints.ts");
const keys = read("src/API/queryKeys.ts");
const schema = read(prefix + "schemas/prospect.schemas.ts");
const queries = read(prefix + "api/prospect.queries.ts");
const mutations = read(prefix + "api/prospect.mutations.ts");
const mappers = read(prefix + "common/prospect.mappers.ts");
const identity = read(prefix + "components/prospect-identity-fields.tsx");
const location = read(prefix + "components/prospect-location-fields.tsx");
const commercial = read(prefix + "components/prospect-commercial-fields.tsx");
const app = read("src/App.tsx");
assert.ok(app.includes('path="/marcas-gt/prospecto"'));
assert.ok(app.includes("<ProspectoFormulario />"));
for (const endpoint of ["/prospecto/jornada/abierto", "/prospecto/jornada",
  "/finalizar", "/cancelar"]) assert.ok(api.includes(endpoint));
assert.ok(keys.includes('prospectos: createQueryKeys("prospectos")'));
assert.ok(queries.includes("API.useQuery<ProspectRecord | null>"));
assert.ok(queries.includes("emptyResponseValue: null"),
  "Una respuesta vacía del prospecto abierto debe convertirse en null.");
const apiHooks = read("src/API/createApiHooks.ts");
assert.ok(apiHooks.includes("emptyResponseValue?: TQueryFnData"));
assert.ok(apiHooks.includes("result === undefined && emptyResponseValue !== undefined"));

for (const mutation of ["useStartProspect", "useFinishProspect", "useCancelProspect"])
  assert.ok(mutations.includes(mutation));
assert.ok(mutations.includes("marcasQueryKeys.prospectos.all"));
assert.ok(schema.includes("prospectStartSchema"));
assert.ok(schema.includes("prospectFinishSchema"));
assert.ok(schema.includes("coordenadas: gps"));
assert.ok(mappers.includes("toProspectForm"));
assert.ok(mappers.includes("toStartPayload"));
assert.ok(mappers.includes("toFinishPayload"));
assert.ok(identity.includes("AppFormInput"));
assert.ok(location.includes("AppFormSingleSelect"));
assert.ok(location.includes('setValue("municipioId", 0'));
assert.ok(location.includes("navigator.geolocation.getCurrentPosition"));
assert.ok(commercial.includes("AppFormMultiSelect"));
assert.ok(page.includes("AppForm"));
assert.ok(page.includes("AppFormSubmit"));
assert.ok(page.includes("AppConfirmDialog"));
assert.ok(page.includes("prospectFinishSchema.safeParse"));
assert.ok(page.includes("useOpenProspect"));
assert.ok(page.includes("useStartProspect"));
assert.ok(page.includes("useFinishProspect"));
assert.ok(page.includes("useCancelProspect"));
assert.ok(!page.includes("axios"));
assert.ok(!page.includes("jwtDecode"));
assert.ok(!page.includes("window.location.reload"));
assert.ok(!page.includes("localStorage"));
assert.ok(!page.includes("new Date().toLocaleString(\"es-GT\","));
console.log("Prospectos: ciclo de vida autenticado, validaciones, formularios, GPS y rutas correctas.");
