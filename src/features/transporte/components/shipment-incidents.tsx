import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import { useShipmentIncidents } from "../api/transport.queries";
import type { ShipmentIncident } from "../api/transport.types";
import {
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_SEVERITY_TONES,
  INCIDENT_STATE_LABELS,
  INCIDENT_STATE_TONES,
  INCIDENT_TYPE_LABELS,
} from "../common/transport.constants";

export function ShipmentIncidents({
  shipmentId,
  canResolve,
}: {
  shipmentId: number;
  canResolve: boolean;
}) {
  const query = useShipmentIncidents(shipmentId, { page: 1, limit: 50 });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.pathname + location.search;

  const columns: ColumnDef<ShipmentIncident, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 170,
      cell: ({ row }) => INCIDENT_TYPE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "severidad",
      header: "Severidad",
      size: 105,
      cell: ({ row }) => (
        <AppBadge
          tone={INCIDENT_SEVERITY_TONES[row.original.severidad]}
          size="xs"
        >
          {INCIDENT_SEVERITY_LABELS[row.original.severidad]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={INCIDENT_STATE_TONES[row.original.estado]} size="xs">
          {INCIDENT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      size: 320,
      meta: { grow: true },
    },
    {
      id: "reportadaPor",
      header: "Reportada por",
      size: 145,
      cell: ({ row }) => row.original.reportadaPor?.nombre ?? "—",
    },
    {
      accessorKey: "reportadaEn",
      header: "Reportada",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.reportadaEn),
    },
    {
      id: "resolucion",
      header: "Resolución",
      size: 240,
      meta: { grow: true },
      cell: ({ row }) => row.original.resolucion ?? "—",
    },
    createAppRowActionsColumn<ShipmentIncident>({
      actions: (row) => [
        {
          label: "Resolver incidencia",
          icon: <CheckCircle2 />,
          hidden: !canResolve || row.original.estado === "RESUELTA",
          onClick: () =>
            navigate(
              "/marcas-gt/transporte/envios/" +
                shipmentId +
                "/incidencias/" +
                row.original.id +
                "/resolver",
              { state: { from } },
            ),
        },
      ],
    }),
  ];

  return (
    <AppDataTable
      data={query.data?.data ?? []}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onRetry={() => void query.refetch()}
      paginationMode="none"
      density="xs"
      responsiveMode="scroll"
      emptyTitle="Sin incidencias"
      emptyDescription="El envío no tiene incidencias registradas."
    />
  );
}
