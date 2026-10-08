import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const root = "src/features/productos/";
const page = read("src/Pages/CreateProduct.tsx");
const types = read(root + "api/product.types.ts");
const query = read(root + "api/product.queries.ts");
const mutation = read(root + "api/product.mutations.ts");
const schema = read(root + "schemas/product.schemas.ts");
const mapper = read(root + "common/product.mappers.ts");
const images = read(root + "common/use-product-images.ts");
const uploader = read(root + "components/product-image-uploader.tsx");
const fields = read(root + "components/product-form-fields.tsx");
const preview = read(root + "components/product-preview.tsx");
const routes = read("src/App.tsx");
const endpoints = read("src/API/routes/endpoints.ts");
const keys = read("src/API/queryKeys.ts");

for (const field of ["nombre", "codigoProducto", "descripcion", "categoriaIds", "precio", "precioCosto", "fotos"]) {
  assert.ok(types.includes(field + ":"), "Missing POST /product field: " + field);
  assert.ok(mapper.includes(field + ":"), "Mapper missing: " + field);
}
for (const token of [
  "createProductSchema", "categoriaIds: z.array(", "precio: money(",
  "precioCosto: money(", "emptyProductForm",
]) assert.ok(schema.includes(token), "Missing product schema: " + token);
assert.ok(query.includes("marcasEndpoints.categories.root"));
assert.ok(query.includes("marcasQueryKeys.categorias.list()"));
assert.ok(mutation.includes("API.useMutation<CreatedProduct, CreateProductPayload>"));
assert.ok(mutation.includes("marcasEndpoints.products.root"));
assert.ok(mutation.includes("marcasQueryKeys.productos.all"));
assert.ok(keys.includes("categorias: createQueryKeys"));
assert.ok(endpoints.includes('root: "/categories"'));
assert.ok(endpoints.includes('root: "/product"'));
assert.ok(images.includes("setImages"));
assert.ok(images.includes("cropProductImage"));
assert.ok(uploader.includes("useDropzone"));
assert.ok(uploader.includes("<Cropper"));
assert.ok(uploader.includes("controller.useOriginal"));
assert.ok(uploader.includes("controller.remove"));
assert.ok(fields.includes("AppFormMultiSelect"));
assert.ok(fields.includes("AppFormInput"));
assert.ok(preview.includes("useWatch"));
assert.ok(page.includes("AppFormSubmit"));
assert.ok(page.includes("ProductFormFields"));
assert.ok(page.includes("ProductImageUploader"));
assert.ok(page.includes("ProductPreview"));
assert.ok(page.includes("toCreateProductPayload(values, images.images)"));
assert.ok(page.includes("await createProduct.mutateAsync"));
assert.ok(page.indexOf("await createProduct.mutateAsync") < page.indexOf("handlers.reset(emptyProductForm);\n      images.reset();"));
assert.ok(!page.includes("axios"));
assert.ok(!page.includes("VITE_API_URL"));
assert.ok(routes.includes('path="/marcas-gt/crear-productos"'));
assert.ok(read("src/Pages/ViewProducts.tsx").includes('from "./Tools/cropImage"'),
  "Keep legacy image tool import usable until editing view is migrated.");
console.log("Crear producto: endpoint, contrato, categorías, imágenes, formularios y ruta verificados.");
