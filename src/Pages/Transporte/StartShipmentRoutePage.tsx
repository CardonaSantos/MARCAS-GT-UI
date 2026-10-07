import { zodResolver } from "@hookform/resolvers/zod";
import { Navigation } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useStartShipmentRoute } from "@/features/transporte/api/transport.mutations";
import { useShipment } from "@/features/transporte/api/transport.queries";
import { toStartRoutePayload } from "@/features/transporte/common/transport.mappers";
import {
  shipmentRouteSchema,
  type ShipmentRouteFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function StartShipmentRoutePage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/transporte/envios/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/transporte/envios",
  );
  const key = useIdempotencyKey("transport-route");
  const query = useShipment(id);
  const mutation = useStartShipmentRoute();

  const form = useForm<ShipmentRouteFormValues>({
    resolver: zodResolver(shipmentRouteSchema),
    defaultValues: { latitud: "", longitud: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ShipmentRouteFormValues) => {
    if (!query.data?.acciones.puedeIniciarRuta) return;
    await mutation.mutateAsync({
      id,
      payload: toStartRoutePayload(values, key),
    });
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Iniciar ruta"
          description={query.data?.numero}
          backTo={backTo}
          backLabel="Volver al envío"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Envío no encontrado"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppAlert
                  tone="info"
                  title="Inicio de operación en ruta"
                  description="El envío pasará a EN_RUTA. En transporte interno, el vehículo y conductor también pasarán a EN_RUTA."
                />
                <AppCard
                  title="Ubicación de salida"
                  description="Opcional. Permite auditar desde dónde se inició la ruta."
                  size="sm"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormInput<ShipmentRouteFormValues>
                      name="latitud"
                      label="Latitud"
                      type="number"
                      step="any"
                    />
                    <AppFormInput<ShipmentRouteFormValues>
                      name="longitud"
                      label="Longitud"
                      type="number"
                      step="any"
                    />
                  </div>
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<ShipmentRouteFormValues>
                    leftIcon={<Navigation />}
                    loadingText="Iniciando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeIniciarRuta}
                  >
                    Iniciar ruta
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
