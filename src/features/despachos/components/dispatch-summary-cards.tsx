import { AlertTriangle, Boxes, PackageCheck, Truck } from "lucide-react";

import {
  formatDecimal,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { DispatchSummary } from "../api/dispatch.types";

export function DispatchSummaryCards({
  summary,
}: {
  summary?: DispatchSummary;
  isLoading?: boolean;
}) {
  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Órdenes abiertas" icon={<Truck />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.abiertas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Total: {formatInteger(summary?.totalOrdenes, "—")}
        </p>
      </AppCard>

      <AppCard title="Unidades programadas" icon={<Boxes />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.unidades.programadas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Preparación {formatDecimal(summary?.porcentajes.preparacion, "—")}%
        </p>
      </AppCard>

      <AppCard title="Unidades despachadas" icon={<PackageCheck />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.unidades.despachadas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Despacho {formatDecimal(summary?.porcentajes.despacho, "—")}%
        </p>
      </AppCard>

      <AppCard title="Atención operativa" icon={<AlertTriangle />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(
            (summary?.atrasadas ?? 0) + (summary?.operaciones.fallidas ?? 0),
            "—",
          )}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          {formatInteger(summary?.atrasadas, "—")} atrasadas ·{" "}
          {formatInteger(summary?.operaciones.fallidas, "—")} operaciones fallidas
        </p>
      </AppCard>
    </AppGrid>
  );
}
