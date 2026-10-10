import { Landmark, Plus, Settings2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useCreditApplications,
  useCreditSummary,
} from "@/features/creditos/api/credit.queries";
import { useCreditListState } from "@/features/creditos/common/use-credit-list-state";
import { CreditFilters } from "@/features/creditos/components/credit-filters";
import { CreditSummaryCards } from "@/features/creditos/components/credit-summary-cards";
import { CreditSummaryInsights } from "@/features/creditos/components/credit-summary-insights";
import { CreditTable } from "@/features/creditos/components/credit-table";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreditApplicationsPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canWrite = role === "ADMIN" || role === "VENDEDOR" || role === "BODEGA";
  const state = useCreditListState();

  const listQuery = useCreditApplications(state.queryFilters);
  const summaryQuery = useCreditSummary(
    state.summaryFilters,
    state.summaryCompatible,
  );

  const meta = listQuery.data?.meta;
  const currentUrl = location.pathname + location.search;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Solicitudes de crédito"
          description="Gestionar el expediente de crédito vinculado a pedidos CREDITO."
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/creditos/cartera"
                  state={{ from: currentUrl }}
                >
                  <Landmark className="h-4 w-4" />
                  Cartera
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

              {canWrite ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/creditos/solicitudes/nueva"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nueva solicitud
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        {state.summaryCompatible ? (
          <CreditSummaryCards
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading}
          />
        ) : (
          <AppAlert
            tone="info"
            title="Resumen agregado no disponible con estos filtros"
            description="Los filtros de decisión, integración y Sólo pendientes no forman parte del contrato del endpoint de resumen. El listado sí permanece correctamente filtrado."
          />
        )}

        <CreditTable
          data={listQuery.data?.data ?? []}
          isLoading={listQuery.isLoading}
          isFetching={listQuery.isFetching}
          error={listQuery.error}
          onRetry={() => void listQuery.refetch()}
          sorting={state.table.sorting}
          onSortingChange={state.setSorting}
          pagination={{
            pageIndex: state.table.pagination.pageIndex,
            pageSize: state.table.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <CreditFilters
              search={state.table.search}
              estado={state.filters.estado}
              clienteId={state.filters.clienteId}
              solicitanteId={state.filters.solicitanteId}
              vendedorId={state.filters.vendedorId}
              politicaId={state.filters.politicaId}
              tipoDecision={state.filters.tipoDecision}
              integracionEstado={state.filters.integracionEstado}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              soloPendientes={state.filters.soloPendientes}
              onSearchChange={state.setSearch}
              onSearchDebouncedChange={state.setServerSearch}
              onEstadoChange={state.setEstado}
              onClienteChange={state.setClienteId}
              onSolicitanteChange={state.setSolicitanteId}
              onVendedorChange={state.setVendedorId}
              onPoliticaChange={state.setPoliticaId}
              onTipoDecisionChange={state.setTipoDecision}
              onIntegracionChange={state.setIntegracionEstado}
              onFechaDesdeChange={state.setFechaDesde}
              onFechaHastaChange={state.setFechaHasta}
              onSoloPendientesChange={state.setSoloPendientes}
              onReset={state.resetFilters}
            />
          }
        />

        {state.summaryCompatible ? (
          <CreditSummaryInsights summary={summaryQuery.data} />
        ) : null}
      </AppStack>
    </AppContainer>
  );
}
