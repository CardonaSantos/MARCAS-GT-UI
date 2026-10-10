import { PackageCheck, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import {
  useProviderSelectables,
  useUserSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useRequisitionSummary,
  useRequisitions,
} from "@/features/requisiciones/api/requisition.queries";
import { useRequisitionListState } from "@/features/requisiciones/common/use-requisition-list-state";
import { RequisitionFilters } from "@/features/requisiciones/components/requisition-filters";
import { RequisitionSummaryCards } from "@/features/requisiciones/components/requisition-summary-cards";
import { RequisitionTable } from "@/features/requisiciones/components/requisition-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function RequisitionsPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canOperate = role === "ADMIN" || role === "BODEGA";
  const currentUrl = location.pathname + location.search;

  const state = useRequisitionListState();
  const listQuery = useRequisitions(state.queryFilters);
  const summaryQuery = useRequisitionSummary(state.summaryFilters);
  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const providersQuery = useProviderSelectables();
  const usersQuery = useUserSelectables();

  const meta = listQuery.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Requisiciones"
          description=""
          actions={
            <div className="flex flex-wrap gap-2">
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/requisiciones/recepciones"
                  state={{ from: currentUrl }}
                >
                  <PackageCheck className="h-4 w-4" />
                  Recepciones
                </Link>
              </AppButton>

              {canOperate ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/requisiciones/nueva"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nueva requisición
                  </Link>
                </AppButton>
              ) : null}
            </div>
          }
        />

        <RequisitionSummaryCards
          summary={summaryQuery.data}
          isLoading={summaryQuery.isLoading}
        />

        <RequisitionTable
          data={listQuery.data?.data ?? []}
          role={role}
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
            <RequisitionFilters
              search={state.table.search}
              estado={state.filters.estado}
              bodegaDestinoId={state.filters.bodegaDestinoId}
              proveedorId={state.filters.proveedorId}
              solicitanteId={state.filters.solicitanteId}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              soloPendientesRecepcion={state.filters.soloPendientesRecepcion}
              bodegas={bodegasQuery.data ?? []}
              proveedores={providersQuery.data ?? []}
              usuarios={usersQuery.data ?? []}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={(value) => {
                state.table.setServerSearch(value);
                state.table.resetPage();
              }}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onBodegaChange={(value) =>
                state.setFilter("bodegaDestinoId", value)
              }
              onProveedorChange={(value) =>
                state.setFilter("proveedorId", value)
              }
              onSolicitanteChange={(value) =>
                state.setFilter("solicitanteId", value)
              }
              onFechaDesdeChange={(value) =>
                state.setFilter("fechaDesde", value)
              }
              onFechaHastaChange={(value) =>
                state.setFilter("fechaHasta", value)
              }
              onSoloPendientesChange={(value) =>
                state.setFilter("soloPendientesRecepcion", value)
              }
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
