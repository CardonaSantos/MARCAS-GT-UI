import { FileCheck2, Settings2, Trash2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { useInvoice } from "@/features/facturacion/api/billing.queries";
import {
  INVOICE_DETAIL_TABS,
  INVOICE_STATE_LABELS,
  INVOICE_STATE_TONES,
  type InvoiceDetailTab,
} from "@/features/facturacion/common/billing.constants";
import { InvoiceActivity } from "@/features/facturacion/components/invoice-activity";
import { InvoiceDetailSummary } from "@/features/facturacion/components/invoice-detail-summary";
import { InvoiceFelPanel } from "@/features/facturacion/components/invoice-fel-panel";
import { InvoiceLinesTable } from "@/features/facturacion/components/invoice-lines-table";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function InvoiceDetailPage() {
  const params = useParams();
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const id = Number(params.id);
  const query = useInvoice(id);
  const invoice = query.data;
  const backTo = getReturnRoute(location.state, "/marcas-gt/facturacion/facturas");
  const currentUrl = location.pathname + location.search;
  const canOperate = role === "ADMIN" || role === "CONTABILIDAD";

  const tabState = useUrlTabState<InvoiceDetailTab>({
    defaultValue: "resumen",
    allowedValues: INVOICE_DETAIL_TABS,
  });

  const tabs = invoice
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <InvoiceDetailSummary invoice={invoice} />,
        },
        {
          value: "lineas" as const,
          label: "Líneas",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {invoice.detalles.length}
            </AppBadge>
          ),
          content: <InvoiceLinesTable data={invoice.detalles} />,
        },
        {
          value: "fiscal" as const,
          label: "Fiscal",
          content: (
            <div className="space-y-4">
              {invoice.cliente.fiscal ? (
                <AppCard title="Receptor fiscal" size="sm">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Identificación</p>
                      <p className="mt-1 text-sm font-medium">
                        {invoice.cliente.fiscal.tipoIdentificacion +
                          " · " +
                          invoice.cliente.fiscal.identificacion}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Nombre fiscal</p>
                      <p className="mt-1 text-sm font-medium">{invoice.cliente.fiscal.nombreFiscal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Correo fiscal</p>
                      <p className="mt-1 text-sm font-medium">{invoice.cliente.fiscal.correoFiscal ?? "—"}</p>
                    </div>
                  </div>
                </AppCard>
              ) : (
                <AppAlert
                  tone="warning"
                  title="Cliente sin perfil fiscal"
                  description="Configura el receptor antes de preparar el documento fiscal."
                />
              )}
              {canOperate ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to="/marcas-gt/facturacion/configuracion-fiscal"
                    state={{ from: currentUrl }}
                  >
                    <Settings2 className="h-4 w-4" />
                    Abrir configuración fiscal
                  </Link>
                </AppButton>
              ) : null}
            </div>
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: <InvoiceActivity invoiceId={id} />,
        },
        {
          value: "fel" as const,
          label: "FEL",
          content: <InvoiceFelPanel invoiceId={id} fiscal={invoice.fiscal} />,
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            invoice ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                Factura #{invoice.id}
                <AppBadge tone={INVOICE_STATE_TONES[invoice.estado]} size="xs">
                  {INVOICE_STATE_LABELS[invoice.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de factura"
            )
          }
          description={
            invoice
              ? invoice.cliente.nombreCompleto +
                " · " +
                (invoice.pedido?.numero ?? "Sin pedido")
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a facturación"
          actions={
            invoice && canOperate ? (
              <>
                {invoice.acciones.puedePreparar ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/facturacion/facturas/" + id + "/preparar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <FileCheck2 className="h-4 w-4" />
                      Preparar DTE
                    </Link>
                  </AppButton>
                ) : null}
                {invoice.acciones.puedeDescartar ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={"/marcas-gt/facturacion/facturas/" + id + "/descartar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Descartar
                    </Link>
                  </AppButton>
                ) : null}
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !invoice}
          emptyTitle="Factura no encontrada"
          emptyDescription="La factura no existe o no está disponible para tu usuario."
        >
          {invoice ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
