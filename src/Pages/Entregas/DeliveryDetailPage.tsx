import { Camera, CheckCircle2, MapPin, PackageCheck, Play, ReceiptText } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { useDelivery } from "@/features/entregas/api/delivery.queries";
import {
  DELIVERY_DETAIL_TABS,
  DELIVERY_STATE_LABELS,
  DELIVERY_STATE_TONES,
  type DeliveryDetailTab,
} from "@/features/entregas/common/delivery.constants";
import { DeliveryActivity } from "@/features/entregas/components/delivery-activity";
import { DeliveryDetailSummary } from "@/features/entregas/components/delivery-detail-summary";
import { DeliveryEvidencePanel } from "@/features/entregas/components/delivery-evidence-panel";
import { DeliveryLinesTable } from "@/features/entregas/components/delivery-lines-table";
import { DeliveryTrackingPanel } from "@/features/entregas/components/delivery-tracking-panel";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function DeliveryDetailPage() {
  const params = useParams();
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const id = Number(params.id);
  const query = useDelivery(id);
  const delivery = query.data;
  const backTo = getReturnRoute(location.state, "/marcas-gt/entregas");
  const currentUrl = location.pathname + location.search;
  const canBill =
    (role === "ADMIN" || role === "CONTABILIDAD") &&
    Boolean(
      delivery?.advertencias.some(
        (warning) => warning.codigo === "ENTREGA_SIN_FACTURAR",
      ),
    );

  const tabState = useUrlTabState<DeliveryDetailTab>({
    defaultValue: "resumen",
    allowedValues: DELIVERY_DETAIL_TABS,
  });

  const tabs = delivery
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <DeliveryDetailSummary delivery={delivery} />,
        },
        {
          value: "productos" as const,
          label: "Productos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {delivery.detalles.length}
            </AppBadge>
          ),
          content: <DeliveryLinesTable data={delivery.detalles} />,
        },
        {
          value: "evidencias" as const,
          label: "Evidencias",
          badge:
            delivery.evidencias.total > 0 ? (
              <AppBadge tone="neutral" size="xs">
                {delivery.evidencias.total}
              </AppBadge>
            ) : undefined,
          content: (
            <DeliveryEvidencePanel
              deliveryId={id}
              canAdd={delivery.acciones.puedeAgregarEvidencia}
              canRemove={delivery.acciones.puedeEliminarEvidencia}
            />
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: (
            <DeliveryActivity
              deliveryId={id}
              canAddObservation={delivery.acciones.puedeAgregarObservacion}
            />
          ),
        },
        {
          value: "tracking" as const,
          label: "Tracking",
          content: (
            <DeliveryTrackingPanel tracking={delivery.trackingActual} />
          ),
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            delivery ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                Entrega #{delivery.id}
                <AppBadge
                  tone={DELIVERY_STATE_TONES[delivery.estado]}
                  size="xs"
                >
                  {DELIVERY_STATE_LABELS[delivery.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de entrega"
            )
          }
          description={
            delivery
              ? delivery.cliente.nombreCompleto +
                " · " +
                delivery.pedido.numero +
                " · " +
                (delivery.transporte?.envio.numero ?? "Sin envío")
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a entregas"
          actions={
            delivery ? (
              <>
                {delivery.acciones.puedeIniciar ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/entregas/" + id + "/iniciar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Play className="h-4 w-4" />
                      Iniciar atención
                    </Link>
                  </AppButton>
                ) : null}
                {delivery.acciones.puedeEditarResultado ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/entregas/" + id + "/resultado"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <PackageCheck className="h-4 w-4" />
                      Registrar resultado
                    </Link>
                  </AppButton>
                ) : null}
                {delivery.acciones.puedeAgregarEvidencia ? (
                  <AppButton
                    variant="secondary"
                    size="sm"
                    leftIcon={<Camera />}
                    onClick={() => tabState.setValue("evidencias")}
                  >
                    Evidencia
                  </AppButton>
                ) : null}
                {delivery.acciones.puedeFinalizar ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/entregas/" + id + "/finalizar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Finalizar
                    </Link>
                  </AppButton>
                ) : null}
                {canBill ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/facturacion/facturas/nueva?entregaId=" +
                        id
                      }
                      state={{ from: currentUrl }}
                    >
                      <ReceiptText className="h-4 w-4" />
                      Facturar
                    </Link>
                  </AppButton>
                ) : null}
                <AppButton
                  variant="ghost"
                  size="sm"
                  leftIcon={<MapPin />}
                  onClick={() => tabState.setValue("tracking")}
                >
                  Ver ubicación
                </AppButton>
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !delivery}
          emptyTitle="Entrega no encontrada"
          emptyDescription="La entrega no existe o no está disponible para tu usuario."
        >
          {delivery ? (
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
