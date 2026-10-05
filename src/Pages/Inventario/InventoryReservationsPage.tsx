import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useInventoryReservations } from "@/features/inventario/api/inventory.queries";
import { useInventoryReservationState } from "@/features/inventario/common/use-inventory-reservation-state";
import { InventoryReservationFilters } from "@/features/inventario/components/inventory-reservation-filters";
import { InventoryReservationTable } from "@/features/inventario/components/inventory-reservation-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function InventoryReservationsPage() {
  const location = useLocation();
  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const currentUrl = location.pathname + location.search;
  const state = useInventoryReservationState();
  const query = useInventoryReservations(state.queryFilters);
  const meta = query.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Reservas de inventario"
          description="Consulta y administra unidades reservadas para detalles de pedido."
          backTo={backTo}
          backLabel="Volver a inventario"
          actions={
            <AppButton asChild variant="primary" size="sm">
              <Link
                to="/marcas-gt/inventario/reservas/nueva"
                state={{ from: currentUrl, listFrom: backTo }}
              >
                <Plus className="h-4 w-4" />
                Nueva reserva
              </Link>
            </AppButton>
          }
        />

        <InventoryReservationTable
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          canManage
          pagination={{
            pageIndex: state.table.pagination.pageIndex,
            pageSize: state.table.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <InventoryReservationFilters
              bodegaId={state.filters.bodegaId}
              productoId={state.filters.productoId}
              pedidoDetalleId={state.filters.pedidoDetalleId}
              estado={state.filters.estado}
              onBodegaChange={state.setBodegaId}
              onProductoChange={state.setProductoId}
              onPedidoDetalleChange={state.setPedidoDetalleId}
              onEstadoChange={state.setEstado}
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
