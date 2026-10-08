import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(path, "utf8");
const login = read("src/components/Auth/Login.tsx");
const schema = read("src/features/auth/schemas/login.schemas.ts");
const hook = read("src/features/auth/api/auth.mutations.ts");
const types = read("src/features/auth/api/auth.types.ts");
const endpoints = read("src/API/routes/endpoints.ts");
const app = read("src/App.tsx");

assert.ok(schema.includes("loginSchema"));
assert.ok(schema.includes("loginResponseSchema"));
assert.ok(schema.includes("correo:"));
assert.ok(schema.includes("contrasena:"));
assert.ok(hook.includes("API.useMutation<LoginResponse, LoginPayload>"));
assert.ok(hook.includes("marcasEndpoints.auth.login"));
assert.ok(endpoints.includes('login: "/auth/login"'));
assert.ok(login.includes("AppFormInput"));
assert.ok(login.includes("AppFormSubmit"));
assert.ok(login.includes("useAppFormHandlers"));
assert.ok(login.includes("loginResponseSchema.safeParse"));
assert.ok(login.includes("queryClient.clear()"));
assert.ok(login.includes("setAuthSession"));
assert.ok(login.includes("getLoginHome(usuario.rol)"));
assert.ok(!login.includes("axios"));
assert.ok(!login.includes("window.location.href"));
assert.ok(!login.includes("<Toaster"));
for (const role of ["ADMIN","VENDEDOR","BODEGA","CONTABILIDAD","REPARTIDOR"])
  assert.ok(types.includes(role + ': "/marcas-gt/'), "Missing role landing: " + role);
for (const path of ["/marcas-gt/dashboard", "/marcas-gt/dashboard-empleado"])
  assert.ok(app.includes('path="' + path + '"'), "Missing destination route: " + path);
console.log("Login comprobado: API hooks, formulario, rutas por rol, sesión y caché.");
