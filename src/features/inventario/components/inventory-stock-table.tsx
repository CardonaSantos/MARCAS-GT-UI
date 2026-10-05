import { Eye, PackageSearch, PencilLine, RotateCcw, Truck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { InventoryStockListItem } from "../api/inventory.types";

interface InventoryStockTableProps {
  data: InventoryStockListItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  canManage: boolean;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
  toolbar?: React.ReactNode;
}

export function InventoryStockTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  canManage,
  sorting,
  onSortingChange,
  pagination,
  toolbar,
}: InventoryStockTableProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.pathname + location.search;

  const go = (path: string) =>
    navigate(path, {
      state: { from: returnTo },
    });

  const columns: ColumnDef<InventoryStockListItem, unknown>[] = [
    {
      id: "codigoProducto",
      header: "Código",
      size: 125,
      enableSorting: true,
      cell: ({ row }) => row.original.producto.codigo,
    },
    {
      id: "producto",
      header: "Producto",
      size: 220,
      enableSorting: true,
      meta: { grow: true },
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/inventario/productos/" + row.original.producto.id}
          state={{ from: returnTo }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring))]"
        >
          {row.original.producto.nombre}
        </Link>
      ),
    },
    {
      id: "bodega",
      header: "Bodega",
      size: 180,
      enableSorting: true,
      cell: ({ row }) => row.original.bodega.nombre,
    },
    {
      accessorKey: "cantidadReal",
      header: "Real",
      size: 95,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatInteger(row.original.cantidadReal)}
        </span>
      ),
    },
    {
      accessorKey: "cantidadReservada",
      header: "Reservado",
      size: 105,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatInteger(row.original.cantidadReservada)}
        </span>
      ),
    },
    {
      accessorKey: "cantidadDisponible",
      header: "Disponible",
      size: 105,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatInteger(row.original.cantidadDisponible)}
        </span>
      ),
    },
    {
      accessorKey: "costoPromedio",
      header: "Costo promedio",
      size: 125,
      enableSorting: true,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.costoPromedio),
    },
    {
      accessorKey: "valorInventario",
      header: "Valor",
      size: 125,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.valorInventario),
    },
    {
      accessorKey: "actualizadoEn",
      header: "Actualizado",
      size: 150,
      enableSorting: true,
      cell: ({ row }) => formatDateTime(row.original.actualizadoEn),
    },
    createAppRowActionsColumn<InventoryStockListItem>({
      actions: (row) => {
        const stock = row.original;
        const baseQuery =
          "?bodegaId=" +
          stock.bodega.id +
          "&productoId=" +
          stock.producto.id;

        return [
          {
            label: "Ver detalle de stock",
            icon: <Eye />,
            onClick: () =>
              go("/marcas-gt/inventario/stocks/" + stock.id),
          },
          {
            label: "Disponibilidad / kardex",
            icon: <PackageSearch />,
            onClick: () =>
              go("/marcas-gt/inventario/productos/" + stock.producto.id),
          },
          {
            label: "Registrar entrada",
            icon: <Truck />,
            hidden: !canManage,
            separatorBefore: true,
            onClick: () =>
              go("/marcas-gt/inventario/entradas/nueva" + baseQuery),
          },
          {
            label: "Registrar ajuste",
            icon: <PencilLine />,
            hidden: !canManage,
            onClick: () =>
              go("/marcas-gt/inventario/ajustes/nuevo" + baseQuery),
          },
          {
            label: "Registrar devolución",
            icon: <RotateCcw />,
            hidden: !canManage,
            onClick: () =>
              go("/marcas-gt/inventario/devoluciones/nueva" + baseQuery),
          },
        ];
      },
    }),
  ];

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetry}
      toolbar={toolbar}
      enableSorting
      manualSorting
      sorting={sorting}
      onSortingChange={onSortingChange}
      paginationMode="server"
      pagination={pagination}
      stickyHeader
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      enableColumnPinning
      emptyTitle="No hay existencias"
      emptyDescription="No se encontraron registros de inventario con los filtros seleccionados."
    />
  );
}
