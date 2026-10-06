import { Activity, BarChart3, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useDispatches,
  useDispatchSummary,
} from "@/features/despachos/api/dispatch.queries";
import { useDispatchListState } from "@/features/despachos/common/use-dispatch-list-state";
import { DispatchFilters } from "@/features/despachos/components/dispatch-filters";
import { DispatchSummaryCards } from "@/features/despachos/components/dispatch-summary-cards";
import { DispatchTable } from "@/features/despachos/components/dispatch-table";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function DispatchesPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canOperate = role === "ADMIN" || role === "BODEGA";
  const state = useDispatchListState();

  const listQuery = useDispatches(state.queryFilters);

  const summaryCompatible =
    !state.table.serverSearch &&
    state.filters.estado === null &&
    state.filters.clienteId === null &&
    state.filters.vendedorId === null &&
    state.filters.creadoPorId === null &&
    state.filters.preparadoPorId === null &&
    state.filters.despachadoPorId === null &&
    !state.filters.programadoDesde &&
    !state.filters.programadoHasta &&
    state.filters.soloPendientes === null &&
    state.filters.soloAtrasados === null &&
    state.filters.conPendientePreparacion === null &&
    state.filters.conPendienteDespacho === null;

  const summaryQuery = useDispatchSummary(
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
          title="Despachos"
          description="Planifica preparación, reserva inventario y registra salidas físicas con auditoría e idempotencia."
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/despachos/operaciones"
                  state={{ from: currentUrl }}
                >
                  <Activity className="h-4 w-4" />
                  Operaciones
                </Link>
              </AppButton>
              <AppButton asChild variant="secondary" size="sm">
                <Link
                  to="/marcas-gt/despachos/reportes/operacion"
                  state={{ from: currentUrl }}
                >
                  <BarChart3 className="h-4 w-4" />
                  Reporte operativo
                </Link>
              </AppButton>
              {canOperate ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/despachos/nuevo"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo despacho
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        {summaryCompatible ? (
          <DispatchSummaryCards
            summary={summaryQuery.data}
            isLoading={summaryQuery.isLoading}
          />
        ) : (
          <AppAlert
            tone="info"
            title="Resumen agregado no disponible con estos filtros"
            description="El endpoint de resumen sólo admite bodega y rango de creación. El listado continúa filtrado correctamente."
          />
        )}

        <DispatchTable
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
            <DispatchFilters
              search={state.table.search}
              estado={state.filters.estado}
              bodegaId={state.filters.bodegaId}
              clienteId={state.filters.clienteId}
              vendedorId={state.filters.vendedorId}
              creadoPorId={state.filters.creadoPorId}
              preparadoPorId={state.filters.preparadoPorId}
              despachadoPorId={state.filters.despachadoPorId}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              programadoDesde={state.filters.programadoDesde}
              programadoHasta={state.filters.programadoHasta}
              soloPendientes={state.filters.soloPendientes}
              soloAtrasados={state.filters.soloAtrasados}
              conPendientePreparacion={
                state.filters.conPendientePreparacion
              }
              conPendienteDespacho={state.filters.conPendienteDespacho}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={state.table.setServerSearch}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onBodegaChange={(value) => state.setFilter("bodegaId", value)}
              onClienteChange={(value) => state.setFilter("clienteId", value)}
              onVendedorChange={(value) =>
                state.setFilter("vendedorId", value)
              }
              onCreadoPorChange={(value) =>
                state.setFilter("creadoPorId", value)
              }
              onPreparadoPorChange={(value) =>
                state.setFilter("preparadoPorId", value)
              }
              onDespachadoPorChange={(value) =>
                state.setFilter("despachadoPorId", value)
              }
              onFechaDesdeChange={(value) =>
                state.setFilter("fechaDesde", value)
              }
              onFechaHastaChange={(value) =>
                state.setFilter("fechaHasta", value)
              }
              onProgramadoDesdeChange={(value) =>
                state.setFilter("programadoDesde", value)
              }
              onProgramadoHastaChange={(value) =>
                state.setFilter("programadoHasta", value)
              }
              onSoloPendientesChange={(value) =>
                state.setFilter("soloPendientes", value)
              }
              onSoloAtrasadosChange={(value) =>
                state.setFilter("soloAtrasados", value)
              }
              onPendientePreparacionChange={(value) =>
                state.setFilter("conPendientePreparacion", value)
              }
              onPendienteDespachoChange={(value) =>
                state.setFilter("conPendienteDespacho", value)
              }
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
