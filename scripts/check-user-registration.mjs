import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const types = read("src/features/usuarios/api/user.types.ts");
const schema = read("src/features/usuarios/schemas/user.schemas.ts");
const hook = read("src/features/usuarios/api/user.mutations.ts");
const form = read("src/components/Auth/CreateUser.tsx");
const app = read("src/App.tsx");
const usersPage = read("src/Pages/Users.tsx");

for (const role of ["ADMIN","VENDEDOR","BODEGA","CONTABILIDAD","REPARTIDOR"]) {
  assert.ok(types.includes(`"${role}"`), `Missing role ${role}`);
}
assert.ok(schema.includes('path: ["confirmarContrasena"]'));
assert.ok(hook.includes("API.useMutation<CreateUserResponse, CreateUserPayload>"));
assert.ok(hook.includes("marcasEndpoints.users.root"));
assert.ok(hook.includes("marcasQueryKeys.usuarios.all"));
assert.ok(form.includes("useAppFormHandlers"));
assert.ok(form.includes("AppFormSingleSelect"));
assert.ok(form.includes("empresaId,"));
assert.ok(!form.includes("setAuthSession"));
assert.ok(!form.includes("axios"));
assert.ok(!form.includes("empresaId: 1"));
assert.ok(/path="\/marcas-gt\/register"[\s\S]*?<ProtectedRouteAdmin>[\s\S]*?<CreateUser \/>/.test(app));
assert.ok(!app.includes('<Route path="/marcas-gt/register" element={<CreateUser />} />'));
assert.ok(usersPage.includes('to="/marcas-gt/register"'));
console.log("Registro validado: cinco roles, hook, empresa, sesión y ruta administrativa.");
