import type { ColumnDef } from "@tanstack/react-table";

import { formatMoney } from "@/features/common/formatters/value.formatters";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { InvoiceDetailLine } from "../api/billing.types";

export function InvoiceLinesTable({ data }: { data: InvoiceDetailLine[] }) {
  const columns: ColumnDef<InvoiceDetailLine, unknown>[] = [
    {
      id: "producto",
      header: "Producto",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) =>
        [row.original.producto.codigoProducto, row.original.producto.nombre]
          .filter(Boolean)
          .join(" · ") || row.original.descripcion,
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      size: 80,
      meta: { align: "right" },
    },
    {
      accessorKey: "unidadMedida",
      header: "Unidad",
      size: 80,
    },
    {
      accessorKey: "precioUnitario",
      header: "P. unitario",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.precioUnitario),
    },
    {
      accessorKey: "precioBruto",
      header: "Bruto",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.precioBruto),
    },
    {
      accessorKey: "descuento",
      header: "Descuento",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.descuento),
    },
    {
      accessorKey: "impuestoTotal",
      header: "Impuesto",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.impuestoTotal),
    },
    {
      accessorKey: "totalLinea",
      header: "Total",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.totalLinea),
    },
    {
      accessorKey: "bienOServicio",
      header: "Tipo",
      size: 90,
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
      emptyTitle="Sin líneas"
    />
  );
}
