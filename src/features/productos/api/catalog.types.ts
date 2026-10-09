/** Contrato de GET /product/catalogo y /product/catalogo/:id. */
export type CatalogSortField =
  | "nombre" | "codigoProducto" | "precio" | "costo" | "creadoEn" | "actualizadoEn";
export type SortDirection = "asc" | "desc";

export interface ProductCatalogFilters {
  page: number;
  limit: number;
  search?: string;
  categoriaId?: number;
  bodegaId?: number;
  conExistencia?: boolean;
  precioMin?: number;
  precioMax?: number;
  sortBy: CatalogSortField;
  sortDir: SortDirection;
}
export interface ProductCatalogStock {
  stockId: number;
  bodega: { id: number; codigo: string; nombre: string; esPrincipal: boolean; activo: boolean };
  real: number;
  reservado: number;
  disponible: number;
  costoPromedio: string;
  actualizadoEn: string;
}
export interface CatalogProduct {
  id: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string | null;
  precio: number;
  costoReferencia: number | null;
  categorias: Array<{ id: number; nombre: string }>;
  imagenes: Array<{ id: number; url: string }>;
  imagenPrincipal: string | null;
  perfilFiscal: {
    bienOServicio: "BIEN" | "SERVICIO";
    unidadMedida: string;
    descripcionFiscal: string | null;
    activo: boolean;
  } | null;
  inventario: {
    fuente: "STOCK_BODEGA";
    totales: { real: number; reservado: number; disponible: number };
    bodegas: ProductCatalogStock[];
  };
  stockLegacy: {
    fuente: "STOCK_LEGACY";
    cantidad: number;
    proveedorId: number | null;
    diferenciaConInventarioReal: number;
  } | null;
  creadoEn: string;
  actualizadoEn: string;
}
export interface CatalogMovement {
  id: number;
  tipo: string;
  cantidad: number;
  creadoEn: string;
  costoUnitario: string | null;
  bodega: { id: number; codigo: string; nombre: string };
  proveedor: { id: number; nombre: string } | null;
  referencia: { tipo: string; id: number } | null;
}
export interface CatalogProductDetail extends CatalogProduct {
  ingresosRecientes: CatalogMovement[];
  movimientosRecientes: CatalogMovement[];
}
export interface ProductCatalogPage {
  data: CatalogProduct[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface UpdateCatalogProductPayload {
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precio: number;
  precioCosto: number;
  /** El PATCH legacy del servidor usa categoriasIds (plural). */
  categoriasIds: number[];
}
export interface UpdateCatalogProductVariables {
  id: number;
  payload: UpdateCatalogProductPayload;
}
export interface ProductImagesVariables {
  id: number;
  images: string[];
}
export interface DeleteProductImageVariables {
  productId: number;
  imageId: number;
  publicId: string;
}
