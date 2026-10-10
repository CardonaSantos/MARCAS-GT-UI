import type { CreateProductFormValues } from "../schemas/product.schemas";
import type { CatalogProduct, UpdateCatalogProductPayload } from "../api/catalog.types";

export function toCatalogProductForm(product: CatalogProduct): CreateProductFormValues {
  return {
    nombre: product.nombre,
    codigoProducto: product.codigoProducto,
    descripcion: product.descripcion ?? "",
    categoriaIds: product.categorias.map((category) => category.id),
    precio: String(product.precio),
    precioCosto: String(product.costoReferencia ?? 0),
  };
}

export function toCatalogUpdatePayload(values: CreateProductFormValues): UpdateCatalogProductPayload {
  return {
    nombre: values.nombre.trim(),
    codigoProducto: values.codigoProducto.trim(),
    descripcion: values.descripcion.trim(),
    precio: Number(values.precio),
    precioCosto: Number(values.precioCosto),
    categoriasIds: [...values.categoriaIds],
  };
}

/** Public ID de Cloudinary, exclusivamente desde URLs de Cloudinary. */
export function getCloudinaryPublicId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".cloudinary.com")) return null;
    const sections = url.pathname.split("/upload/");
    if (sections.length !== 2) return null;
    const parts = sections[1].split("/");
    const version = parts.findIndex((part) => /^v\d+$/.test(part));
    const remainder = version < 0 ? parts : parts.slice(version + 1);
    if (!remainder.length) return null;
    const last = remainder[remainder.length - 1];
    const dot = last.lastIndexOf(".");
    if (dot < 1) return null;
    remainder[remainder.length - 1] = last.slice(0, dot);
    return decodeURIComponent(remainder.join("/"));
  } catch {
    return null;
  }
}
