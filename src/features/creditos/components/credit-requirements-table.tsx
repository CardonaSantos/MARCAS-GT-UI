import { ClipboardCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  CREDIT_REQUIREMENT_STATE_LABELS,
  CREDIT_REQUIREMENT_STATE_TONES,
} from "../common/credit.constants";
import type { CreditRequirement } from "../api/credit.types";

export function CreditRequirementsTable({
  creditId,
  data,
  canReview,
}: {
  creditId: number;
  data: CreditRequirement[];
  canReview: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const columns: ColumnDef<CreditRequirement, unknown>[] = [
    {
      accessorKey: "codigo",
      header: "Código",
      size: 120,
    },
    {
      accessorKey: "nombre",
      header: "Requisito",
      size: 220,
      meta: { grow: true },
    },
    {
      accessorKey: "obligatorio",
      header: "Obligatorio",
      size: 105,
      cell: ({ row }) => (row.original.obligatorio ? "Sí" : "No"),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 120,
      cell: ({ row }) => (
        <AppBadge
          tone={CREDIT_REQUIREMENT_STATE_TONES[row.original.estado]}
          size="xs"
        >
          {CREDIT_REQUIREMENT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "observaciones",
      header: "Observaciones",
      size: 240,
      meta: { grow: true, truncate: false },
      cell: ({ row }) => row.original.observaciones ?? "—",
    },
    {
      id: "revisadoPor",
      header: "Revisado por",
      size: 155,
      cell: ({ row }) => row.original.revisadoPor?.nombre ?? "—",
    },
    {
      accessorKey: "revisadoEn",
      header: "Revisado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.revisadoEn),
    },
    createAppRowActionsColumn<CreditRequirement>({
      actions: (row) => [
        {
          label: "Revisar requisito",
          icon: <ClipboardCheck />,
          hidden: !canReview,
          onClick: () =>
            navigate(
              "/marcas-gt/creditos/solicitudes/" +
                creditId +
                "/requisitos/" +
                row.original.id +
                "/revisar",
              { state: { from: returnTo } },
            ),
        },
      ],
    }),
  ];

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      paginationMode="none"
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      emptyTitle="Sin requisitos"
      emptyDescription="La solicitud no tiene requisitos asociados."
    />
  );
}
