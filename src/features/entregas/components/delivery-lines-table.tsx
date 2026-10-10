import type { ColumnDef } from "@tanstack/react-table";

import { formatInteger } from "@/features/common/formatters/value.formatters";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { DeliveryLine } from "../api/delivery.types";

export function DeliveryLinesTable({ data }: { data: DeliveryLine[] }) {
  const columns: ColumnDef<DeliveryLine, unknown>[] = [
    {
      id: "producto",
      header: "Producto",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) =>
        row.original.producto.codigo + " · " + row.original.producto.nombre,
    },
    {
      accessorKey: "solicitado",
      header: "Solicitado",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.solicitado),
    },
    {
      accessorKey: "despachadoAcumulado",
      header: "Despachado acum.",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.despachadoAcumulado),
    },
    {
      accessorKey: "cargadoIntento",
      header: "Cargado",
      size: 85,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cargadoIntento),
    },
    {
      accessorKey: "entregadoIntento",
      header: "Entregado",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.entregadoIntento),
    },
    {
      accessorKey: "rechazadoIntento",
      header: "Rechazado",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.rechazadoIntento),
    },
    {
      accessorKey: "entregadoAcumulado",
      header: "Entregado acum.",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.entregadoAcumulado),
    },
    {
      accessorKey: "pendientePedido",
      header: "Pendiente pedido",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.pendientePedido),
    },
    {
      accessorKey: "motivoRechazo",
      header: "Motivo rechazo",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) => row.original.motivoRechazo ?? "—",
    },
  ];

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      paginationMode="none"
      density="xs"
      responsiveMode="scroll"
      emptyTitle="Sin productos"
    />
  );
}
