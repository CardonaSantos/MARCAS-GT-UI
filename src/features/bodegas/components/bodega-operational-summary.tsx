import {
  Boxes,
  ClipboardList,
  Package,
  PackageCheck,
  PackageOpen,
  Route,
  Send,
  Truck,
} from "lucide-react";

import { formatInteger } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { BodegaOperationalSummary as BodegaOperationalSummaryType } from "../api/bodega.types";

interface BodegaOperationalSummaryProps {
  operation: BodegaOperationalSummaryType;
}

export function BodegaOperationalSummary({
  operation,
}: BodegaOperationalSummaryProps) {
  const items = [
    {
      title: "Stock real",
      value: operation.stockReal,
      icon: <Boxes />,
    },
    {
      title: "Stock reservado",
      value: operation.stockReservado,
      icon: <PackageOpen />,
    },
    {
      title: "Stock disponible",
      value: operation.stockDisponible,
      icon: <PackageCheck />,
    },
    {
      title: "Productos con stock",
      value: operation.productosConStock,
      icon: <Package />,
    },
    {
      title: "Requisiciones pendientes",
      value: operation.requisicionesPendientes,
      icon: <ClipboardList />,
    },
    {
      title: "Transferencias pendientes",
      value: operation.transferenciasPendientes,
      icon: <Send />,
    },
    {
      title: "Despachos pendientes",
      value: operation.despachosPendientes,
      icon: <Truck />,
    },
    {
      title: "Envíos pendientes",
      value: operation.enviosPendientes,
      icon: <Route />,
    },
  ];

  return (
    <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
      {items.map((item) => (
        <AppCard
          key={item.title}
          size="sm"
          title={item.title}
          icon={item.icon}
        >
          <p className="text-xl font-semibold tabular-nums">
            {formatInteger(item.value)}
          </p>
        </AppCard>
      ))}
    </AppGrid>
  );
}
