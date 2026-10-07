import type { ColumnDef } from "@tanstack/react-table";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { formatInteger } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { ShipmentStop } from "../api/transport.types";

export function ShipmentStopsTable({ data }: { data: ShipmentStop[] }) {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const from = location.pathname + location.search;
  const canOperateDelivery =
    role === "ADMIN" || role === "BODEGA" || role === "REPARTIDOR";

  const columns: ColumnDef<ShipmentStop, unknown>[] = [
    {
      accessorKey: "secuencia",
      header: "#",
      size: 55,
      meta: { align: "right" },
    },
    {
      id: "despacho",
      header: "Despacho",
      size: 120,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/despachos/" + row.original.ordenDespacho.id}
          state={{ from }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {row.original.ordenDespacho.numero}
        </Link>
      ),
    },
    {
      id: "cliente",
      header: "Cliente",
      size: 180,
      meta: { grow: true },
      cell: ({ row }) =>
        [row.original.cliente.nombre, row.original.cliente.apellido]
          .filter(Boolean)
          .join(" "),
    },
    {
      id: "destino",
      header: "Destino",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) => row.original.destino.direccion,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 115,
      cell: ({ row }) => (
        <AppBadge
          tone={
            row.original.estado === "ATENDIDA"
              ? "success"
              : row.original.estado === "INCIDENCIA"
                ? "danger"
                : row.original.estado === "EN_RUTA"
                  ? "primary"
                  : row.original.estado === "CANCELADA"
                    ? "danger"
                    : "warning"
          }
          size="xs"
        >
          {row.original.estado.replace("_", " ")}
        </AppBadge>
      ),
    },
    {
      id: "lineas",
      header: "Líneas",
      size: 70,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.cargas.length),
    },
    {
      id: "planificadas",
      header: "Planif.",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(
          row.original.cargas.reduce(
            (sum, line) => sum + line.cantidadPlanificada,
            0,
          ),
        ),
    },
    {
      id: "cargadas",
      header: "Cargadas",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatInteger(
          row.original.cargas.reduce(
            (sum, line) => sum + line.cantidadCargada,
            0,
          ),
        ),
    },
    {
      id: "entrega",
      header: "Entrega",
      size: 140,
      cell: ({ row }) => {
        if (row.original.entrega) {
          return (
            <Link
              to={"/marcas-gt/entregas/" + row.original.entrega.id}
              state={{ from }}
              className="font-medium text-[hsl(var(--app-primary))] hover:underline"
            >
              #{row.original.entrega.id} · {row.original.entrega.estado.replace(/_+/g, " ")}
            </Link>
          );
        }

        const hasLoad = row.original.cargas.some(
          (line) => line.cantidadCargada > 0,
        );
        if (
          canOperateDelivery &&
          row.original.estado === "EN_RUTA" &&
          hasLoad
        ) {
          return (
            <Link
              to={
                "/marcas-gt/entregas/nueva?envioDespachoId=" +
                row.original.id
              }
              state={{ from }}
              className="font-medium text-[hsl(var(--app-primary))] hover:underline"
            >
              Crear entrega
            </Link>
          );
        }

        return "—";
      },
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
      emptyTitle="Sin paradas"
    />
  );
}
