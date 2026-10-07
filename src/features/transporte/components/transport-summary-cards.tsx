import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Truck,
} from "lucide-react";

import {
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { ShipmentSummary } from "../api/transport.types";

export function TransportSummaryCards({
  summary,
}: {
  summary?: ShipmentSummary;
  isLoading?: boolean;
}) {
  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Envíos abiertos" icon={<Truck />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.abiertas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Total: {formatInteger(summary?.total, "—")}
        </p>
      </AppCard>

      <AppCard title="Carga" icon={<Boxes />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.unidades.cargadas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          de {formatInteger(summary?.unidades.planificadas, "—")} unidades
        </p>
      </AppCard>

      <AppCard title="Incidencias abiertas" icon={<AlertTriangle />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.incidenciasAbiertas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Requieren seguimiento operativo
        </p>
      </AppCard>

      <AppCard title="Costo externo" icon={<CircleDollarSign />} size="sm">
        <p className="text-2xl font-semibold">
          {formatMoney(summary?.costoExterno, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Transporte tercerizado
        </p>
      </AppCard>
    </AppGrid>
  );
}
