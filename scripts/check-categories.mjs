import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const root = "src/features/categorias/";
const page = read("src/Pages/CrearCategoria.tsx");
const types = read(root + "api/category.types.ts");
const schema = read(root + "schemas/category.schemas.ts");
const query = read(root + "api/category.queries.ts");
const mutations = read(root + "api/category.mutations.ts");
const utils = read(root + "common/category.utils.ts");
const fields = read(root + "components/category-form-fields.tsx");
const list = read(root + "components/category-list.tsx");
const edit = read(root + "components/category-edit-dialog.tsx");
const deletion = read(root + "components/category-delete-dialog.tsx");
const endpoint = read("src/API/routes/endpoints.ts");
const keys = read("src/API/queryKeys.ts");
const productQuery = read("src/features/productos/api/product.queries.ts");
const routes = read("src/App.tsx");

assert.ok(types.includes("interface CategoryPayload"));
assert.ok(types.includes("productos?: Array<"), "Category list should know associations");
assert.ok(schema.includes('nombre: z.string()'));
assert.ok(schema.includes('.trim()'));
assert.ok(query.includes("marcasEndpoints.categories.root"));
assert.ok(query.includes("marcasQueryKeys.categorias.list()"));
assert.ok(productQuery.includes("marcasQueryKeys.categorias.list()"),
  "Creation form and categories screen must share the query key.");
assert.ok(productQuery.includes("marcasEndpoints.categories.root"),
  "Creation form and categories screen must share the GET endpoint.");
assert.ok(mutations.includes("useCreateCategory"));
assert.ok(mutations.includes("useUpdateCategory"));
assert.ok(mutations.includes("useDeleteCategory"));
for (const method of ['method: "POST"', 'method: "PATCH"', 'method: "DELETE"']) {
  assert.ok(mutations.includes(method), "Missing category method: " + method);
}
assert.ok(mutations.includes("marcasQueryKeys.categorias.all"));
assert.ok(mutations.includes("marcasQueryKeys.productos.all"));
assert.ok(endpoint.includes('root: "/categories"'));
assert.ok(endpoint.includes('detail: (id: number) => `/categories/${id}`'));
assert.ok(utils.includes("categoryNameExists"));
assert.ok(fields.includes("AppFormInput<CategoryFormValues>"));
assert.ok(list.includes("AppSearchInput"));
assert.ok(list.includes("AppEmptyState"));
assert.ok(edit.includes("AppDialog"));
assert.ok(edit.includes("AppFormSubmit<CategoryFormValues>"));
assert.ok(edit.includes("categoryNameExists"));
assert.ok(deletion.includes("AppConfirmDialog"));
assert.ok(deletion.includes("productos asociados"));
assert.ok(page.includes("CategoryList"));
assert.ok(page.includes("CategoryEditDialog"));
assert.ok(page.includes("CategoryDeleteDialog"));
assert.ok(page.includes("AppForm"));
assert.ok(page.includes("await createCategory.mutateAsync"));
assert.ok(page.indexOf("await createCategory.mutateAsync") < page.indexOf("handlers.reset(emptyCategoryForm)"));
assert.ok(!page.includes("axios"));
assert.ok(!page.includes("VITE_API_URL"));
assert.ok(routes.includes('path="/marcas-gt/crear-categoria"'));
assert.ok(routes.includes("<CrearCategoria />"));
console.log("Categorías: CRUD, validación, etiquetas, relaciones, caché y ruta verificadas.");
