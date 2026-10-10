import { Clock3, PackageCheck, Route, Truck } from "lucide-react";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { ShipmentDetail } from "../api/transport.types";
import {
  SHIPMENT_MODE_LABELS,
  SHIPMENT_STATE_LABELS,
} from "../common/transport.constants";

function Value({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</p>
      <div className="mt-1 text-sm font-medium">{children ?? "—"}</div>
    </div>
  );
}

export function ShipmentDetailSummary({
  shipment,
}: {
  shipment: ShipmentDetail;
}) {
  return (
    <div className="space-y-4">
      {shipment.advertencias.map((warning) => (
        <AppAlert
          key={warning.codigo}
          tone={warning.nivel === "CRITICO" ? "danger" : "warning"}
          title={warning.codigo.replace("_", " ")}
          description={warning.mensaje}
        />
      ))}

      <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
        <AppCard title="Estado" icon={<Truck />} size="sm">
          <p className="text-lg font-semibold">
            {SHIPMENT_STATE_LABELS[shipment.estado]}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {SHIPMENT_MODE_LABELS[shipment.modalidad]}
          </p>
        </AppCard>
        <AppCard title="Paradas" icon={<Route />} size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(shipment.progreso.paradas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {formatInteger(shipment.progreso.paradasAtendidas)} atendidas
          </p>
        </AppCard>
        <AppCard title="Carga" icon={<PackageCheck />} size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(shipment.progreso.unidadesCargadas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            de {formatInteger(shipment.progreso.unidadesPlanificadas)}
          </p>
        </AppCard>
        <AppCard title="Costo" icon={<Clock3 />} size="sm">
          <p className="text-2xl font-semibold">{formatMoney(shipment.costo)}</p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {shipment.guia ? "Guía " + shipment.guia : "Sin guía"}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppCard title="Planificación" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Bodega">{shipment.bodega?.nombre ?? "—"}</Value>
            <Value label="Modalidad">
              {SHIPMENT_MODE_LABELS[shipment.modalidad]}
            </Value>
            <Value label="Salida programada">
              {formatDateTime(shipment.salidaProgramadaEn)}
            </Value>
            <Value label="Entrega estimada">
              {formatDateTime(shipment.entregaEstimadaEn)}
            </Value>
            <Value label="Observaciones">
              {shipment.observaciones ?? "—"}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Recursos" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Transportista">
              {shipment.transportista?.nombre ?? "—"}
            </Value>
            <Value label="Vehículo">
              {shipment.vehiculo?.placa ?? "—"}
            </Value>
            <Value label="Conductor">
              {shipment.conductor?.nombre ?? "—"}
            </Value>
            <Value label="Responsable">
              {shipment.responsable?.nombre ?? "—"}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Tiempos" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Creado">{formatDateTime(shipment.creadoEn)}</Value>
            <Value label="Asignado">{formatDateTime(shipment.asignadoEn)}</Value>
            <Value label="Carga confirmada">
              {formatDateTime(shipment.cargaConfirmadaEn)}
            </Value>
            <Value label="Salida">{formatDateTime(shipment.salidaEn)}</Value>
            <Value label="Completado">
              {formatDateTime(shipment.completadoEn)}
            </Value>
            <Value label="Cancelado">
              {formatDateTime(shipment.canceladoEn)}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Auditoría" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Creado por">{shipment.creadoPor?.nombre ?? "—"}</Value>
            <Value label="Asignado por">
              {shipment.asignadoPor?.nombre ?? "—"}
            </Value>
            <Value label="Carga confirmada por">
              {shipment.cargaConfirmadaPor?.nombre ?? "—"}
            </Value>
            <Value label="Ruta iniciada por">
              {shipment.iniciadoPor?.nombre ?? "—"}
            </Value>
            <Value label="Completado por">
              {shipment.completadoPor?.nombre ?? "—"}
            </Value>
            <Value label="Cancelado por">
              {shipment.canceladoPor?.nombre ?? "—"}
            </Value>
          </div>
        </AppCard>
      </AppGrid>

      {shipment.motivoCancelacion ? (
        <AppAlert
          tone="danger"
          title="Motivo de cancelación"
          description={shipment.motivoCancelacion}
        />
      ) : null}
    </div>
  );
}
