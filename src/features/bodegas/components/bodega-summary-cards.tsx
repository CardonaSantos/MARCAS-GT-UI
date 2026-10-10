import { Boxes, Building2, PackageCheck, PackageOpen } from "lucide-react";

import { formatInteger } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { BodegaOverview } from "../api/bodega.types";

interface BodegaSummaryCardsProps {
  overview?: BodegaOverview;
  isLoading?: boolean;
}

export function BodegaSummaryCards({
  overview,
  isLoading = false,
}: BodegaSummaryCardsProps) {
  const cards = [
    {
      title: "Bodegas",
      value: isLoading ? "…" : formatInteger(overview?.total),
      description: overview
        ? `${overview.activas} activas · ${overview.inactivas} inactivas`
        : "Sin información",
      icon: <Building2 />,
    },
    {
      title: "Bodega principal",
      value: isLoading ? "…" : (overview?.principal?.codigo ?? "Sin definir"),
      description: overview?.principal?.nombre ?? "No configurada",
      icon: <Boxes />,
    },
    {
      title: "Stock disponible",
      value: isLoading ? "…" : formatInteger(overview?.stockDisponibleTotal),
      description: "Unidades disponibles",
      icon: <PackageCheck />,
    },
    {
      title: "Stock reservado",
      value: isLoading ? "…" : formatInteger(overview?.stockReservadoTotal),
      description: "Unidades comprometidas",
      icon: <PackageOpen />,
    },
  ];

  return (
    <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
      {cards.map((card) => (
        <AppCard
          key={card.title}
          size="sm"
          title={card.title}
          description={card.description}
          icon={card.icon}
        >
          <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
        </AppCard>
      ))}
    </AppGrid>
  );
}
