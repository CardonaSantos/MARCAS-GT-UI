import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Boxes, PackageCheck, Truck } from "lucide-react";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type {
  RequisitionDetail,
  RequisitionEvent,
  RequisitionReceipt,
} from "../api/requisition.types";
import {
  REQUISITION_RECEIPT_STATE_LABELS,
  requisitionReceiptTone,
} from "../common/requisition.constants";
import { RequisitionProgress } from "./requisition-progress";

export function RequisitionOverview({ requisition }: { requisition: RequisitionDetail }) {
  return (
    <div className="space-y-4">
      {requisition.estado === "APROBADA" || requisition.estado === "PARCIAL" ? (
        <AppAlert
          tone="info"
          title="Lista para recibir mercadería"
          description="La aprobación no modifica existencias. El inventario aumenta únicamente cuando se registra una recepción física."
        />
      ) : null}

      {requisition.estado === "RECHAZADA" ? (
        <AppAlert
          tone="danger"
          title="Requisición rechazada"
          description={requisition.motivoRechazo ?? "Sin motivo registrado."}
        />
      ) : null}

      {requisition.estado === "CANCELADA" ? (
        <AppAlert
          tone="danger"
          title="Requisición cancelada"
          description={requisition.motivoCancelacion ?? "Sin motivo registrado."}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AppCard title="Productos" icon={<Boxes />} size="sm">
          <p className="text-2xl font-semibold">{requisition.progreso.productos}</p>
        </AppCard>
        <AppCard title="Solicitado" icon={<Truck />} size="sm">
          <p className="text-2xl font-semibold">
            {requisition.progreso.unidadesSolicitadas}
          </p>
        </AppCard>
        <AppCard title="Recibido" icon={<PackageCheck />} size="sm">
          <p className="text-2xl font-semibold">
            {requisition.progreso.unidadesRecibidas}
          </p>
        </AppCard>
        <AppCard title="Pendiente" icon={<AlertTriangle />} size="sm">
          <p className="text-2xl font-semibold">
            {requisition.progreso.unidadesPendientes}
          </p>
        </AppCard>
      </div>

      <AppCard
        title="Progreso de recepción"
        description={
          "Costo estimado total " +
          formatMoney(requisition.progreso.costoEstimado)
        }
        size="sm"
      >
        <RequisitionProgress
          received={requisition.progreso.unidadesRecibidas}
          requested={requisition.progreso.unidadesSolicitadas}
          percentage={requisition.progreso.porcentajeRecepcion}
        />
      </AppCard>

      <div className="grid gap-3 xl:grid-cols-2">
        <AppCard title="Destino y proveedor" size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Bodega</dt>
              <dd className="mt-1 text-sm font-medium">
                {requisition.bodega.codigo} · {requisition.bodega.nombre}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Proveedor</dt>
              <dd className="mt-1 text-sm font-medium">
                {requisition.proveedor?.nombre ?? "Sin asignar"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Solicitante</dt>
              <dd className="mt-1 text-sm font-medium">{requisition.solicitante.nombre}</dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Creada</dt>
              <dd className="mt-1 text-sm font-medium">{formatDateTime(requisition.creadoEn)}</dd>
            </div>
          </dl>
        </AppCard>

        <AppCard title="Workflow" size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Solicitada</dt>
              <dd className="mt-1 text-sm font-medium">{formatDateTime(requisition.solicitadaEn)}</dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Aprobada</dt>
              <dd className="mt-1 text-sm font-medium">{formatDateTime(requisition.aprobadaEn)}</dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Completada</dt>
              <dd className="mt-1 text-sm font-medium">{formatDateTime(requisition.completadaEn)}</dd>
            </div>
            <div>
              <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Observaciones</dt>
              <dd className="mt-1 text-sm font-medium">{requisition.observaciones ?? "—"}</dd>
            </div>
          </dl>
        </AppCard>
      </div>
    </div>
  );
}

export function RequisitionProducts({ requisition }: { requisition: RequisitionDetail }) {
  return (
    <div className="space-y-2">
      {requisition.detalles.map((line) => (
        <AppCard
          key={line.id}
          title={line.producto.codigo + " · " + line.producto.nombre}
          description={
            line.costoUnitarioEstimado
              ? "Costo estimado " + formatMoney(line.costoUnitarioEstimado)
              : "Sin costo estimado"
          }
          size="sm"
        >
          <div className="grid items-center gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Solicitado</p>
              <p className="mt-1 font-semibold">{line.cantidadSolicitada}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Recibido</p>
              <p className="mt-1 font-semibold">{line.cantidadRecibida}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Pendiente</p>
              <p className="mt-1 font-semibold">{line.cantidadPendiente}</p>
            </div>
            <RequisitionProgress
              received={line.cantidadRecibida}
              requested={line.cantidadSolicitada}
              percentage={line.porcentajeRecepcion}
              compact
            />
          </div>
        </AppCard>
      ))}
    </div>
  );
}

export function RequisitionReceiptsTable({
  receipts,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  receipts: RequisitionReceipt[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const columns: ColumnDef<RequisitionReceipt, unknown>[] = [
    {
      accessorKey: "id",
      header: "Recepción",
      size: 100,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={requisitionReceiptTone(row.original.estado)} size="xs">
          {REQUISITION_RECEIPT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "documentoReferencia",
      header: "Documento",
      size: 150,
      cell: ({ row }) => row.original.documentoReferencia ?? "—",
    },
    {
      accessorKey: "unidades",
      header: "Unidades",
      size: 95,
      meta: { align: "right" },
    },
    {
      accessorKey: "costoTotal",
      header: "Costo real",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.costoTotal),
    },
    {
      id: "recibidoPor",
      header: "Recibido por",
      size: 150,
      cell: ({ row }) => row.original.recibidoPor.nombre,
    },
    {
      accessorKey: "recibidoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.recibidoEn),
    },
  ];

  return (
    <div className="space-y-3">
      {receipts.some((item) => item.estado === "FALLIDA") ? (
        <AppAlert
          tone="danger"
          title="Hay recepciones fallidas"
          description="Una recepción fallida conserva su clave de idempotencia y puede reintentarse sin duplicar inventario."
        />
      ) : null}
      <AppDataTable
        data={receipts}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin recepciones"
        emptyDescription="Todavía no se ha registrado recepción física de esta requisición."
      />
    </div>
  );
}

export function RequisitionActivity({
  events,
  isLoading,
  isFetching,
  error,
  onRetry,
}: {
  events: RequisitionEvent[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const columns: ColumnDef<RequisitionEvent, unknown>[] = [
    { accessorKey: "tipo", header: "Evento", size: 180 },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 420,
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
      emptyDescription="No hay eventos registrados para esta requisición."
    />
  );
}
