import type { Category } from "../api/category.types";

/** Verificación de duplicados en UI: el servidor legacy aún no exige unicidad. */
export function categoryNameExists(
  name: string,
  categories: readonly Category[],
  excludedId?: number,
): boolean {
  const normalized = name.trim();
  return categories.some(
    (category) =>
      category.id !== excludedId &&
      category.nombre.trim().localeCompare(normalized, "es", { sensitivity: "base" }) === 0,
  );
}

export function sortCategories(categories: readonly Category[]): Category[] {
  return [...categories].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }),
  );
}
