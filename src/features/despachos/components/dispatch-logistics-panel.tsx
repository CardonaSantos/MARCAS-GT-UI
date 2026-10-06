import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type { DispatchDetail } from "../api/dispatch.types";

type Shipment = DispatchDetail["envios"][number];
type Delivery = DispatchDetail["entregas"][number];

export function DispatchLogisticsPanel({
  dispatch,
}: {
  dispatch: DispatchDetail;
}) {
  const shipmentColumns: ColumnDef<Shipment, unknown>[] = [
    {
      accessorKey: "id",
      header: "Envío",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 130,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "guia",
      header: "Guía",
      size: 150,
      cell: ({ row }) => row.original.guia ?? "—",
    },
    {
      accessorKey: "salidaEn",
      header: "Salida",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.salidaEn),
    },
    {
      accessorKey: "completadoEn",
      header: "Completado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.completadoEn),
    },
  ];

  const deliveryColumns: ColumnDef<Delivery, unknown>[] = [
    {
      accessorKey: "id",
      header: "Entrega",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 130,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "receptorNombre",
      header: "Receptor",
      size: 180,
      meta: { grow: true },
      cell: ({ row }) => row.original.receptorNombre ?? "—",
    },
    {
      accessorKey: "entregadoEn",
      header: "Entregado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.entregadoEn),
    },
  ];

  return (
    <AppStack gap="md">
      <AppCard title="Envíos" size="sm">
        <AppDataTable
          data={dispatch.envios}
          columns={shipmentColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin envíos"
          emptyDescription="Transporte todavía no ha generado un envío."
        />
      </AppCard>

      <AppCard title="Entregas" size="sm">
        <AppDataTable
          data={dispatch.entregas}
          columns={deliveryColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin entregas"
          emptyDescription="Todavía no hay entregas asociadas a esta orden."
        />
      </AppCard>
    </AppStack>
  );
}
