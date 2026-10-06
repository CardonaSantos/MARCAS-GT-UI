import {
  CalendarClock,
  CircleDollarSign,
  MapPin,
  Phone,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import {
  ORDER_PAYMENT_CONDITION_LABELS,
  ORDER_PAYMENT_STATE_LABELS,
  ORDER_PAYMENT_STATE_TONES,
  ORDER_STATE_LABELS,
  ORDER_STATE_TONES,
} from "../common/order.constants";
import type { OrderDetail } from "../api/order.types";
import { OrderProgressPanel } from "./order-progress-panel";

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value ?? "—"}</dd>
    </div>
  );
}

export function OrderDetailSummary({ order }: { order: OrderDetail }) {
  return (
    <div className="space-y-4">
      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppCard title="Subtotal" icon={<CircleDollarSign />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(order.subtotal)}
          </p>
        </AppCard>
        <AppCard title="Descuento" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(order.descuentoTotal)}
          </p>
        </AppCard>
        <AppCard title="Total" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(order.total)}
          </p>
        </AppCard>
        <AppCard title="Pendiente estimado" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(order.pagos.montoPendienteEstimado)}
          </p>
        </AppCard>
      </AppGrid>

      <OrderProgressPanel progress={order.progreso} />

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Pedido" icon={<ShoppingCart />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue label="Número" value={order.numero} />
            <DetailValue
              label="Estado"
              value={
                <AppBadge tone={ORDER_STATE_TONES[order.estado]} size="xs">
                  {ORDER_STATE_LABELS[order.estado]}
                </AppBadge>
              }
            />
            <DetailValue
              label="Condición de pago"
              value={ORDER_PAYMENT_CONDITION_LABELS[order.condicionPago]}
            />
            <DetailValue
              label="Estado de pago"
              value={
                <AppBadge
                  tone={ORDER_PAYMENT_STATE_TONES[order.estadoPago]}
                  size="xs"
                >
                  {ORDER_PAYMENT_STATE_LABELS[order.estadoPago]}
                </AppBadge>
              }
            />
            <DetailValue label="Moneda" value={order.moneda} />
            <DetailValue label="Versión" value={order.version} />
          </dl>
        </AppCard>

        <AppCard title="Cliente" icon={<UserRound />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue
              label="Nombre"
              value={order.cliente.nombreCompleto}
            />
            <DetailValue
              label="Teléfono"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {order.cliente.telefono}
                </span>
              }
            />
            <DetailValue
              label="Correo"
              value={order.cliente.correo ?? "—"}
            />
            <DetailValue
              label="Dirección"
              value={
                <span className="inline-flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {order.cliente.direccion}
                </span>
              }
            />
          </dl>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Vendedor y visita" icon={<UserRound />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue label="Vendedor" value={order.vendedor.nombre} />
            <DetailValue label="Correo" value={order.vendedor.correo} />
            <DetailValue
              label="Visita"
              value={order.visita ? "#" + order.visita.id : "Sin visita"}
            />
            <DetailValue
              label="Estado de visita"
              value={order.visita?.estado ?? "—"}
            />
            <DetailValue
              label="Inicio de visita"
              value={formatDateTime(order.visita?.inicio)}
            />
            <DetailValue
              label="Fin de visita"
              value={formatDateTime(order.visita?.fin)}
            />
          </dl>
        </AppCard>

        <AppCard title="Fechas" icon={<CalendarClock />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue
              label="Creado"
              value={formatDateTime(order.creadoEn)}
            />
            <DetailValue
              label="Actualizado"
              value={formatDateTime(order.actualizadoEn)}
            />
            <DetailValue
              label="Validación solicitada"
              value={formatDateTime(order.validacionSolicitadaEn)}
            />
            <DetailValue
              label="Confirmado"
              value={formatDateTime(order.confirmadoEn)}
            />
            <DetailValue
              label="Cancelado"
              value={formatDateTime(order.canceladoEn)}
            />
          </dl>
        </AppCard>
      </AppGrid>

      {order.observaciones || order.motivoCancelacion ? (
        <AppCard title="Observaciones" size="sm">
          <dl className="grid gap-4 lg:grid-cols-2">
            <DetailValue
              label="Observaciones del pedido"
              value={order.observaciones ?? "—"}
            />
            <DetailValue
              label="Motivo de cancelación"
              value={order.motivoCancelacion ?? "—"}
            />
          </dl>
        </AppCard>
      ) : null}
    </div>
  );
}
