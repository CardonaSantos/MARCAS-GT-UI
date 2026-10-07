import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useAssignShipment } from "@/features/transporte/api/transport.mutations";
import { useShipment } from "@/features/transporte/api/transport.queries";
import {
  toExternalAssignmentPayload,
  toInternalAssignmentPayload,
} from "@/features/transporte/common/transport.mappers";
import {
  TransportCarrierFormSelect,
  TransportDriverFormSelect,
  TransportResponsibleFormSelect,
  TransportVehicleFormSelect,
} from "@/features/transporte/components/transport-selects";
import {
  shipmentExternalAssignmentSchema,
  shipmentInternalAssignmentSchema,
  type ShipmentExternalAssignmentFormValues,
  type ShipmentInternalAssignmentFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function AssignShipmentPage() {
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
  const key = useIdempotencyKey("transport-assignment");
  const query = useShipment(id);
  const mutation = useAssignShipment();

  const internalForm = useForm<ShipmentInternalAssignmentFormValues>({
    resolver: zodResolver(shipmentInternalAssignmentSchema),
    defaultValues: {
      vehiculoId: null,
      conductorId: null,
      responsableId: null,
    },
    mode: "onTouched",
  });

  const externalForm = useForm<ShipmentExternalAssignmentFormValues>({
    resolver: zodResolver(shipmentExternalAssignmentSchema),
    defaultValues: { transportistaId: null },
    mode: "onTouched",
  });

  const finish = () =>
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });

  const submitInternal = async (
    values: ShipmentInternalAssignmentFormValues,
  ) => {
    if (!query.data?.acciones.puedeAsignar) return;
    await mutation.mutateAsync({
      id,
      payload: toInternalAssignmentPayload(values, key),
    });
    finish();
  };

  const submitExternal = async (
    values: ShipmentExternalAssignmentFormValues,
  ) => {
    if (!query.data?.acciones.puedeAsignar) return;
    await mutation.mutateAsync({
      id,
      payload: toExternalAssignmentPayload(values, key),
    });
    finish();
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Asignar transporte"
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
          {query.data?.modalidad === "INTERNO" ? (
            <AppForm form={internalForm} onSubmit={submitInternal}>
              <AppStack gap="md">
                <AppAlert
                  tone="info"
                  title="Transporte interno"
                  description="El vehículo debe estar DISPONIBLE, el conductor DISPONIBLE y el responsable debe ser ADMIN o REPARTIDOR."
                />
                <AppCard title="Recursos internos" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <TransportVehicleFormSelect<ShipmentInternalAssignmentFormValues>
                      name="vehiculoId"
                      label="Vehículo"
                      availableOnly
                      required
                    />
                    <TransportDriverFormSelect<ShipmentInternalAssignmentFormValues>
                      name="conductorId"
                      label="Conductor"
                      availableOnly
                      required
                    />
                    <TransportResponsibleFormSelect<ShipmentInternalAssignmentFormValues>
                      name="responsableId"
                      label="Responsable de ruta"
                      required
                    />
                  </div>
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<ShipmentInternalAssignmentFormValues>
                    leftIcon={<Settings2 />}
                    loadingText="Asignando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeAsignar}
                  >
                    Asignar recursos
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data?.modalidad === "EXTERNO" ? (
            <AppForm form={externalForm} onSubmit={submitExternal}>
              <AppStack gap="md">
                <AppAlert
                  tone="info"
                  title="Transporte externo"
                  description="Selecciona un transportista externo activo."
                />
                <AppCard title="Transportista" size="sm">
                  <TransportCarrierFormSelect<ShipmentExternalAssignmentFormValues>
                    name="transportistaId"
                    label="Transportista"
                    mode="EXTERNO"
                    activeOnly
                    required
                  />
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<ShipmentExternalAssignmentFormValues>
                    leftIcon={<Settings2 />}
                    loadingText="Asignando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeAsignar}
                  >
                    Asignar transportista
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
