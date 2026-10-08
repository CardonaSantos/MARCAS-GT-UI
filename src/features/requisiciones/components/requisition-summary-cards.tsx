import type { ReactNode } from "react";
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  PackageCheck,
} from "lucide-react";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import type { RequisitionSummary } from "../api/requisition.types";

interface Props {
  summary?: RequisitionSummary;
  isLoading: boolean;
}

export function RequisitionSummaryCards({ summary, isLoading }: Props) {
  const cards: {
    title: string;
    icon: ReactNode;
    value: number;
    description: ReactNode;
  }[] = [
    {
      title: "Abiertas",
      icon: <ClipboardList />,
      value: summary?.abiertas ?? 0,
      description: "Borrador, solicitada, aprobada o parcial",
    },
    {
      title: "Pendiente de recibir",
      icon: <PackageCheck />,
      value: (summary?.aprobadas ?? 0) + (summary?.parciales ?? 0),
      description: "Requisiciones habilitadas para recepción",
    },
    {
      title: "Unidades pendientes",
      icon: <Boxes />,
      value: summary?.unidadesPendientes ?? 0,
      description: `De ${summary?.unidadesSolicitadas ?? 0} solicitadas`,
    },
    {
      title: "Atención recepción",
      icon: <AlertTriangle />,
      value:
        (summary?.recepcionesPendientes ?? 0) +
        (summary?.recepcionesFallidas ?? 0),
      description: (
        <>
          {summary?.recepcionesFallidas ?? 0} fallidas · estimado{" "}
          {formatMoney(summary?.costoEstimadoTotal ?? "0")}
        </>
      ),
    },
  ];

  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="xs">
      {cards.map(({ title, icon, value, description }, index) => (
        <AppCard
          key={title}
          title={title}
          icon={icon}
          size={index === 0 ? "xs" : "sm"}
        >
          <p className="text-2xl font-semibold tabular-nums">
            {isLoading ? "…" : value}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {description}
          </p>
        </AppCard>
      ))}
    </AppGrid>
  );
}
