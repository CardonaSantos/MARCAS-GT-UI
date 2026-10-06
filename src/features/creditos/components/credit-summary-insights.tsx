import { Landmark, PieChart, ShieldCheck, Users } from "lucide-react";

import {
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import {
  CREDIT_APPLICATION_STATE_LABELS,
  CREDIT_APPLICATION_STATE_TONES,
} from "../common/credit.constants";
import type { CreditSummary } from "../api/credit.types";

export function CreditSummaryInsights({
  summary,
}: {
  summary?: CreditSummary;
}) {
  if (!summary) return null;

  const states = Object.entries(summary.porEstado).filter(
    ([, count]) => count > 0,
  );

  return (
    <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
      <AppCard title="Estado de solicitudes" icon={<PieChart />} size="sm">
        <div className="grid gap-2">
          {states.length ? (
            states.map(([state, count]) => (
              <div
                key={state}
                className="flex items-center justify-between gap-3"
              >
                <AppBadge
                  tone={
                    CREDIT_APPLICATION_STATE_TONES[
                      state as keyof typeof CREDIT_APPLICATION_STATE_TONES
                    ]
                  }
                  size="xs"
                >
                  {
                    CREDIT_APPLICATION_STATE_LABELS[
                      state as keyof typeof CREDIT_APPLICATION_STATE_LABELS
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
              Sin solicitudes para los filtros actuales.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 border-t border-[hsl(var(--app-border))] pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Integraciones pendientes
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {formatInteger(summary.integraciones.pendientes)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Aplicadas
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {formatInteger(summary.integraciones.aplicadas)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Fallidas
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {formatInteger(summary.integraciones.fallidas)}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard title="Concentración" icon={<ShieldCheck />} size="sm">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              <Users className="h-3.5 w-3.5" />
              Solicitantes
            </p>
            <div className="space-y-2">
              {summary.topSolicitantes.slice(0, 5).map((item) => (
                <div key={item.usuario.id} className="text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="truncate">{item.usuario.nombre}</span>
                    <span className="shrink-0 font-medium">
                      {formatInteger(item.solicitudes)}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    {formatMoney(item.montoSolicitado)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              <Landmark className="h-3.5 w-3.5" />
              Clientes
            </p>
            <div className="space-y-2">
              {summary.topClientes.slice(0, 5).map((item) => (
                <div key={item.cliente.id} className="text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="truncate">
                      {item.cliente.nombreCompleto}
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatInteger(item.solicitudes)}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    {formatMoney(item.montoSolicitado)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Políticas
            </p>
            <div className="space-y-2">
              {summary.topPoliticas.slice(0, 5).map((item) => (
                <div key={item.politica.id} className="text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="truncate">{item.politica.nombre}</span>
                    <span className="shrink-0 font-medium">
                      {formatInteger(item.solicitudes)}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    {formatMoney(item.montoSolicitado)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppCard>
    </AppGrid>
  );
}
