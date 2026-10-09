import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useOrders, useOrderSummary } from "@/features/pedidos/api/order.queries";
import { useOrderListState } from "@/features/pedidos/common/use-order-list-state";
import { OrderFilters } from "@/features/pedidos/components/order-filters";
import { OrderSummaryCards } from "@/features/pedidos/components/order-summary-cards";
import { OrderSummaryInsights } from "@/features/pedidos/components/order-summary-insights";
import { OrderTable } from "@/features/pedidos/components/order-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function OrdersPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canWrite = ["ADMIN", "VENDEDOR", "BODEGA"].includes(role ?? "");
  const state = useOrderListState();

  const listQuery = useOrders(state.queryFilters);
  const summaryCompatible =
    state.filters.visitaId === null && state.filters.soloAbiertos !== true;
  const summaryQuery = useOrderSummary(
    state.summaryFilters,
    summaryCompatible,
  );
  const meta = listQuery.data?.meta;
  const currentUrl = location.pathname + location.search;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Pedidos"
          description="Gestiona el ciclo comercial del pedido desde borrador hasta entrega, facturación y pago."
          actions={
            canWrite ? (
              <AppButton asChild variant="primary" size="sm">
                <Link to="/marcas-gt/pedidos/nuevo" state={{ from: currentUrl }}>
                  <Plus className="h-4 w-4" />
                  Nuevo pedido
                </Link>
              </AppButton>
            ) : undefined
          }
        />

        {summaryCompatible ? (
          <OrderSummaryCards
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading}
          />
        ) : (
          <AppCard
            title="Resumen agregado no disponible con estos filtros"
            description="El filtro de visita y la opción Sólo abiertos aplican al listado, pero no forman parte del contrato del resumen agregado."
            size="sm"
          />
        )}

        <OrderTable
          data={listQuery.data?.data ?? []}
          canWrite={canWrite}
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
            <OrderFilters
              search={state.table.search}
              estado={state.filters.estado}
              estadoPago={state.filters.estadoPago}
              condicionPago={state.filters.condicionPago}
              clienteId={state.filters.clienteId}
              vendedorId={state.filters.vendedorId}
              visitaId={state.filters.visitaId}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              soloAbiertos={state.filters.soloAbiertos}
              onSearchChange={state.setSearch}
              onSearchDebouncedChange={state.setServerSearch}
              onEstadoChange={state.setEstado}
              onEstadoPagoChange={state.setEstadoPago}
              onCondicionPagoChange={state.setCondicionPago}
              onClienteChange={state.setClienteId}
              onVendedorChange={state.setVendedorId}
              onVisitaChange={state.setVisitaId}
              onFechaDesdeChange={state.setFechaDesde}
              onFechaHastaChange={state.setFechaHasta}
              onSoloAbiertosChange={state.setSoloAbiertos}
              onReset={state.resetFilters}
            />
          }
        />

        {summaryCompatible ? (
          <OrderSummaryInsights summary={summaryQuery.data} />
        ) : null}
      </AppStack>
    </AppContainer>
  );
}
