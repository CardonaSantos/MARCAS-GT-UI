import { BarChart3, Plus, Settings2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useShipments,
  useTransportSummary,
} from "@/features/transporte/api/transport.queries";
import { useTransportListState } from "@/features/transporte/common/use-transport-list-state";
import { ShipmentTable } from "@/features/transporte/components/shipment-table";
import { TransportFilters } from "@/features/transporte/components/transport-filters";
import { TransportSummaryCards } from "@/features/transporte/components/transport-summary-cards";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ShipmentsPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canPlan = role === "ADMIN" || role === "BODEGA";
  const canReadCatalogs =
    role === "ADMIN" || role === "BODEGA" || role === "CONTABILIDAD";
  const state = useTransportListState();

  const listQuery = useShipments(state.queryFilters);

  const summaryCompatible =
    !state.table.serverSearch &&
    state.filters.estado === null &&
    state.filters.modalidad === null &&
    state.filters.transportistaId === null &&
    state.filters.vehiculoId === null &&
    state.filters.conductorId === null &&
    state.filters.responsableId === null &&
    state.filters.clienteId === null &&
    state.filters.conIncidencia === null &&
    state.filters.soloAtrasados === null;

  const summaryQuery = useTransportSummary(
    {
      bodegaId: state.filters.bodegaId ?? undefined,
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
          title="Transporte"
          description="Planificación logística, asignación de recursos, carga, rutas e incidencias."
          actions={
            <>
              {canReadCatalogs ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to="/marcas-gt/transporte/transportistas"
                    state={{ from: currentUrl }}
                  >
                    <Settings2 className="h-4 w-4" />
                    Recursos
                  </Link>
                </AppButton>
              ) : null}
              {canReadCatalogs ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to="/marcas-gt/transporte/reportes/operacion"
                    state={{ from: currentUrl }}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Reporte operativo
                  </Link>
                </AppButton>
              ) : null}
              {canPlan ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/transporte/envios/nuevo"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo envío
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        {summaryCompatible ? (
          <TransportSummaryCards
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading}
          />
        ) : (
          <AppAlert
            tone="info"
            title="Resumen agregado no disponible con estos filtros"
            description="El resumen admite bodega y rango de creación. El listado continúa filtrado correctamente."
          />
        )}

        <ShipmentTable
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
            <TransportFilters
              search={state.table.search}
              estado={state.filters.estado}
              modalidad={state.filters.modalidad}
              bodegaId={state.filters.bodegaId}
              transportistaId={state.filters.transportistaId}
              vehiculoId={state.filters.vehiculoId}
              conductorId={state.filters.conductorId}
              responsableId={state.filters.responsableId}
              clienteId={state.filters.clienteId}
              conIncidencia={state.filters.conIncidencia}
              soloAtrasados={state.filters.soloAtrasados}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              showCatalogFilters={canReadCatalogs}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={state.table.setServerSearch}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onModalidadChange={(value) =>
                state.setFilter("modalidad", value)
              }
              onBodegaChange={(value) => state.setFilter("bodegaId", value)}
              onTransportistaChange={(value) =>
                state.setFilter("transportistaId", value)
              }
              onVehiculoChange={(value) =>
                state.setFilter("vehiculoId", value)
              }
              onConductorChange={(value) =>
                state.setFilter("conductorId", value)
              }
              onResponsableChange={(value) =>
                state.setFilter("responsableId", value)
              }
              onClienteChange={(value) =>
                state.setFilter("clienteId", value)
              }
              onConIncidenciaChange={(value) =>
                state.setFilter("conIncidencia", value)
              }
              onSoloAtrasadosChange={(value) =>
                state.setFilter("soloAtrasados", value)
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
