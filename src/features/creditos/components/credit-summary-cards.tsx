import {
  BadgeDollarSign,
  Banknote,
  ClipboardCheck,
  FileClock,
  Landmark,
  Percent,
} from "lucide-react";

import {
  formatDecimal,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { CreditSummary } from "../api/credit.types";

export function CreditSummaryCards({
  summary,
  isLoading = false,
}: {
  summary?: CreditSummary;
  isLoading?: boolean;
}) {
  const cards = [
    {
      title: "Solicitudes",
      value: formatInteger(summary?.totalSolicitudes),
      icon: <ClipboardCheck />,
    },
    {
      title: "Monto solicitado",
      value: formatMoney(summary?.montos.solicitado),
      icon: <BadgeDollarSign />,
    },
    {
      title: "Monto autorizado",
      value: formatMoney(summary?.montos.autorizado),
      icon: <Banknote />,
    },
    {
      title: "Monto financiado",
      value: formatMoney(summary?.montos.financiado),
      icon: <Landmark />,
    },
    {
      title: "Saldo CxC",
      value: formatMoney(summary?.montos.cuentasPendiente),
      icon: <FileClock />,
    },
    {
      title: "Aprobación",
      value:
        summary == null
          ? "—"
          : formatDecimal(summary.promedios.porcentajeAprobacion) + "%",
      icon: <Percent />,
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
