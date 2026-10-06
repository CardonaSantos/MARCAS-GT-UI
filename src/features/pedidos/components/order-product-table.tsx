import type { ColumnDef } from "@tanstack/react-table";

import {
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { OrderDetailLine } from "../api/order.types";

export function OrderProductTable({
  data,
}: {
  data: OrderDetailLine[];
}) {
  const columns: ColumnDef<OrderDetailLine, unknown>[] = [
    {
      id: "codigo",
      header: "Código",
      size: 120,
      cell: ({ row }) => row.original.producto.codigo,
    },
    {
      id: "producto",
      header: "Producto",
      size: 220,
      meta: { grow: true },
      cell: ({ row }) => row.original.producto.nombre,
    },
    {
      accessorKey: "cantidadSolicitada",
      header: "Solicitado",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadSolicitada),
    },
    {
      accessorKey: "cantidadReservada",
      header: "Reservado",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadReservada),
    },
    {
      accessorKey: "cantidadDespachada",
      header: "Despachado",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadDespachada),
    },
    {
      accessorKey: "cantidadEntregada",
      header: "Entregado",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadEntregada),
    },
    {
      accessorKey: "cantidadPendienteReserva",
      header: "Pend. reserva",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadPendienteReserva),
    },
    {
      accessorKey: "cantidadPendienteDespacho",
      header: "Pend. despacho",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadPendienteDespacho),
    },
    {
      accessorKey: "cantidadPendienteEntrega",
      header: "Pend. entrega",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cantidadPendienteEntrega),
    },
    {
      accessorKey: "precioUnitario",
      header: "Precio",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.precioUnitario),
    },
    {
      accessorKey: "descuento",
      header: "Descuento",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.descuento),
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.subtotal),
    },
  ];

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      paginationMode="none"
      density="xs"
      stickyHeader
      responsiveMode="scroll"
      enableColumnVisibility
      emptyTitle="Sin productos"
      emptyDescription="El pedido todavía no contiene productos."
    />
  );
}
