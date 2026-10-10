import { Award, Package, PieChart, Users } from "lucide-react";

import {
  formatInteger,
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
import type { OrderSummary } from "../api/order.types";

export function OrderSummaryInsights({
  summary,
}: {
  summary?: OrderSummary;
}) {
  if (!summary) return null;

  const stateEntries = Object.entries(summary.porEstado).filter(
    ([, count]) => count > 0,
  );

  const paymentEntries = Object.entries(summary.porEstadoPago).filter(
    ([, count]) => count > 0,
  );

  const conditionEntries = Object.entries(summary.porCondicionPago).filter(
    ([, count]) => count > 0,
  );

  return (
    <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
      <AppCard title="Distribución de pedidos" icon={<PieChart />} size="sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Por estado
            </p>
            <div className="space-y-2">
              {stateEntries.length ? (
                stateEntries.map(([state, count]) => (
                  <div
                    key={state}
                    className="flex items-center justify-between gap-3"
                  >
                    <AppBadge
                      tone={
                        ORDER_STATE_TONES[
                          state as keyof typeof ORDER_STATE_TONES
                        ]
                      }
                      size="xs"
                    >
                      {
                        ORDER_STATE_LABELS[
                          state as keyof typeof ORDER_STATE_LABELS
                        ]
                      }
                    </AppBadge>
                    <span className="text-sm font-medium tabular-nums">
                      {formatInteger(count)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                  Sin pedidos para los filtros actuales.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Por estado de pago
            </p>
            <div className="space-y-2">
              {paymentEntries.length ? (
                paymentEntries.map(([state, count]) => (
                  <div
                    key={state}
                    className="flex items-center justify-between gap-3"
                  >
                    <AppBadge
                      tone={
                        ORDER_PAYMENT_STATE_TONES[
                          state as keyof typeof ORDER_PAYMENT_STATE_TONES
                        ]
                      }
                      size="xs"
                    >
                      {
                        ORDER_PAYMENT_STATE_LABELS[
                          state as keyof typeof ORDER_PAYMENT_STATE_LABELS
                        ]
                      }
                    </AppBadge>
                    <span className="text-sm font-medium tabular-nums">
                      {formatInteger(count)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                  Sin datos.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Por condición de pago
            </p>
            <div className="space-y-2">
              {conditionEntries.map(([condition, count]) => (
                <div
                  key={condition}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span>
                    {
                      ORDER_PAYMENT_CONDITION_LABELS[
                        condition as keyof typeof ORDER_PAYMENT_CONDITION_LABELS
                      ]
                    }
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatInteger(count)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard title="Rendimiento comercial" icon={<Award />} size="sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              <Users className="h-3.5 w-3.5" />
              Top vendedores
            </p>
            <div className="space-y-2">
              {summary.topVendedores.length ? (
                summary.topVendedores.slice(0, 5).map((item) => (
                  <div key={item.vendedor.id} className="text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{item.vendedor.nombre}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {formatMoney(item.monto)}
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      {formatInteger(item.pedidos)} pedidos
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                  Sin datos.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              <Package className="h-3.5 w-3.5" />
              Top productos
            </p>
            <div className="space-y-2">
              {summary.topProductos.length ? (
                summary.topProductos.slice(0, 5).map((item) => (
                  <div key={item.producto.id} className="text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{item.producto.nombre}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {formatInteger(item.unidadesSolicitadas)}
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      {formatMoney(item.montoNeto)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                  Sin datos.
                </p>
              )}
            </div>
          </div>
        </div>
      </AppCard>
    </AppGrid>
  );
}
