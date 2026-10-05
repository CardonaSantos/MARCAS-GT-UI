import { Eye, PackageCheck, PackageMinus, XCircle } from "lucide-react";
import type { ReturnRouteState } from "@/features/common/navigation/route-state";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

import {
  formatDateTime,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  INVENTORY_RESERVATION_LABELS,
  INVENTORY_RESERVATION_TONES,
} from "../common/inventory.constants";
import type { InventoryReservation } from "../api/inventory.types";

interface InventoryReservationTableProps {
  data: InventoryReservation[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  canManage: boolean;
  toolbar?: React.ReactNode;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    pageCount: number;
    onPaginationChange: (pagination: PaginationState) => void;
  };
}

export function InventoryReservationTable({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  canManage,
  toolbar,
  pagination,
}: InventoryReservationTableProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.pathname + location.search;
  const routeState = location.state as ReturnRouteState | null;
  const listFrom =
    routeState?.listFrom ?? routeState?.from ?? "/marcas-gt/inventario/reservas";

  const go = (path: string) =>
    navigate(path, {
      state: { from: returnTo, listFrom },
    });

  const columns: ColumnDef<InventoryReservation, unknown>[] = [
    {
      accessorKey: "id",
      header: "Reserva",
      size: 90,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/inventario/reservas/" + row.original.id}
          state={{ from: returnTo, listFrom }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          #{row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "pedidoId",
      header: "Pedido",
      size: 95,
      cell: ({ row }) => "#" + row.original.pedidoId,
    },
    {
      id: "producto",
      header: "Producto",
      size: 210,
      meta: { grow: true },
      cell: ({ row }) => row.original.producto.nombre,
    },
    {
      id: "bodega",
      header: "Bodega",
      size: 170,
      cell: ({ row }) => row.original.bodega.nombre,
    },
    {
      accessorKey: "cantidadOriginal",
      header: "Original",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadOriginal),
    },
    {
      accessorKey: "cantidadPendiente",
      header: "Pendiente",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadPendiente),
    },
    {
      accessorKey: "cantidadAplicada",
      header: "Aplicada",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadAplicada),
    },
    {
      accessorKey: "cantidadLiberada",
      header: "Liberada",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadLiberada),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 135,
      cell: ({ row }) => (
        <AppBadge
          tone={INVENTORY_RESERVATION_TONES[row.original.estado]}
          size="xs"
        >
          {INVENTORY_RESERVATION_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "actualizadoEn",
      header: "Actualizada",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.actualizadoEn),
    },
    createAppRowActionsColumn<InventoryReservation>({
      actions: (row) => {
        const reservation = row.original;
        const canMutate = canManage && reservation.cantidadPendiente > 0;

        return [
          {
            label: "Ver detalle",
            icon: <Eye />,
            onClick: () =>
              go("/marcas-gt/inventario/reservas/" + reservation.id),
          },
          {
            label: "Aplicar reserva",
            icon: <PackageCheck />,
            hidden: !canMutate,
            separatorBefore: true,
            onClick: () =>
              go(
                "/marcas-gt/inventario/reservas/" +
                  reservation.id +
                  "/aplicar",
              ),
          },
          {
            label: "Liberar reserva",
            icon: <PackageMinus />,
            hidden: !canMutate,
            onClick: () =>
              go(
                "/marcas-gt/inventario/reservas/" +
                  reservation.id +
                  "/liberar",
              ),
          },
          {
            label: "Cancelar reserva",
            icon: <XCircle />,
            tone: "danger",
            hidden: !canMutate,
            onClick: () =>
              go(
                "/marcas-gt/inventario/reservas/" +
                  reservation.id +
                  "/cancelar",
              ),
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
      paginationMode={pagination ? "server" : "none"}
      pagination={pagination}
      stickyHeader
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      enableColumnPinning
      emptyTitle="Sin reservas"
      emptyDescription="No hay reservas de inventario para los filtros seleccionados."
    />
  );
}
