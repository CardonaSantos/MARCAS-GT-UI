import {
  Banknote,
  Boxes,
  ClipboardList,
  CircleDollarSign,
  PackageCheck,
  Send,
  Truck,
  WalletCards,
} from "lucide-react";

import {
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { OrderSummary } from "../api/order.types";

export function OrderSummaryCards({
  summary,
  isLoading = false,
}: {
  summary?: OrderSummary;
  isLoading?: boolean;
}) {
  const cards = [
    {
      title: "Pedidos",
      value: formatInteger(summary?.totalPedidos),
      icon: <ClipboardList />,
    },
    {
      title: "Monto total",
      value: formatMoney(summary?.montos.total),
      icon: <CircleDollarSign />,
    },
    {
      title: "Pagado verificado",
      value: formatMoney(summary?.montos.pagadoVerificado),
      icon: <Banknote />,
    },
    {
      title: "Pendiente estimado",
      value: formatMoney(summary?.montos.pendienteEstimado),
      icon: <WalletCards />,
    },
    {
      title: "Unidades solicitadas",
      value: formatInteger(summary?.unidades.solicitadas),
      icon: <Boxes />,
    },
    {
      title: "Unidades reservadas",
      value: formatInteger(summary?.unidades.reservadas),
      icon: <PackageCheck />,
    },
    {
      title: "Unidades despachadas",
      value: formatInteger(summary?.unidades.despachadas),
      icon: <Send />,
    },
    {
      title: "Unidades entregadas",
      value: formatInteger(summary?.unidades.entregadas),
      icon: <Truck />,
    },
  ];

  return (
    <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
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
