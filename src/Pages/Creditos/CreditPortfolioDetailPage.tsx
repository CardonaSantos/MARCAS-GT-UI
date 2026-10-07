import {
  Banknote,
  CalendarClock,
  FileText,
  Landmark,
  ReceiptText,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { useCreditPortfolioDetail } from "@/features/creditos/api/credit.queries";
import {
  CREDIT_PORTFOLIO_DETAIL_TABS,
  type CreditPortfolioDetailTab,
} from "@/features/creditos/common/credit.constants";
import { CreditPaymentPlanPanel } from "@/features/creditos/components/credit-payment-plan-panel";
import { CreditPortfolioDetailSummary } from "@/features/creditos/components/credit-portfolio-detail-summary";
import { CreditPortfolioPayments } from "@/features/creditos/components/credit-portfolio-payments";
import {
  CreditPortfolioActivity,
  CreditPortfolioInvoices,
  CreditPortfolioReceivables,
} from "@/features/creditos/components/credit-portfolio-tables";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function CreditPortfolioDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const backTo = getReturnRoute(location.state, "/marcas-gt/creditos/cartera");
  const currentUrl = location.pathname + location.search;
  const query = useCreditPortfolioDetail(id);
  const credit = query.data;

  const tabState = useUrlTabState<CreditPortfolioDetailTab>({
    defaultValue: "resumen",
    allowedValues: CREDIT_PORTFOLIO_DETAIL_TABS,
  });

  const tabs = credit
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: (
            <CreditPortfolioDetailSummary
              credit={credit}
              currentUrl={currentUrl}
            />
          ),
        },
        {
          value: "plan" as const,
          label: "Plan de pagos",
          icon: <CalendarClock />,
          badge: credit.planPago ? (
            <AppBadge
              tone={credit.planPago.estado === "ACTIVO" ? "success" : "warning"}
              size="xs"
            >
              {credit.planPago.numeroCuotas}
            </AppBadge>
          ) : undefined,
          content: <CreditPaymentPlanPanel credit={credit} />,
        },
        {
          value: "pagos" as const,
          label: "Pagos",
          icon: <Banknote />,
          badge: credit.pagos.length ? (
            <AppBadge tone="neutral" size="xs">
              {credit.pagos.length}
            </AppBadge>
          ) : undefined,
          content: (
            <CreditPortfolioPayments
              credit={credit}
              currentUrl={currentUrl}
            />
          ),
        },
        {
          value: "cuentas" as const,
          label: "CxC",
          icon: <Landmark />,
          badge: credit.cuentasPorCobrar.length ? (
            <AppBadge tone="neutral" size="xs">
              {credit.cuentasPorCobrar.length}
            </AppBadge>
          ) : undefined,
          content: <CreditPortfolioReceivables credit={credit} />,
        },
        {
          value: "facturacion" as const,
          label: "Facturación",
          icon: <ReceiptText />,
          badge: credit.facturas.length ? (
            <AppBadge tone="neutral" size="xs">
              {credit.facturas.length}
            </AppBadge>
          ) : undefined,
          content: (
            <CreditPortfolioInvoices
              credit={credit}
              currentUrl={currentUrl}
            />
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          icon: <FileText />,
          content: <CreditPortfolioActivity credit={credit} />,
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            credit ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {credit.numero}
                <AppBadge
                  tone={credit.estado === "ACTIVO" ? "success" : "neutral"}
                  size="xs"
                >
                  {credit.estado}
                </AppBadge>
              </span>
            ) : (
              "Detalle de crédito"
            )
          }
          description={
            credit
              ? credit.cliente.nombreCompleto +
                " · " +
                credit.pedido.numero +
                " · crédito concedido"
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a cartera"
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !credit}
          emptyTitle="Crédito no encontrado"
          emptyDescription="El crédito no existe o no está disponible para tu usuario."
        >
          {credit ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
