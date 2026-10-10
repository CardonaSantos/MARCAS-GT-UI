import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useCancelInventoryReservation } from "@/features/inventario/api/inventory.mutations";
import { useInventoryReservation } from "@/features/inventario/api/inventory.queries";
import { toCancelReservationPayload } from "@/features/inventario/common/inventory.mappers";
import { InventoryReferenceFields } from "@/features/inventario/components/inventory-reference-fields";
import {
  cancelReservationSchema,
  type CancelReservationFormValues,
} from "@/features/inventario/schemas/inventory.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CancelInventoryReservationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/inventario/reservas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/inventario/reservas",
  );
  const key = useIdempotencyKey("inventory-reservation-cancel-" + id);

  const query = useInventoryReservation(id);
  const mutation = useCancelInventoryReservation();

  const form = useForm<CancelReservationFormValues>({
    resolver: zodResolver(cancelReservationSchema),
    defaultValues: {
      motivo: "",
      referenciaTipo: "",
      referenciaId: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CancelReservationFormValues) => {
    await mutation.mutateAsync({
      id,
      payload: toCancelReservationPayload(values, key),
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
          title="Cancelar reserva"
          description="Cancela la reserva y libera toda la cantidad todavía pendiente."
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver a la reserva"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Reserva no encontrada"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Motivo de cancelación"
                  description={
                    "Se liberarán " +
                    query.data.cantidadPendiente +
                    " unidades pendientes."
                  }
                  size="sm"
                >
                  <AppFormTextarea<CancelReservationFormValues>
                    name="motivo"
                    label="Motivo"
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Describe por qué se cancela la reserva."
                  />
                </AppCard>

                <AppCard
                  title="Referencia"
                  description="Opcional. Si se omite, el backend utilizará el detalle de pedido."
                  size="sm"
                >
                  <InventoryReferenceFields<CancelReservationFormValues> />
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Volver
                    </Link>
                  </AppButton>

                  <AppFormSubmit<CancelReservationFormValues>
                    variant="danger"
                    leftIcon={<XCircle />}
                    loadingText="Cancelando..."
                    disableWhenInvalid
                  >
                    Cancelar reserva
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
