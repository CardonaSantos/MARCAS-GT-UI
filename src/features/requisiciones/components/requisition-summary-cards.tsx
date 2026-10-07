import { AlertTriangle, Boxes, ClipboardList, PackageCheck } from "lucide-react";

import { formatMoney } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { RequisitionSummary } from "../api/requisition.types";

export function RequisitionSummaryCards({
  summary,
  isLoading,
}: {
  summary?: RequisitionSummary;
  isLoading: boolean;
}) {
  const value = (content: React.ReactNode) =>
    isLoading ? "…" : content;

  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Abiertas" icon={<ClipboardList />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(summary?.abiertas ?? 0)}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Borrador, solicitada, aprobada o parcial
        </p>
      </AppCard>

      <AppCard title="Pendiente de recibir" icon={<PackageCheck />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value((summary?.aprobadas ?? 0) + (summary?.parciales ?? 0))}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Requisiciones habilitadas para recepción
        </p>
      </AppCard>

      <AppCard title="Unidades pendientes" icon={<Boxes />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(summary?.unidadesPendientes ?? 0)}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          De {summary?.unidadesSolicitadas ?? 0} solicitadas
        </p>
      </AppCard>

      <AppCard title="Atención recepción" icon={<AlertTriangle />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(
            (summary?.recepcionesPendientes ?? 0) +
              (summary?.recepcionesFallidas ?? 0),
          )}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          {summary?.recepcionesFallidas ?? 0} fallidas · estimado{" "}
          {formatMoney(summary?.costoEstimadoTotal ?? "0")}
        </p>
      </AppCard>
    </AppGrid>
  );
}
