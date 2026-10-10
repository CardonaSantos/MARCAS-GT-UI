import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { BodegaFilters } from "@/features/bodegas/components/bodega-filters";
import { BodegaPageHeader } from "@/features/bodegas/components/bodega-page-header";
import { BodegaSummaryCards } from "@/features/bodegas/components/bodega-summary-cards";
import { BodegaTable } from "@/features/bodegas/components/bodega-table";
import { useBodegaListState } from "@/features/bodegas/common/use-bodega-list-state";
import {
  useBodegaOverview,
  useBodegaResponsibleOptions,
  useBodegas,
} from "@/features/bodegas/api/bodega.queries";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function BodegasPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const isAdmin = role === "ADMIN";
  const canViewOverview =
    role === "ADMIN" || role === "BODEGA" || role === "CONTABILIDAD";

  const state = useBodegaListState();

  const listQuery = useBodegas(state.queryFilters);
  const overviewQuery = useBodegaOverview(canViewOverview);
  const responsibleQuery = useBodegaResponsibleOptions(isAdmin);

  const meta = listQuery.data?.meta;
  const currentListUrl = location.pathname + location.search;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <BodegaPageHeader
          title="Bodegas"
          description="Administra los centros de almacenamiento y consulta su estado operativo."
          actions={
            isAdmin ? (
              <AppButton asChild variant="primary" size="sm">
                <Link
                  to="/marcas-gt/bodegas/nueva"
                  state={{ from: currentListUrl }}
                >
                  <Plus className="h-4 w-4" />
                  Nueva bodega
                </Link>
              </AppButton>
            ) : undefined
          }
        />

        {canViewOverview ? (
          <BodegaSummaryCards
            overview={overviewQuery.data}
            isLoading={overviewQuery.isLoading}
          />
        ) : null}

        <BodegaTable
          data={listQuery.data?.data ?? []}
          isLoading={listQuery.isLoading}
          isFetching={listQuery.isFetching}
          error={listQuery.error}
          onRetry={() => void listQuery.refetch()}
          isAdmin={isAdmin}
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
            <BodegaFilters
              search={state.table.search}
              activo={state.filters.activo}
              esPrincipal={state.filters.esPrincipal}
              responsableId={state.filters.responsableId}
              responsibleUsers={responsibleQuery.data ?? []}
              responsibleUsersLoading={responsibleQuery.isLoading}
              showResponsibleFilter={isAdmin}
              onSearchChange={state.setSearch}
              onSearchDebouncedChange={state.setServerSearch}
              onActivoChange={state.setActivo}
              onPrincipalChange={state.setEsPrincipal}
              onResponsableChange={state.setResponsableId}
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
