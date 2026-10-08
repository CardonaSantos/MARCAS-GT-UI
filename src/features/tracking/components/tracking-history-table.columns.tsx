import type { ColumnDef } from "@tanstack/react-table";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import type { TrackingHistoryItem } from "../api/tracking.types";

import {
  formatTrackingBusinessDate,
  formatTrackingDuration,
  formatTrackingTime,
} from "./tracking-history.utils";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { AppButton } from "@/ui/components/app/primitives/app-button";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const muted =
  "text-[hsl(var(--app-table-cell-muted-fg,var(--app-muted-foreground)))]";

function resolveJornadaStatus(row: TrackingHistoryItem): {
  label: string;
  tone: AppBadgeTone;
} {
  if (row.tracking.haySesionActiva) {
    return { label: "En jornada", tone: "success" };
  }

  if (row.horaSalida) {
    return row.tracking.sesionesExpiradas > 0
      ? { label: "Finalizada · con expiración", tone: "warning" }
      : { label: "Finalizada", tone: "neutral" };
  }

  return { label: "Sin cierre", tone: "warning" };
}

export function createTrackingHistoryColumns(): ColumnDef<
  TrackingHistoryItem,
  any
>[] {
  return [
    {
      id: "tecnico",
      header: "Técnico",
      accessorFn: (row) => row.tecnico.nombre,
      enableSorting: false,
      minSize: 180,
      meta: { grow: true },
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold">
            {row.original.tecnico.nombre}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      enableSorting: false,
      size: 105,
      cell: ({ row }) => (
        <span className={`whitespace-nowrap text-xs tabular-nums ${muted}`}>
          {formatTrackingBusinessDate(row.original.fecha)}
        </span>
      ),
    },
    {
      accessorKey: "horaEntrada",
      header: "Entrada",
      enableSorting: false,
      size: 105,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs tabular-nums">
          {formatTrackingTime(row.original.horaEntrada)}
        </span>
      ),
    },
    {
      accessorKey: "horaSalida",
      header: "Salida",
      enableSorting: false,
      size: 105,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs tabular-nums">
          {row.original.horaSalida
            ? formatTrackingTime(row.original.horaSalida)
            : "En curso"}
        </span>
      ),
    },
    {
      id: "trackingMinutes",
      header: "Seguimiento",
      enableSorting: false,
      size: 125,
      accessorFn: (row) => row.tracking.minutosTracking,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs font-medium tabular-nums">
          {formatTrackingDuration(row.original.tracking.minutosTracking)}
        </span>
      ),
    },
    {
      id: "sessions",
      header: "Sesiones",
      enableSorting: false,
      size: 90,
      accessorFn: (row) => row.tracking.sesionesTotal,
      cell: ({ row }) => (
        <span className={`text-xs tabular-nums ${muted}`}>
          {row.original.tracking.sesionesTotal}
        </span>
      ),
    },
    {
      id: "expired",
      header: "Expiradas",
      enableSorting: false,
      size: 90,
      accessorFn: (row) => row.tracking.sesionesExpiradas,
      cell: ({ row }) => {
        const count = row.original.tracking.sesionesExpiradas;

        return count > 0 ? (
          <AppBadge tone="warning" appearance="soft" size="xs" radius="full">
            {count}
          </AppBadge>
        ) : (
          <span className={`text-xs tabular-nums ${muted}`}>0</span>
        );
      },
    },
    {
      id: "status",
      header: "Estado",
      enableSorting: false,
      size: 165,
      cell: ({ row }) => {
        const status = resolveJornadaStatus(row.original);

        return (
          <AppBadge
            tone={status.tone}
            appearance="soft"
            size="xs"
            radius="full"
          >
            {status.label}
          </AppBadge>
        );
      },
    },

    {
      id: "acciones",

      header: "",

      size: 48,
      minSize: 48,
      maxSize: 48,

      enableSorting: false,
      enableHiding: false,

      cell: ({ row }) => (
        <div className="flex w-full justify-center">
          <AppButton
            asChild
            variant="ghost"
            size="iconXs"
            title="Ver jornada"
            aria-label={`Ver jornada de ${row.original.tecnico.nombre}`}
          >
            <Link
              to={`/marcas-gt/tracking/jornadas/${row.original.asistenciaId}`}
            >
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </AppButton>
        </div>
      ),
    },
  ];
}
