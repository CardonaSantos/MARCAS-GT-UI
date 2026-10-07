import { BarChart3, FilePlus2, Landmark, Settings2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useBillingSummary,
  useInvoices,
} from "@/features/facturacion/api/billing.queries";
import { useInvoiceListState } from "@/features/facturacion/common/use-invoice-list-state";
import { BillingSummaryCards } from "@/features/facturacion/components/billing-summary-cards";
import { InvoiceFilters } from "@/features/facturacion/components/invoice-filters";
import { InvoiceTable } from "@/features/facturacion/components/invoice-table";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function InvoicesPage() {
  const role = useStore((state) => state.userRol);
  const location = useLocation();
  const canOperate = role === "ADMIN" || role === "CONTABILIDAD";
  const state = useInvoiceListState();
  const query = useInvoices(state.queryFilters);

  const summaryCompatible =
    !state.table.serverSearch &&
    state.filters.estado === null &&
    state.filters.estadoFiscal === null &&
    state.filters.clienteId === null &&
    state.filters.vendedorId === null &&
    state.filters.condicionPago === null &&
    state.filters.soloPendientesFel === null &&
    state.filters.soloErroresFel === null &&
    state.filters.soloInciertas === null;

  const summary = useBillingSummary(
    {
      fechaDesde: state.filters.fechaDesde || undefined,
      fechaHasta: state.filters.fechaHasta || undefined,
    },
    summaryCompatible,
  );

  const currentUrl = location.pathname + location.search;
  const meta = query.data?.meta;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Facturación"
          description="Facturas comerciales, preparación fiscal, estado FEL y cuentas por cobrar."
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/facturacion/cuentas-por-cobrar" state={{ from: currentUrl }}>
                  <Landmark className="h-4 w-4" />
                  Cuentas por cobrar
                </Link>
              </AppButton>
              {role !== "VENDEDOR" ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link to="/marcas-gt/facturacion/reportes/operacion" state={{ from: currentUrl }}>
                    <BarChart3 className="h-4 w-4" />
                    Reporte operativo
                  </Link>
                </AppButton>
              ) : null}
              {canOperate ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link to="/marcas-gt/facturacion/configuracion-fiscal" state={{ from: currentUrl }}>
                    <Settings2 className="h-4 w-4" />
                    Configuración fiscal
                  </Link>
                </AppButton>
              ) : null}
              {canOperate ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link to="/marcas-gt/facturacion/facturas/nueva" state={{ from: currentUrl }}>
                    <FilePlus2 className="h-4 w-4" />
                    Nueva factura
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        <AppAlert
          tone="info"
          title="FEL todavía sin certificación externa"
          description="La UI permite crear borradores y preparar el DTE. No mostrará acciones falsas de certificación mientras Grupo CDS no esté habilitado en el servidor."
        />

        {summaryCompatible ? (
          <BillingSummaryCards summary={summary.data} />
        ) : null}

        <InvoiceTable
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
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
            <InvoiceFilters
              search={state.table.search}
              estado={state.filters.estado}
              estadoFiscal={state.filters.estadoFiscal}
              clienteId={state.filters.clienteId}
              vendedorId={state.filters.vendedorId}
              condicionPago={state.filters.condicionPago}
              soloPendientesFel={state.filters.soloPendientesFel}
              soloErroresFel={state.filters.soloErroresFel}
              soloInciertas={state.filters.soloInciertas}
              fechaDesde={state.filters.fechaDesde}
              fechaHasta={state.filters.fechaHasta}
              showSellerFilter={role !== "VENDEDOR"}
              onSearchChange={state.table.setSearch}
              onSearchDebouncedChange={state.table.setServerSearch}
              onEstadoChange={(value) => state.setFilter("estado", value)}
              onEstadoFiscalChange={(value) => state.setFilter("estadoFiscal", value)}
              onClienteChange={(value) => state.setFilter("clienteId", value)}
              onVendedorChange={(value) => state.setFilter("vendedorId", value)}
              onCondicionPagoChange={(value) => state.setFilter("condicionPago", value)}
              onSoloPendientesFelChange={(value) => state.setFilter("soloPendientesFel", value)}
              onSoloErroresFelChange={(value) => state.setFilter("soloErroresFel", value)}
              onSoloInciertasChange={(value) => state.setFilter("soloInciertas", value)}
              onFechaDesdeChange={(value) => state.setFilter("fechaDesde", value)}
              onFechaHastaChange={(value) => state.setFilter("fechaHasta", value)}
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
