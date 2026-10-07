import { Banknote, CircleDollarSign, Clock3, WalletCards } from "lucide-react";

import { formatInteger, formatMoney } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { PaymentSummary } from "../api/payment.types";

export function PaymentSummaryCards({ summary }: { summary?: PaymentSummary }) {
  return (
    <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
      <AppCard title="Pagos" icon={<WalletCards />} size="sm">
        <p className="text-2xl font-semibold">{formatInteger(summary?.total, "—")}</p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Pendientes: {formatInteger(summary?.porEstado.PENDIENTE, "—")}
        </p>
      </AppCard>
      <AppCard title="Monto verificado" icon={<CircleDollarSign />} size="sm">
        <p className="text-2xl font-semibold">
          {summary ? formatMoney(summary.montos.verificado) : "—"}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Dinero reconocido
        </p>
      </AppCard>
      <AppCard title="Monto pendiente" icon={<Clock3 />} size="sm">
        <p className="text-2xl font-semibold">
          {summary ? formatMoney(summary.montos.pendiente) : "—"}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Aún sin verificar
        </p>
      </AppCard>
      <AppCard title="Disponible sin aplicar" icon={<Banknote />} size="sm">
        <p className="text-2xl font-semibold">
          {summary ? formatMoney(summary.montos.disponibleNoAplicado) : "—"}
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
          Verificado pendiente de CxC
        </p>
      </AppCard>
    </AppGrid>
  );
}
