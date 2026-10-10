import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Eye, Pencil, Warehouse } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { formatInteger, formatMoney } from "@/features/common/formatters/value.formatters";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import placeholder from "@/assets/images/placeholder.jpg";
import type { CatalogProduct } from "../api/catalog.types";

interface Props {
  data: CatalogProduct[];
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
  onDetail: (id: number) => void;
  onEdit: (id: number) => void;
  sorting: SortingState;
  onSortingChange: (value: SortingState) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (value: PaginationState) => void;
  };
  toolbar: React.ReactNode;
}

export function ProductCatalogTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;
  const columns: ColumnDef<CatalogProduct, unknown>[] = [
    {
      id: "imagen",
      header: "Foto",
      size: 72,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center py-1">
          <img
            src={row.original.imagenPrincipal || placeholder}
            alt={`Producto ${row.original.nombre}`}
            className="h-9 w-9 shrink-0 rounded-md border border-[hsl(var(--app-border))] object-contain"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      accessorKey: "nombre",
      header: "Producto",
      size: 230,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) => (
        <button type="button" onClick={() => props.onDetail(row.original.id)}
          className="block min-w-0 text-left hover:underline">
          <span className="block truncate font-medium text-[hsl(var(--app-primary))]">
            {row.original.nombre}
          </span>
        </button>
      ),
    },
    {
      id: "codigoProducto",
      header: "Código",
      size: 120,
      enableSorting: true,
      cell: ({ row }) => row.original.codigoProducto,
    },
    {
      id: "categorias",
      header: "Categorías",
      size: 185,
      enableSorting: false,
      cell: ({ row }) => row.original.categorias.map((c) => c.nombre).join(", ") || "—",
    },
    {
      accessorKey: "precio",
      header: "Venta",
      size: 105,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.precio),
    },
    {
      id: "costo",
      header: "Costo ref.",
      size: 110,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => row.original.costoReferencia === null
        ? "—" : formatMoney(row.original.costoReferencia),
    },
    {
      id: "disponible",
      header: "Disponible",
      size: 105,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className={row.original.inventario.totales.disponible > 0
          ? "font-semibold tabular-nums" : "text-[hsl(var(--app-muted-foreground))] tabular-nums"}>
          {formatInteger(row.original.inventario.totales.disponible)}
        </span>
      ),
    },
    {
      id: "reservado",
      header: "Reservado",
      size: 95,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.inventario.totales.reservado),
    },
    {
      id: "bodegas",
      header: "Bodegas",
      size: 95,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(
        row.original.inventario.bodegas.filter((stock) => stock.real > 0).length,
      ),
    },
    createAppRowActionsColumn<CatalogProduct>({
      actions: (row) => [
        {
          label: "Ver ficha",
          icon: <Eye />,
          onClick: () => props.onDetail(row.original.id),
        },
        {
          label: "Editar producto e imágenes",
          icon: <Pencil />,
          onClick: () => props.onEdit(row.original.id),
        },
        {
          label: "Disponibilidad y kardex",
          icon: <Warehouse />,
          onClick: () => navigate(
            "/marcas-gt/inventario/productos/" + row.original.id,
            { state: { from: returnTo } },
          ),
        },
      ],
    }),
  ];

  return (
    <AppDataTable<CatalogProduct>
      data={props.data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.error}
      onRetry={props.onRetry}
      sorting={props.sorting}
      onSortingChange={props.onSortingChange}
      enableSorting
      manualSorting
      paginationMode="server"
      pagination={props.pagination}
      stickyHeader
      density="sm"
      responsiveMode="cards"
      enableColumnVisibility
      enableColumnPinning
      toolbar={props.toolbar}
      emptyTitle="Sin productos"
      emptyDescription="No se encontraron productos con los filtros seleccionados."
      renderMobileCard={(row) => {
        const product = row.original;
        return (
          <div className="space-y-2 rounded-lg border border-[hsl(var(--app-border))] p-3">
            <div className="flex items-center gap-3">
              <img src={product.imagenPrincipal || placeholder} alt=""
                className="h-14 w-14 rounded-md object-contain" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.nombre}</p>
                <p className="truncate text-xs text-[hsl(var(--app-muted-foreground))]">{product.codigoProducto}</p>
                <p className="text-xs">{formatMoney(product.precio)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span>Disponible: <strong>{product.inventario.totales.disponible}</strong></span>
              <span>Reservado: {product.inventario.totales.reservado}</span>
              <span>Bodegas: {product.inventario.bodegas.filter((s) => s.real > 0).length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <AppButton type="button" size="sm" variant="secondary"
                leftIcon={<Eye />} onClick={() => props.onDetail(product.id)}>
                Ver ficha
              </AppButton>
              <AppButton type="button" size="sm" variant="outline"
                leftIcon={<Pencil />} onClick={() => props.onEdit(product.id)}>
                Editar
              </AppButton>
              <AppButton asChild size="sm" variant="ghost">
                <Link to={`/marcas-gt/inventario/productos/${product.id}`}>Inventario</Link>
              </AppButton>
            </div>
          </div>
        );
      }}
    />
  );
}
