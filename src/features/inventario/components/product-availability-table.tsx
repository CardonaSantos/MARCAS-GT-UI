import { Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { formatInteger } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";
import type { ReturnRouteState } from "@/features/common/navigation/route-state";

import type { ProductAvailability } from "../api/inventory.types";

type AvailabilityRow = ProductAvailability["bodegas"][number];

export function ProductAvailabilityTable({
  data,
  canViewStockDetail,
}: {
  data: AvailabilityRow[];
  canViewStockDetail: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.pathname + location.search;
  const routeState = location.state as ReturnRouteState | null;
  const listFrom = routeState?.listFrom ?? routeState?.from ?? "/marcas-gt/inventario";

  const columns: ColumnDef<AvailabilityRow, unknown>[] = [
    {
      accessorKey: "codigo",
      header: "Código bodega",
      size: 130,
    },
    {
      accessorKey: "nombre",
      header: "Bodega",
      size: 220,
      meta: { grow: true },
    },
    {
      accessorKey: "real",
      header: "Real",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.real),
    },
    {
      accessorKey: "reservado",
      header: "Reservado",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.reservado),
    },
    {
      accessorKey: "disponible",
      header: "Disponible",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.disponible),
    },
    {
      accessorKey: "esPrincipal",
      header: "Principal",
      size: 100,
      cell: ({ row }) =>
        row.original.esPrincipal ? (
          <AppBadge tone="primary" size="xs">
            Principal
          </AppBadge>
        ) : (
          "—"
        ),
    },
  ];

  if (canViewStockDetail) {
    columns.push(
      createAppRowActionsColumn<AvailabilityRow>({
        actions: (row) => [
          {
            label: "Ver stock",
            icon: <Eye />,
            onClick: () =>
              navigate(
                "/marcas-gt/inventario/stocks/" + row.original.stockId,
                {
                  state: {
                    from: returnTo,
                    listFrom,
                  },
                },
              ),
          },
        ],
      }),
    );
  }

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.stockId)}
      paginationMode="none"
      density="xs"
      responsiveMode="scroll"
      stickyHeader
      emptyTitle="Sin disponibilidad"
      emptyDescription="Este producto todavía no tiene existencias registradas en bodegas."
    />
  );
}
