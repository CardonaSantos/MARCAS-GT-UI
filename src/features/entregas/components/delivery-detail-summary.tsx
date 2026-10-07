import { MapPin, PackageCheck, ReceiptText, UserRound } from "lucide-react";

import {
  formatDateTime,
  formatDecimal,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { DeliveryView } from "../api/delivery.types";
import {
  DELIVERY_FAILURE_REASON_LABELS,
  DELIVERY_STATE_LABELS,
} from "../common/delivery.constants";

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

export function DeliveryDetailSummary({ delivery }: { delivery: DeliveryView }) {
  return (
    <div className="space-y-4">
      {delivery.advertencias.map((warning) => (
        <AppAlert
          key={warning.codigo}
          tone={
            warning.nivel === "CRITICO"
              ? "danger"
              : warning.nivel === "ADVERTENCIA"
                ? "warning"
                : "info"
          }
          title={warning.codigo.replace(/_+/g, " ")}
          description={warning.mensaje}
        />
      ))}

      <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
        <AppCard title="Estado" icon={<PackageCheck />} size="sm">
          <p className="text-lg font-semibold">
            {DELIVERY_STATE_LABELS[delivery.estado]}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Entrega #{delivery.id}
          </p>
        </AppCard>
        <AppCard title="Resultado" icon={<ReceiptText />} size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(delivery.resultado.unidadesEntregadas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            de {formatInteger(delivery.resultado.unidadesCargadas)} cargadas
          </p>
        </AppCard>
        <AppCard title="Receptor" icon={<UserRound />} size="sm">
          <p className="text-sm font-semibold">
            {delivery.receptor.nombre ?? "Sin receptor"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {delivery.receptor.documento ?? "Sin documento"}
          </p>
        </AppCard>
        <AppCard title="Distancia al destino" icon={<MapPin />} size="sm">
          <p className="text-lg font-semibold">
            {delivery.ubicacion.distanciaDestinoMetros == null
              ? "—"
              : formatInteger(delivery.ubicacion.distanciaDestinoMetros) + " m"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {delivery.ubicacion.dentroRadioEsperado == null
              ? "Sin comparación GPS"
              : delivery.ubicacion.dentroRadioEsperado
                ? "Dentro del radio esperado"
                : "Fuera del radio esperado"}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppCard title="Cliente y pedido" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Cliente">{delivery.cliente.nombreCompleto}</Value>
            <Value label="Teléfono">{delivery.cliente.telefono}</Value>
            <Value label="Pedido">{delivery.pedido.numero}</Value>
            <Value label="Estado pedido">{delivery.pedido.estado}</Value>
            <Value label="Condición de pago">
              {delivery.pedido.condicionPago}
            </Value>
            <Value label="Total">{formatMoney(delivery.pedido.total)}</Value>
          </div>
        </AppCard>

        <AppCard title="Despacho y transporte" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Despacho">{delivery.despacho.numero}</Value>
            <Value label="Bodega">{delivery.despacho.bodega?.nombre ?? "—"}</Value>
            <Value label="Envío">
              {delivery.transporte?.envio.numero ?? "—"}
            </Value>
            <Value label="Parada">
              {delivery.transporte
                ? "#" + delivery.transporte.secuencia
                : "—"}
            </Value>
            <Value label="Responsable">
              {delivery.transporte?.responsable?.nombre ?? "—"}
            </Value>
            <Value label="Modalidad">
              {delivery.transporte?.envio.modalidad ?? "—"}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Resultado físico" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Cargadas">
              {formatInteger(delivery.resultado.unidadesCargadas)}
            </Value>
            <Value label="Entregadas">
              {formatInteger(delivery.resultado.unidadesEntregadas)}
            </Value>
            <Value label="Rechazadas">
              {formatInteger(delivery.resultado.unidadesRechazadas)}
            </Value>
            <Value label="Sin resolver">
              {formatInteger(delivery.resultado.unidadesSinResolver)}
            </Value>
            <Value label="Aceptación">
              {formatDecimal(delivery.resultado.porcentajeAceptacion)}%
            </Value>
            <Value label="Evidencias">
              {formatInteger(delivery.evidencias.total)}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Tiempos y auditoría" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Creada">
              {formatDateTime(delivery.tiempos.creadoEn)}
            </Value>
            <Value label="Iniciada">
              {formatDateTime(delivery.tiempos.iniciadaEn)}
            </Value>
            <Value label="Finalizada">
              {formatDateTime(delivery.tiempos.finalizadaEn)}
            </Value>
            <Value label="Duración">
              {delivery.tiempos.duracionHoras == null
                ? "—"
                : formatDecimal(delivery.tiempos.duracionHoras) + " h"}
            </Value>
            <Value label="Registrada por">
              {delivery.registradoPor?.nombre ?? "—"}
            </Value>
            <Value label="Factura">
              {delivery.factura ? "Con factura activa" : "Sin factura"}
            </Value>
          </div>
        </AppCard>
      </AppGrid>

      {delivery.motivoNoEntrega ? (
        <AppAlert
          tone="warning"
          title={
            "Motivo: " +
            DELIVERY_FAILURE_REASON_LABELS[delivery.motivoNoEntrega]
          }
          description={delivery.detalleNoEntrega ?? "Sin detalle adicional."}
        />
      ) : null}

      {delivery.observaciones ? (
        <AppAlert
          tone="info"
          title="Observaciones"
          description={delivery.observaciones}
        />
      ) : null}
    </div>
  );
}
