import { useMemo, useState } from "react";
import { Pencil, RefreshCw, Tags, Trash2 } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppEmptyState } from "@/ui/components/app/primitives/app-empty-state";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";

import type { Category } from "../api/category.types";
import { sortCategories } from "../common/category.utils";

interface CategoryListProps {
  categories: readonly Category[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryList({
  categories,
  isLoading,
  isError,
  isFetching,
  onRetry,
  onEdit,
  onDelete,
}: CategoryListProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    return sortCategories(categories).filter((item) =>
      item.nombre.toLocaleLowerCase("es").includes(term),
    );
  }, [categories, search]);

  return (
    <AppCard
      title="Categorías registradas"
      icon={<Tags />}
      size="sm"
      action={
        <AppButton
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Actualizar categorías"
          title="Actualizar categorías"
          loading={isFetching}
          disabled={isFetching}
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" />
        </AppButton>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <AppSearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar categoría"
            aria-label="Buscar categoría"
            wrapperClassName="min-w-[200px] flex-1"
          />
          <span className="text-xs tabular-nums text-[hsl(var(--app-muted-foreground))]">
            {filtered.length} de {categories.length}
          </span>
        </div>

        {isLoading ? (
          <p role="status" className="py-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]">
            Cargando categorías...
          </p>
        ) : isError ? (
          <AppEmptyState
            preset="error"
            title="No se pudieron cargar las categorías"
            action={
              <AppButton variant="secondary" size="sm" onClick={onRetry}>
                Reintentar
              </AppButton>
            }
          />
        ) : filtered.length === 0 ? (
          <AppEmptyState
            preset={search ? "search" : "empty"}
            title={search ? "Sin coincidencias" : "Sin categorías registradas"}
          />
        ) : (
          <ul role="list" aria-label="Categorías" className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
            {filtered.map((category) => (
              <li
                key={category.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-[hsl(var(--app-border))] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium" title={category.nombre}>
                    {category.nombre}
                  </p>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    {category.productos
                      ? `${category.productos.length} productos asociados`
                      : "Categoría de producto"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="iconSm"
                    aria-label={`Editar categoría ${category.nombre}`}
                    title="Editar categoría"
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </AppButton>
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="iconSm"
                    aria-label={`Eliminar categoría ${category.nombre}`}
                    title="Eliminar categoría"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="h-4 w-4 text-[hsl(var(--app-danger))]" />
                  </AppButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppCard>
  );
}
