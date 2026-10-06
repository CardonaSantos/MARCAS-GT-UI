import { Pencil, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  CREDIT_REFERENCE_RESULT_LABELS,
  CREDIT_REFERENCE_RESULT_TONES,
  CREDIT_REFERENCE_TYPE_LABELS,
} from "../common/credit.constants";
import type { CreditReference } from "../api/credit.types";

export function CreditReferencesTable({
  creditId,
  data,
  canEdit,
  canReview,
}: {
  creditId: number;
  data: CreditReference[];
  canEdit: boolean;
  canReview: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const columns: ColumnDef<CreditReference, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 110,
      cell: ({ row }) => CREDIT_REFERENCE_TYPE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      size: 180,
      meta: { grow: true },
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      size: 130,
    },
    {
      accessorKey: "relacion",
      header: "Relación",
      size: 145,
      cell: ({ row }) => row.original.relacion ?? "—",
    },
    {
      accessorKey: "resultado",
      header: "Resultado",
      size: 125,
      cell: ({ row }) => (
        <AppBadge
          tone={CREDIT_REFERENCE_RESULT_TONES[row.original.resultado]}
          size="xs"
        >
          {CREDIT_REFERENCE_RESULT_LABELS[row.original.resultado]}
        </AppBadge>
      ),
    },
    {
      id: "verificadoPor",
      header: "Revisado por",
      size: 150,
      cell: ({ row }) => row.original.verificadoPor?.nombre ?? "—",
    },
    {
      accessorKey: "verificadoEn",
      header: "Revisado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.verificadoEn),
    },
    createAppRowActionsColumn<CreditReference>({
      actions: (row) => [
        {
          label: "Editar referencia",
          icon: <Pencil />,
          hidden: !canEdit,
          onClick: () =>
            navigate(
              "/marcas-gt/creditos/solicitudes/" +
                creditId +
                "/referencias/" +
                row.original.id +
                "/editar",
              { state: { from: returnTo } },
            ),
        },
        {
          label: "Revisar referencia",
          icon: <ShieldCheck />,
          hidden: !canReview,
          onClick: () =>
            navigate(
              "/marcas-gt/creditos/solicitudes/" +
                creditId +
                "/referencias/" +
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
      emptyTitle="Sin referencias"
      emptyDescription="Agrega referencias personales, comerciales o laborales al expediente."
    />
  );
}
