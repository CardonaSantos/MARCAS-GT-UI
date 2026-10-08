/** Contratos de las rutas legacy /categories respaldadas por Prisma Categoria. */
export interface Category {
  id: number;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
  productos?: Array<{ id: number; productoId: number; categoriaId: number }>;
}

export interface CategoryPayload {
  nombre: string;
}

export interface UpdateCategoryVariables {
  id: number;
  payload: CategoryPayload;
}

export interface DeleteCategoryVariables {
  id: number;
}
