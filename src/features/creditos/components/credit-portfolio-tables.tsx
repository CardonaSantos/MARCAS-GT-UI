import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  formatDate,
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { CreditPortfolioDetail } from "../api/credit.types";

type Receivable = CreditPortfolioDetail["cuentasPorCobrar"][number];
type Invoice = CreditPortfolioDetail["facturas"][number];
type PlanEvent = NonNullable<
  CreditPortfolioDetail["planPago"]
>["eventos"][number];

function stateTone(state: string) {
  if (["PAGADA", "EMITIDA", "ACTIVO"].includes(state)) {
    return "success" as const;
  }
  if (["VENCIDA", "ANULADA", "RECHAZADA"].includes(state)) {
    return "danger" as const;
  }
  if (["PARCIAL", "LISTA_EMISION", "BORRADOR"].includes(state)) {
    return "warning" as const;
  }
  return "neutral" as const;
}

export function CreditPortfolioReceivables({
  credit,
}: {
  credit: CreditPortfolioDetail;
}) {
  const columns: ColumnDef<Receivable, unknown>[] = [
    {
      accessorKey: "numeroDocumento",
      header: "Documento",
      size: 175,
      cell: ({ row }) => row.original.numeroDocumento ?? "#" + row.original.id,
    },
    {
      accessorKey: "cuotaNumero",
      header: "Cuota",
      size: 80,
      cell: ({ row }) =>
        row.original.cuotaNumero ? "#" + row.original.cuotaNumero : "—",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={stateTone(row.original.estado)} size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "montoOriginal",
      header: "Original",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoOriginal),
    },
    {
      accessorKey: "saldoPendiente",
      header: "Pendiente",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.saldoPendiente),
    },
    {
      accessorKey: "fechaEmision",
      header: "Emisión",
      size: 130,
      cell: ({ row }) => formatDate(row.original.fechaEmision),
    },
    {
      accessorKey: "fechaVencimiento",
      header: "Vencimiento",
      size: 135,
      cell: ({ row }) => formatDate(row.original.fechaVencimiento),
    },
  ];

  return (
    <AppCard
      title="Cuentas por cobrar"
      description="Cada cuota activa del plan tiene su propia obligación de cobro."
      size="sm"
    >
      <AppDataTable
        data={credit.cuentasPorCobrar}
        columns={columns}
        getRowId={(row) => String(row.id)}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin cuentas por cobrar"
        emptyDescription="Activa el plan de pagos para generar las CxC de cada cuota."
      />
    </AppCard>
  );
}

export function CreditPortfolioInvoices({
  credit,
  currentUrl,
}: {
  credit: CreditPortfolioDetail;
  currentUrl: string;
}) {
  const navigate = useNavigate();

  const columns: ColumnDef<Invoice, unknown>[] = [
    {
      accessorKey: "id",
      header: "Factura",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 135,
      cell: ({ row }) => (
        <AppBadge tone={stateTone(row.original.estado)} size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "serie",
      header: "Serie",
      size: 105,
      cell: ({ row }) => row.original.serie ?? "—",
    },
    {
      accessorKey: "numero",
      header: "Número",
      size: 115,
      cell: ({ row }) => row.original.numero ?? "—",
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.total),
    },
    {
      accessorKey: "emitidaEn",
      header: "Emitida",
      size: 140,
      cell: ({ row }) => formatDateTime(row.original.emitidaEn),
    },
    createAppRowActionsColumn<Invoice>({
      actions: (row) => [
        {
          label: "Ver factura",
          icon: <Eye />,
          onClick: () =>
            navigate("/marcas-gt/facturacion/facturas/" + row.original.id, {
              state: { from: currentUrl },
            }),
        },
      ],
    }),
  ];

  return (
    <AppCard
      title="Facturación relacionada"
      description="El documento fiscal es independiente del plan de cobro; no se duplica la deuda."
      size="sm"
    >
      <AppDataTable
        data={credit.facturas}
        columns={columns}
        getRowId={(row) => String(row.id)}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin facturas"
        emptyDescription="Todavía no existen facturas relacionadas con este pedido."
      />
    </AppCard>
  );
}

export function CreditPortfolioActivity({
  credit,
}: {
  credit: CreditPortfolioDetail;
}) {
  const events = credit.planPago?.eventos ?? [];

  const columns: ColumnDef<PlanEvent, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Evento",
      size: 145,
      cell: ({ row }) => row.original.tipo.replace(/_+/g, " "),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={stateTone(row.original.estado)} size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 360,
      meta: { grow: true },
      cell: ({ row }) => row.original.detalle ?? "—",
    },
    {
      id: "actor",
      header: "Usuario",
      size: 150,
      cell: ({ row }) => row.original.actor?.nombre ?? "Sistema",
    },
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
  ];

  return (
    <AppCard
      title="Actividad del plan de pagos"
      description="Auditoría de creación, ajustes y activación del plan."
      size="sm"
    >
      <AppDataTable
        data={events}
        columns={columns}
        getRowId={(row) => String(row.id)}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin actividad del plan"
        emptyDescription="La actividad aparecerá cuando se cree el plan de pagos."
      />
    </AppCard>
  );
}
