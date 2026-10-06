import type { ColumnDef } from "@tanstack/react-table";
import { Banknote, FileText, Landmark } from "lucide-react";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type {
  CreditAccount,
  CreditDetail,
  CreditInvoice,
  CreditPaymentDetail,
} from "../api/credit.types";

export function CreditFinancialPanel({ credit }: { credit: CreditDetail }) {
  const accountColumns: ColumnDef<CreditAccount, unknown>[] = [
    {
      accessorKey: "numeroDocumento",
      header: "Documento",
      size: 140,
      cell: ({ row }) => row.original.numeroDocumento ?? "—",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 120,
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
      header: "Saldo",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.saldoPendiente),
    },
    {
      accessorKey: "aplicado",
      header: "Aplicado",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.aplicado),
    },
    {
      accessorKey: "fechaEmision",
      header: "Emisión",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.fechaEmision),
    },
    {
      accessorKey: "fechaVencimiento",
      header: "Vencimiento",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.fechaVencimiento),
    },
  ];

  const paymentColumns: ColumnDef<CreditPaymentDetail, unknown>[] = [
    {
      accessorKey: "id",
      header: "Pago",
      size: 80,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "metodo",
      header: "Método",
      size: 135,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 120,
    },
    {
      accessorKey: "monto",
      header: "Monto",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.monto),
    },
    {
      accessorKey: "referencia",
      header: "Referencia",
      size: 140,
      cell: ({ row }) => row.original.referencia ?? "—",
    },
    {
      accessorKey: "fechaPago",
      header: "Fecha",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.fechaPago),
    },
    {
      id: "registradoPor",
      header: "Registrado por",
      size: 150,
      cell: ({ row }) => row.original.registradoPor?.nombre ?? "—",
    },
    {
      accessorKey: "verificadoEn",
      header: "Verificado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.verificadoEn),
    },
  ];

  const invoiceColumns: ColumnDef<CreditInvoice, unknown>[] = [
    {
      accessorKey: "id",
      header: "Factura",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 130,
    },
    {
      accessorKey: "serie",
      header: "Serie",
      size: 100,
      cell: ({ row }) => row.original.serie ?? "—",
    },
    {
      accessorKey: "numero",
      header: "Número",
      size: 110,
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
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.emitidaEn),
    },
    {
      accessorKey: "fechaVencimiento",
      header: "Vencimiento",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.fechaVencimiento),
    },
  ];

  return (
    <AppStack gap="md">
      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppCard title="Cuentas por cobrar" icon={<Landmark />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(credit.cuentasPorCobrar.cantidad)}
          </p>
        </AppCard>
        <AppCard title="Saldo pendiente" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.cuentasPorCobrar.saldoPendiente)}
          </p>
        </AppCard>
        <AppCard title="Pagos registrados" icon={<Banknote />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(credit.pagos.cantidad)}
          </p>
        </AppCard>
        <AppCard title="Pagado verificado" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.pagos.montoVerificado)}
          </p>
        </AppCard>
      </AppGrid>

      <AppCard title="Cuentas por cobrar" icon={<Landmark />} size="sm">
        <AppDataTable
          data={credit.cuentas}
          columns={accountColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin cuentas por cobrar"
          emptyDescription="Todavía no existen cuentas por cobrar para este crédito."
        />
      </AppCard>

      <AppCard title="Pagos" icon={<Banknote />} size="sm">
        <AppDataTable
          data={credit.pagosDetalle}
          columns={paymentColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin pagos"
          emptyDescription="Todavía no existen pagos asociados."
        />
      </AppCard>

      <AppCard title="Facturas" icon={<FileText />} size="sm">
        <AppDataTable
          data={credit.facturas}
          columns={invoiceColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin facturas"
          emptyDescription="Todavía no existen facturas asociadas."
        />
      </AppCard>
    </AppStack>
  );
}
