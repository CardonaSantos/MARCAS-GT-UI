/** Contrato de POST /product (CreateProductDto del backend actual). */
export interface CreateProductPayload {
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  categoriaIds: number[];
  precio: number;
  precioCosto: number;
  fotos: string[];
}

export interface CreatedProduct {
  id: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string | null;
  precio: number;
  costo: number | null;
  imagenes: Array<{ url: string; productoId: number }>;
}

export interface ProductCategory {
  id: number;
  nombre: string;
}
