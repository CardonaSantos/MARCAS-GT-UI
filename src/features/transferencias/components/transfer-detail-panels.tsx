import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowRight,
  Boxes,
  PackageCheck,
  Send,
  Truck,
} from "lucide-react";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type {
  TransferDetail,
  TransferEvent,
} from "../api/transfer.types";
import { TransferProgress } from "./transfer-progress";

export function TransferOverview({
  transfer,
}: {
  transfer: TransferDetail;
}) {
  return (
    <div className="space-y-4">
      {transfer.estado === "PREPARADA" ? (
        <AppAlert
          tone="warning"
          title="Lista para salida"
          description="La disponibilidad fue validada al preparar, pero el inventario NO está reservado. El stock sólo disminuye cuando registras la salida física."
        />
      ) : null}

      {["EN_TRANSITO", "RECIBIDA_PARCIAL"].includes(transfer.estado) ? (
        <AppAlert
          tone="info"
          title="Mercadería en tránsito"
          description="El inventario ya salió de la bodega origen. Sólo aumentará en la bodega destino conforme registres recepciones físicas."
        />
      ) : null}

      {transfer.estado === "CANCELADA" ? (
        <AppAlert
          tone="danger"
          title="Transferencia cancelada"
          description={transfer.motivoCancelacion ?? "Sin motivo registrado."}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AppCard title="Solicitado" icon={<Boxes />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {transfer.progreso.unidadesSolicitadas}
          </p>
        </AppCard>
        <AppCard title="Enviado" icon={<Send />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {transfer.progreso.unidadesEnviadas}
          </p>
        </AppCard>
        <AppCard title="Recibido" icon={<PackageCheck />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {transfer.progreso.unidadesRecibidas}
          </p>
        </AppCard>
        <AppCard title="En tránsito" icon={<Truck />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {transfer.progreso.unidadesEnTransito}
          </p>
        </AppCard>
      </div>

      <AppCard title="Ruta del traslado" size="sm">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Origen
            </p>
            <p className="mt-1 font-semibold">
              {transfer.bodegaOrigen.codigo} · {transfer.bodegaOrigen.nombre}
            </p>
          </div>
          <ArrowRight className="hidden h-6 w-6 text-[hsl(var(--app-muted-foreground))] md:block" />
          <div className="md:text-right">
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Destino
            </p>
            <p className="mt-1 font-semibold">
              {transfer.bodegaDestino.codigo} · {transfer.bodegaDestino.nombre}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard
        title="Progreso de recepción"
        description={
          transfer.progreso.unidadesEnviadas === 0
            ? "Todavía no se ha registrado una salida física."
            : transfer.progreso.unidadesEnTransito +
              " unidades siguen fuera de la bodega destino."
        }
        size="sm"
      >
        <TransferProgress
          received={transfer.progreso.unidadesRecibidas}
          sent={transfer.progreso.unidadesEnviadas}
          percentage={transfer.progreso.porcentajeRecepcion}
        />
      </AppCard>

      <div className="grid gap-3 xl:grid-cols-2">
        <AppCard title="Responsable y fechas" size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Creada por
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {transfer.creadoPor.nombre}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Creada
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDateTime(transfer.creadoEn)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Preparada
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDateTime(transfer.preparadaEn)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Salida
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDateTime(transfer.enviadaEn)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Recepción final
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDateTime(transfer.recibidaEn)}
              </dd>
            </div>
          </dl>
        </AppCard>

        <AppCard title="Observaciones" size="sm">
          <p className="text-sm">
            {transfer.observaciones ?? "Sin observaciones."}
          </p>
        </AppCard>
      </div>
    </div>
  );
}

export function TransferProducts({
  transfer,
}: {
  transfer: TransferDetail;
}) {
  return (
    <div className="space-y-2">
      {transfer.detalles.map((line) => (
        <AppCard
          key={line.id}
          title={line.producto.codigo + " · " + line.producto.nombre}
          description={line.observaciones ?? undefined}
          size="sm"
        >
          <div className="grid items-center gap-4 md:grid-cols-5">
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Solicitado
              </p>
              <p className="mt-1 font-semibold">{line.cantidadSolicitada}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Enviado
              </p>
              <p className="mt-1 font-semibold">{line.cantidadEnviada}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Recibido
              </p>
              <p className="mt-1 font-semibold">{line.cantidadRecibida}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                En tránsito
              </p>
              <p className="mt-1 font-semibold">{line.cantidadEnTransito}</p>
            </div>
            <TransferProgress
              received={line.cantidadRecibida}
              sent={line.cantidadEnviada}
              percentage={line.porcentajeRecepcion}
              compact
            />
          </div>
        </AppCard>
      ))}
    </div>
  );
}

export function TransferActivity({
  events,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  events: TransferEvent[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const columns: ColumnDef<TransferEvent, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Evento",
      size: 190,
      cell: ({ row }) => row.original.tipo.replace(/_+/g, " "),
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 430,
      meta: { grow: true },
      cell: ({ row }) => row.original.detalle ?? "—",
    },
    {
      id: "actor",
      header: "Usuario",
      size: 160,
      cell: ({ row }) => row.original.actor?.nombre ?? "Sistema",
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
      data={events}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetry}
      paginationMode="none"
      density="xs"
      responsiveMode="scroll"
      emptyTitle="Sin actividad"
      emptyDescription="No hay eventos registrados para esta transferencia."
    />
  );
}
