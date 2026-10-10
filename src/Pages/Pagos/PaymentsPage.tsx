import { Building2, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  usePayments,
  usePaymentSummary,
} from "@/features/pagos/api/payment.queries";
import { usePaymentListState } from "@/features/pagos/common/use-payment-list-state";
import { PaymentFilters } from "@/features/pagos/components/payment-filters";
import { PaymentSummaryCards } from "@/features/pagos/components/payment-summary-cards";
import { PaymentTable } from "@/features/pagos/components/payment-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function PaymentsPage() {
  const role = useStore((state) => state.userRol);
  const location = useLocation();
  const state = usePaymentListState();
  const query = usePayments(state.queryFilters);
  const summary = usePaymentSummary({
    fechaDesde: state.filters.fechaDesde || undefined,
    fechaHasta: state.filters.fechaHasta || undefined,
  });
  const meta = query.data?.meta;
  const currentUrl = location.pathname + location.search;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Pagos"
          description="Registro, verificación y aplicación de cobros a pedidos y cuentas por cobrar."
          actions={
            <>
              {["ADMIN", "CONTABILIDAD"].includes(role ?? "") ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to="/marcas-gt/pagos/bancos"
                    state={{ from: currentUrl }}
                  >
                    <Building2 className="h-4 w-4" />
                    Bancos
                  </Link>
                </AppButton>
              ) : null}
              <AppButton asChild variant="primary" size="sm">
                <Link
                  to="/marcas-gt/pagos/nuevo"
                  state={{ from: currentUrl }}
                >
                  <Plus className="h-4 w-4" />
                  Registrar pago
                </Link>
              </AppButton>
            </>
          }
        />

        <PaymentSummaryCards summary={summary.data} />

        <PaymentTable
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          pagination={{
            pageIndex: state.table.pagination.pageIndex,
            pageSize: state.table.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <PaymentFilters
              search={state.table.search}
              estado={state.filters.estado}
              metodo={state.filters.metodo}
              clienteId={state.filters.clienteId}
              bancoId={state.filters.bancoId}
              soloConSaldoDisponible={state.filters.soloConSaldoDisponible}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={state.table.setServerSearch}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onMetodoChange={(value) => state.setFilter("metodo", value)}
              onClienteChange={(value) => state.setFilter("clienteId", value)}
              onBancoChange={(value) => state.setFilter("bancoId", value)}
              onSaldoDisponibleChange={(value) =>
                state.setFilter("soloConSaldoDisponible", value)
              }
              onFechaDesdeChange={(value) =>
                state.setFilter("fechaDesde", value)
              }
              onFechaHastaChange={(value) =>
                state.setFilter("fechaHasta", value)
              }
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
