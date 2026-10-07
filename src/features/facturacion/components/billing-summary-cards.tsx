import { CircleDollarSign, FileCheck2, ReceiptText, TriangleAlert } from "lucide-react";

import {
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { BillingSummary } from "../api/billing.types";

export function BillingSummaryCards({ summary }: { summary?: BillingSummary }) {
  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Facturas" icon={<ReceiptText />} size="sm">
        <p className="text-2xl font-semibold">{formatInteger(summary?.total, "—")}</p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Borradores: {formatInteger(summary?.porEstado.BORRADOR, "—")}
        </p>
      </AppCard>
      <AppCard title="Monto facturado" icon={<CircleDollarSign />} size="sm">
        <p className="text-2xl font-semibold">
          {summary ? formatMoney(summary.montos.facturado) : "—"}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Impuestos: {summary ? formatMoney(summary.montos.impuestos) : "—"}
        </p>
      </AppCard>
      <AppCard title="Pendientes FEL" icon={<FileCheck2 />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.fel.pendientes, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Integración externa aún deshabilitada
        </p>
      </AppCard>
      <AppCard title="Atención FEL" icon={<TriangleAlert />} size="sm">
        <p className="text-2xl font-semibold">
          {summary ? summary.fel.inciertas + summary.fel.rechazadas : "—"}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Inciertas + rechazadas
        </p>
      </AppCard>
    </AppGrid>
  );
}
