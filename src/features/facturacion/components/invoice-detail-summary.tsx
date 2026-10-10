import { CircleDollarSign, FileText, ReceiptText, UserRound } from "lucide-react";

import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { InvoiceDetail } from "../api/billing.types";
import {
  FISCAL_STATE_LABELS,
  INVOICE_STATE_LABELS,
} from "../common/billing.constants";

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

export function InvoiceDetailSummary({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <div className="space-y-4">
      {invoice.advertencias.map((warning) => (
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

      {invoice.estado === "LISTA_EMISION" ? (
        <AppAlert
          tone="info"
          title="Certificación FEL pendiente"
          description="El documento fiscal está preparado, pero la certificación externa con Grupo CDS todavía no está habilitada en el servidor."
        />
      ) : null}

      <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
        <AppCard title="Estado" icon={<ReceiptText />} size="sm">
          <p className="text-lg font-semibold">
            {INVOICE_STATE_LABELS[invoice.estado]}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Factura #{invoice.id}
          </p>
        </AppCard>
        <AppCard title="Total" icon={<CircleDollarSign />} size="sm">
          <p className="text-2xl font-semibold">{formatMoney(invoice.totales.total)}</p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Impuestos {formatMoney(invoice.totales.impuestos)}
          </p>
        </AppCard>
        <AppCard title="Cliente" icon={<UserRound />} size="sm">
          <p className="text-sm font-semibold">{invoice.cliente.nombreCompleto}</p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {invoice.cliente.fiscal
              ? invoice.cliente.fiscal.identificacion
              : "Sin perfil fiscal"}
          </p>
        </AppCard>
        <AppCard title="Documento fiscal" icon={<FileText />} size="sm">
          <p className="text-sm font-semibold">
            {invoice.fiscal
              ? FISCAL_STATE_LABELS[invoice.fiscal.estado]
              : "Sin preparar"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {invoice.fiscal
              ? invoice.fiscal.serieInterna + "-" + invoice.fiscal.numeroInterno
              : "—"}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppCard title="Cliente y pedido" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Cliente">{invoice.cliente.nombreCompleto}</Value>
            <Value label="Teléfono">{invoice.cliente.telefono}</Value>
            <Value label="Pedido">{invoice.pedido?.numero ?? "—"}</Value>
            <Value label="Vendedor">{invoice.pedido?.vendedor?.nombre ?? "—"}</Value>
            <Value label="Condición de pago">{invoice.condicionPago ?? "—"}</Value>
            <Value label="Moneda">{invoice.moneda}</Value>
          </div>
        </AppCard>

        <AppCard title="Totales" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Subtotal">{formatMoney(invoice.totales.subtotal)}</Value>
            <Value label="Descuento">{formatMoney(invoice.totales.descuento)}</Value>
            <Value label="Impuestos">{formatMoney(invoice.totales.impuestos)}</Value>
            <Value label="Total">{formatMoney(invoice.totales.total)}</Value>
          </div>
        </AppCard>

        <AppCard title="Origen" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Entregas">
              {invoice.entregas.length
                ? invoice.entregas.map((delivery) => "#" + delivery.id).join(", ")
                : "—"}
            </Value>
            <Value label="Líneas">{invoice.detalles.length}</Value>
            <Value label="Creada por">{invoice.creadoPor?.nombre ?? "—"}</Value>
            <Value label="Creada">{formatDateTime(invoice.fechas.creadoEn)}</Value>
          </div>
        </AppCard>

        <AppCard title="Cuenta por cobrar" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Estado">{invoice.cuentaPorCobrar?.estado ?? "—"}</Value>
            <Value label="Saldo">
              {invoice.cuentaPorCobrar
                ? formatMoney(invoice.cuentaPorCobrar.saldoPendiente)
                : "—"}
            </Value>
            <Value label="Vencimiento">
              {formatDateTime(invoice.cuentaPorCobrar?.fechaVencimiento)}
            </Value>
            <Value label="Emitida">{formatDateTime(invoice.fechas.emitidaEn)}</Value>
          </div>
        </AppCard>
      </AppGrid>
    </div>
  );
}
