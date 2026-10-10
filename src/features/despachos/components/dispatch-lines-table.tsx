import type { ColumnDef } from "@tanstack/react-table";

import {
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { DispatchDetail } from "../api/dispatch.types";

type Row = DispatchDetail["detalles"][number];

export function DispatchLinesTable({ data }: { data: Row[] }) {
  const columns: ColumnDef<Row, unknown>[] = [
    {
      id: "codigo",
      header: "Código",
      size: 120,
      cell: ({ row }) => row.original.producto.codigo,
    },
    {
      id: "producto",
      header: "Producto",
      size: 190,
      meta: { grow: true },
      cell: ({ row }) => row.original.producto.nombre,
    },
    {
      id: "programada",
      header: "Programada",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.despacho.cantidadProgramada),
    },
    {
      id: "preparada",
      header: "Preparada",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.despacho.cantidadPreparada),
    },
    {
      id: "despachada",
      header: "Despachada",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.despacho.cantidadDespachada),
    },
    {
      id: "pendientePreparar",
      header: "Pend. preparar",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.despacho.pendientePreparar),
    },
    {
      id: "pendienteDespachar",
      header: "Pend. despachar",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(row.original.despacho.pendienteDespachar),
    },
    {
      id: "real",
      header: "Real",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.inventario.real),
    },
    {
      id: "reservado",
      header: "Reservado",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.inventario.reservado),
    },
    {
      id: "disponible",
      header: "Disponible",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.inventario.disponible),
    },
    {
      id: "reserva",
      header: "Reserva",
      size: 115,
      cell: ({ row }) =>
        row.original.inventario.reserva ? (
          <AppBadge tone="neutral" size="xs">
            #{row.original.inventario.reserva.id} ·{" "}
            {row.original.inventario.reserva.estado}
          </AppBadge>
        ) : (
          "—"
        ),
    },
    {
      id: "obs",
      header: "Observaciones",
      size: 180,
      cell: ({ row }) => row.original.observaciones ?? "—",
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
      emptyDescription="La orden no contiene líneas de despacho."
    />
  );
}
