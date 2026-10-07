import { ArrowRightLeft, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import { useUserSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useTransferSummary,
  useTransfers,
} from "@/features/transferencias/api/transfer.queries";
import { useTransferListState } from "@/features/transferencias/common/use-transfer-list-state";
import { TransferFilters } from "@/features/transferencias/components/transfer-filters";
import { TransferSummaryCards } from "@/features/transferencias/components/transfer-summary-cards";
import { TransferTable } from "@/features/transferencias/components/transfer-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function TransfersPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canOperate = role === "ADMIN" || role === "BODEGA";
  const currentUrl = location.pathname + location.search;

  const state = useTransferListState();
  const listQuery = useTransfers(state.queryFilters);
  const summaryQuery = useTransferSummary(state.summaryFilters);
  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const usersQuery = useUserSelectables();

  const meta = listQuery.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Transferencias"
          description="Mueve mercadería entre bodegas con salida física, tránsito y recepción controlada."
          actions={
            <div className="flex flex-wrap gap-2">
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/transferencias/operaciones"
                  state={{ from: currentUrl }}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Operaciones
                </Link>
              </AppButton>

              {canOperate ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/transferencias/nueva"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nueva transferencia
                  </Link>
                </AppButton>
              ) : null}
            </div>
          }
        />

        <TransferSummaryCards
          summary={summaryQuery.data}
          isLoading={summaryQuery.isLoading}
        />

        <TransferTable
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
            <TransferFilters
              search={state.table.search}
              estado={state.filters.estado}
              bodegaOrigenId={state.filters.bodegaOrigenId}
              bodegaDestinoId={state.filters.bodegaDestinoId}
              creadoPorId={state.filters.creadoPorId}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              soloPendientes={state.filters.soloPendientes}
              bodegas={bodegasQuery.data ?? []}
              usuarios={usersQuery.data ?? []}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={(value) => {
                state.table.setServerSearch(value);
                state.table.resetPage();
              }}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onBodegaOrigenChange={(value) =>
                state.setFilter("bodegaOrigenId", value)
              }
              onBodegaDestinoChange={(value) =>
                state.setFilter("bodegaDestinoId", value)
              }
              onCreadoPorChange={(value) =>
                state.setFilter("creadoPorId", value)
              }
              onFechaDesdeChange={(value) =>
                state.setFilter("fechaDesde", value)
              }
              onFechaHastaChange={(value) =>
                state.setFilter("fechaHasta", value)
              }
              onSoloPendientesChange={(value) =>
                state.setFilter("soloPendientes", value)
              }
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
