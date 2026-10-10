import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import { useInvoiceEvents } from "../api/billing.queries";
import type { InvoiceEvent } from "../api/billing.types";

export function InvoiceActivity({ invoiceId }: { invoiceId: number }) {
  const query = useInvoiceEvents(invoiceId);

  const columns: ColumnDef<InvoiceEvent, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Evento",
      size: 180,
      cell: ({ row }) => row.original.tipo.replace(/_+/g, " "),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 140,
      cell: ({ row }) => row.original.estado.replace(/_+/g, " "),
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 340,
      meta: { grow: true },
      cell: ({ row }) => row.original.detalle ?? "—",
    },
    {
      id: "usuario",
      header: "Usuario",
      size: 160,
      cell: ({ row }) => row.original.usuario?.nombre ?? "Sistema",
    },
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 160,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
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
      emptyTitle="Sin actividad"
    />
  );
}
