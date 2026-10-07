import {
  AlertTriangle,
  PackageCheck,
  Play,
  Route,
  Settings2,
  XCircle,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import {
  useShipment,
  useShipmentIncidents,
} from "@/features/transporte/api/transport.queries";
import {
  SHIPMENT_STATE_LABELS,
  SHIPMENT_STATE_TONES,
  TRANSPORT_DETAIL_TABS,
  type TransportDetailTab,
} from "@/features/transporte/common/transport.constants";
import { ShipmentActivity } from "@/features/transporte/components/shipment-activity";
import { ShipmentDetailSummary } from "@/features/transporte/components/shipment-detail-summary";
import { ShipmentIncidents } from "@/features/transporte/components/shipment-incidents";
import { ShipmentStopsTable } from "@/features/transporte/components/shipment-stops-table";
import { ShipmentTrackingPanel } from "@/features/transporte/components/shipment-tracking-panel";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function ShipmentDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const role = useStore((state) => state.userRol);
  const query = useShipment(id);
  const openIncidentsQuery = useShipmentIncidents(id, {
    page: 1,
    limit: 1,
    estado: "ABIERTA",
  });
  const attendingIncidentsQuery = useShipmentIncidents(id, {
    page: 1,
    limit: 1,
    estado: "EN_ATENCION",
  });
  const shipment = query.data;
  const currentUrl = location.pathname + location.search;
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transporte/envios",
  );

  const tabState = useUrlTabState<TransportDetailTab>({
    defaultValue: "resumen",
    allowedValues: TRANSPORT_DETAIL_TABS,
  });

  const canResolveIncident =
    role === "ADMIN" || role === "BODEGA" || role === "REPARTIDOR";
  const openIncidentCount =
    (openIncidentsQuery.data?.meta.total ?? 0) +
    (attendingIncidentsQuery.data?.meta.total ?? 0);

  const tabs = shipment
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <ShipmentDetailSummary shipment={shipment} />,
        },
        {
          value: "paradas" as const,
          label: "Paradas y carga",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {shipment.paradas.length}
            </AppBadge>
          ),
          content: <ShipmentStopsTable data={shipment.paradas} />,
        },
        {
          value: "incidencias" as const,
          label: "Incidencias",
          badge:
            openIncidentCount > 0 ? (
              <AppBadge tone="danger" size="xs">
                {openIncidentCount}
              </AppBadge>
            ) : undefined,
          content: (
            <ShipmentIncidents
              shipmentId={id}
              canResolve={canResolveIncident}
            />
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: (
            <ShipmentActivity
              shipmentId={id}
              canAddObservation={shipment.acciones.puedeAgregarObservacion}
            />
          ),
        },
        {
          value: "tracking" as const,
          label: "Tracking",
          content: (
            <ShipmentTrackingPanel tracking={shipment.trackingActual} />
          ),
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            shipment ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {shipment.numero}
                <AppBadge
                  tone={SHIPMENT_STATE_TONES[shipment.estado]}
                  size="xs"
                >
                  {SHIPMENT_STATE_LABELS[shipment.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de envío"
            )
          }
          description={
            shipment
              ? (shipment.bodega?.nombre ?? "Sin bodega") +
                " · " +
                shipment.modalidad
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a transporte"
          actions={
            shipment ? (
              <>
                {shipment.acciones.puedeAsignar ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/transporte/envios/" + id + "/asignar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Settings2 className="h-4 w-4" />
                      Asignar recursos
                    </Link>
                  </AppButton>
                ) : null}

                {shipment.acciones.puedeConfirmarCarga ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/transporte/envios/" + id + "/carga"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <PackageCheck className="h-4 w-4" />
                      Confirmar carga
                    </Link>
                  </AppButton>
                ) : null}

                {shipment.acciones.puedeIniciarRuta ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/transporte/envios/" +
                        id +
                        "/iniciar-ruta"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Play className="h-4 w-4" />
                      Iniciar ruta
                    </Link>
                  </AppButton>
                ) : null}

                {shipment.acciones.puedeReportarIncidencia ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/transporte/envios/" +
                        id +
                        "/incidencias/nueva"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Reportar incidencia
                    </Link>
                  </AppButton>
                ) : null}

                {shipment.acciones.puedeCancelar ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={"/marcas-gt/transporte/envios/" + id + "/cancelar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancelar
                    </Link>
                  </AppButton>
                ) : null}

                {shipment.estado === "EN_RUTA" ? (
                  <AppButton
                    variant="ghost"
                    size="sm"
                    onClick={() => tabState.setValue("tracking")}
                    leftIcon={<Route />}
                  >
                    Ver ubicación
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
          isEmpty={!query.isLoading && !shipment}
          emptyTitle="Envío no encontrado"
          emptyDescription="El envío no existe o no está disponible para tu usuario."
        >
          {shipment ? (
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
