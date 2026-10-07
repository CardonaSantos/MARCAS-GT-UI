import { CheckCircle2, FileText, PackageCheck, Route } from "lucide-react";

import {
  formatDecimal,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { DeliverySummary } from "../api/delivery.types";

export function DeliverySummaryCards({
  summary,
}: {
  summary?: DeliverySummary;
}) {
  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Entregas activas" icon={<Route />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.activas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Total: {formatInteger(summary?.total, "—")}
        </p>
      </AppCard>
      <AppCard title="Efectividad" icon={<CheckCircle2 />} size="sm">
        <p className="text-2xl font-semibold">
          {formatDecimal(summary?.efectividad.porcentajeExito, "—")}%
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Completas + parciales
        </p>
      </AppCard>
      <AppCard title="Unidades entregadas" icon={<PackageCheck />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.unidades.entregadas, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          de {formatInteger(summary?.unidades.cargadas, "—")} cargadas
        </p>
      </AppCard>
      <AppCard title="Listas para facturar" icon={<FileText />} size="sm">
        <p className="text-2xl font-semibold">
          {formatInteger(summary?.facturacion.listasParaFacturar, "—")}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Entregadas sin factura activa
        </p>
      </AppCard>
    </AppGrid>
  );
}
