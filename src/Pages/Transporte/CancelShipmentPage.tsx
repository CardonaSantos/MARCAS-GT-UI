import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useCancelShipment } from "@/features/transporte/api/transport.mutations";
import { useShipment } from "@/features/transporte/api/transport.queries";
import { toCancelShipmentPayload } from "@/features/transporte/common/transport.mappers";
import {
  shipmentCancelSchema,
  type ShipmentCancelFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CancelShipmentPage() {
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
  const key = useIdempotencyKey("transport-cancel");
  const query = useShipment(id);
  const mutation = useCancelShipment();

  const form = useForm<ShipmentCancelFormValues>({
    resolver: zodResolver(shipmentCancelSchema),
    defaultValues: { motivo: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ShipmentCancelFormValues) => {
    if (!query.data?.acciones.puedeCancelar) return;
    await mutation.mutateAsync({
      id,
      payload: toCancelShipmentPayload(values, key),
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
          title="Cancelar envío"
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
                  tone="warning"
                  title="Cancelación logística"
                  description="Sólo se permite cancelar envíos PROGRAMADO o ASIGNADO. Si es interno y ya tiene recursos asignados, el backend los libera automáticamente."
                />
                <AppCard title="Motivo" size="sm">
                  <AppFormTextarea<ShipmentCancelFormValues>
                    name="motivo"
                    label="Motivo de cancelación"
                    rows={5}
                    maxLength={500}
                    required
                  />
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Volver</Link>
                  </AppButton>
                  <AppFormSubmit<ShipmentCancelFormValues>
                    variant="danger"
                    leftIcon={<XCircle />}
                    loadingText="Cancelando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeCancelar}
                  >
                    Cancelar envío
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
