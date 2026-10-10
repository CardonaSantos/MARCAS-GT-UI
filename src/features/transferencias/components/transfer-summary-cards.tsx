import { AlertTriangle, ArrowRightLeft, Boxes, Truck } from "lucide-react";

import { formatMoney } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { TransferSummary } from "../api/transfer.types";

export function TransferSummaryCards({
  summary,
  isLoading,
}: {
  summary?: TransferSummary;
  isLoading: boolean;
}) {
  const value = (content: React.ReactNode) =>
    isLoading ? "…" : content;

  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Abiertas" icon={<ArrowRightLeft />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(summary?.abiertas ?? 0)}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Borrador, preparada o aún en tránsito
        </p>
      </AppCard>

      <AppCard title="En tránsito" icon={<Truck />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(
            (summary?.enTransito ?? 0) + (summary?.recibidasParcial ?? 0),
          )}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Transferencias con mercancía fuera del origen
        </p>
      </AppCard>

      <AppCard title="Unidades en tránsito" icon={<Boxes />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(summary?.unidadesEnTransito ?? 0)}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Valor {formatMoney(summary?.valorEnTransito ?? "0")}
        </p>
      </AppCard>

      <AppCard title="Atención operativa" icon={<AlertTriangle />} size="sm">
        <p className="text-2xl font-semibold tabular-nums">
          {value(
            (summary?.operacionesPendientes ?? 0) +
              (summary?.operacionesFallidas ?? 0),
          )}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          {summary?.operacionesFallidas ?? 0} fallidas ·{" "}
          {summary?.operacionesPendientes ?? 0} pendientes
        </p>
      </AppCard>
    </AppGrid>
  );
}
