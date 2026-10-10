import {
  Boxes,
  PackageCheck,
  Send,
  Truck,
} from "lucide-react";

import { formatInteger } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { OrderProgress } from "../api/order.types";

function ProgressRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: number;
  percentage: number;
}) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-[hsl(var(--app-muted-foreground))]">
          {formatInteger(value)} · {safePercentage.toFixed(2)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--app-muted))]">
        <div
          className="h-full rounded-full bg-[hsl(var(--app-primary))] transition-[width]"
          style={{ width: safePercentage + "%" }}
        />
      </div>
    </div>
  );
}

export function OrderProgressPanel({
  progress,
}: {
  progress: OrderProgress;
}) {
  return (
    <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
      <AppCard title="Unidades" icon={<Boxes />} size="sm">
        <AppGrid cols={{ base: 2, md: 4 }} gap="sm">
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Solicitadas
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatInteger(progress.unidadesSolicitadas)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Reservadas
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatInteger(progress.unidadesReservadas)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Despachadas
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatInteger(progress.unidadesDespachadas)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Entregadas
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatInteger(progress.unidadesEntregadas)}
            </p>
          </div>
        </AppGrid>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between">
            <span>Pendientes de reserva</span>
            <span className="tabular-nums">
              {formatInteger(progress.unidadesPendientesReserva)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pendientes de despacho</span>
            <span className="tabular-nums">
              {formatInteger(progress.unidadesPendientesDespacho)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pendientes de entrega</span>
            <span className="tabular-nums">
              {formatInteger(progress.unidadesPendientesEntrega)}
            </span>
          </div>
        </div>
      </AppCard>

      <AppCard title="Progreso operativo" icon={<Truck />} size="sm">
        <div className="space-y-4">
          <ProgressRow
            label="Reservado"
            value={progress.unidadesReservadas}
            percentage={progress.porcentajeReservado}
          />
          <ProgressRow
            label="Despachado"
            value={progress.unidadesDespachadas}
            percentage={progress.porcentajeDespachado}
          />
          <ProgressRow
            label="Entregado"
            value={progress.unidadesEntregadas}
            percentage={progress.porcentajeEntregado}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[hsl(var(--app-muted-foreground))]">
          <span className="inline-flex items-center gap-1">
            <PackageCheck className="h-3.5 w-3.5" />
            Reserva
          </span>
          <span className="inline-flex items-center gap-1">
            <Send className="h-3.5 w-3.5" />
            Despacho
          </span>
          <span className="inline-flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            Entrega
          </span>
        </div>
      </AppCard>
    </AppGrid>
  );
}
