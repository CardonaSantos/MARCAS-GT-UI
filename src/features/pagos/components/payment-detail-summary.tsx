import { Banknote, CircleDollarSign, Landmark, UserRound } from "lucide-react";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { PaymentDetail } from "../api/payment.types";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATE_LABELS,
} from "../common/payment.constants";

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

export function PaymentDetailSummary({ payment }: { payment: PaymentDetail }) {
  const directOrder = ["PREPAGO", "CONTRAENTREGA"].includes(
    payment.pedido?.condicionPago ?? "",
  );
  const verifiedDirect = directOrder && payment.estado === "VERIFICADO";
  return (
    <div className="space-y-4">
      {payment.motivoRechazo ? (
        <AppAlert
          tone="danger"
          title="Pago rechazado"
          description={payment.motivoRechazo}
        />
      ) : null}
      {payment.motivoAnulacion ? (
        <AppAlert
          tone="warning"
          title="Pago anulado"
          description={payment.motivoAnulacion}
        />
      ) : null}

      {verifiedDirect ? (
        <AppAlert
          tone="info"
          title={payment.pedido?.estadoPago === "PAGADO"
            ? "Pedido pagado: cobro reconocido"
            : "Pago verificado y vinculado al pedido"}
          description="El pago ya cuenta para el estado comercial del pedido. El saldo sin aplicación a CxC es un cobro vinculado al pedido, no un nuevo cobro pendiente. Si existe una CxC directa compatible al verificar, se concilia automáticamente."
        />
      ) : null}

      <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
        <AppCard title="Estado" icon={<Banknote />} size="sm">
          <p className="text-lg font-semibold">
            {PAYMENT_STATE_LABELS[payment.estado]}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Pago #{payment.id}
          </p>
        </AppCard>
        <AppCard title="Monto" icon={<CircleDollarSign />} size="sm">
          <p className="text-2xl font-semibold">{formatMoney(payment.monto)}</p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {payment.moneda}
          </p>
        </AppCard>
        <AppCard title="Aplicado a CxC" icon={<Landmark />} size="sm">
          <p className="text-2xl font-semibold">
            {formatMoney(payment.montoAplicado)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {verifiedDirect
              ? (payment.pedido?.condicionPago === "PREPAGO" ? "Anticipo vinculado " : "Cobro vinculado ") + formatMoney(payment.montoVinculadoPedido ?? payment.montoDisponible)
              : "Libre para cartera " + formatMoney(payment.montoLibreCxC ?? payment.montoDisponible)}
          </p>
        </AppCard>
        <AppCard title="Cliente" icon={<UserRound />} size="sm">
          <p className="text-sm font-semibold">
            {[payment.cliente.nombre, payment.cliente.apellido]
              .filter(Boolean)
              .join(" ")}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {payment.pedido?.numero ?? "Pago sin pedido"}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppCard title="Pago" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Método">
              {PAYMENT_METHOD_LABELS[payment.metodo]}
            </Value>
            <Value label="Banco">{payment.banco?.nombre ?? "—"}</Value>
            <Value label="Referencia">{payment.referencia ?? "—"}</Value>
            <Value label="Fecha del pago">
              {formatDateTime(payment.fechaPago)}
            </Value>
            <Value label="Registrado por">
              {payment.registradoPor?.nombre ?? "—"}
            </Value>
            <Value label="Comprobantes">{payment.comprobantes.length}</Value>
          </div>
        </AppCard>

        <AppCard title="Estado financiero" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Monto original">{formatMoney(payment.monto)}</Value>
            <Value label="Monto aplicado">
              {formatMoney(payment.montoAplicado)}
            </Value>
            <Value label={verifiedDirect ? (payment.pedido?.condicionPago === "PREPAGO" ? "Anticipo vinculado al pedido" : "Cobro vinculado al pedido") : "Disponible para CxC"}>
              {formatMoney(verifiedDirect
                ? payment.montoVinculadoPedido ?? payment.montoDisponible
                : payment.montoLibreCxC ?? payment.montoDisponible)}
            </Value>
            <Value label="Aplicaciones contables">{payment.aplicaciones.length}</Value>
            <Value label="Estado pedido">
              {payment.pedido?.estadoPago ?? "—"}
            </Value>
            <Value label="Total pedido">
              {payment.pedido?.total
                ? formatMoney(payment.pedido.total)
                : "—"}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Auditoría" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Creado">{formatDateTime(payment.creadoEn)}</Value>
            <Value label="Verificado">
              {formatDateTime(payment.verificadoEn)}
            </Value>
            <Value label="Verificado por">
              {payment.verificadoPor?.nombre ?? "—"}
            </Value>
            <Value label="Rechazado">
              {formatDateTime(payment.rechazadoEn)}
            </Value>
            <Value label="Anulado">{formatDateTime(payment.anuladoEn)}</Value>
            <Value label="Versión">{payment.version}</Value>
          </div>
        </AppCard>

        <AppCard title="Observaciones" size="sm">
          <p className="text-sm">
            {payment.observaciones ?? "Sin observaciones."}
          </p>
        </AppCard>
      </AppGrid>
    </div>
  );
}
