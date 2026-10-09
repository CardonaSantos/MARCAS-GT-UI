import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { RotateCcw } from "lucide-react";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import { useProductCategories } from "../api/product.queries";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { ProductCatalogFilters } from "../api/catalog.types";

interface Props {
  filters: ProductCatalogFilters;
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onSearch: (value: string) => void;
  onFilter: (key: "categoriaId" | "bodegaId" | "conExistencia", value: number | boolean | null) => void;
  onPrice: (min: number | undefined, max: number | undefined) => void;
  onReset: () => void;
}

const availabilityOptions = [
  { value: "all", label: "Todos" },
  { value: "yes", label: "Con existencias" },
  { value: "no", label: "Sin existencias" },
];

const labelStyle = "mb-1 block text-xs font-medium text-[hsl(var(--app-muted-foreground))]";
const validMoney = (s: string) => s === "" || /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(s);

export function ProductCatalogFilters({
  filters, searchDraft, onSearchDraftChange, onSearch,
  onFilter, onPrice, onReset,
}: Props) {
  const categories = useProductCategories();
  const warehouses = useBodegaSelectables();
  const [min, setMin] = useState(filters.precioMin === undefined ? "" : String(filters.precioMin));
  const [max, setMax] = useState(filters.precioMax === undefined ? "" : String(filters.precioMax));
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    setMin(filters.precioMin === undefined ? "" : String(filters.precioMin));
    setMax(filters.precioMax === undefined ? "" : String(filters.precioMax));
    setPriceError("");
  }, [filters.precioMin, filters.precioMax]);

  const submitPrices = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validMoney(min) || !validMoney(max)) {
      setPriceError("Utiliza importes positivos con hasta 2 decimales.");
      return;
    }
    if (min && max && Number(min) > Number(max)) {
      setPriceError("El precio mínimo no puede superar al máximo.");
      return;
    }
    setPriceError("");
    onPrice(min ? Number(min) : undefined, max ? Number(max) : undefined);
  };

  const active = Boolean(filters.search || filters.categoriaId || filters.bodegaId ||
    filters.conExistencia !== undefined || filters.precioMin !== undefined || filters.precioMax !== undefined);

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">Filtrar catálogo</span>
        <AppButton type="button" size="sm" variant="secondary" leftIcon={<RotateCcw />}
          disabled={!active} onClick={() => { setMin(""); setMax(""); setPriceError(""); onReset(); }}>
          Limpiar filtros
        </AppButton>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0 sm:col-span-2 xl:col-span-1">
          <label className={labelStyle} htmlFor="catalog-search">Nombre, código o descripción</label>
          <AppSearchInput
            id="catalog-search"
            value={searchDraft}
            onValueChange={onSearchDraftChange}
            onDebouncedChange={onSearch}
            placeholder="Buscar producto..."
          />
        </div>
        <div className="min-w-0">
          <label className={labelStyle} htmlFor="catalog-category">Categoría</label>
          <AppSingleSelect<number>
            inputId="catalog-category"
            options={(categories.data ?? []).map((c) => ({ value: c.id, label: c.nombre }))}
            isLoading={categories.isLoading}
            value={filters.categoriaId ?? null}
            onChange={(value) => onFilter("categoriaId", value)}
            placeholder="Todas las categorías"
            noOptionsText="No hay categorías"
          />
        </div>
        <div className="min-w-0">
          <label className={labelStyle} htmlFor="catalog-warehouse">Bodega</label>
          <AppSingleSelect<number>
            inputId="catalog-warehouse"
            options={(warehouses.data ?? []).map((b) => ({
              value: b.id, label: b.nombre,
            }))}
            isLoading={warehouses.isLoading}
            value={filters.bodegaId ?? null}
            onChange={(value) => onFilter("bodegaId", value)}
            placeholder="Todas las bodegas"
            noOptionsText="No hay bodegas"
          />
        </div>
        <div className="min-w-0">
          <label className={labelStyle} htmlFor="catalog-availability">Existencias físicas</label>
          <AppSingleSelect
            inputId="catalog-availability"
            options={availabilityOptions}
            value={filters.conExistencia === undefined
              ? "all" : filters.conExistencia ? "yes" : "no"}
            onChange={(value) => onFilter("conExistencia", value === "yes" ? true : value === "no" ? false : null)}
            isClearable={false}
            isSearchable={false}
          />
        </div>
      </div>

      <form onSubmit={submitPrices} className="flex flex-wrap items-end gap-2">
        <div className="w-full min-w-0 sm:w-40">
          <label className={labelStyle} htmlFor="catalog-price-min">Precio desde (Q)</label>
          <AppInput id="catalog-price-min" inputMode="decimal"
            value={min} placeholder="0.00" onChange={(e) => setMin(e.target.value)} />
        </div>
        <div className="w-full min-w-0 sm:w-40">
          <label className={labelStyle} htmlFor="catalog-price-max">Precio hasta (Q)</label>
          <AppInput id="catalog-price-max" inputMode="decimal"
            value={max} placeholder="Sin límite" onChange={(e) => setMax(e.target.value)} />
        </div>
        <AppButton type="submit" size="sm" variant="secondary">Aplicar precios</AppButton>
        {priceError ? <p className="text-xs text-red-500" role="alert">{priceError}</p> : null}
      </form>
      {(categories.isError || warehouses.isError) ? (
        <p className="text-xs text-red-500" role="alert">
          No se pudieron cargar todas las opciones de filtro. Actualiza la página.
        </p>
      ) : null}
    </div>
  );
}
