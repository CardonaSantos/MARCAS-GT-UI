import { AlertTriangle, Boxes, PackageCheck, Truck } from "lucide-react";
import {
  formatDecimal,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import type { DispatchSummary } from "../api/dispatch.types";

interface Props {
  summary?: DispatchSummary;
  isLoading?: boolean;
}

export function DispatchSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Órdenes abiertas",
      icon: Truck,
      value: formatInteger(summary?.abiertas, "—"),
      description: `Total: ${formatInteger(summary?.totalOrdenes, "—")}`,
    },
    {
      title: "Unidades programadas",
      icon: Boxes,
      value: formatInteger(summary?.unidades.programadas, "—"),
      description: `Preparación ${formatDecimal(summary?.porcentajes.preparacion, "—")}%`,
    },
    {
      title: "Unidades despachadas",
      icon: PackageCheck,
      value: formatInteger(summary?.unidades.despachadas, "—"),
      description: `Despacho ${formatDecimal(summary?.porcentajes.despacho, "—")}%`,
    },
    {
      title: "Atención operativa",
      icon: AlertTriangle,
      value: formatInteger(
        (summary?.atrasadas ?? 0) + (summary?.operaciones.fallidas ?? 0),
        "—",
      ),
      description: `${formatInteger(summary?.atrasadas, "—")} atrasadas · ${formatInteger(
        summary?.operaciones.fallidas,
        "—",
      )} operaciones fallidas`,
    },
  ];

  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      {cards.map(({ title, icon: Icon, value, description }) => (
        <AppCard key={title} title={title} icon={<Icon />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {description}
          </p>
        </AppCard>
      ))}
    </AppGrid>
  );
}
