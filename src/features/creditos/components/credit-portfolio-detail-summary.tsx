import {
  Banknote,
  CalendarClock,
  FileText,
  Landmark,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  formatDate,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { CreditPortfolioDetail } from "../api/credit.types";
import { moneyCents } from "../common/credit-advance.utils";

function Value({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</p>
      <div className="mt-1 text-sm font-medium">{children ?? "—"}</div>
    </div>
  );
}

export function CreditPortfolioDetailSummary({
  credit,
  currentUrl,
}: {
  credit: CreditPortfolioDetail;
  currentUrl: string;
}) {
  const hasReceivables = credit.cuentasPorCobrar.length > 0;
  const requiresAdvance = (moneyCents(credit.montos.anticipoRequerido) ?? 0) > 0;
  const advancePendingId = credit.anticipo?.pagoPendienteId ?? null;
  const missingAdvance = moneyCents(credit.anticipo?.saldoPendiente ?? credit.montos.anticipoRequerido) ?? 0;
  const advancePaid = credit.anticipo?.estado === "PAGADA" && missingAdvance === 0;
  const paymentPath = "/marcas-gt/pagos/nuevo?clienteId=" + credit.cliente.id +
    "&pedidoId=" + credit.pedido.id + "&monto=" + (missingAdvance / 100).toFixed(2) +
    "&concepto=anticipo";

  return (
    <div className="space-y-4">
      {!credit.planPago ? (
        <AppAlert
          tone="warning"
          title="Crédito sin plan de pagos"
          description="Todavía no existe una programación de cuotas. El saldo no se considera liquidado: aún no se han generado las Cuentas por Cobrar."
        />
      ) : null}

      {requiresAdvance ? (
        <AppCard title="Anticipo del pedido" icon={<Banknote />} size="sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Value label="Anticipo requerido">{formatMoney(credit.montos.anticipoRequerido)}</Value>
            <Value label="Anticipo aplicado">{formatMoney(credit.montos.anticipoAplicado)}</Value>
            <Value label="Plan de cuotas">{credit.planPago?.estado === "ACTIVO" ? "Activo" : "Pendiente de activación"}</Value>
          </div>
          <p className="mt-3 text-sm text-[hsl(var(--app-muted-foreground))]">
            {advancePaid
              ? "Anticipo liquidado. Ya puedes activar manualmente el plan desde la pestaña Plan de pagos, sin esperar la entrega."
              : "El anticipo debe verificarse y aplicarse antes de activar las cuotas. Solo se admite un anticipo activo por pedido."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {advancePendingId ? (
              <AppButton asChild variant="secondary" size="sm">
                <Link to={"/marcas-gt/pagos/" + advancePendingId} state={{ from: currentUrl }}>
                  Revisar pago pendiente
                </Link>
              </AppButton>
            ) : null}
            {!advancePendingId && !advancePaid && missingAdvance > 0 && credit.planPago?.estado !== "ACTIVO" ? (
              <AppButton asChild variant="primary" size="sm">
                <Link to={paymentPath} state={{ from: currentUrl }}>Registrar anticipo</Link>
              </AppButton>
            ) : null}
            {advancePaid && credit.planPago?.estado === "BORRADOR" ? (
              <AppButton asChild variant="primary" size="sm">
                <Link to={currentUrl.split("?")[0] + "?tab=plan"}>Activar cuotas</Link>
              </AppButton>
            ) : null}
            <AppButton asChild variant="secondary" size="sm">
              <Link to={"/marcas-gt/pedidos/" + credit.pedido.id + "?tab=operacion"} state={{ from: currentUrl }}>
                Consultar pagos del pedido
              </Link>
            </AppButton>
          </div>
        </AppCard>
      ) : null}

      <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
        <AppCard title="Financiado" icon={<WalletCards />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.montos.financiado)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Autorizado {formatMoney(credit.montos.autorizado)}
          </p>
        </AppCard>

        <AppCard title="Pagado verificado" icon={<Banknote />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.montos.pagadoVerificado)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Dinero reconocido en pagos
          </p>
        </AppCard>

        <AppCard title="Abonado a cuotas" icon={<Landmark />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.montos.pagadoAplicado)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Cobros aplicados a cuentas de cuotas (no incluye anticipo)
          </p>
        </AppCard>

        <AppCard title="Saldo pendiente" icon={<CalendarClock />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {hasReceivables
              ? formatMoney(credit.montos.saldoPendiente)
              : "—"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {hasReceivables ? "Saldo de cuotas activadas" : "Activa el plan para crear CxC de cuotas"}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppCard title="Crédito" size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Número">{credit.numero}</Value>
            <Value label="Estado">{credit.estado}</Value>
            <Value label="Anticipo requerido">
              {formatMoney(credit.montos.anticipoRequerido)}
            </Value>
            <Value label="Plazo autorizado">
              {credit.plazoAutorizadoDias} días
            </Value>
            <Value label="Aprobado">{formatDate(credit.aprobadoEn)}</Value>
            <Value label="Aprobado por">
              {credit.aprobadoPor?.nombre ?? "—"}
            </Value>
          </div>
        </AppCard>

        <AppCard title="Cliente y origen" icon={<UserRound />} size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Cliente">{credit.cliente.nombreCompleto}</Value>
            <Value label="Vendedor">{credit.vendedor.nombre}</Value>
            <Value label="Pedido">
              <AppButton asChild variant="ghost" size="sm">
                <Link
                  to={"/marcas-gt/pedidos/" + credit.pedido.id}
                  state={{ from: currentUrl }}
                >
                  {credit.pedido.numero}
                </Link>
              </AppButton>
            </Value>
            <Value label="Estado pedido">
              {credit.pedido.estado} · {credit.pedido.estadoPago}
            </Value>
            <Value label="Solicitud origen">
              <AppButton asChild variant="ghost" size="sm">
                <Link
                  to={
                    "/marcas-gt/creditos/solicitudes/" +
                    credit.solicitud.id
                  }
                  state={{ from: currentUrl }}
                >
                  {credit.solicitud.numero}
                </Link>
              </AppButton>
            </Value>
            <Value label="Total pedido">
              {formatMoney(credit.pedido.total)}
            </Value>
          </div>
        </AppCard>
      </AppGrid>

      <AppCard title="Estado financiero" icon={<FileText />} size="sm">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Value label="Plan de pagos">
            {credit.planPago
              ? credit.planPago.estado + " · " + credit.planPago.numeroCuotas + " cuotas"
              : "Sin plan"}
          </Value>
          <Value label="Cuentas por cobrar">
            {credit.cuentasPorCobrar.length}
          </Value>
          <Value label="Pagos relacionados">{credit.pagos.length}</Value>
          <Value label="Facturas relacionadas">{credit.facturas.length}</Value>
        </div>
      </AppCard>
    </div>
  );
}
