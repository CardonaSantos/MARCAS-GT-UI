import { CalendarClock, Package, ShoppingCart, Warehouse } from "lucide-react";

import {
  formatDateTime,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import {
  INVENTORY_RESERVATION_LABELS,
  INVENTORY_RESERVATION_TONES,
} from "../common/inventory.constants";
import type { InventoryReservation } from "../api/inventory.types";

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

export function InventoryReservationDetail({
  reservation,
}: {
  reservation: InventoryReservation;
}) {
  return (
    <div className="space-y-4">
      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppCard title="Cantidad original" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(reservation.cantidadOriginal)}
          </p>
        </AppCard>
        <AppCard title="Pendiente" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(reservation.cantidadPendiente)}
          </p>
        </AppCard>
        <AppCard title="Aplicada" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(reservation.cantidadAplicada)}
          </p>
        </AppCard>
        <AppCard title="Liberada" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(reservation.cantidadLiberada)}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, lg: 3 }} gap="sm">
        <AppCard title="Reserva" icon={<ShoppingCart />} size="sm">
          <dl className="space-y-3">
            <DetailValue label="ID" value={"#" + reservation.id} />
            <DetailValue
              label="Estado"
              value={
                <AppBadge
                  tone={INVENTORY_RESERVATION_TONES[reservation.estado]}
                  size="xs"
                >
                  {INVENTORY_RESERVATION_LABELS[reservation.estado]}
                </AppBadge>
              }
            />
            <DetailValue
              label="Pedido"
              value={"#" + reservation.pedidoId}
            />
            <DetailValue
              label="Detalle de pedido"
              value={"#" + reservation.pedidoDetalleId}
            />
          </dl>
        </AppCard>

        <AppCard title="Producto" icon={<Package />} size="sm">
          <dl className="space-y-3">
            <DetailValue label="Código" value={reservation.producto.codigo} />
            <DetailValue label="Nombre" value={reservation.producto.nombre} />
          </dl>
        </AppCard>

        <AppCard title="Bodega" icon={<Warehouse />} size="sm">
          <dl className="space-y-3">
            <DetailValue label="Código" value={reservation.bodega.codigo} />
            <DetailValue label="Nombre" value={reservation.bodega.nombre} />
            <DetailValue
              label="Principal"
              value={reservation.bodega.esPrincipal ? "Sí" : "No"}
            />
          </dl>
        </AppCard>
      </AppGrid>

      <AppCard title="Fechas" icon={<CalendarClock />} size="sm">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailValue
            label="Creada"
            value={formatDateTime(reservation.creadoEn)}
          />
          <DetailValue
            label="Actualizada"
            value={formatDateTime(reservation.actualizadoEn)}
          />
          <DetailValue
            label="Aplicada"
            value={formatDateTime(reservation.aplicadaEn)}
          />
          <DetailValue
            label="Liberada"
            value={formatDateTime(reservation.liberadaEn)}
          />
          <DetailValue
            label="Cancelada"
            value={formatDateTime(reservation.canceladaEn)}
          />
          <DetailValue
            label="Cerrada"
            value={formatDateTime(reservation.cerradaEn)}
          />
        </dl>
      </AppCard>
    </div>
  );
}
