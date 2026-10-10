import {
  ArrowDownToLine,
  ClipboardList,
  History,
  PencilLine,
  RotateCcw,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useInventory } from "@/features/inventario/api/inventory.queries";
import { useInventorySummary } from "@/features/inventario/api/inventory.queries";
import { useInventoryListState } from "@/features/inventario/common/use-inventory-list-state";
import { InventoryStockFilters } from "@/features/inventario/components/inventory-stock-filters";
import { InventoryStockTable } from "@/features/inventario/components/inventory-stock-table";
import { InventorySummaryCards } from "@/features/inventario/components/inventory-summary-cards";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function InventoryPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canManage = role === "ADMIN" || role === "BODEGA";

  const state = useInventoryListState();
  const listQuery = useInventory(state.queryFilters);
  const summaryQuery = useInventorySummary(
    state.filters.bodegaId ?? undefined,
  );

  const currentUrl = location.pathname + location.search;
  const meta = listQuery.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Inventario"
          description="Consulta existencias por producto y bodega, reservas y valor de inventario."
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/inventario/movimientos"
                  state={{ from: currentUrl }}
                >
                  <History className="h-4 w-4" />
                  Movimientos
                </Link>
              </AppButton>

              {canManage ? (
                <>
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to="/marcas-gt/inventario/reservas"
                      state={{ from: currentUrl }}
                    >
                      <ClipboardList className="h-4 w-4" />
                      Reservas
                    </Link>
                  </AppButton>

                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to="/marcas-gt/inventario/ajustes/nuevo"
                      state={{ from: currentUrl }}
                    >
                      <PencilLine className="h-4 w-4" />
                      Ajuste
                    </Link>
                  </AppButton>

                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to="/marcas-gt/inventario/devoluciones/nueva"
                      state={{ from: currentUrl }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Devolución
                    </Link>
                  </AppButton>

                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to="/marcas-gt/inventario/entradas/nueva"
                      state={{ from: currentUrl }}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                      Registrar entrada
                    </Link>
                  </AppButton>
                </>
              ) : null}
            </>
          }
        />

        <InventorySummaryCards
          summary={summaryQuery.data}
          isLoading={summaryQuery.isLoading}
        />

        <InventoryStockTable
          data={listQuery.data?.data ?? []}
          isLoading={listQuery.isLoading}
          isFetching={listQuery.isFetching}
          error={listQuery.error}
          onRetry={() => void listQuery.refetch()}
          canManage={canManage}
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
            <InventoryStockFilters
              search={state.table.search}
              bodegaId={state.filters.bodegaId}
              productoId={state.filters.productoId}
              conExistencia={state.filters.conExistencia}
              conReservas={state.filters.conReservas}
              onSearchChange={state.setSearch}
              onSearchDebouncedChange={state.setServerSearch}
              onBodegaChange={state.setBodegaId}
              onProductoChange={state.setProductoId}
              onExistenciaChange={state.setConExistencia}
              onReservasChange={state.setConReservas}
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
