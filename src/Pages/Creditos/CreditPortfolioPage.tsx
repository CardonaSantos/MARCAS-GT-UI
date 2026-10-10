import { ClipboardList, Settings2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useCreditPortfolio } from "@/features/creditos/api/credit.queries";
import { useCreditPortfolioState } from "@/features/creditos/common/use-credit-portfolio-state";
import { CreditPortfolioFilters } from "@/features/creditos/components/credit-portfolio-filters";
import { CreditPortfolioTable } from "@/features/creditos/components/credit-portfolio-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreditPortfolioPage() {
  const location = useLocation();
  const state = useCreditPortfolioState();
  const query = useCreditPortfolio(state.queryFilters);
  const meta = query.data?.meta;
  const currentUrl = location.pathname + location.search;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Cartera de crédito"
          description="Consulta créditos generados, saldos, vencimientos y relación con solicitudes y pedidos."
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/creditos" state={{ from: currentUrl }}>
                  <ClipboardList className="h-4 w-4" />
                  Solicitudes
                </Link>
              </AppButton>
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/creditos/politicas"
                  state={{ from: currentUrl }}
                >
                  <Settings2 className="h-4 w-4" />
                  Políticas
                </Link>
              </AppButton>
            </>
          }
        />

        <CreditPortfolioTable
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
            <CreditPortfolioFilters
              search={state.table.search}
              estado={state.filters.estado}
              clienteId={state.filters.clienteId}
              vendedorId={state.filters.vendedorId}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              conSaldoPendiente={state.filters.conSaldoPendiente}
              onSearchChange={state.setSearch}
              onSearchDebouncedChange={state.setServerSearch}
              onEstadoChange={state.setEstado}
              onClienteChange={state.setClienteId}
              onVendedorChange={state.setVendedorId}
              onFechaDesdeChange={state.setFechaDesde}
              onFechaHastaChange={state.setFechaHasta}
              onSaldoChange={state.setConSaldoPendiente}
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
