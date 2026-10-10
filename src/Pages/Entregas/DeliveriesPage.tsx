import { BarChart3, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useDeliveries,
  useDeliverySummary,
} from "@/features/entregas/api/delivery.queries";
import { useDeliveryListState } from "@/features/entregas/common/use-delivery-list-state";
import { DeliveryFilters } from "@/features/entregas/components/delivery-filters";
import { DeliverySummaryCards } from "@/features/entregas/components/delivery-summary-cards";
import { DeliveryTable } from "@/features/entregas/components/delivery-table";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function DeliveriesPage() {
  const role = useStore((state) => state.userRol);
  const location = useLocation();
  const canOperate =
    role === "ADMIN" || role === "BODEGA" || role === "REPARTIDOR";
  const canReport =
    role === "ADMIN" || role === "BODEGA" || role === "CONTABILIDAD";
  const state = useDeliveryListState();
  const listQuery = useDeliveries(state.queryFilters);

  const summaryCompatible =
    !state.table.serverSearch &&
    state.filters.estado === null &&
    state.filters.clienteId === null &&
    state.filters.registradoPorId === null &&
    state.filters.motivoNoEntrega === null &&
    state.filters.soloPendientes === null &&
    state.filters.soloSinFactura === null;

  const summaryQuery = useDeliverySummary(
    {
      fechaDesde: state.filters.fechaDesde || undefined,
      fechaHasta: state.filters.fechaHasta || undefined,
    },
    summaryCompatible,
  );

  const currentUrl = location.pathname + location.search;
  const meta = listQuery.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={role === "REPARTIDOR" ? "Mis entregas" : "Entregas"}
          description="Atención de paradas, recepción del cliente, evidencias y cierre físico de mercancía."
          actions={
            <>
              {canReport ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to="/marcas-gt/entregas/reportes/operacion"
                    state={{ from: currentUrl }}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Reporte operativo
                  </Link>
                </AppButton>
              ) : null}
              {canOperate ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/entregas/nueva"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nueva entrega
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        {summaryCompatible ? (
          <DeliverySummaryCards summary={summaryQuery.data} />
        ) : (
          <AppAlert
            tone="info"
            title="Resumen agregado no disponible con estos filtros"
            description="El resumen admite rango de creación. El listado continúa filtrado correctamente."
          />
        )}

        <DeliveryTable
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
            <DeliveryFilters
              search={state.table.search}
              estado={state.filters.estado}
              clienteId={state.filters.clienteId}
              registradoPorId={state.filters.registradoPorId}
              motivoNoEntrega={state.filters.motivoNoEntrega}
              soloPendientes={state.filters.soloPendientes}
              soloSinFactura={state.filters.soloSinFactura}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              showUserFilter={role !== "REPARTIDOR" && role !== "VENDEDOR"}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={state.table.setServerSearch}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onClienteChange={(value) => state.setFilter("clienteId", value)}
              onRegistradoPorChange={(value) =>
                state.setFilter("registradoPorId", value)
              }
              onMotivoChange={(value) =>
                state.setFilter("motivoNoEntrega", value)
              }
              onSoloPendientesChange={(value) =>
                state.setFilter("soloPendientes", value)
              }
              onSoloSinFacturaChange={(value) =>
                state.setFilter("soloSinFactura", value)
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
