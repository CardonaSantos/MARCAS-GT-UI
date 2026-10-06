import {
  Boxes,
  CircleOff,
  Layers3,
  PackageCheck,
  PackageOpen,
  Wallet,
} from "lucide-react";

import {
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { InventorySummary } from "../api/inventory.types";

interface InventorySummaryCardsProps {
  summary?: InventorySummary;
  isLoading?: boolean;
}

export function InventorySummaryCards({
  summary,
  isLoading = false,
}: InventorySummaryCardsProps) {
  const cards = [
    {
      title: "Registros de stock",
      value: formatInteger(summary?.totalRegistros),
      icon: <Layers3 />,
    },
    {
      title: "Registros con existencia",
      value: formatInteger(summary?.productosConExistencia),
      icon: <Boxes />,
    },
    {
      title: "Registros sin disponibilidad",
      value: formatInteger(summary?.productosAgotados),
      icon: <CircleOff />,
    },
    {
      title: "Disponible",
      value: formatInteger(summary?.cantidadDisponibleTotal),
      icon: <PackageCheck />,
    },
    {
      title: "Reservado",
      value: formatInteger(summary?.cantidadReservadaTotal),
      icon: <PackageOpen />,
    },
    {
      title: "Valor de inventario",
      value: formatMoney(summary?.valorInventario),
      icon: <Wallet />,
    },
  ];

  return (
    <AppGrid cols={{ base: 1, md: 2, xl: 3 }} gap="sm">
      {cards.map((card) => (
        <AppCard key={card.title} title={card.title} icon={card.icon} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {isLoading ? "…" : card.value}
          </p>
        </AppCard>
      ))}
    </AppGrid>
  );
}
