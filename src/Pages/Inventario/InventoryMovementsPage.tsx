import { Info } from "lucide-react";
import { useLocation } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useInventoryMovements } from "@/features/inventario/api/inventory.queries";
import { useInventoryMovementState } from "@/features/inventario/common/use-inventory-movement-state";
import { InventoryMovementFilters } from "@/features/inventario/components/inventory-movement-filters";
import { InventoryMovementTable } from "@/features/inventario/components/inventory-movement-table";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function InventoryMovementsPage() {
  const location = useLocation();
  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const state = useInventoryMovementState();

  const query = useInventoryMovements(
    state.queryFilters,
    state.hasRequiredContext,
  );
  const meta = query.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Movimientos de inventario"
          description="Auditoría de entradas, salidas, reservas, ajustes y transferencias."
          backTo={backTo}
          backLabel="Volver a inventario"
        />

        {!state.hasRequiredContext ? (
          <AppCard
            title="Selecciona producto y bodega"
            description="El backend actual no incluye producto ni bodega dentro de cada fila del movimiento. Ambos filtros son obligatorios en esta vista para que cada registro tenga contexto inequívoco."
            icon={<Info />}
            size="sm"
          />
        ) : null}

        <InventoryMovementTable
          data={query.data?.data ?? []}
          isLoading={state.hasRequiredContext && query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          toolbar={
            <InventoryMovementFilters
              bodegaId={state.filters.bodegaId}
              productoId={state.filters.productoId}
              tipo={state.filters.tipo}
              referenciaTipo={state.filters.referenciaTipo}
              referenciaId={state.filters.referenciaId}
              creadoPorId={state.filters.creadoPorId}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              onBodegaChange={state.setBodegaId}
              onProductoChange={state.setProductoId}
              onTipoChange={state.setTipo}
              onReferenciaTipoChange={state.setReferenciaTipo}
              onReferenciaIdChange={state.setReferenciaId}
              onCreadoPorChange={state.setCreadoPorId}
              onFechaDesdeChange={state.setFechaDesde}
              onFechaHastaChange={state.setFechaHasta}
              onReset={state.resetFilters}
            />
          }
          pagination={
            state.hasRequiredContext
              ? {
                  pageIndex: state.table.pagination.pageIndex,
                  pageSize: state.table.pagination.pageSize,
                  totalRows: meta?.total ?? 0,
                  pageCount: Math.max(meta?.totalPages ?? 1, 1),
                  onPaginationChange: state.setPagination,
                }
              : undefined
          }
        />
      </AppStack>
    </AppContainer>
  );
}
